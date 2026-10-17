import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type Props = { faqs: { q: string; a: string }[] };

// forceMount keeps every answer in the HTML (hidden when collapsed) so search
// engines can read them — Radix otherwise unmounts closed panels.
export default function FaqAccordion({ faqs }: Props) {
  return (
    <Accordion type="single" collapsible defaultValue="faq-0" className="rounded-2xl border bg-card px-5 sm:px-6">
      {faqs.map((f, i) => (
        <AccordionItem key={f.q} value={`faq-${i}`}>
          <AccordionTrigger className="py-5 text-left text-base font-semibold hover:no-underline">{f.q}</AccordionTrigger>
          <AccordionContent forceMount className="pb-5 text-[0.95rem] leading-relaxed text-muted-foreground">
            {f.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
