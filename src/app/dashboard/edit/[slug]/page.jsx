"use client";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useUser from "@/utils/useUser";
import { useUpload } from "@/utils/useUpload";

export default function EditJobPage({ params }) {
  const { slug } = params;
  const { data: user, loading: userLoading } = useUser();
  const { getRootProps, getInputProps, isDragActive, file, uploading } =
    useUpload();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company_name: "",
    company_logo: "",
    location: "",
    job_type: "full-time",
    salary_min: "",
    salary_max: "",
    application_url: "",
  });

  // Fetch job data
  const { data: jobData, isLoading } = useQuery({
    queryKey: ["job", slug],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/jobs`);
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const jobs = await res.json();
      const job = jobs.find((j) => j.slug === slug);
      if (!job) throw new Error("Job not found");
      return job;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (jobData) {
      setFormData({
        title: jobData.title || "",
        description: jobData.description || "",
        company_name: jobData.company_name || "",
        company_logo: jobData.company_logo || "",
        location: jobData.location || "",
        job_type: jobData.job_type || "full-time",
        salary_min: jobData.salary_min || "",
        salary_max: jobData.salary_max || "",
        application_url: jobData.application_url || "",
      });
    }
  }, [jobData]);

  useEffect(() => {
    if (file?.cdnUrl) {
      setFormData((prev) => ({ ...prev, company_logo: file.cdnUrl }));
    }
  }, [file]);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch(`/api/jobs/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update job");
      return res.json();
    },
    onSuccess: (data) => {
      alert("Job updated successfully!");
      if (data.slug !== slug) {
        window.location.href = `/dashboard/edit/${data.slug}`;
      }
    },
  });

  if (userLoading || isLoading) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-white">
      <Header />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </a>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Edit Job Posting
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Update your job details
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.company_name}
                onChange={(e) =>
                  setFormData({ ...formData, company_name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Logo
              </label>
              {formData.company_logo ? (
                <div className="mb-4">
                  <img
                    src={formData.company_logo}
                    alt="Company logo"
                    className="w-24 h-24 object-contain rounded-lg border border-gray-200 dark:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, company_logo: "" })
                    }
                    className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
                  >
                    Remove logo
                  </button>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? "border-black dark:border-white bg-gray-50 dark:bg-gray-700"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                  {uploading ? (
                    <p className="text-gray-600 dark:text-gray-400">
                      Uploading...
                    </p>
                  ) : (
                    <>
                      <p className="text-gray-600 dark:text-gray-400">
                        Drag & drop or click to upload
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        PNG, JPG up to 5MB
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Description *
              </label>
              <textarea
                required
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Remote, San Francisco, CA"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Type *
                </label>
                <select
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={formData.job_type}
                  onChange={(e) =>
                    setFormData({ ...formData, job_type: e.target.value })
                  }
                >
                  <option value="full-time">Full-time</option>
                  <option value="contract">Contract</option>
                  <option value="part-time">Part-time</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Salary (USD)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 80000"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={formData.salary_min}
                  onChange={(e) =>
                    setFormData({ ...formData, salary_min: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Salary (USD)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 120000"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={formData.salary_max}
                  onChange={(e) =>
                    setFormData({ ...formData, salary_max: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Application URL *
              </label>
              <input
                type="url"
                required
                placeholder="https://your-company.com/apply"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.application_url}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    application_url: e.target.value,
                  })
                }
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Where should candidates apply? (Your careers page, email, etc.)
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex-1 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateMutation.isPending ? "Updating..." : "Update Job"}
              </button>
              <a
                href="/dashboard"
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </a>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
