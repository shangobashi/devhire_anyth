import { ArrowRight, CheckCircle2, Globe, Zap, Shield } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans text-gray-900 dark:text-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="mx-auto max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                The home for{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  web developer
                </span>{" "}
                jobs.
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
                DevHire connects the best companies with top-tier web
                developers. Post a job in minutes, reach thousands of qualified
                candidates, and build your dream team.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="/dashboard/create"
                  className="rounded-xl bg-black dark:bg-white px-6 py-3.5 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-gray-800 dark:hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white transition-all"
                >
                  Post a Job for $199
                </a>
                <a
                  href="/jobs"
                  className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  Find a job <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="bg-gray-50 dark:bg-gray-800 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Everything you need to hire
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
                Simple pricing, powerful reach.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                <div className="flex flex-col items-start">
                  <div className="rounded-lg bg-white dark:bg-gray-700 p-2 ring-1 ring-gray-200 dark:ring-gray-600">
                    <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <dt className="mt-4 font-semibold text-gray-900 dark:text-white">
                    Global Reach
                  </dt>
                  <dd className="mt-2 leading-7 text-gray-600 dark:text-gray-400">
                    Your job posting is indexed by Google for Jobs and shared
                    across our partner network.
                  </dd>
                </div>
                <div className="flex flex-col items-start">
                  <div className="rounded-lg bg-white dark:bg-gray-700 p-2 ring-1 ring-gray-200 dark:ring-gray-600">
                    <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <dt className="mt-4 font-semibold text-gray-900 dark:text-white">
                    Instant Publishing
                  </dt>
                  <dd className="mt-2 leading-7 text-gray-600 dark:text-gray-400">
                    Pay via Stripe and your job goes live immediately. No
                    waiting for approval.
                  </dd>
                </div>
                <div className="flex flex-col items-start">
                  <div className="rounded-lg bg-white dark:bg-gray-700 p-2 ring-1 ring-gray-200 dark:ring-gray-600">
                    <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <dt className="mt-4 font-semibold text-gray-900 dark:text-white">
                    Quality Candidates
                  </dt>
                  <dd className="mt-2 leading-7 text-gray-600 dark:text-gray-400">
                    We focus exclusively on web development roles, attracting
                    highly skilled talent.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Simple Pricing Preview */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl rounded-3xl ring-1 ring-gray-200 dark:ring-gray-700 lg:mx-0 lg:flex lg:max-w-none bg-white dark:bg-gray-800">
              <div className="p-8 sm:p-10 lg:flex-auto">
                <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Single Job Post
                </h3>
                <p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-400">
                  Perfect for companies looking to fill a single role. Get your
                  job in front of thousands of developers for 30 days.
                </p>
                <div className="mt-10 flex items-center gap-x-4">
                  <h4 className="flex-none text-sm font-semibold leading-6 text-blue-600 dark:text-blue-400">
                    What's included
                  </h4>
                  <div className="h-px flex-auto bg-gray-100 dark:bg-gray-700" />
                </div>
                <ul
                  role="list"
                  className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 dark:text-gray-400 sm:grid-cols-2 sm:gap-6"
                >
                  {[
                    "30-day active listing",
                    "Google for Jobs schema",
                    "Company logo & branding",
                    "Direct application link",
                    "Analytics dashboard",
                    "Email support",
                  ].map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckCircle2
                        className="h-6 w-5 flex-none text-blue-600 dark:text-blue-400"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
                <div className="rounded-2xl bg-gray-50 dark:bg-gray-700 py-10 text-center ring-1 ring-inset ring-gray-900/5 dark:ring-gray-600/20 lg:flex lg:flex-col lg:justify-center lg:py-16">
                  <div className="mx-auto max-w-xs px-8">
                    <p className="text-base font-semibold text-gray-600 dark:text-gray-400">
                      One-time payment
                    </p>
                    <p className="mt-6 flex items-baseline justify-center gap-x-2">
                      <span className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                        $199
                      </span>
                      <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600 dark:text-gray-400">
                        USD
                      </span>
                    </p>
                    <a
                      href="/dashboard/create"
                      className="mt-10 block w-full rounded-md bg-blue-600 dark:bg-blue-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 dark:hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                      Post a job
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
