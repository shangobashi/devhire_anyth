import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [profile] = await sql`
    SELECT id FROM profiles WHERE email = ${session.user.email}
  `;

  if (!profile) {
    return Response.json({ error: "Profile not found" }, { status: 404 });
  }

  const payments = await sql`
    SELECT 
      p.*,
      j.title as job_title,
      j.slug as job_slug
    FROM payments p
    LEFT JOIN jobs j ON p.job_id = j.id
    WHERE p.user_id = ${profile.id}
    ORDER BY p.created_at DESC
  `;

  return Response.json(payments);
}
