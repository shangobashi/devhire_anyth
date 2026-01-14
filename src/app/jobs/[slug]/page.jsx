import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  ExternalLink,
  Building,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function JobDetailPage({ params }) {
  const { slug } = params;

  // Fetch job data
  const res = await fetch(`${process.env.APP_URL}/api/jobs/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Job not found
          </h1>
          <a
            href="/jobs"
            className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline"
          >
            Browse all jobs
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  const job = await res.json();

  // Generate JSON-LD structured data for Google for Jobs
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    identifier: {
      "@type": "PropertyValue",
      name: "DevHire",
      value: job.id,
    },
    datePosted: job.created_at,
    validThrough: job.expires_at,
    employmentType: job.job_type.toUpperCase().replace("-", "_"),
    hiringOrganization: {
      "@type": "Organization",
      name: job.company_name,
      sameAs: job.company_website || process.env.APP_URL,
      logo: job.company_logo,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
      },
    },
    baseSalary:
      job.salary_min && job.salary_max
        ? {
            "@type": "MonetaryAmount",
            currency: job.salary_currency || "USD",
            value: {
              "@type": "QuantitativeValue",
              minValue: job.salary_min,
              maxValue: job.salary_max,
              unitText: "YEAR",
            },
          }
        : undefined,
    directApply: true,
    applicationContact: {
      "@type": "ContactPoint",
      url: job.application_url,
    },
  };

  return (
    <>
      <head>
        <title>
          {job.title} at {job.company_name} | DevHire
        </title>
        <meta name="description" content={job.description.substring(0, 160)} />
        <link
          rel="canonical"
          href={`${process.env.APP_URL}/jobs/${job.slug}`}
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content={`${job.title} at ${job.company_name}`}
        />
        <meta
          property="og:description"
          content={job.description.substring(0, 160)}
        />
        <meta
          property="og:url"
          content={`${process.env.APP_URL}/jobs/${job.slug}`}
        />
        <meta property="og:type" content="website" />
        {job.company_logo && (
          <meta property="og:image" content={job.company_logo} />
        )}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${job.title} at ${job.company_name}`}
        />
        <meta
          name="twitter:description"
          content={job.description.substring(0, 160)}
        />
        {job.company_logo && (
          <meta name="twitter:image" content={job.company_logo} />
        )}

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-white">
        <Header />

        <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Job Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
            <div className="flex items-start gap-6 mb-6">
              {job.company_logo ? (
                <img
                  src={job.company_logo}
                  alt={job.company_name}
                  className="w-20 h-20 rounded-xl object-contain bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold text-3xl">
                  {job.company_name.charAt(0)}
                </div>
              )}

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {job.title}
                </h1>
                <div className="flex items-center gap-2 text-xl text-gray-600 dark:text-gray-400">
                  <Building size={20} />
                  <span>{job.company_name}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <span className="flex items-center gap-2">
                <MapPin size={16} /> {job.location}
              </span>
              <span className="flex items-center gap-2">
                <Briefcase size={16} /> {job.job_type}
              </span>
              {(job.salary_min || job.salary_max) && (
                <span className="flex items-center gap-2">
                  <DollarSign size={16} />
                  {job.salary_min && !job.salary_max
                    ? `${job.salary_min.toLocaleString()}+`
                    : ""}
                  {job.salary_min && job.salary_max
                    ? `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}`
                    : ""}
                  {job.salary_currency && ` ${job.salary_currency}`}
                </span>
              )}
              <span className="flex items-center gap-2">
                <Clock size={16} /> Posted{" "}
                {formatDistanceToNow(new Date(job.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>

            <a
              href={job.application_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Apply for this position
              <ExternalLink size={18} />
            </a>
          </div>

          {/* Job Description */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Job Description
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                {job.description}
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
