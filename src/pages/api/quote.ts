import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

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

export const POST: APIRoute = async ({ request }) => {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
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
  const source = clean(data.source, 20) === "contact" ? "Contact form" : "Quote request";
  const page = clean(data.page, 200);

  if (!name || !phone || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Please fill in your name, phone and a valid email." }, 422);
  }

  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set — enquiry not sent", { name, phone, email });
    return json({ error: "Our online form is temporarily unavailable." }, 503);
  }

  const rows: [string, string][] = [
    ["Name", name],
    ["Phone", phone],
    ["Email", email],
    ["Suburb", suburb || "—"],
    ["Needs help with", help],
    ["Message", message || "—"],
    ["Sent from", page || "—"],
  ];
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `<h2 style="font-family:sans-serif">${source} — ProVent website</h2><table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">${rows
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
      reply_to: email,
      subject: `${source}: ${name}${suburb ? ` (${suburb})` : ""} — ${help}`,
      text,
      html,
    }),
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return json({ error: "We couldn't send your request." }, 502);
  }
  return json({ ok: true });
};

export const ALL: APIRoute = () => json({ error: "Method not allowed." }, 405);
