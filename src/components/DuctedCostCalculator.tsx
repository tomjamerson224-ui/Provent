import { useMemo, useState } from "react";
import { ArrowRight, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field";
import type { DuctedBand, DuctedExtra } from "@/data/ducted";

type Props = {
  /** Only bands/extras with a published price are passed in. */
  bands: DuctedBand[];
  extras: DuctedExtra[];
  phoneHref: string;
};

const fmt = (n: number) => `$${n.toLocaleString("en-AU")}`;

export default function DuctedCostCalculator({ bands, extras, phoneHref }: Props) {
  const [bandId, setBandId] = useState(bands[0]?.id ?? "");
  const [picked, setPicked] = useState<string[]>([]);

  const band = bands.find((b) => b.id === bandId);
  const total = useMemo(
    () => (band?.from ?? 0) + extras.filter((e) => picked.includes(e.id)).reduce((sum, e) => sum + (e.price ?? 0), 0),
    [band, extras, picked],
  );

  const toggle = (id: string, on: boolean) => setPicked((p) => (on ? [...p, id] : p.filter((x) => x !== id)));

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
                      <FieldDescription>{b.detail}</FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
          </FieldSet>

          {extras.length > 0 && (
            <FieldSet>
              <FieldLegend variant="label" className="text-base font-semibold">2. Anything extra?</FieldLegend>
              <div className="grid gap-2 sm:grid-cols-2">
                {extras.map((e) => (
                  <FieldLabel key={e.id} htmlFor={`extra-${e.id}`}>
                    <Field orientation="horizontal">
                      <Checkbox id={`extra-${e.id}`} checked={picked.includes(e.id)} onCheckedChange={(v) => toggle(e.id, v === true)} />
                      <FieldContent>
                        <FieldTitle>{e.label}</FieldTitle>
                        <FieldDescription>
                          {e.detail} · +{fmt(e.price!)}
                        </FieldDescription>
                      </FieldContent>
                    </Field>
                  </FieldLabel>
                ))}
              </div>
            </FieldSet>
          )}
        </CardContent>
      </Card>

      <Card className="h-fit border-0 bg-ink text-white shadow-lg lg:sticky lg:top-32">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-ink-muted">Estimated starting price</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="font-display text-5xl font-extrabold text-brand" aria-live="polite">
            <span className="mr-2 align-middle text-base font-medium text-ink-muted">from</span>
            {fmt(total)}
          </p>
          {(band?.typicalKw || band?.zones) && (
            <p className="text-sm text-ink-muted">
              Typical system: {[band.typicalKw, band.zones && `${band.zones} zones`].filter(Boolean).join(" · ")}
            </p>
          )}
          <p className="flex gap-2 text-xs leading-relaxed text-ink-muted">
            <Info className="mt-0.5 size-3.5 shrink-0" />
            Supply and install, inc GST. A guide only — your fixed written quote comes after a free measure-up.
          </p>
          <Button asChild size="xl" className="mt-2">
            <a href="/request-a-quote">
              Get my exact quote <ArrowRight data-icon="inline-end" />
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
