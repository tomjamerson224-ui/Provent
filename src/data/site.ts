import type { ImageMetadata } from "astro";

import iconSplit from "@/assets/images/icon-split.avif";
import iconDucted from "@/assets/images/icon-ducted.avif";
import iconEvaporative from "@/assets/images/icon-evaporative.avif";
import imgDuctedLiving from "@/assets/images/ducted-living-room.webp";
import imgFamilyLiving from "@/assets/images/family-living-room.webp";
import imgEvapRoof from "@/assets/images/evaporative-roof-unit.webp";
import imgServicePortrait from "@/assets/images/tech-service-portrait.avif";
import imgDuctingRoof from "@/assets/images/ducting-roof-space.webp";

export const business = {
  name: "Pro Vent Air Conditioning WA",
  shortName: "Pro Vent",
  tagline: "Perth's go-to aircon team",
  phone: "0420 496 791",
  phoneHref: "tel:0420496791",
  email: "info@proventairconditioning.com.au",
  emailHref: "mailto:info@proventairconditioning.com.au",
  region: "Perth, Western Australia",
  owner: "Matt",
  url: "https://proventairconditioning.com.au",
  area: "Perth CBD & surrounds · Kalamunda & the Hills",
  /** ARCtick refrigerant trading authorisation. */
  arctick: "AU59556",
} as const;

/**
 * Conversion tracking. Phone taps and form submissions always push
 * `phone_click` / `lead_submit` events to window.dataLayer. Fill these in to
 * also send Google Ads conversions (Google Ads > Goals > Conversions > the
 * action > Tag setup > "Use Google tag" shows AW-XXXXXXXXX/label).
 */
export const tracking = {
  googleAdsId: null as string | null, // e.g. "AW-123456789"
  leadLabel: null as string | null, // conversion label for form submissions
  callLabel: null as string | null, // conversion label for tel: clicks
};

export type NavLink = {
  title: string;
  href: string;
  description: string;
  icon?: ImageMetadata;
  image?: ImageMetadata;
};

/** The three system types — used in the "Systems" menu and the picker grid. */
export const systems: NavLink[] = [
  {
    title: "Ducted Air Conditioning",
    href: "/ducted-air-conditioning",
    description: "Whole-home climate control with hidden ducts, slim vents and smart zoning.",
    icon: iconDucted,
    image: imgDuctedLiving,
  },
  {
    title: "Split System Air Conditioning",
    href: "/split-system-air-conditioning",
    description: "Efficient, quiet, cost-effective cooling and heating for bedrooms, living areas and offices.",
    icon: iconSplit,
    image: imgFamilyLiving,
  },
  {
    title: "Evaporative Air Conditioning",
    href: "/evaporative-air-conditioning",
    description: "Fresh, budget-friendly cooling built for Perth's hot, dry summers.",
    icon: iconEvaporative,
    image: imgEvapRoof,
  },
];

/** Service lines — the "Services" menu. */
export const services: NavLink[] = [
  {
    title: "Supply & Install",
    href: "/supply-install",
    description: "New systems, done right — from measure and design through to a tidy install.",
    image: imgDuctingRoof,
  },
  {
    title: "Service & Repairs",
    href: "/service-repairs",
    description: "Fault-finding and repairs for all brands and models, with up-front quotes.",
    image: imgServicePortrait,
  },
  {
    title: "Evaporative to Ducted Conversion",
    href: "/evaporative-to-ducted-reverse-cycle",
    description: "Swap the old roof cooler for ducted reverse cycle — removal and roof repair included.",
  },
  {
    title: "Ducted Cost Guide",
    href: "/ducted-air-conditioning-cost",
    description: "What ducted air conditioning costs in Perth and what a good quote should include.",
  },
  {
    title: "Ceiling Cassette Air Conditioning",
    href: "/ceiling-cassette-air-conditioning",
    description: "Discreet in-ceiling heating and cooling for open-plan homes, shops and offices.",
  },
  {
    title: "Split System Size Calculator",
    href: "/split-system-size-calculator",
    description: "Work out roughly what size split system your room needs in under a minute.",
  },
];

export const mainNav = {
  services,
  systems,
  links: [
    { title: "Our Work", href: "/projects" },
    { title: "Guides", href: "/blog" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
  ],
};

export const footerLinks = [
  { title: "About Us", href: "/about" },
  { title: "Ducted Air Conditioning", href: "/ducted-air-conditioning" },
  { title: "Ducted Cost Guide", href: "/ducted-air-conditioning-cost" },
  { title: "Evaporative to Ducted", href: "/evaporative-to-ducted-reverse-cycle" },
  { title: "Ceiling Cassettes", href: "/ceiling-cassette-air-conditioning" },
  { title: "Kalamunda & Perth Hills", href: "/air-conditioning-kalamunda" },
  { title: "Supply & Install", href: "/supply-install" },
  { title: "Service & Repairs", href: "/service-repairs" },
  { title: "Guides & Advice", href: "/blog" },
  { title: "Our Work", href: "/projects" },
  { title: "Size Calculator", href: "/split-system-size-calculator" },
  { title: "Request a Quote", href: "/request-a-quote" },
  { title: "Contact", href: "/contact" },
];

export const howWeWork = [
  {
    title: "Quick Quote & Consultation",
    body: "Tell us what you need for heating or cooling, and we'll send you a price estimate and schedule a visit — no pressure or hidden costs.",
  },
  {
    title: "Precise Measure & Custom Design",
    body: "Our technician measures your space and designs a system that fits your comfort and budget. You'll get a written quote by email before we start.",
  },
  {
    title: "Expert Installation",
    body: "We protect your home during installation, run pipes out of sight, and ensure everything is properly sealed and tested.",
  },
  {
    title: "Support & Peace of Mind",
    body: "We'll show you how to use the system, set up your first service reminder, and provide a three-year warranty on our work and up to five years on equipment.",
  },
];

export const whyProVent = [
  {
    title: "Family-run, Perth-based business",
    body: "We're a family-owned business based in Perth, led by Matt and his team of local experts. You can trust us for honest advice and fair prices.",
  },
  {
    title: "10+ years of experience",
    body: "We supply and install air conditioning for homes and businesses across Western Australia, keeping families cool through those hot summer months.",
  },
  {
    title: "Simple, hassle-free process",
    body: "We work out the right size and type of system for you, without delays or hidden fees, and make everything easy to understand.",
  },
  {
    title: "Installation & unit warranty",
    body: "A 3-year warranty on our installation work and a 5-year manufacturer's warranty on the air conditioning units we supply.",
  },
];

export const commitments = [
  {
    title: "Safety",
    body: "We're licensed, insured and follow safety rules. Our technicians hold a Certificate in Refrigeration and Air-Conditioning, and we hold ARCtick licence AU59556.",
  },
  {
    title: "Quality",
    body: "Relax knowing you're covered by a 3-year warranty on our work and a 5-year warranty on the equipment.",
  },
  {
    title: "Experience",
    body: "With over 10 years in Perth, we've tackled every kind of air conditioning job — from apartments to old buildings.",
  },
];
