import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function PATCH(request, { params }) {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [profile] = await sql`
    SELECT role FROM profiles WHERE email = ${session.user.email}
  `;

  if (profile?.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = params;
  const body = await request.json();
  const { status, action } = body;

  if (action === "delete") {
    await sql`DELETE FROM jobs WHERE id = ${id}`;
    return Response.json({ success: true });
  }

  if (status) {
    await sql`
      UPDATE jobs 
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${id}
    `;
  }

  return Response.json({ success: true });
}
