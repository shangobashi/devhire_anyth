import { useState, useEffect } from "react";
import { Menu, X, Briefcase } from "lucide-react";
import useUser from "@/utils/useUser";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: user, loading } = useUser();
  const [pathname, setPathname] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPathname(window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (user) {
      // Check if user is admin
      fetch("/api/admin/stats")
        .then((res) => {
          if (res.ok) setIsAdmin(true);
        })
        .catch(() => setIsAdmin(false));
    }
  }, [user]);

  const navigation = [
    { name: "Find Jobs", href: "/jobs" },
    { name: "Pricing", href: "/pricing" },
  ];

  const isActive = (path) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black dark:bg-white text-white dark:text-black transition-colors">
              <Briefcase size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              DevHire
            </span>
          </a>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-black dark:hover:text-white ${
                isActive(item.href)
                  ? "text-black dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Desktop Auth Buttons + Dark Mode Toggle */}
        <div className="hidden md:flex items-center gap-4">
          <DarkModeToggle />
          {loading ? (
            <div className="h-9 w-24 animate-pulse rounded-md bg-gray-100 dark:bg-gray-800" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <a
                href="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-black dark:hover:text-white ${
                  isActive("/dashboard")
                    ? "text-black dark:text-white"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                Dashboard
              </a>
              {isAdmin && (
                <a
                  href="/admin"
                  className={`text-sm font-medium transition-colors hover:text-black dark:hover:text-white ${
                    isActive("/admin")
                      ? "text-black dark:text-white"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  Admin
                </a>
              )}
              <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />
              <a
                href="/account/logout"
                className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
              >
                Sign out
              </a>
              <a
                href="/dashboard/create"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-black dark:bg-white px-4 text-sm font-medium text-white dark:text-black transition-colors hover:bg-gray-800 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                Post a Job
              </a>
            </div>
          ) : (
            <>
              <a
                href="/account/signin"
                className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
              >
                Log in
              </a>
              <a
                href="/account/signup"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-black dark:bg-white px-4 text-sm font-medium text-white dark:text-black transition-colors hover:bg-gray-800 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                Post a Job
              </a>
            </>
          )}
        </div>

        {/* Mobile Menu Button + Dark Mode Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <DarkModeToggle />
          <button
            className="p-2 text-gray-600 dark:text-gray-400"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-6 space-y-4">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block text-base font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-4">
            {user ? (
              <>
                <a
                  href="/dashboard"
                  className="block text-base font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                >
                  Dashboard
                </a>
                {isAdmin && (
                  <a
                    href="/admin"
                    className="block text-base font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  >
                    Admin
                  </a>
                )}
                <a
                  href="/dashboard/create"
                  className="block w-full rounded-lg bg-black dark:bg-white px-4 py-2 text-center text-sm font-medium text-white dark:text-black"
                >
                  Post a Job
                </a>
                <a
                  href="/account/logout"
                  className="block text-base font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
                >
                  Sign out
                </a>
              </>
            ) : (
              <>
                <a
                  href="/account/signin"
                  className="block text-base font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                >
                  Log in
                </a>
                <a
                  href="/account/signup"
                  className="block w-full rounded-lg bg-black dark:bg-white px-4 py-2 text-center text-sm font-medium text-white dark:text-black"
                >
                  Post a Job
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
