import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    // Get all published jobs
    const jobs = await sql`
      SELECT slug, updated_at
      FROM jobs
      WHERE status = 'published'
      ORDER BY updated_at DESC
    `;

    const baseUrl = process.env.APP_URL || "https://devhire.com";

    const staticPages = [
      { url: "", changefreq: "daily", priority: "1.0" },
      { url: "/jobs", changefreq: "hourly", priority: "0.9" },
      { url: "/pricing", changefreq: "weekly", priority: "0.8" },
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
    )
    .join("")}
  ${jobs
    .map(
      (job) => `
  <url>
    <loc>${baseUrl}/jobs/${job.slug}</loc>
    <lastmod>${new Date(job.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`,
    )
    .join("")}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
}
