import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { HTMLAttributes, useEffect, useState } from "react";
import { cn } from "@/lib/utils"; // Shadcn helper for merging classes

type ThemeToggleProps = HTMLAttributes<HTMLButtonElement>

/**
 * Theme toggle component
 * Switches between light and dark themes with animated icon transitions
 */
const ThemeToggle = ({ className, ...props }: ThemeToggleProps) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" 
              size="icon" 
              className={cn("relative h-10 w-10", className)}
              {...props}
      >
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative h-10 w-10 rounded-full transition-all duration-300 hover:bg-accent/80"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
