import { Moon, Sun } from "lucide-react";
import useDarkMode from "@/utils/useDarkMode";

export default function DarkModeToggle() {
  const { isDark, toggle, mounted } = useDarkMode();

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggle}
      className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 dark:from-indigo-500 dark:to-purple-600 p-2 transition-all duration-300 hover:scale-110 hover:rotate-12 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white shadow-lg"
      aria-label="Toggle dark mode"
    >
      <div className="relative w-full h-full">
        <Sun
          size={20}
          className={`absolute inset-0 text-white transition-all duration-300 ${
            isDark
              ? "opacity-0 rotate-90 scale-0"
              : "opacity-100 rotate-0 scale-100"
          }`}
        />
        <Moon
          size={20}
          className={`absolute inset-0 text-white transition-all duration-300 ${
            isDark
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-0"
          }`}
        />
      </div>
    </button>
  );
}
