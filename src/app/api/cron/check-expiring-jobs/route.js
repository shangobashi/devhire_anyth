import sql from "@/app/api/utils/sql";

// This endpoint should be called daily by a cron job
// You can set this up with services like Vercel Cron, GitHub Actions, or cron-job.org
export async function GET() {
  const now = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

  // Find jobs expiring in 3 days
  const expiringJobs = await sql`
    SELECT j.id, j.title, p.email
    FROM jobs j
    JOIN profiles p ON j.user_id = p.id
    WHERE j.status = 'published'
    AND j.expires_at BETWEEN ${now.toISOString()} AND ${threeDaysFromNow.toISOString()}
    AND j.expires_at IS NOT NULL
  `;

  // Find expired jobs
  const expiredJobs = await sql`
    SELECT j.id, j.title, p.email
    FROM jobs j
    JOIN profiles p ON j.user_id = p.id
    WHERE j.status = 'published'
    AND j.expires_at < ${now.toISOString()}
  `;

  // Send expiring soon notifications
  for (const job of expiringJobs) {
    try {
      await fetch(`${process.env.APP_URL}/api/notifications/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: job.email,
          type: "job_expiring_soon",
          message: job.title,
        }),
      });
    } catch (error) {
      console.error(
        `Failed to send expiring notification for job ${job.id}:`,
        error,
      );
    }
  }

  // Update expired jobs and send notifications
  for (const job of expiredJobs) {
    await sql`
      UPDATE jobs 
      SET status = 'expired' 
      WHERE id = ${job.id}
    `;

    try {
      await fetch(`${process.env.APP_URL}/api/notifications/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: job.email,
          type: "job_expired",
          message: job.title,
        }),
      });
    } catch (error) {
      console.error(
        `Failed to send expired notification for job ${job.id}:`,
        error,
      );
    }
  }

  return Response.json({
    success: true,
    expiringJobsNotified: expiringJobs.length,
    expiredJobsUpdated: expiredJobs.length,
  });
}
