# ProVent Air Conditioning — website

Rebuild of [proventairconditioning.com.au](https://proventairconditioning.com.au) (previously WordPress + Elementor) as a fast static site.

- **Astro 7** — every page is prerendered to plain HTML
- **React islands + shadcn/ui** (radix-nova style) for the interactive parts: navigation menus, mobile menu, quote form, project filter and size calculator
- **Tailwind CSS 4** — brand tokens live in `src/styles/global.css` (amber `#FCB827` on charcoal `#191C1E`)
- **Cloudflare Workers** (static assets + one Worker route, `/api/quote`)

## Local development

```sh
npm install
npm run dev        # http://localhost:4321
npm run check      # type-check
npm run preview    # production build served by wrangler (http://localhost:8787)
```

For `npm run preview` to send real emails, copy `.dev.vars.example` to `.dev.vars` and add a Resend API key.

## Where things live

| What | Where |
| --- | --- |
| Phone, email, nav menus, shared copy | `src/data/site.ts` |
| Projects ("Our Work") | `src/data/projects.ts` + images in `src/assets/images/` |
| Page sections (hero, CTA band, process, etc.) | `src/components/sections/` |
| Header / menus (shadcn NavigationMenu + Sheet) | `src/components/SiteNav.tsx` |
| Quote & contact form | `src/components/QuoteForm.tsx` → `src/pages/api/quote.ts` |
| Old WordPress URL redirects | `astro.config.mjs` (paths) and `src/lib/legacy-redirects.ts` (`/?page_id=` URLs) |
| shadcn components | `src/components/ui/` (add more with `npx shadcn@latest add <name>`) |

To add a project: drop a photo in `src/assets/images/`, import it at the top of `src/data/projects.ts` and add an entry to the array. It appears on `/projects`, its own page, and the matching system pages automatically.

## Deploying to Cloudflare

**Option A — automatic deploys from GitHub (recommended)**

1. Cloudflare dashboard → **Workers & Pages → Create → Import a repository** → pick this repo.
2. Build command `npm run build`, deploy command `npx wrangler deploy`.
3. Every push to `main` then builds and deploys.

**Option B — from your machine:** `npx wrangler login` once, then `npm run deploy`.

### Form email setup (once)

The quote/contact forms email via [Resend](https://resend.com) (free tier is plenty):

1. Create a Resend account and verify the `proventairconditioning.com.au` domain (adds a few DNS records).
2. Create an API key, then: `npx wrangler secret put RESEND_API_KEY`
3. Recipient/sender addresses are `QUOTE_TO_EMAIL` / `QUOTE_FROM_EMAIL` in `wrangler.jsonc`.

Until the key is set, the form shows an error asking people to call instead — nothing is silently lost.

### Pointing the domain

In the Worker's **Settings → Domains & Routes**, add `proventairconditioning.com.au` and `www.proventairconditioning.com.au` as custom domains (the domain's DNS must be on Cloudflare). Old WordPress URLs (`/?page_id=847`, `/?portfolio_tradesmen=…`, `/about-us`, etc.) 301 to their new pages, so search rankings carry over.
