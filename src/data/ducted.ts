/**
 * Ducted air conditioning facts used across the ducted pages, cost guide and
 * calculator. Every price, size and timeframe here came from the owner
 * (Oct 2026) — never guess one. Prices are supply + install, inc GST.
 */

export type DuctedBand = {
  id: string;
  label: string;
  /** Short description shown under the label. */
  detail: string;
  /** Typical system capacity, e.g. "10–14kW". */
  kw: string | null;
  /** Typical installed price range. `max: null` means open-ended ("$16,000+"). */
  min: number | null;
  max: number | null;
  /** Needs a site inspection before any price can be given. */
  inspect?: boolean;
};

export const ductedBands: DuctedBand[] = [
  { id: "small", label: "2–3 bedroom home", detail: "Single storey", kw: "7–10kW", min: 7000, max: 12000 },
  { id: "medium", label: "4 bedroom home", detail: "Single storey", kw: "10–14kW", min: 10000, max: 15000 },
  { id: "large", label: "5+ bedroom home", detail: "Single storey", kw: "16kW+", min: 16000, max: null },
  { id: "double", label: "Double-storey home", detail: "Inspection needed first", kw: null, min: null, max: null, inspect: true },
];

export const doubleStoreyNote =
  "Double-storey homes vary a lot. If there's a provision to run a duct downstairs, one system can often do both levels. If not — and there's a real ceiling space on each level — upstairs and downstairs may need separate units. We need to inspect the home to see what's possible before we can price it.";

export type DuctedExtra = {
  id: string;
  label: string;
  detail: string;
  /** Fixed price, or the low end of a range. */
  min: number;
  /** High end of a range (equal to min for fixed prices). */
  max: number;
  /** Priced per unit (zones, vents) rather than once. */
  perUnit?: string;
};

export const ductedExtras: Record<"evapRemoval" | "roofSheets" | "airTouch" | "zone" | "linearVent", DuctedExtra> = {
  evapRemoval: {
    id: "evapRemoval",
    label: "Remove old evaporative cooler",
    detail: "Includes patching tiles (customer-supplied tiles), or capping the dropper and leaving it on the roof",
    min: 650,
    max: 650,
  },
  roofSheets: {
    id: "roofSheets",
    label: "Patch metal roof sheets",
    detail: "Where the cooler sat on a metal roof — depends on length and complexity",
    min: 800,
    max: 1500,
  },
  airTouch: {
    id: "airTouch",
    label: "AirTouch 5 smart controller upgrade",
    detail: "Control every zone from your phone, with schedules and room temperatures",
    min: 1000,
    max: 1000,
  },
  zone: {
    id: "zone",
    label: "Additional zones",
    detail: "Each extra zone",
    min: 100,
    max: 100,
    perUnit: "zone",
  },
  linearVent: {
    id: "linearVent",
    label: "Slim linear vents",
    detail: "Where no ceiling joists need cutting — the outlet must run parallel to the joists",
    min: 250,
    max: 250,
    perUnit: "vent",
  },
};

export const extrasList = Object.values(ductedExtras);

/** Install times from the owner. */
export const installTimes = {
  ducted: "usually half a day",
  withEvapRemoval: "a full day, including removing the evaporative cooler and patching the roof",
};

/** Zone controllers installed. */
export const ductedControllers = ["AirTouch 5"];

/** Brands the original site said they install. */
export const ductedBrands = ["Daikin", "Panasonic", "Fujitsu", "ActronAir", "Mitsubishi Electric", "Toshiba"];

export const formatPrice = (n: number) => `$${n.toLocaleString("en-AU")}`;
export const formatK = (n: number) => `$${Math.round(n / 1000)}k`;

/** "$7,000–$12,000" / "$16,000+" */
export const bandRange = (b: DuctedBand) =>
  b.min === null ? "Inspection needed" : b.max === null ? `${formatPrice(b.min)}+` : `${formatPrice(b.min)}–${formatPrice(b.max)}`;

/** "$800–$1,500" / "$650" with optional per-unit suffix */
export const extraPrice = (e: DuctedExtra) =>
  `${e.min === e.max ? formatPrice(e.min) : `${formatPrice(e.min)}–${formatPrice(e.max)}`}${e.perUnit ? ` per ${e.perUnit}` : ""}`;

const [small, medium, large] = ductedBands;

export type Faq = { q: string; a: string };

