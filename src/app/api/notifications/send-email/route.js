// Simple email notification system
// In production, you'd integrate with a service like Resend, SendGrid, etc.

export async function POST(request) {
  const body = await request.json();
  const { to, subject, message, type } = body;

  // Log the email for now (in production, integrate with email service)
  console.log("📧 Email Notification:", {
    to,
    subject,
    message,
    type,
    timestamp: new Date().toISOString(),
  });

  // Simulate email templates
  const templates = {
    job_published: {
      subject: "✅ Your job posting is now live on DevHire!",
      message: `Your job "${message}" has been successfully published and is now visible to thousands of developers.`,
    },
    job_expiring_soon: {
      subject: "⏰ Your job posting expires in 3 days",
      message: `Your job "${message}" will expire soon. Consider reposting to continue receiving applications.`,
    },
    job_expired: {
      subject: "📅 Your job posting has expired",
      message: `Your job "${message}" has expired and is no longer visible. You can repost it from your dashboard.`,
    },
  };

  const template = templates[type] || { subject, message };

  // Here you would integrate with your email service
  // For example, with Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: 'DevHire <noreply@devhire.com>',
  //   to: to,
  //   subject: template.subject,
  //   html: template.message,
  // });

  return Response.json({
    success: true,
    message: "Email logged (integrate with email service for production)",
  });
}
