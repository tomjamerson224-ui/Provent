import { useMemo, useState } from "react";
import { ArrowRight, Info, Minus, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field";
import type { DuctedBand, DuctedExtra } from "@/data/ducted";

type Props = {
  bands: DuctedBand[];
  extras: { evapRemoval: DuctedExtra; roofSheets: DuctedExtra; airTouch: DuctedExtra; zone: DuctedExtra; linearVent: DuctedExtra };
  doubleStoreyNote: string;
  phoneHref: string;
};

type Evap = "none" | "tile" | "metal";

const fmt = (n: number) => `$${n.toLocaleString("en-AU")}`;

export default function DuctedCostCalculator({ bands, extras, doubleStoreyNote, phoneHref }: Props) {
  const [bandId, setBandId] = useState(bands[0].id);
  const [evap, setEvap] = useState<Evap>("none");
  const [airTouch, setAirTouch] = useState(false);
  const [zones, setZones] = useState(0);
  const [vents, setVents] = useState(0);

  const band = bands.find((b) => b.id === bandId)!;

  const { low, high } = useMemo(() => {
    let low = band.min ?? 0;
    let high = band.max;
    const add = (min: number, max: number) => {
      low += min;
      if (high !== null) high += max;
    };
    if (evap !== "none") add(extras.evapRemoval.min, extras.evapRemoval.max);
    if (evap === "metal") add(extras.roofSheets.min, extras.roofSheets.max);
    if (airTouch) add(extras.airTouch.min, extras.airTouch.max);
    add(zones * extras.zone.min, zones * extras.zone.max);
    add(vents * extras.linearVent.min, vents * extras.linearVent.max);
    return { low, high };
  }, [band, evap, airTouch, zones, vents, extras]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <Card className="shadow-sm">
        <CardContent className="flex flex-col gap-8 p-6 sm:p-8">
          <FieldSet>
            <FieldLegend variant="label" className="text-base font-semibold">1. Your home</FieldLegend>
            <RadioGroup value={bandId} onValueChange={setBandId} className="grid gap-2 sm:grid-cols-2">
              {bands.map((b) => (
                <FieldLabel key={b.id} htmlFor={`band-${b.id}`}>
                  <Field orientation="horizontal">
                    <RadioGroupItem value={b.id} id={`band-${b.id}`} />
                    <FieldContent>
                      <FieldTitle>{b.label}</FieldTitle>
                      <FieldDescription>{[b.detail, b.kw].filter(Boolean).join(" · ")}</FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
          </FieldSet>

          {!band.inspect && (
            <>
              <FieldSet>
                <FieldLegend variant="label" className="text-base font-semibold">2. Replacing an evaporative cooler?</FieldLegend>
                <RadioGroup value={evap} onValueChange={(v) => setEvap(v as Evap)} className="grid gap-2 sm:grid-cols-3">
                  {[
                    { v: "none", t: "No", d: "No cooler to remove" },
                    { v: "tile", t: "Yes — tile roof", d: `+${fmt(extras.evapRemoval.min)} removal & tile patch` },
                    { v: "metal", t: "Yes — metal roof", d: `+${fmt(extras.evapRemoval.min)} plus ${fmt(extras.roofSheets.min)}–${fmt(extras.roofSheets.max)} sheet patch` },
                  ].map((o) => (
                    <FieldLabel key={o.v} htmlFor={`evap-${o.v}`}>
                      <Field orientation="horizontal">
                        <RadioGroupItem value={o.v} id={`evap-${o.v}`} />
                        <FieldContent>
                          <FieldTitle>{o.t}</FieldTitle>
                          <FieldDescription>{o.d}</FieldDescription>
                        </FieldContent>
                      </Field>
                    </FieldLabel>
                  ))}
                </RadioGroup>
              </FieldSet>

              <FieldSet>
                <FieldLegend variant="label" className="text-base font-semibold">3. Upgrades</FieldLegend>
                <FieldLabel htmlFor="airtouch">
                  <Field orientation="horizontal">
                    <Checkbox id="airtouch" checked={airTouch} onCheckedChange={(v) => setAirTouch(v === true)} />
                    <FieldContent>
                      <FieldTitle>{extras.airTouch.label} · +{fmt(extras.airTouch.min)}</FieldTitle>
                      <FieldDescription>{extras.airTouch.detail}</FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Counter label={`${extras.zone.label} · ${fmt(extras.zone.min)} each`} detail="Beyond the zones in a standard system" value={zones} max={8} onChange={setZones} />
                  <Counter label={`${extras.linearVent.label} · ${fmt(extras.linearVent.min)} each`} detail={extras.linearVent.detail} value={vents} max={15} onChange={setVents} />
                </div>
              </FieldSet>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="h-fit border-0 bg-ink text-white shadow-lg lg:sticky lg:top-32">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-ink-muted">{band.inspect ? "Double-storey homes" : "Estimated installed price"}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {band.inspect ? (
            <>
              <p className="flex items-center gap-2 font-display text-3xl font-extrabold text-brand">
                <Search className="size-7" /> Inspection first
              </p>
              <p className="text-sm leading-relaxed text-white/80">{doubleStoreyNote}</p>
            </>
          ) : (
            <>
              <p className="font-display text-4xl font-extrabold text-brand tabular-nums sm:text-5xl lg:text-4xl xl:text-5xl" aria-live="polite">
                {high === null ? `${fmt(low)}+` : `${fmt(low)}–${fmt(high)}`}
              </p>
              {band.kw && <p className="text-sm text-ink-muted">Typical system size: {band.kw}</p>}
              <p className="flex gap-2 text-xs leading-relaxed text-ink-muted">
                <Info className="mt-0.5 size-3.5 shrink-0" />
                Supply and install, inc GST. A guide only — your fixed written quote comes after a free measure-up.
              </p>
            </>
          )}
          <Button asChild size="xl" className="mt-2">
            <a href="/request-a-quote">
              {band.inspect ? "Book an inspection" : "Get my exact quote"} <ArrowRight data-icon="inline-end" />
            </a>
          </Button>
          <Button asChild size="lg" variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
            <a href={phoneHref}>Or call us to talk it through</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Counter({ label, detail, value, max, onChange }: { label: string; detail: string; value: number; max: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
      <div className="min-w-0">
        <p className="text-sm font-medium leading-snug">{label}</p>
        <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{detail}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <Button type="button" size="icon-sm" variant="outline" aria-label={`Fewer — ${label}`} disabled={value === 0} onClick={() => onChange(value - 1)}>
          <Minus />
        </Button>
        <span className="w-6 text-center font-semibold tabular-nums" aria-live="polite">{value}</span>
        <Button type="button" size="icon-sm" variant="outline" aria-label={`More — ${label}`} disabled={value === max} onClick={() => onChange(value + 1)}>
          <Plus />
        </Button>
      </div>
    </div>
  );
}
