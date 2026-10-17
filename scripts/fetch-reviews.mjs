#!/usr/bin/env node
/**
 * Pulls Pro Vent's Google reviews via DataForSEO's Google Reviews endpoint
 * and writes src/data/reviews.json (read by the reviews section at build time).
 *
 * DataForSEO rather than the Google Places API because Places caps responses
 * at the 5 most recent reviews. Cost is ~US$0.0075 per run.
 *
 *   npm run fetch-reviews     (then build + deploy to publish)
 *
 * Needs in .env: DATAFORSEO_LOGIN, DATAFORSEO_PASSWORD, GOOGLE_PLACE_ID
 * (Place ID for "Pro Vent Air Conditioning WA": ChIJ_SGbxeIf2gcR0dHXVm7U2yY)
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const envPath = resolve(ROOT, ".env");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf-8").split(/\r?\n/)) {
    const [k, ...rest] = line.split("=");
    if (k && rest.length && !k.trim().startsWith("#") && !process.env[k.trim()]) process.env[k.trim()] = rest.join("=").trim();
  }
}

const { DATAFORSEO_LOGIN: LOGIN, DATAFORSEO_PASSWORD: PASSWORD, GOOGLE_PLACE_ID: PLACE_ID } = process.env;
if (!LOGIN || !PASSWORD || !PLACE_ID) {
  console.error("Missing DATAFORSEO_LOGIN, DATAFORSEO_PASSWORD or GOOGLE_PLACE_ID (.env or environment).");
  process.exit(1);
}

const AUTH = "Basic " + Buffer.from(`${LOGIN}:${PASSWORD}`).toString("base64");
async function call(path, body) {
  const res = await fetch(`https://api.dataforseo.com${path}`, {
    method: body ? "POST" : "GET",
    headers: { Authorization: AUTH, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  return res.json();
}

const post = await call("/v3/business_data/google/reviews/task_post", [
  { place_id: PLACE_ID, location_name: "Perth,Western Australia,Australia", language_code: "en", depth: 100, sort_by: "newest" },
]);
const taskId = post.tasks?.[0]?.id;
if (!taskId) throw new Error(`task_post returned no id: ${JSON.stringify(post).slice(0, 300)}`);
console.log("DataForSEO task", taskId);

// Review scrapes usually finish in 30–90s.
let result = null;
for (let i = 0; i < 40 && !result; i++) {
  await new Promise((r) => setTimeout(r, 5000));
  const task = (await call(`/v3/business_data/google/reviews/task_get/${taskId}`)).tasks?.[0];
  if (task?.status_code === 20000 && task.result?.length) result = task.result[0];
  else if (task?.status_code >= 40000 && task.status_code !== 40602) throw new Error(`task_get ${task.status_code} ${task.status_message}`);
  else process.stdout.write(".");
}
if (!result) throw new Error("Timed out waiting for reviews");

const reviews = (result.items || [])
  .map((r) => ({
    author: r.profile_name ?? "",
    rating: r.rating?.value ?? 5,
    text: (r.review_text ?? r.original_review_text ?? "").trim(),
    relativeTime: r.time_ago ?? "",
    date: r.timestamp ? new Date(r.timestamp.replace(" +00:00", "+00:00")).toISOString() : null,
    ownerReply: Boolean(r.owner_answer),
  }))
  .filter((r) => r.text);

const output = {
  placeName: result.title ?? "Pro Vent Air Conditioning WA",
  rating: result.rating?.value ?? null,
  total: result.reviews_count ?? reviews.length,
  mapsUrl: result.cid ? `https://maps.google.com/?cid=${result.cid}` : null,
  writeReviewUrl: `https://search.google.com/local/writereview?placeid=${PLACE_ID}`,
  reviews,
  fetchedAt: new Date().toISOString(),
};

// Only rewrite when something real changed, so the weekly GitHub Action
// doesn't commit and redeploy just because fetchedAt moved.
const outPath = resolve(ROOT, "src/data/reviews.json");
// relativeTime ("3 weeks ago") drifts every week; the site shows the date instead.
const strip = ({ fetchedAt, reviews, ...rest }) => JSON.stringify({ ...rest, reviews: reviews.map(({ relativeTime, ...r }) => r) });
const previous = existsSync(outPath) ? JSON.parse(readFileSync(outPath, "utf-8")) : null;
if (previous && strip(previous) === strip(output)) {
  console.log(`\nNo change — still ${output.rating}★ from ${output.total} reviews.`);
} else {
  writeFileSync(outPath, JSON.stringify(output, null, 2) + "\n");
  console.log(`\nUpdated: ${reviews.length} reviews with text — ${output.rating}★ from ${output.total} total.`);
}
