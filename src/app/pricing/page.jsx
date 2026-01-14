import {
  CheckCircle2,
  Zap,
  Globe,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PricingPage() {
  const features = [
    { icon: Globe, text: "Google for Jobs structured data & SEO optimization" },
    { icon: Zap, text: "Instant publishing after payment" },
    { icon: Shield, text: "30-day active listing" },
    { icon: TrendingUp, text: "Featured placement in job feed" },
    { icon: Users, text: "Direct applicant contact via your link" },
    { icon: CheckCircle2, text: "Company logo and branding" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 font-sans text-gray-900 dark:text-white">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black tracking-tight mb-6 bg-gradient-to-r from-gray-900 via-black to-gray-700 dark:from-white dark:via-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            No subscriptions, no hidden fees. Pay once per job posting.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">Single Job Post</h2>
              <p className="text-blue-100">
                Perfect for hiring one amazing developer
              </p>
            </div>

            <div className="p-8">
              <div className="flex items-baseline justify-center mb-8">
                <span className="text-6xl font-black tracking-tight">$199</span>
                <span className="text-2xl font-semibold text-gray-600 dark:text-gray-400 ml-2">
                  USD
                </span>
              </div>

              <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                One-time payment • No recurring fees
              </p>

              <a
                href="/dashboard/create"
                className="block w-full py-4 px-6 text-center bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105 mb-8"
              >
                Post a Job Now
              </a>

              <div className="space-y-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                  What's included:
                </h3>
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-lg mb-2">
                How long does my job stay active?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your job listing stays active for 30 days from the date of
                publishing.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-lg mb-2">
                Can I edit my job after posting?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! You can edit your job anytime from your dashboard before
                publishing. Once published, contact us for major changes.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-lg mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We accept all major credit cards via Stripe, our secure payment
                processor.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-lg mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We offer refunds within 7 days of posting if you haven't
                received any qualified applicants. Contact our support team.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
