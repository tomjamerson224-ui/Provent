import { useState } from "react";
import { ArrowRight, Menu, Phone, Mail, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

/** Menu entries with images already resolved to optimised URLs by SiteHeader.astro. */
export type MenuEntry = {
  title: string;
  href: string;
  description: string;
  icon?: string;
  image?: string;
};

type Props = {
  currentPath: string;
  logoBadge: string;
  logoWordmark: string;
  services: MenuEntry[];
  systems: MenuEntry[];
  links: { title: string; href: string }[];
  phone: string;
  phoneHref: string;
  email: string;
  emailHref: string;
};

const isActive = (current: string, href: string) =>
  href === "/" ? current === "/" : current === href || current.startsWith(href + "/");

/* Dark-header variant of the shadcn trigger style. */
const darkTrigger =
  "bg-transparent text-ink-foreground hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white data-open:bg-white/10 data-open:text-white data-open:hover:bg-white/10 data-open:focus:bg-white/10 data-active:text-brand h-10 px-3 text-[0.95rem]";

export default function SiteNav(props: Props) {
  const { currentPath, services, systems, links } = props;
  const [open, setOpen] = useState(false);
  const featuredService = services.find((s) => s.image);

  return (
    <div className="container-page flex h-18 items-center justify-between gap-4">
      <a href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Pro Vent Air Conditioning — home">
        <img src={props.logoBadge} alt="" width={44} height={44} className="size-11 rounded-full ring-1 ring-white/20" />
        <img src={props.logoWordmark} alt="Pro Vent Air Conditioning" width={160} height={48} className="h-10 w-auto sm:h-11" />
      </a>

      {/* ---------- Desktop ---------- */}
      <NavigationMenu className="hidden lg:flex" viewport={false}>
        <NavigationMenuList className="gap-1">
          <NavigationMenuItem>
            <NavigationMenuTrigger
              className={darkTrigger}
              data-active={services.some((s) => isActive(currentPath, s.href)) || undefined}
            >
              Services
            </NavigationMenuTrigger>
            <NavigationMenuContent className="!p-2">
              <ul className="grid w-[640px] grid-cols-[1.1fr_1fr] gap-2">
                {featuredService && (
                  <li style={{ gridRow: `span ${services.length} / span ${services.length}` }}>
                    <NavigationMenuLink asChild>
                      <a
                        href={featuredService.href}
                        className="group relative flex h-full min-h-64 flex-col justify-end overflow-hidden rounded-lg !p-0"
                      >
                        <img
                          src={featuredService.image}
                          alt=""
                          className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
                        <span className="relative p-4 text-white">
                          <span className="block text-base font-semibold">{featuredService.title}</span>
                          <span className="mt-1 block text-sm leading-snug text-white/80">
                            {featuredService.description}
                          </span>
                        </span>
                      </a>
                    </NavigationMenuLink>
                  </li>
                )}
                {services.map((item) => (
                  <li key={item.href}>
                    <NavigationMenuLink asChild data-active={isActive(currentPath, item.href) || undefined}>
                      <a href={item.href} className="flex-col items-start gap-1 !p-3">
                        <span className="font-semibold text-foreground">{item.title}</span>
                        <span className="line-clamp-2 text-[0.8rem] leading-snug text-muted-foreground">
                          {item.description}
                        </span>
                      </a>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger
              className={darkTrigger}
              data-active={systems.some((s) => isActive(currentPath, s.href)) || undefined}
            >
              Systems
            </NavigationMenuTrigger>
            <NavigationMenuContent className="!p-2">
              <ul className="grid w-[460px] gap-1">
                {systems.map((item) => (
                  <li key={item.href}>
                    <NavigationMenuLink asChild data-active={isActive(currentPath, item.href) || undefined}>
                      <a href={item.href} className="items-center gap-3 !p-2.5">
                        {item.icon && (
                          <span className="flex size-14 shrink-0 items-center justify-center rounded-md bg-muted p-1.5">
                            <img src={item.icon} alt="" className="size-full object-contain" loading="lazy" />
                          </span>
                        )}
                        <span className="flex flex-col gap-0.5">
                          <span className="font-semibold text-foreground">{item.title}</span>
                          <span className="text-[0.8rem] leading-snug text-muted-foreground">{item.description}</span>
                        </span>
                      </a>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {links.map((link) => (
            <NavigationMenuItem key={link.href}>
              <NavigationMenuLink
                asChild
                data-active={isActive(currentPath, link.href) || undefined}
                className={cn(navigationMenuTriggerStyle(), darkTrigger)}
              >
                <a href={link.href}>{link.title}</a>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="hidden items-center gap-2 lg:flex">
        <Button asChild variant="ghost" size="lg" className="h-10 px-3 text-ink-foreground hover:bg-white/10 hover:text-white">
          <a href={props.phoneHref}>
            <Phone data-icon="inline-start" className="text-brand" />
            {props.phone}
          </a>
        </Button>
        <Button asChild size="lg" className="h-10 px-4 font-semibold">
          <a href="/request-a-quote">
            Free Quote
            <ArrowRight data-icon="inline-end" />
          </a>
        </Button>
      </div>

      {/* ---------- Mobile ---------- */}
      <div className="flex items-center gap-1 lg:hidden">
        <Button asChild size="icon-lg" variant="ghost" className="text-brand hover:bg-white/10 hover:text-brand">
          <a href={props.phoneHref} aria-label={`Call ${props.phone}`}>
            <Phone />
          </a>
        </Button>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="icon-lg" variant="ghost" className="text-white hover:bg-white/10 hover:text-white" aria-label="Open menu">
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[88vw] gap-0 overflow-y-auto p-0 sm:max-w-sm">
            <SheetHeader className="border-b bg-ink p-4 text-left">
              <SheetTitle className="flex items-center gap-2.5">
                <img src={props.logoBadge} alt="" width={36} height={36} className="size-9 rounded-full" />
                <img src={props.logoWordmark} alt="Pro Vent Air Conditioning" className="h-8 w-auto" />
              </SheetTitle>
              <SheetDescription className="sr-only">Site navigation</SheetDescription>
            </SheetHeader>

            <nav className="flex flex-col px-4 py-2">
              <a
                href="/"
                className={cn(
                  "py-3.5 text-base font-medium",
                  isActive(currentPath, "/") && "text-brand-dark",
                )}
              >
                Home
              </a>
              <Separator />
              <Accordion
                type="multiple"
                defaultValue={[
                  ...(services.some((s) => isActive(currentPath, s.href)) ? ["services"] : []),
                  ...(systems.some((s) => isActive(currentPath, s.href)) ? ["systems"] : []),
                ]}
              >
                <AccordionItem value="services">
                  <AccordionTrigger className="py-3.5 text-base font-medium hover:no-underline">Services</AccordionTrigger>
                  <AccordionContent className="pb-2 [&_a]:no-underline">
                    <MobileList items={services} currentPath={currentPath} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="systems">
                  <AccordionTrigger className="py-3.5 text-base font-medium hover:no-underline">Systems</AccordionTrigger>
                  <AccordionContent className="pb-2 [&_a]:no-underline">
                    <MobileList items={systems} currentPath={currentPath} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Separator />
              {links.map((link) => (
                <div key={link.href}>
                  <a
                    href={link.href}
                    className={cn(
                      "block py-3.5 text-base font-medium",
                      isActive(currentPath, link.href) && "text-brand-dark",
                    )}
                  >
                    {link.title}
                  </a>
                  <Separator />
                </div>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-2 border-t bg-muted/60 p-4">
              <Button asChild size="xl">
                <a href="/request-a-quote">
                  Get a Free Quote <ArrowRight data-icon="inline-end" />
                </a>
              </Button>
              <Button asChild size="xl" variant="outline">
                <a href={props.phoneHref}>
                  <Phone data-icon="inline-start" /> {props.phone}
                </a>
              </Button>
              <div className="mt-2 flex flex-col gap-1.5 text-sm text-muted-foreground">
                <a href={props.emailHref} className="flex items-center gap-2 break-all">
                  <Mail className="size-4 shrink-0" /> {props.email}
                </a>
                <span className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0" /> Perth CBD, surrounds &amp; the Hills
                </span>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

function MobileList({ items, currentPath }: { items: MenuEntry[]; currentPath: string }) {
  return (
    <ul className="flex flex-col gap-1">
      {items.map((item) => (
        <li key={item.href}>
          <a
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted",
              isActive(currentPath, item.href) && "bg-accent",
            )}
          >
            {item.icon ? (
              <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-muted p-1">
                <img src={item.icon} alt="" className="size-full object-contain" loading="lazy" />
              </span>
            ) : null}
            <span className="flex flex-col">
              <span className="text-sm font-semibold">{item.title}</span>
              <span className="line-clamp-1 text-xs text-muted-foreground">{item.description}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
