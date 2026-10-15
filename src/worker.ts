import { handle } from "@astrojs/cloudflare/handler";
import { legacyRedirect } from "@/lib/legacy-redirects";

// Wraps Astro's Cloudflare handler so legacy WordPress `/?page_id=` URLs get
// a 301 before Astro sees them. wrangler.jsonc routes "/" through the Worker
// first (`run_worker_first`), otherwise the static index.html would answer.
export default {
  async fetch(request, env, ctx) {
    const target = legacyRedirect(new URL(request.url));
    if (target) return Response.redirect(target, 301);
    return handle(request, env, ctx);
  },
} satisfies ExportedHandler<Env>;
