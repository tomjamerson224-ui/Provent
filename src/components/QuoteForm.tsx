import { useState, type SubmitEvent } from "react";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Toaster } from "@/components/ui/sonner";
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

const helpOptions = [
  { value: "service", label: "Air conditioner service / repair" },
  { value: "installation", label: "New air conditioner installation" },
  { value: "quote", label: "Fast air conditioner quote" },
  { value: "question", label: "Quick technical question" },
];

type Props = {
  /** Which page the enquiry came from — included in the email. */
  source: "quote" | "contact";
  phone: string;
  phoneHref: string;
};

export default function QuoteForm({ source, phone, phoneHref }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [help, setHelp] = useState(source === "quote" ? "quote" : "");

  async function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, help, source, page: window.location.pathname }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error || "Something went wrong.");
      setStatus("sent");
      form.reset();
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
              <FieldLabel htmlFor={`${source}-email`}>Email *</FieldLabel>
              <Input id={`${source}-email`} name="email" type="email" autoComplete="email" required className="h-11" />
            </Field>
            <Field>
              <FieldLabel htmlFor={`${source}-suburb`}>Suburb</FieldLabel>
              <Input id={`${source}-suburb`} name="suburb" autoComplete="address-level2" className="h-11" />
            </Field>
          </div>

          <FieldSet>
            <FieldLegend variant="label">How can we help?</FieldLegend>
            <RadioGroup value={help} onValueChange={setHelp} className="grid gap-2 sm:grid-cols-2">
              {helpOptions.map((o) => (
                <FieldLabel key={o.value} htmlFor={`${source}-help-${o.value}`}>
                  <Field orientation="horizontal">
                    <RadioGroupItem value={o.value} id={`${source}-help-${o.value}`} />
                    <FieldContent>
                      <FieldTitle>{o.label}</FieldTitle>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
          </FieldSet>

          <Field>
            <FieldLabel htmlFor={`${source}-message`}>Tell us about the job</FieldLabel>
            <Textarea
              id={`${source}-message`}
              name="message"
              rows={5}
              placeholder="e.g. 4-bedroom home, looking at ducted reverse cycle. Old evaporative unit on the roof."
            />
            <FieldDescription>We reply to every request as quickly as we can.</FieldDescription>
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
            {status === "sending" ? "Sending…" : source === "quote" ? "Send my quote request" : "Send message"}
          </Button>
        </FieldGroup>
      </form>
      <Toaster richColors position="top-center" />
    </div>
  );
}
