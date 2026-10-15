import type { ImageMetadata } from "astro";

import imgLocalBusiness from "@/assets/images/project-local-business.avif";
import imgEvapToDucted from "@/assets/images/project-evap-to-ducted.avif";
import imgPrecisionLift from "@/assets/images/project-precision-lift.avif";
import imgMelville from "@/assets/images/project-melville-industrial.avif";
import imgLinearVents from "@/assets/images/project-linear-vents.avif";
import imgCleanDucted from "@/assets/images/project-clean-ducted.avif";
import imgPanasonicDucted from "@/assets/images/project-panasonic-ducted.avif";
import imgDualPanasonic from "@/assets/images/project-dual-panasonic.avif";
import imgEvapReplacement from "@/assets/images/project-evaporative-replacement.avif";

export type SystemCategory = "ducted" | "split" | "evaporative";

export const categoryLabels: Record<SystemCategory, string> = {
  ducted: "Ducted",
  split: "Split System",
  evaporative: "Evaporative",
};

export type Project = {
  slug: string;
  /** Old WordPress `?portfolio_tradesmen=` slug, for 301s. */
  legacySlug: string;
  title: string;
  subtitle: string;
  body: string[];
  image: ImageMetadata;
  imageAlt: string;
  categories: SystemCategory[];
};

// Newest first — this order is used everywhere projects are listed.
export const projects: Project[] = [
  {
    slug: "local-business-split-systems",
    legacySlug: "keeping-your-local-businesses-cool",
    title: "Keeping Your Local Businesses Cool",
    subtitle: "A small local business wanted their shop fully air-conditioned.",
    body: [
      "We were more than happy to make it happen. We designed and installed a range of split systems at a great price, because supporting local businesses is something we truly believe in.",
      "The result? A professional finish, built tough to last, with efficient cooling that keeps staff and customers comfortable all year round.",
    ],
    image: imgLocalBusiness,
    imageAlt: "Row of split system outdoor units installed on a commercial roof in Perth",
    categories: ["split"],
  },
  {
    slug: "evaporative-to-ducted-upgrade",
    legacySlug: "from-old-to-new-seamless-ducted-aircon-upgrades-done-right",
    title: "Old Evap Unit to New Ducted Aircon",
    subtitle: "We swapped a dated evaporative unit for a modern, efficient ducted system.",
    body: [
      "This home got a massive comfort boost — but we didn't stop there. The old machine left a big hole in the roof, exposed to the elements, and instead of calling in another contractor we repaired it ourselves.",
      "That means less hassle, less cost, and a clean, professional finish from start to finish. With us you get more than an aircon install — you get a one-stop shop that handles everything.",
    ],
    image: imgEvapToDucted,
    imageAlt: "Repaired metal roof after removing an old evaporative cooler",
    categories: ["ducted", "evaporative"],
  },
  {
    slug: "precision-lift-and-install",
    legacySlug: "installed-the-right-way",
    title: "Precision Lift & Install",
    subtitle: "Right gear, right team, zero compromise.",
    body: [
      "Using our heavy-duty installation hoist for double-storey installs, our crew uses purpose-built equipment and follows strict protocols to keep every job injury-free.",
      "No risky shortcuts — just a well-drilled team moving larger units smoothly into place, so your new air-con starts its life safely and performs at its best.",
    ],
    image: imgPrecisionLift,
    imageAlt: "ProVent technicians lifting a ducted outdoor unit into position with a hoist",
    categories: ["ducted"],
  },
  {
    slug: "melville-industrial-ducting",
    legacySlug: "modern-melville-home-makeover-with-industrial-cool-ducting",
    title: "Melville Renovation with Industrial Ducting",
    subtitle: "Industrial edge, home comfort — exactly what the client asked for.",
    body: [
      "The brief was a bold, exposed-duct feature to anchor this open-plan makeover. We custom-fitted slimline slot diffusers so airflow stays whisper-quiet while the industrial ducting steals the show.",
      "It's a functional warehouse-loft look that finishes the space with a punch of modern Perth character.",
    ],
    image: imgMelville,
    imageAlt: "Exposed spiral ducting running along a brick wall in a renovated Melville home",
    categories: ["ducted"],
  },
  {
    slug: "modern-linear-vents",
    legacySlug: "modern-linear-vents-for-a-sleek-finish",
    title: "Modern Linear Vents for a Sleek Finish",
    subtitle: "Out with the old — clean, stylish vents to match today's homes.",
    body: [
      "We replaced bulky, dated ceiling vents with low-profile linear designs to give the space a fresh, modern look.",
      "Installed with care and precision, they blend seamlessly into the ceiling, improve airflow and add a premium feel to the room.",
    ],
    image: imgLinearVents,
    imageAlt: "Slim linear ducted air conditioning vent in a white ceiling",
    categories: ["ducted"],
  },
  {
    slug: "clean-ducted-install",
    legacySlug: "clean-ducted-install-done-right-first-time",
    title: "Clean Ducted Install — Done Right, First Time",
    subtitle: "Top-quality workmanship with a neat, professional finish.",
    body: [
      "One of our recent ducted installs — everything sealed tight, lined up properly and built to perform.",
      "We take pride in clean, efficient work that looks as good behind the scenes as it feels in your home.",
    ],
    image: imgCleanDucted,
    imageAlt: "Ducted indoor unit and insulated flex ducting neatly installed in a roof space",
    categories: ["ducted"],
  },
  {
    slug: "panasonic-ducted-install",
    legacySlug: "panasonic-ducted-unit-installed",
    title: "Panasonic Ducted Unit Installed",
    subtitle: "Reliable cooling for larger homes and multi-zone setups.",
    body: [
      "We installed this high-capacity Panasonic system to deliver powerful, efficient cooling for a larger home.",
      "It's built to handle multiple zones with ease — keeping every room comfortable, even at the peak of summer.",
    ],
    image: imgPanasonicDucted,
    imageAlt: "Panasonic ducted outdoor unit mounted against a white brick wall",
    categories: ["ducted"],
  },
  {
    slug: "dual-panasonic-split-systems",
    legacySlug: "dual-panasonic-units-cool-quiet-reliable",
    title: "Dual Panasonic Units — Cool, Quiet & Reliable",
    subtitle: "Tailored climate control from the very start.",
    body: [
      "Installed as part of a new home build, these Panasonic systems were chosen for their energy efficiency, quiet performance and year-round comfort.",
      "A perfect fit to keep the home cool in summer and cosy in winter from day one.",
    ],
    image: imgDualPanasonic,
    imageAlt: "Two Panasonic split system outdoor units stacked on a wall bracket",
    categories: ["split"],
  },
  {
    slug: "evaporative-replacement",
    legacySlug: "evaporative-aircon-replacement",
    title: "Evaporative Aircon Replacement",
    subtitle: "Cool comfort restored.",
    body: [
      "Our customer was dealing with poor airflow and rising energy bills from their old evaporative unit.",
      "We replaced it with a brand-new system to restore powerful cooling, better efficiency and peace of mind — just in time for summer.",
    ],
    image: imgEvapReplacement,
    imageAlt: "New terracotta-coloured evaporative cooler installed on a tiled roof",
    categories: ["evaporative"],
  },
];

export const projectsFor = (category: SystemCategory) =>
  projects.filter((p) => p.categories.includes(category));
