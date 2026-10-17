/**
 * Split system and multi-head installed prices (supply + back-to-back install,
 * inc GST). Source: the owner's direction (Oct 2026) — Otter Air's published
 * bands + 15%, rounded to the nearest $10. Update here only; pages, posts and
 * llms.txt read from this file (llms.txt is hand-written — update it too).
 */

// +15% in whole numbers: n * 1.15 in floating point gives 3334.999… for 2900,
// which rounded down to $3,330 instead of $3,340.
const r10 = (n: number) => Math.round((n * 115) / 1000) * 10;

export type SplitBand = { label: string; low: number; high: number; room: string; suits: string };

// Base figures are Otter Air's bands (src/data/install-pricing.ts in that repo).
export const splitBands: SplitBand[] = [
  { label: "2kW", low: r10(1490), high: r10(2190), room: "up to 13 m²", suits: "Nursery, study, small bedroom" },
  { label: "2.5kW", low: r10(1820), high: r10(2400), room: "13–20 m²", suits: "Small bedroom, study" },
  { label: "3.5kW", low: r10(2020), high: r10(2900), room: "20–30 m²", suits: "Standard bedroom, small living area" },
  { label: "5kW", low: r10(2550), high: r10(3600), room: "30–45 m²", suits: "Master bedroom, open-plan living" },
  { label: "7kW", low: r10(2310), high: r10(3830), room: "45–50 m²", suits: "Large open-plan living/kitchen" },
  { label: "8–8.5kW", low: r10(2575), high: r10(4455), room: "50–58 m²", suits: "Very large open-plan areas" },
  { label: "9–9.5kW", low: r10(4115), high: r10(5035), room: "58–65 m²", suits: "The biggest single-zone spaces" },
];

export type MultiHeadBand = { heads: number; low: number; high: number; plus?: boolean };

export const multiHeadBands: MultiHeadBand[] = [
  { heads: 2, low: r10(4500), high: r10(6000) },
  { heads: 3, low: r10(6000), high: r10(7500) },
  { heads: 4, low: r10(7500), high: r10(9000) },
  { heads: 5, low: r10(9000), high: r10(11000), plus: true },
];

export type SplitAddon = { label: string; price: number; from?: boolean; detail: string };

export const splitAddons: SplitAddon[] = [
  { label: "Back-to-side pipe run", price: r10(95), detail: "Indoor unit on an internal wall — pipes run around the corner to the outdoor unit." },
  { label: "Up-and-over pipe run", price: r10(300), from: true, detail: "Outdoor unit on the other side of the house — pipes run through the roof space. Confirmed on site." },
  { label: "Outdoor wall brackets", price: r10(100), detail: "Outdoor unit mounted on the wall instead of the ground." },
  { label: "Outdoor unit above head height", price: r10(100), detail: "Extra access and handling for a high wall mount (common on double-storey homes)." },
  { label: "Outdoor ground pad", price: r10(90), detail: "A pad for the outdoor unit where there's only loose sand." },
];

export const money = (n: number) => `$${n.toLocaleString("en-AU")}`;
export const range = (b: { low: number; high: number; plus?: boolean }) =>
  `${money(b.low)}–${money(b.high)}${b.plus ? "+" : ""}`;

export const cheapestSplit = Math.min(...splitBands.map((b) => b.low));
