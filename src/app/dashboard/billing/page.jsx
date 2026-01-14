"use client";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Download,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useUser from "@/utils/useUser";

export default function BillingPage() {
  const { data: user, loading: userLoading } = useUser();

  const { data: payments, isLoading } = useQuery({
    queryKey: ["billing-history"],
    queryFn: async () => {
      const res = await fetch("/api/billing/history");
      if (!res.ok) throw new Error("Failed to fetch billing history");
      return res.json();
    },
    enabled: !!user,
  });

  if (userLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-black dark:border-white border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    window.location.href = "/account/signin?callbackUrl=/dashboard/billing";
    return null;
  }

  const totalSpent =
    payments?.reduce(
      (sum, p) => (p.status === "succeeded" ? sum + p.amount : sum),
      0,
    ) || 0;
  const successfulPayments =
    payments?.filter((p) => p.status === "succeeded").length || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-white">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </a>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Billing History
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            View all your payments and transactions
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Spent
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  ${(totalSpent / 100).toFixed(2)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Successful Payments
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {successfulPayments}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              All Transactions
            </h2>
          </div>

          {payments?.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <CreditCard className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
              <p className="text-lg font-medium">No payments yet</p>
              <p>Your payment history will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Job
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Receipt
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {payments?.map((payment) => (
                    <tr
                      key={payment.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-6 py-4">
                        {payment.job_title ? (
                          <a
                            href={`/jobs/${payment.job_slug}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                          >
                            {payment.job_title}
                          </a>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">
                            N/A
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        ${(payment.amount / 100).toFixed(2)}{" "}
                        {payment.currency.toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {payment.status === "succeeded" ? (
                            <>
                              <CheckCircle
                                size={16}
                                className="text-green-600 dark:text-green-400"
                              />
                              <span className="text-green-700 dark:text-green-400 font-medium">
                                Succeeded
                              </span>
                            </>
                          ) : payment.status === "pending" ? (
                            <>
                              <Clock
                                size={16}
                                className="text-yellow-600 dark:text-yellow-400"
                              />
                              <span className="text-yellow-700 dark:text-yellow-400 font-medium">
                                Pending
                              </span>
                            </>
                          ) : (
                            <>
                              <XCircle
                                size={16}
                                className="text-red-600 dark:text-red-400"
                              />
                              <span className="text-red-700 dark:text-red-400 font-medium">
                                Failed
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        <div>
                          {format(new Date(payment.created_at), "MMM d, yyyy")}
                        </div>
                        <div className="text-xs">
                          {formatDistanceToNow(new Date(payment.created_at), {
                            addSuffix: true,
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {payment.stripe_session_id &&
                          payment.status === "succeeded" && (
                            <button className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                              <Download size={14} />
                              Download
                            </button>
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
