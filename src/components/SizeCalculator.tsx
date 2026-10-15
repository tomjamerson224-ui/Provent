import { useMemo, useState } from "react";
import { ArrowRight, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Field, FieldContent, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field";

/*
 * Rule-of-thumb cooling load for a single room in Perth: ~140 W per m² for a
 * standard (≤2.7m) insulated room, scaled up for taller ceilings, sun and no
 * ceiling insulation, then rounded up to the next common split-system size.
 * It's a guide only — the on-site measure sets the real size.
 */
const BASE_KW_PER_M2 = 0.14;
const HEIGHT = { low: 1, mid: 1.1, high: 1.2 } as const;
const SUN = { shaded: 1, sunny: 1.15 } as const;
const INSULATION = { yes: 1, no: 1.2 } as const;
const STANDARD_SIZES = [2.5, 3.5, 5.0, 6.0, 7.1, 8.0, 9.0];

type Height = keyof typeof HEIGHT;
type Sun = keyof typeof SUN;
type Insulation = keyof typeof INSULATION;

type Props = { phoneHref: string };

export default function SizeCalculator({ phoneHref }: Props) {
  const [length, setLength] = useState(5);
  const [width, setWidth] = useState(4);
  const [height, setHeight] = useState<Height>("low");
  const [sun, setSun] = useState<Sun>("shaded");
  const [insulated, setInsulated] = useState<Insulation>("yes");

  const { area, load, size, tooBig } = useMemo(() => {
    const area = length * width;
    const load = area * BASE_KW_PER_M2 * HEIGHT[height] * SUN[sun] * INSULATION[insulated];
    const size = STANDARD_SIZES.find((s) => s >= load);
    return { area, load, size, tooBig: size === undefined };
  }, [length, width, height, sun, insulated]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <Card className="shadow-sm">
        <CardContent className="flex flex-col gap-8 p-6 sm:p-8">
          <div className="grid gap-8 sm:grid-cols-2">
            <RangeField id="length" label="Room length" value={length} onChange={setLength} />
            <RangeField id="width" label="Room width" value={width} onChange={setWidth} />
          </div>
          <Separator />
          <Choice
            legend="Ceiling height"
            name="height"
            value={height}
            onChange={(v) => setHeight(v as Height)}
            options={[
              { value: "low", label: "Below 2.7m" },
              { value: "mid", label: "2.7m – 3.0m" },
              { value: "high", label: "Above 3.0m" },
            ]}
          />
          <Choice
            legend="Sunlight exposure"
            name="sun"
            value={sun}
            onChange={(v) => setSun(v as Sun)}
            options={[
              { value: "shaded", label: "Mostly shaded" },
              { value: "sunny", label: "Sunny / west-facing" },
            ]}
          />
          <Choice
            legend="Is the roof space insulated?"
            name="insulated"
            value={insulated}
            onChange={(v) => setInsulated(v as Insulation)}
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No / not sure" },
            ]}
          />
        </CardContent>
      </Card>

      <Card className="h-fit border-0 bg-ink text-white shadow-lg lg:sticky lg:top-32">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-ink-muted">Recommended size</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="font-display text-6xl font-extrabold text-brand" aria-live="polite">
            {tooBig ? "9kW+" : `${size!.toFixed(1)}kW`}
          </p>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-ink-muted">Floor area</dt>
              <dd className="font-semibold">{area.toFixed(1)} m²</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Estimated load</dt>
              <dd className="font-semibold">{load.toFixed(1)} kW</dd>
            </div>
          </dl>
          {tooBig && (
            <p className="rounded-lg bg-white/10 p-3 text-sm">
              That's a big space for one split system — ducted or multiple units may suit better. We'll advise on site.
            </p>
          )}
          <p className="flex gap-2 text-xs leading-relaxed text-ink-muted">
            <Info className="mt-0.5 size-3.5 shrink-0" />
            A guide only. Windows, orientation and how you use the room all matter — we confirm the right size when we measure up.
          </p>
          <Button asChild size="xl" className="mt-2">
            <a href="/request-a-quote">
              Get a quote for this room <ArrowRight data-icon="inline-end" />
            </a>
          </Button>
          <Button asChild size="lg" variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
            <a href={phoneHref}>Or call us for advice</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function RangeField({ id, label, value, onChange }: { id: string; label: string; value: number; onChange: (v: number) => void }) {
  return (
    <Field>
      <div className="flex items-baseline justify-between">
        <FieldLabel htmlFor={id} className="text-base font-semibold">{label}</FieldLabel>
        <span className="font-display text-xl font-bold tabular-nums">{value.toFixed(1)} m</span>
      </div>
      <Slider id={id} min={2} max={12} step={0.5} value={[value]} onValueChange={([v]) => onChange(v)} className="mt-2" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>2m</span>
        <span>12m</span>
      </div>
    </Field>
  );
}

function Choice({
  legend,
  name,
  value,
  onChange,
  options,
}: {
  legend: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <FieldSet>
      <FieldLegend variant="label" className="text-base font-semibold">{legend}</FieldLegend>
      <RadioGroup value={value} onValueChange={onChange} className="grid gap-2 sm:grid-flow-col sm:auto-cols-fr">
        {options.map((o) => (
          <FieldLabel key={o.value} htmlFor={`${name}-${o.value}`}>
            <Field orientation="horizontal">
              <RadioGroupItem value={o.value} id={`${name}-${o.value}`} />
              <FieldContent>
                <FieldTitle>{o.label}</FieldTitle>
              </FieldContent>
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
    </FieldSet>
  );
}
