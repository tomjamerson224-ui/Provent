import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Blog posts live in src/content/blog/*.mdx. MDX lets posts import price data
// from src/data so tables never drift from the rest of the site.
const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Meta description — keep under ~155 characters. */
      description: z.string().max(160),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image(),
      heroAlt: z.string(),
      category: z.enum(["Ducted", "Split systems", "Evaporative", "Buying guides"]),
      /** Shown on the post and output as FAQPage schema. */
      faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
      /** Links shown in the "Related" box at the end of the post. */
      related: z.array(z.object({ title: z.string(), href: z.string() })).default([]),
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog };
