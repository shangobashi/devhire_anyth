import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const PRICE_AMOUNT = 19900; // $199.00 in cents

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { jobId } = body;

    if (!jobId) {
      return Response.json({ error: "Job ID is required" }, { status: 400 });
    }

    // Get user profile
    const [profile] = await sql`
      SELECT au.email, p.id as profile_id
      FROM auth_users au
      JOIN profiles p ON CAST(au.id AS TEXT) = p.email
      WHERE au.id = ${session.user.id}
      LIMIT 1
    `;

    if (!profile) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    // Verify job exists and belongs to user
    const [job] = await sql`
      SELECT id, title, slug, status, user_id
      FROM jobs
      WHERE id = ${jobId}
      LIMIT 1
    `;

    if (!job) {
      return Response.json({ error: "Job not found" }, { status: 404 });
    }

    if (job.user_id !== profile.profile_id) {
      return Response.json(
        { error: "Not authorized to publish this job" },
        { status: 403 },
      );
    }

    if (job.status !== "draft") {
      return Response.json(
        { error: "Job must be in draft status" },
        { status: 400 },
      );
    }

    // Create Stripe Checkout Session
    const stripeResponse = await fetch(
      "https://api.stripe.com/v1/checkout/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          success_url: `${process.env.APP_URL}/dashboard?success=true`,
          cancel_url: `${process.env.APP_URL}/dashboard?canceled=true`,
          mode: "payment",
          client_reference_id: jobId,
          customer_email: profile.email,
          "line_items[0][price_data][currency]": "usd",
          "line_items[0][price_data][product_data][name]": `Job Posting: ${job.title}`,
          "line_items[0][price_data][product_data][description]":
            "30-day job listing on DevHire",
          "line_items[0][price_data][unit_amount]": PRICE_AMOUNT,
          "line_items[0][quantity]": "1",
          "metadata[job_id]": jobId,
          "metadata[user_id]": profile.profile_id,
        }),
      },
    );

    if (!stripeResponse.ok) {
      const error = await stripeResponse.text();
      console.error("Stripe error:", error);
      throw new Error("Failed to create Stripe session");
    }

    const stripeSession = await stripeResponse.json();

    // Update job status to pending_payment and create payment record
    await sql.transaction([
      sql`
        UPDATE jobs
        SET status = 'pending_payment', updated_at = NOW()
        WHERE id = ${jobId}
      `,
      sql`
        INSERT INTO payments (user_id, job_id, stripe_session_id, amount, currency, status)
        VALUES (${profile.profile_id}, ${jobId}, ${stripeSession.id}, ${PRICE_AMOUNT}, 'usd', 'pending')
      `,
    ]);

    return Response.json({ url: stripeSession.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
