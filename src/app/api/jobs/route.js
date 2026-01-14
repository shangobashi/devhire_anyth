import sql from "@/app/api/utils/sql";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const location = searchParams.get("location") || "";
  const type = searchParams.get("type") || "";

  // Base query for published jobs
  // Using dynamic query building
  let query = sql`
    SELECT id, title, slug, company_name, company_logo, location, job_type, salary_min, salary_max, salary_currency, created_at
    FROM jobs
    WHERE status = 'published'
  `;

  if (q) {
    query = sql`${query} AND (title ILIKE ${"%" + q + "%"} OR company_name ILIKE ${"%" + q + "%"})`;
  }

  if (location) {
    query = sql`${query} AND location ILIKE ${"%" + location + "%"}`;
  }

  if (type) {
    query = sql`${query} AND job_type = ${type}`;
  }

  query = sql`${query} ORDER BY created_at DESC LIMIT 50`;

  try {
    const jobs = await sql(query.text, query.values); // Note: Depending on sql tag implementation, might just be 'await query' if it's a promise, but usually the tag returns { text, values } if used for building, or executes if awaited.
    // The provided sql util says "You can use it as either a tagged template or as a function".
    // "const rowsA = await sql`SELECT ...`" implies it executes immediately.
    // So dynamic building is tricky with that specific util if it executes immediately.
    // The doc says: "let query = sql`...`; if(search) { query = sql`${query} ...` }" is INVALID nesting.
    // Instead: "Build the query string separately... Use function form of sql for the final query".

    // Reworking for the specific SQL util rules:

    let text = `
      SELECT id, title, slug, company_name, company_logo, location, job_type, salary_min, salary_max, salary_currency, created_at
      FROM jobs
      WHERE status = 'published'
    `;
    const values = [];

    if (q) {
      text += ` AND (title ILIKE $${values.length + 1} OR company_name ILIKE $${values.length + 1})`;
      values.push("%" + q + "%");
    }

    if (location) {
      text += ` AND location ILIKE $${values.length + 1}`;
      values.push("%" + location + "%");
    }

    if (type) {
      text += ` AND job_type = $${values.length + 1}`;
      values.push(type);
    }

    text += " ORDER BY created_at DESC LIMIT 50";

    const rows = await sql(text, values);
    return Response.json(rows);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return Response.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
