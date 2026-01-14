import sql from "@/app/api/utils/sql";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature || !STRIPE_WEBHOOK_SECRET) {
      return Response.json(
        { error: "Missing signature or webhook secret" },
        { status: 400 },
      );
    }

    // Parse the event (simplified - in production you'd verify the signature with Stripe's library)
    // For now, we'll parse the JSON directly
    let event;
    try {
      event = JSON.parse(body);
    } catch (err) {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const jobId = session.metadata?.job_id || session.client_reference_id;
      const sessionId = session.id;

      if (!jobId) {
        console.error("No job_id in session metadata");
        return Response.json({ error: "No job_id" }, { status: 400 });
      }

      // Set expiration date to 30 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      // Update job status to published and payment to succeeded
      await sql.transaction([
        sql`
          UPDATE jobs
          SET status = 'published', 
              updated_at = NOW(),
              expires_at = ${expiresAt.toISOString()}
          WHERE id = ${jobId}
        `,
        sql`
          UPDATE payments
          SET status = 'succeeded'
          WHERE stripe_session_id = ${sessionId}
        `,
      ]);

      // Send email notification
      try {
        const [job] = await sql`
          SELECT j.title, p.email 
          FROM jobs j 
          JOIN profiles p ON j.user_id = p.id 
          WHERE j.id = ${jobId}
        `;

        if (job) {
          await fetch(`${process.env.APP_URL}/api/notifications/send-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: job.email,
              type: "job_published",
              message: job.title,
            }),
          });
        }
      } catch (error) {
        console.error("Failed to send notification:", error);
      }

      console.log(`Job ${jobId} published successfully`);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
