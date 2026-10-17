import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Clean public path for the current page. With `build.format: "file"` Astro
 * reports prerendered paths as `/about.html` and `/index.html`, but the site
 * serves (and should canonicalise) `/about` and `/`.
 */
export function cleanPath(pathname: string) {
  const p = pathname.replace(/\.html$/, "").replace(/\/index$/, "").replace(/\/$/, "");
  return p || "/";
}
