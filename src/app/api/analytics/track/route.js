import sql from "@/app/api/utils/sql";

export async function POST(request) {
  const body = await request.json();
  const { event, jobId, data } = body;

  // Simple analytics tracking
  // In production, you'd integrate with Google Analytics, Plausible, etc.

  console.log("📊 Analytics Event:", {
    event,
    jobId,
    data,
    timestamp: new Date().toISOString(),
    userAgent: request.headers.get("user-agent"),
    referer: request.headers.get("referer"),
  });

  // Store analytics in audit logs
  try {
    await sql`
      INSERT INTO audit_logs (action, details, created_at)
      VALUES (
        ${event},
        ${JSON.stringify({ jobId, ...data })},
        NOW()
      )
    `;
  } catch (error) {
    console.error("Failed to log analytics:", error);
  }

  return Response.json({ success: true });
}
