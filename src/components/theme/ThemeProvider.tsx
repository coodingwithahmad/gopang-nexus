"use client";

import { useEffect } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    const storedTheme = localStorage.getItem("theme");
    const shouldUseDark = storedTheme === "dark";

    root.classList.toggle("dark", shouldUseDark);
  }, []);

  return children;
}
