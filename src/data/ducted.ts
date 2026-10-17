/**
 * Ducted air conditioning facts used across the ducted pages, cost guide and
 * calculator. Everything marked TODO comes from the owner — never guess a
 * price, size or brand claim. `null` values are hidden on the site, so pages
 * stay publishable while they're blank.
 */

export type DuctedBand = {
  id: string;
  label: string;
  /** Short description shown under the label. */
  detail: string;
  /** Typical system capacity, e.g. "12.5–14kW". TODO: owner to confirm. */
  typicalKw: string | null;
  /** Typical number of zones, e.g. "4–6". TODO: owner to confirm. */
  zones: string | null;
  /** "From" price, supply + install, inc GST. TODO: owner to supply. */
  from: number | null;
};

// TODO(owner): fill in typicalKw, zones and from for each band.
export const ductedBands: DuctedBand[] = [
  { id: "small", label: "Apartment or 2–3 bedroom home", detail: "Single storey, up to roughly 150m²", typicalKw: null, zones: null, from: null },
  { id: "medium", label: "4 bedroom home", detail: "Single storey family home, roughly 150–220m²", typicalKw: null, zones: null, from: null },
  { id: "large", label: "5+ bedroom or larger home", detail: "Large single storey, roughly 220m² and up", typicalKw: null, zones: null, from: null },
  { id: "double", label: "Double-storey home", detail: "Usually needs a larger system or two systems", typicalKw: null, zones: null, from: null },
];

export type DuctedExtra = { id: string; label: string; detail: string; price: number | null };

// TODO(owner): price each add-on, or delete ones that don't apply.
export const ductedExtras: DuctedExtra[] = [
  { id: "evapRemoval", label: "Remove old evaporative cooler & repair roof", detail: "Take the old unit off the roof and make good the opening", price: null },
  { id: "smartControl", label: "Smart zone controller (app / Wi-Fi)", detail: "Control each zone from your phone", price: null },
  { id: "extraZone", label: "Each additional zone", detail: "Beyond the zones included in the base price", price: null },
  { id: "linearVents", label: "Upgrade to slim linear vents", detail: "Low-profile slot diffusers instead of round/square vents", price: null },
];

/** True once at least one band has a published price — gates the calculator. */
export const hasDuctedPricing = ductedBands.some((b) => b.from !== null);

/** Zone controllers installed. TODO(owner): confirm which brands he fits. */
export const ductedControllers: string[] = [];

/** Brands the original site said they install. */
export const ductedBrands = ["Daikin", "Panasonic", "Fujitsu", "ActronAir", "Mitsubishi Electric", "Toshiba"];

export const formatPrice = (n: number) => `$${n.toLocaleString("en-AU")}`;

const lowestFrom = ductedBands.map((b) => b.from).filter((n): n is number => n !== null).sort((a, b) => a - b)[0];

export type Faq = { q: string; a: string };

export const ductedFaqs: Faq[] = [
  {
    q: "How much does ducted air conditioning cost in Perth?",
    a: lowestFrom
      ? `Our ducted reverse cycle systems start from ${formatPrice(lowestFrom)} supplied and installed (inc GST). The final price depends on the size of your home, the number of zones, roof access and whether an old system needs removing. We measure up and give you a written quote before any work starts.`
      : "It depends on the size of your home, the number of rooms and zones, ceiling and roof access, and whether an old evaporative or ducted system needs removing. We measure up and give you a free written quote — usually the same day — so you know the exact price before any work starts.",
  },
  {
    q: "How long does a ducted air conditioning install take?",
    a: "Most single-storey homes are installed in one to two days. Larger or double-storey homes, or jobs that include removing an old evaporative cooler and repairing the roof, can take longer. We'll give you a timeframe with your quote.",
  },
  {
    q: "Can I replace my evaporative cooler with ducted reverse cycle?",
    a: "Yes — it's one of the most common upgrades we do in Perth. We remove the old evaporative unit, repair the roof where it sat, and install a new ducted reverse cycle system with properly insulated ductwork. You get heating as well as cooling, and you can keep windows closed while it runs.",
  },
  {
    q: "Can my existing evaporative ductwork be reused?",
    a: "Usually not. Evaporative systems move a large volume of air through big, often uninsulated ducts, while reverse cycle systems need correctly sized, insulated ducting to work efficiently. We'll inspect what you have and tell you honestly if anything can be reused.",
  },
  {
    q: "What is zoning and do I need it?",
    a: "Zoning splits your home into areas — for example bedrooms and living areas — that you can heat or cool independently. You only run the rooms you're using, which keeps running costs down. Almost every ducted system we install is zoned.",
  },
  {
    q: "Is ducted or split system better for my home?",
    a: "Ducted suits homes where you want even comfort in most rooms with nothing on the walls. Split systems are better value when you only need one to three rooms done. Many Perth homes are a good fit for either — we'll give you honest advice on what makes sense for your layout and budget.",
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
    a: "Yes. We service and repair all brands and models of ducted air conditioning, including older systems other companies won't touch, and we're available 24/7 for urgent breakdowns.",
  },
];

export const conversionFaqs: Faq[] = [
  {
    q: "How much does it cost to convert evaporative to ducted reverse cycle?",
    a: "The cost depends on the size of your home, how many zones you want, and how much roof repair is needed once the old cooler comes off. Because new insulated ductwork is usually required, it's priced like a full ducted install plus removal. We'll give you a free written quote that includes every part of the job.",
  },
  {
    q: "What happens to the hole in the roof?",
    a: "We take care of it. When the evaporative unit comes off we repair the roof opening ourselves, so you don't need to organise a separate roofer.",
  },
  {
    q: "Can you reuse my evaporative ducts?",
    a: "Usually not. Evaporative ducts are sized for high airflow and are often uninsulated, which suits evaporative cooling but not refrigerated air. A reverse cycle system needs correctly sized, insulated ducts to run efficiently and avoid condensation. We'll check yours and let you know.",
  },
  {
    q: "Will reverse cycle cost more to run than evaporative?",
    a: "Reverse cycle uses more power than an evaporative cooler when cooling, but it also heats your home in winter, works on humid days, and lets you cool only the zones you're using. Many people replacing an evaporative cooler are also replacing a separate heater, which changes the comparison. We're happy to talk through the trade-offs for your home.",
  },
  {
    q: "How long does the conversion take?",
    a: "Most conversions on single-storey homes take two to three days including removal of the old unit and roof repair. We'll confirm the timeframe when we quote.",
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
