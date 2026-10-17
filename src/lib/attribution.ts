/**
 * Lead source tracking. A tiny script on every page (Layout) records how the
 * visitor arrived — campaign tags, ad click IDs, the referring site and the
 * landing page — and QuoteForm sends it with each enquiry so /api/quote can
 * say where the lead came from. Raw data only here; classification happens
 * server-side in classifySource().
 *
 * - last touch:  this visit (sessionStorage)
 * - first touch: the first visit we saw, kept 90 days (localStorage)
 */

export const TRACKED_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
  "msclkid",
  "fbclid",
] as const;

export type Touch = {
  landing: string;
  referrer: string;
  params: Record<string, string>;
  ts: string;
};

export type Attribution = { first?: Touch; last?: Touch; pages?: number };

const FIRST_KEY = "pv_first_touch";
const LAST_KEY = "pv_last_touch";
const PAGES_KEY = "pv_pages";
const FIRST_TTL_MS = 90 * 24 * 60 * 60 * 1000;

const read = <T>(store: Storage, key: string): T | undefined => {
  try {
    const raw = store.getItem(key);
    return raw ? (JSON.parse(raw) as T) : undefined;
  } catch {
    return undefined;
  }
};
const write = (store: Storage, key: string, value: unknown) => {
  try {
    store.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode / storage blocked — tracking is best-effort */
  }
};

/** Runs on every page load. */
export function recordVisit() {
  const url = new URL(location.href);
  const params: Record<string, string> = {};
  for (const k of TRACKED_PARAMS) {
    const v = url.searchParams.get(k);
    if (v) params[k] = v.slice(0, 200);
  }

  let referrer = "";
  try {
    if (document.referrer && new URL(document.referrer).hostname !== location.hostname) referrer = document.referrer.slice(0, 300);
  } catch {
    /* malformed referrer */
  }

  const touch: Touch = { landing: url.pathname, referrer, params, ts: new Date().toISOString() };
  const isNewSource = Object.keys(params).length > 0 || referrer !== "";

  // A new campaign/referrer always starts a new "last touch"; otherwise only
  // the first page of the session does (so internal clicks don't overwrite it).
  if (isNewSource || !read(sessionStorage, LAST_KEY)) {
    write(sessionStorage, LAST_KEY, touch);
    write(sessionStorage, PAGES_KEY, 0);
  }
  write(sessionStorage, PAGES_KEY, (read<number>(sessionStorage, PAGES_KEY) ?? 0) + 1);

  const first = read<Touch>(localStorage, FIRST_KEY);
  if (!first || Date.now() - new Date(first.ts).getTime() > FIRST_TTL_MS) write(localStorage, FIRST_KEY, touch);
}

/** Read by QuoteForm at submit time. */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  return {
    first: read<Touch>(localStorage, FIRST_KEY),
    last: read<Touch>(sessionStorage, LAST_KEY),
    pages: read<number>(sessionStorage, PAGES_KEY),
  };
}

/** Server-side: turn a touch into a human label for the email. */
export function classifySource(t: Touch | undefined): string {
  if (!t) return "Unknown";
  const p = t.params ?? {};
  const source = (p.utm_source ?? "").toLowerCase();
  const medium = (p.utm_medium ?? "").toLowerCase();
  const campaign = (p.utm_campaign ?? "").toLowerCase();
  let host = "";
  try {
    host = t.referrer ? new URL(t.referrer).hostname.replace(/^www\./, "") : "";
  } catch {
    host = "";
  }
  const paid = /cpc|ppc|paid|ads?$/.test(medium);

  if (p.gclid || p.gbraid || p.wbraid || (source.includes("google") && paid)) return "Google Ads";
  if (p.msclkid || (source.includes("bing") && paid)) return "Microsoft (Bing) Ads";
  if (campaign === "gbp" || source === "gbp" || medium === "gbp") return "Google Business Profile";
  if (p.fbclid || /facebook|instagram|^fb$|^ig$|meta/.test(source)) return paid ? "Facebook/Instagram Ads" : "Facebook/Instagram";
  if (source) return `${p.utm_source}${p.utm_medium ? ` / ${p.utm_medium}` : ""}`;

  if (/(^|\.)google\./.test(host)) return "Google search (organic)";
  if (/(^|\.)bing\.com$/.test(host)) return "Bing search (organic)";
  if (/duckduckgo\.com$/.test(host)) return "DuckDuckGo search";
  if (/(^|\.)yahoo\./.test(host)) return "Yahoo search";
  if (/chatgpt\.com$|openai\.com$/.test(host)) return "ChatGPT";
  if (/perplexity\.ai$/.test(host)) return "Perplexity";
  if (/facebook\.com$|instagram\.com$|fb\.me$|l\.facebook\.com$/.test(host)) return "Facebook/Instagram";
  if (/hipages\.com\.au$/.test(host)) return "hipages";
  if (host) return `Referral: ${host}`;
  return "Direct (typed URL, bookmark or untracked link)";
}
