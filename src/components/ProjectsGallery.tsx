import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export type GalleryProject = {
  slug: string;
  title: string;
  subtitle: string;
  categories: string[];
  categoryLabels: string[];
  image: { src: string; srcSet: string; width: number; height: number; alt: string };
};

type Props = {
  projects: GalleryProject[];
  filters: { value: string; label: string }[];
};

export default function ProjectsGallery({ projects, filters }: Props) {
  const tabs = [{ value: "all", label: "All projects" }, ...filters];

  return (
    <Tabs defaultValue="all" className="gap-8">
      <TabsList className="mx-auto h-auto flex-wrap justify-center gap-1 bg-muted p-1">
        {tabs.map((t) => (
          <TabsTrigger key={t.value} value={t.value} className="px-4 py-2 text-sm data-active:bg-brand data-active:text-ink">
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((t) => {
        const list = t.value === "all" ? projects : projects.filter((p) => p.categories.includes(t.value));
        return (
          <TabsContent key={t.value} value={t.value}>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => (
                <a
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={p.image.src}
                      srcSet={p.image.srcSet}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      width={p.image.width}
                      height={p.image.height}
                      alt={p.image.alt}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap gap-1.5">
                      {p.categoryLabels.map((c) => (
                        <Badge key={c} variant="secondary">{c}</Badge>
                      ))}
                    </div>
                    <h2 className="mt-3 text-lg leading-snug font-semibold group-hover:text-brand-dark">{p.title}</h2>
                    <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{p.subtitle}</p>
                  </div>
                </a>
              ))}
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