export const ductedFaqs: Faq[] = [
  {
    q: "How much does ducted air conditioning cost in Perth?",
    a: `As a guide, a fully installed ducted reverse cycle system costs ${bandRange(small)} for a 2–3 bedroom home, ${bandRange(medium)} for a 4 bedroom home, and ${bandRange(large)} for 5 bedrooms or more (supply and install, inc GST). Double-storey homes need an inspection first. Extras like removing an old evaporative cooler (${extraPrice(ductedExtras.evapRemoval)}) or an AirTouch 5 smart controller (${extraPrice(ductedExtras.airTouch)}) are itemised in your written quote.`,
  },
  {
    q: "What size ducted system do I need?",
    a: `As a starting point: ${small.kw} for a 2–3 bedroom home, ${medium.kw} for a 4 bedroom home, and ${large.kw} for 5 bedrooms or more. Floor area, ceiling height, insulation and which way the house faces all matter, so we confirm the right size when we measure up.`,
  },
  {
    q: "How long does a ducted air conditioning install take?",
    a: `A standard ducted install is ${installTimes.ducted}. If we're also removing an old evaporative cooler and patching the roof, it's ${installTimes.withEvapRemoval}.`,
  },
  {
    q: "Can I replace my evaporative cooler with ducted reverse cycle?",
    a: `Yes — it's one of the most common jobs we do. We remove the old cooler (${extraPrice(ductedExtras.evapRemoval)}, including patching the tiles with your spare tiles, or capping the dropper), and install a new ducted reverse cycle system with new insulated ductwork. It's usually done in a day.`,
  },
  {
    q: "Can my existing evaporative ductwork be reused?",
    a: "No — evaporative ducts are too big for a reverse cycle system, so we run new, correctly sized insulated ducting. Best practice is to move the outlets out towards the outside walls of the house, but we can reuse the existing outlet positions if you'd rather not patch the ceiling.",
  },
  {
    q: "What is zoning and do I need it?",
    a: `Zoning splits your home into areas — for example bedrooms and living areas — that you heat or cool separately, so you only run the rooms you're using. Additional zones are about ${extraPrice(ductedExtras.zone).replace(" per zone", "")} each, and an AirTouch 5 smart controller lets you control every zone from your phone.`,
  },
  {
    q: "Can I have a double-storey home ducted?",
    a: doubleStoreyNote,
  },
  {
    q: "Is ducted or split system better for my home?",
    a: "Ducted suits homes where you want even comfort in most rooms with nothing on the walls. Split systems are better value when you only need one to three rooms done. We'll give you honest advice on what makes sense for your layout and budget.",
  },
  {
    q: "Which ducted air conditioning brands do you install?",
    a: `We install Australia's leading brands, including ${ductedBrands.slice(0, -1).join(", ")} and ${ductedBrands.at(-1)}. We'll recommend the right unit for your home rather than pushing one brand.`,
  },
  {
    q: "What warranty do I get?",
    a: "Every installation comes with our 3-year workmanship warranty, plus a 5-year manufacturer's warranty on the air conditioning units we supply.",
  },
  {
    q: "Do you service and repair ducted systems you didn't install?",
    a: "Yes. We service and repair all brands and models of ducted air conditioning, including older systems other companies won't touch.",
  },
];

export const conversionFaqs: Faq[] = [
  {
    q: "How much does it cost to convert evaporative to ducted reverse cycle?",
    a: `It's the price of a new ducted system (${bandRange(small)} for a 2–3 bedroom home, ${bandRange(medium)} for 4 bedrooms, ${bandRange(large)} for 5+) plus ${extraPrice(ductedExtras.evapRemoval)} to remove the evaporative cooler. On a metal roof, patching the roof sheets adds ${extraPrice(ductedExtras.roofSheets)} depending on length and complexity.`,
  },
  {
    q: "What happens to the hole in the roof?",
    a: "On a tile roof, we patch it with tiles you supply as part of the removal. Alternatively we can cap the dropper and leave it on the roof. On a metal roof we patch the roof sheets ourselves, priced by length and complexity — no need to organise a separate roofer.",
  },
  {
    q: "Can you reuse my evaporative ducts?",
    a: "No — evaporative ducts are too big for reverse cycle, so new insulated ducting is installed. Best practice is to move the outlets towards the outside walls, but we can keep them in the same spots if you don't want to patch the ceiling.",
  },
  {
    q: "Will reverse cycle cost more to run than evaporative?",
    a: "Reverse cycle uses more power than an evaporative cooler when cooling, but it also heats your home in winter, works on humid days, and lets you cool only the zones you're using. Many people replacing an evaporative cooler are also replacing a separate heater, which changes the comparison. We're happy to talk through the trade-offs for your home.",
  },
  {
    q: "How long does the conversion take?",
    a: `Usually ${installTimes.withEvapRemoval}.`,
  },
];

/** FAQPage JSON-LD for a list of FAQs. */
export const faqSchema = (faqs: Faq[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});
