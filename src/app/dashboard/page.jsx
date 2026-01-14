"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Plus, Edit, Eye, CreditCard, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useUser from "@/utils/useUser";

export default function DashboardPage() {
  const { data: user, loading: userLoading } = useUser();
  const [filter, setFilter] = useState("all");

  const {
    data: jobs,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["dashboard-jobs"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/jobs");
      if (!res.ok) throw new Error("Failed to fetch jobs");
      return res.json();
    },
    enabled: !!user,
  });

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600 dark:text-gray-400" />
      </div>
    );
  }

  if (!user) {
    window.location.href = "/account/signin?callbackUrl=/dashboard";
    return null;
  }

  const filteredJobs = jobs?.filter((job) => {
    if (filter === "all") return true;
    return job.status === filter;
  });

  const statusColors = {
    draft: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
    pending_payment:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
    published:
      "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    expired: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
    archived: "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400",
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-white">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Job Postings
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage your job listings and track applications
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="/dashboard/billing"
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <CreditCard size={20} />
              Billing
            </a>
            <a
              href="/dashboard/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              <Plus size={20} />
              Post a Job
            </a>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["all", "draft", "pending_payment", "published", "expired"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  filter === status
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white border border-gray-200 dark:border-gray-700"
                }`}
              >
                {status.replace("_", " ").charAt(0).toUpperCase() +
                  status.replace("_", " ").slice(1)}
              </button>
            ),
          )}
        </div>

        {/* Jobs List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 animate-pulse"
              >
                <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredJobs?.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <Briefcase className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No jobs found
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filter === "all"
                ? "Get started by posting your first job"
                : `No ${filter} jobs found`}
            </p>
            <a
              href="/dashboard/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              <Plus size={20} />
              Post Your First Job
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs?.map((job) => (
              <div
                key={job.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {job.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[job.status]}`}
                      >
                        {job.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {job.company_name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Created{" "}
                      {formatDistanceToNow(new Date(job.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {job.status === "draft" && (
                      <>
                        <a
                          href={`/dashboard/edit/${job.slug}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          <Edit size={16} />
                          Edit
                        </a>
                        <button
                          onClick={async () => {
                            const res = await fetch(
                              "/api/checkout/create-session",
                              {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ jobId: job.id }),
                              },
                            );
                            const data = await res.json();
                            if (data.url) window.location.href = data.url;
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                        >
                          <CreditCard size={16} />
                          Publish ($199)
                        </button>
                      </>
                    )}
                    {job.status === "published" && (
                      <a
                        href={`/jobs/${job.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        <Eye size={16} />
                        View Live
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
