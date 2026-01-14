import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user is admin
  const [profile] = await sql`
    SELECT role FROM profiles WHERE email = ${session.user.email}
  `;

  if (profile?.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // Get stats
  const [stats] = await sql`
    SELECT
      COUNT(*) FILTER (WHERE status = 'published') as published_jobs,
      COUNT(*) FILTER (WHERE status = 'draft') as draft_jobs,
      COUNT(*) FILTER (WHERE status = 'pending_payment') as pending_jobs,
      COUNT(*) FILTER (WHERE status = 'expired') as expired_jobs,
      COUNT(DISTINCT user_id) as total_employers
    FROM jobs
  `;

  const [revenue] = await sql`
    SELECT
      SUM(amount) FILTER (WHERE status = 'succeeded') as total_revenue,
      COUNT(*) FILTER (WHERE status = 'succeeded') as successful_payments,
      COUNT(*) FILTER (WHERE status = 'pending') as pending_payments
    FROM payments
  `;

  const recentJobs = await sql`
    SELECT j.*, p.email as employer_email
    FROM jobs j
    LEFT JOIN profiles p ON j.user_id = p.id
    ORDER BY j.created_at DESC
    LIMIT 10
  `;

  const recentPayments = await sql`
    SELECT pay.*, p.email as user_email, j.title as job_title
    FROM payments pay
    LEFT JOIN profiles p ON pay.user_id = p.id
    LEFT JOIN jobs j ON pay.job_id = j.id
    ORDER BY pay.created_at DESC
    LIMIT 10
  `;

  return Response.json({
    stats: {
      ...stats,
      total_revenue: revenue.total_revenue || 0,
      successful_payments: revenue.successful_payments || 0,
      pending_payments: revenue.pending_payments || 0,
    },
    recentJobs,
    recentPayments,
  });
}
