import { projects } from "@/data/projects";

/**
 * The old WordPress site used plain permalinks (`/?page_id=847`), so every
 * indexed URL is the root path plus a query string. Map them to the new
 * routes so search equity and old links survive the move.
 */
const pageIds: Record<string, string> = {
  "11": "/supply-install",
  "37": "/service-repairs",
  "255": "/",
  "269": "/about",
  "271": "/service-repairs",
  "278": "/contact",
  "562": "/projects",
  "702": "/request-a-quote",
  "786": "/about",
  "843": "/supply-install",
  "845": "/split-system-air-conditioning",
  "846": "/split-system-size-calculator",
  "847": "/ducted-air-conditioning",
  "1117": "/evaporative-air-conditioning",
};

const projectSlugs: Record<string, string> = Object.fromEntries(
  projects.map((p) => [p.legacySlug, `/projects/${p.slug}`]),
);

/** Returns the absolute URL to 301 to, or null if this isn't a legacy URL. */
export function legacyRedirect(url: URL): string | null {
  if (url.pathname !== "/" && url.pathname !== "/index.php") return null;
  const q = url.searchParams;
  let target: string | undefined;
  if (q.has("page_id")) target = pageIds[q.get("page_id")!] ?? "/";
  else if (q.has("portfolio_tradesmen")) target = projectSlugs[q.get("portfolio_tradesmen")!] ?? "/projects";
  else if (q.has("p") || q.has("cat") || q.has("post_type")) target = "/";
  if (!target) return null;
  return new URL(target, url.origin).toString();
}
