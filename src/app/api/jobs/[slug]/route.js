import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request, { params }) {
  const { slug } = params;

  try {
    const rows = await sql`
      SELECT *
      FROM jobs
      WHERE slug = ${slug}
    `;

    if (!rows || rows.length === 0) {
      return Response.json({ error: "Job not found" }, { status: 404 });
    }

    const job = rows[0];

    // Check visibility - If published, anyone can see
    if (job.status === "published") {
      return Response.json(job);
    }

    return Response.json({ error: "Job not found" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching job:", error);
    return Response.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = params;
  const body = await request.json();

  // Get user profile
  const [profile] = await sql`
    SELECT id FROM profiles WHERE email = ${session.user.email}
  `;

  if (!profile) {
    return Response.json({ error: "Profile not found" }, { status: 404 });
  }

  // Get job and verify ownership
  const [job] = await sql`
    SELECT * FROM jobs WHERE slug = ${slug} AND user_id = ${profile.id}
  `;

  if (!job) {
    return Response.json(
      { error: "Job not found or unauthorized" },
      { status: 404 },
    );
  }

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

  // Generate new slug if title changed
  let newSlug = slug;
  if (title && title !== job.title) {
    newSlug =
      title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
  }

  await sql`
    UPDATE jobs SET
      title = COALESCE(${title}, title),
      slug = ${newSlug},
      description = COALESCE(${description}, description),
      company_name = COALESCE(${company_name}, company_name),
      company_logo = COALESCE(${company_logo}, company_logo),
      location = COALESCE(${location}, location),
      job_type = COALESCE(${job_type}, job_type),
      salary_min = COALESCE(${salary_min}, salary_min),
      salary_max = COALESCE(${salary_max}, salary_max),
      application_url = COALESCE(${application_url}, application_url),
      updated_at = NOW()
    WHERE id = ${job.id}
  `;

  return Response.json({ success: true, slug: newSlug });
}
