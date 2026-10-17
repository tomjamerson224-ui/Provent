import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { Buffer } from "node:buffer";
import { MAX_FILE_BYTES, MAX_FILES, MAX_TOTAL_BYTES, formatBytes, isAllowedFile } from "@/lib/attachments";

// The only on-demand route — everything else is prerendered.
export const prerender = false;

const HELP_LABELS: Record<string, string> = {
  service: "Air conditioner service / repair",
  installation: "New air conditioner installation",
  quote: "Fast air conditioner quote",
  question: "Quick technical question",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Keep attachment names readable but safe for email headers. */
const safeFilename = (name: string) =>
  name.replace(/[^\w.\- ()]+/g, "_").replace(/_+/g, "_").slice(-100) || "attachment";

export const POST: APIRoute = async ({ request }) => {
  let data: Record<string, unknown> = {};
  let files: File[] = [];

  const type = request.headers.get("content-type") ?? "";
  try {
    if (type.includes("multipart/form-data")) {
      const form = await request.formData();
      for (const [key, value] of form.entries()) {
        if (key === "files") {
          if (typeof value !== "string" && value.size > 0) files.push(value);
        } else if (typeof value === "string") {
          data[key] = value;
        }
      }
    } else {
      data = await request.json();
    }
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  // Bots fill the hidden field; pretend it worked so they don't retry.
  if (clean(data.company_website)) return json({ ok: true });

  const name = clean(data.name, 100);
  const phone = clean(data.phone, 40);
  const email = clean(data.email, 200);
  const suburb = clean(data.suburb, 100);
  const help = HELP_LABELS[clean(data.help, 40)] ?? "Not specified";
  const message = clean(data.message, 5000);
  const sourceKey = clean(data.source, 20);
  const source = sourceKey === "contact" ? "Contact form" : sourceKey === "ducted" ? "Ducted quote (ads landing page)" : "Quote request";
  const homeSize = clean(data.homeSize, 40);
  const evap = clean(data.evap, 10);
  const page = clean(data.page, 200);

  // Email is optional on the ads landing page (phone is what matters there),
  // but must be valid whenever it's given.
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!name || !phone || (email ? !emailOk : sourceKey !== "ducted")) {
    return json({ error: "Please fill in your name, phone and a valid email." }, 422);
  }

  if (files.length > MAX_FILES) return json({ error: `Please attach up to ${MAX_FILES} files.` }, 422);
  const total = files.reduce((sum, f) => sum + f.size, 0);
  const tooBig = files.find((f) => f.size > MAX_FILE_BYTES);
  if (tooBig) return json({ error: `"${tooBig.name}" is over ${formatBytes(MAX_FILE_BYTES)}.` }, 413);
  if (total > MAX_TOTAL_BYTES) return json({ error: `Attachments are over ${formatBytes(MAX_TOTAL_BYTES)} in total.` }, 413);
  const badType = files.find((f) => !isAllowedFile(f.name));
  if (badType) return json({ error: `"${badType.name}" isn't a PDF or image file.` }, 415);

  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set — enquiry not sent", { name, phone, email });
    return json({ error: "Our online form is temporarily unavailable." }, 503);
  }

  const attachments = await Promise.all(
    files.map(async (f) => ({
      filename: safeFilename(f.name),
      content: Buffer.from(await f.arrayBuffer()).toString("base64"),
    })),
  );

  const rows: [string, string][] = [
    ["Name", name],
    ["Phone", phone],
    ["Email", email || "—"],
    ["Suburb", suburb || "—"],
    ["Needs help with", help],
    ...(homeSize ? ([["Home size", homeSize]] as [string, string][]) : []),
    ...(evap ? ([["Replacing evaporative", evap]] as [string, string][]) : []),
    ["Message", message || "—"],
    ["Attachments", files.length ? files.map((f) => `${safeFilename(f.name)} (${formatBytes(f.size)})`).join(", ") : "—"],
    ["Sent from", page || "—"],
  ];
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `<h2 style="font-family:sans-serif">${source} — Pro Vent website</h2><table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top;white-space:nowrap">${k}</td><td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
    )
    .join("")}</table>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.QUOTE_FROM_EMAIL,
      to: [env.QUOTE_TO_EMAIL],
      ...(email ? { reply_to: email } : {}),
      subject: `${source}: ${name}${suburb ? ` (${suburb})` : ""} — ${help}${files.length ? ` [${files.length} attachment${files.length > 1 ? "s" : ""}]` : ""}`,
      text,
      html,
      ...(attachments.length ? { attachments } : {}),
    }),
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return json({ error: "We couldn't send your request." }, 502);
  }
  return json({ ok: true });
};

export const ALL: APIRoute = () => json({ error: "Method not allowed." }, 405);
