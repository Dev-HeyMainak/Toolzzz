"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [theme, setThemeState] = React.useState<"theme-light" | "dark" | null>(null);

  React.useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setThemeState(isDarkMode ? "dark" : "theme-light");
  }, []);
  
  React.useEffect(() => {
    if (theme !== null) {
      const root = window.document.documentElement;
      root.classList.remove("theme-light", "dark");
      root.classList.add(theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme]);


  const toggleTheme = () => {
    setThemeState((prevTheme) => (prevTheme === "dark" ? "theme-light" : "dark"));
  };
  
  if (theme === null) {
    // Avoid hydration mismatch by not rendering the button until theme is determined
    return <Button variant="outline" size="icon" className="w-9 h-9 opacity-0" disabled />;
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} className="w-9 h-9">
      {theme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
