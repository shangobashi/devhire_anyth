import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

// Helper endpoint to make a user admin
// In production, this should be removed or protected
export async function POST(request) {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email } = await request.json();

  // Update the user's role to admin
  await sql`
    UPDATE profiles 
    SET role = 'admin' 
    WHERE email = ${email || session.user.email}
  `;

  return Response.json({
    success: true,
    message: `User ${email || session.user.email} is now an admin`,
  });
}
