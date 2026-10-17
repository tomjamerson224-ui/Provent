import { useState, type SubmitEvent } from "react";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Toaster } from "@/components/ui/sonner";
import FileDrop from "@/components/FileDrop";
import { getAttribution } from "@/lib/attribution";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";

const homeSizeOptions = [
  { value: "2-3 bedroom", label: "2–3 bedroom" },
  { value: "4 bedroom", label: "4 bedroom" },
  { value: "5+ bedroom", label: "5+ bedroom" },
  { value: "Double storey", label: "Double storey" },
];

const evapOptions = [
  { value: "Yes", label: "Yes — remove it" },
  { value: "No", label: "No" },
];

const helpOptions = [
  { value: "service", label: "Air conditioner service / repair" },
  { value: "installation", label: "New air conditioner installation" },
  { value: "quote", label: "Fast air conditioner quote" },
  { value: "question", label: "Quick technical question" },
];

type Props = {
  /** Which form the enquiry came from — included in the email. "ducted" is the
   *  Google Ads landing page: asks home size + evaporative removal instead of
   *  the general "how can we help" options. */
  source: "quote" | "contact" | "ducted";
  phone: string;
  phoneHref: string;
};

export default function QuoteForm({ source, phone, phoneHref }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const ducted = source === "ducted";
  const [help, setHelp] = useState(source === "quote" ? "quote" : ducted ? "installation" : "");
  const [homeSize, setHomeSize] = useState("");
  const [evap, setEvap] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  async function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    // Multipart so attachments go up with the text fields; the browser sets
    // the boundary header itself.
    const body = new FormData(form);
    body.delete("files");
    files.forEach((f) => body.append("files", f, f.name));
    body.set("help", help);
    if (ducted) {
      body.set("homeSize", homeSize);
      body.set("evap", evap);
    }
    body.set("source", source);
    body.set("page", window.location.pathname);
    body.set("attribution", JSON.stringify(getAttribution()));
    setStatus("sending");
    try {
      const res = await fetch("/api/quote", { method: "POST", body });
      const result = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(result.error || "Something went wrong.");
      window.dispatchEvent(new CustomEvent("pv:lead", { detail: { source } }));
      setStatus("sent");
      form.reset();
      setFiles([]);
    } catch (err) {
      setStatus("idle");
      toast.error("Your request didn't send", {
        description: `${err instanceof Error ? err.message : ""} Please call us on ${phone} instead.`,
      });
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center rounded-2xl border bg-card p-8 text-center sm:p-12">
        <CheckCircle2 className="size-14 text-green-600" />
        <h3 className="mt-4 text-2xl font-bold">Thanks — we've got it!</h3>
        <p className="mt-2 max-w-sm text-muted-foreground">
          One of our technicians will be in touch shortly. Need us sooner?
        </p>
        <Button asChild size="xl" className="mt-6">
          <a href={phoneHref}>Call {phone}</a>
        </Button>
      </div>
    );
  }

  // Single root: Astro islands are display:contents, so siblings here would
  // become separate grid items in the page layout.
  return (
    <div>
      <form onSubmit={onSubmit} className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <FieldGroup className="gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor={`${source}-name`}>Name *</FieldLabel>
              <Input id={`${source}-name`} name="name" autoComplete="name" required className="h-11" />
            </Field>
            <Field>
              <FieldLabel htmlFor={`${source}-phone`}>Phone *</FieldLabel>
              <Input id={`${source}-phone`} name="phone" type="tel" autoComplete="tel" inputMode="tel" required className="h-11" />
            </Field>
            <Field>
              <FieldLabel htmlFor={`${source}-email`}>{ducted ? "Email (optional)" : "Email *"}</FieldLabel>
              <Input id={`${source}-email`} name="email" type="email" autoComplete="email" required={!ducted} className="h-11" />
            </Field>
            <Field>
              <FieldLabel htmlFor={`${source}-suburb`}>Suburb</FieldLabel>
              <Input id={`${source}-suburb`} name="suburb" autoComplete="address-level2" className="h-11" />
            </Field>
          </div>

          {ducted ? (
            <>
              <ChoiceGroup legend="Home size" name={`${source}-size`} value={homeSize} onChange={setHomeSize} options={homeSizeOptions} cols="sm:grid-cols-4" />
              <ChoiceGroup legend="Replacing an evaporative cooler?" name={`${source}-evap`} value={evap} onChange={setEvap} options={evapOptions} cols="sm:grid-cols-2" />
            </>
          ) : (
          <FieldSet>
            <FieldLegend variant="label">How can we help?</FieldLegend>
            <RadioGroup value={help} onValueChange={setHelp} className="grid gap-2 sm:grid-cols-2">
              {helpOptions.map((o) => (
                <FieldLabel key={o.value} htmlFor={`${source}-help-${o.value}`}>
                  <Field orientation="horizontal">
                    <RadioGroupItem value={o.value} id={`${source}-help-${o.value}`} aria-label={o.label} />
                    <FieldContent>
                      <FieldTitle>{o.label}</FieldTitle>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
          </FieldSet>
          )}

          <Field>
            <FieldLabel htmlFor={`${source}-message`}>{ducted ? "Anything else? (optional)" : "Tell us about the job"}</FieldLabel>
            <Textarea
              id={`${source}-message`}
              name="message"
              rows={ducted ? 3 : 5}
              placeholder={ducted ? "e.g. tile roof, want AirTouch 5, best time to call" : "e.g. 4-bedroom home, looking at ducted reverse cycle. Old evaporative unit on the roof."}
            />
            {!ducted && <FieldDescription>We reply to every request as quickly as we can.</FieldDescription>}
          </Field>

          <Field>
            <FieldLabel htmlFor={`${source}-files`}>House plans or photos (optional)</FieldLabel>
            <FileDrop
              id={`${source}-files`}
              files={files}
              onChange={setFiles}
              onReject={(message) => toast.error("File not added", { description: message })}
            />
            <FieldDescription>Floor plans help us size and price your system accurately.</FieldDescription>
          </Field>

          {/* Honeypot — real people never see or fill this. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
            <label>
              Leave this empty
              <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <Button type="submit" size="xl" disabled={status === "sending"} className="w-full sm:w-auto sm:self-start">
            {status === "sending" ? <Loader2 className="animate-spin" /> : <Send />}
            {status === "sending" ? (files.length ? "Uploading…" : "Sending…") : ducted ? "Get my ducted quote" : source === "quote" ? "Send my quote request" : "Send message"}
          </Button>
        </FieldGroup>
      </form>
      <Toaster richColors position="top-center" />
    </div>
  );
}

function ChoiceGroup({
  legend,
  name,
  value,
  onChange,
  options,
  cols,
}: {
  legend: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  cols: string;
}) {
  return (
    <FieldSet>
      <FieldLegend variant="label">{legend}</FieldLegend>
      <RadioGroup value={value} onValueChange={onChange} className={`grid grid-cols-2 gap-2 ${cols}`}>
        {options.map((o) => (
          <FieldLabel key={o.value} htmlFor={`${name}-${o.value}`}>
            <Field orientation="horizontal">
              <RadioGroupItem value={o.value} id={`${name}-${o.value}`} aria-label={o.label} />
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
