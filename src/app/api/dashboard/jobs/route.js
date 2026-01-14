import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all jobs for the current user (dashboard view)
    const jobs = await sql`
      SELECT id, title, slug, status, created_at, company_name, location
      FROM jobs
      WHERE user_id = ${session.user.id}
      ORDER BY created_at DESC
    `;

    return Response.json(jobs);
  } catch (error) {
    console.error("Error fetching dashboard jobs:", error);
    return Response.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      company_name,
      company_logo,
      location,
      job_type,
      salary_min,
      salary_max,
      application_url,
    } = body;

    // Simple validation
    if (
      !title ||
      !description ||
      !company_name ||
      !location ||
      !job_type ||
      !application_url
    ) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Generate slug from title + random string
    const slug =
      title.toLowerCase().replace(/[^a-z0-9]+/g, "-") +
      "-" +
      Math.random().toString(36).substring(2, 7);

    // Insert draft
    const rows = await sql`
      INSERT INTO jobs (
        user_id, title, slug, description, company_name, company_logo, location, job_type, salary_min, salary_max, application_url, status
      ) VALUES (
        ${session.user.id}, ${title}, ${slug}, ${description}, ${company_name}, ${company_logo}, ${location}, ${job_type}, ${salary_min}, ${salary_max}, ${application_url}, 'draft'
      )
      RETURNING id, slug
    `;

    return Response.json(rows[0]);
  } catch (error) {
    console.error("Error creating job:", error);
    return Response.json({ error: "Failed to create job" }, { status: 500 });
  }
}
