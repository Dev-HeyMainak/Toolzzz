
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setThemeState] = React.useState<Theme | null>(null);

  React.useEffect(() => {
    // Determine initial theme: 1. localStorage, 2. system preference, 3. default to 'light'
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    if (storedTheme) {
      setThemeState(storedTheme);
    } else {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setThemeState(systemPrefersDark ? "dark" : "light");
    }
  }, []);
  
  React.useEffect(() => {
    if (theme) {
      const root = window.document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      localStorage.setItem("theme", theme);
    }
  }, [theme]);


  const toggleTheme = () => {
    setThemeState((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };
  
  if (theme === null) {
    // Avoid hydration mismatch and FOUC by rendering a placeholder.
    // 'invisible' class ensures it doesn't take up space if that's desired before hydration.
    // 'opacity-0' makes it take up space but be invisible.
    return <Button variant="outline" size="icon" className="w-9 h-9 opacity-0 invisible" disabled />;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon" onClick={toggleTheme} className="w-9 h-9">
          {theme === "dark" ? (
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          ) : (
            <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Toggle theme</p>
      </TooltipContent>
    </Tooltip>
  );
}
