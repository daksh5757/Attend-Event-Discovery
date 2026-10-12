import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, X, SearchX } from "lucide-react";
import { events } from "@/data/events";
import { CATEGORIES, type Category } from "@/types/event";
import { EventCard } from "@/components/event-card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Attend — Discover events near you" },
      { name: "description", content: "Explore business, tech, education, community and church events across Mumbai, Bengaluru, Pune, Delhi and online." },
      { property: "og:title", content: "Attend — Discover events near you" },
      { property: "og:description", content: "Find your people. Discover your next experience." },
    ],
  }),
  component: Discover,
});

type Sort = "upcoming" | "earliest" | "popular";
const sorts: { value: Sort; label: string }[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "earliest", label: "Earliest first" },
  { value: "popular", label: "Most popular" },
];

function Discover() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | Category>("All");
  const [sort, setSort] = useState<Sort>("upcoming");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = events.filter((e) => {
      if (category !== "All" && e.category !== category) return false;
      if (!q) return true;
      return [e.title, e.category, e.organizer, e.city, e.venue].some((f) => f.toLowerCase().includes(q));
    });
    const time = (s: string) => new Date(s).getTime();
    if (sort === "popular") return [...list].sort((a, b) => b.attendees - a.attendees);
    if (sort === "earliest") return [...list].sort((a, b) => time(a.startsAt) - time(b.startsAt));
    // Upcoming: events from now onward first (soonest first), past events after
    const now = Date.now();
    return [...list].sort((a, b) => {
      const pa = time(a.startsAt) < now, pb = time(b.startsAt) < now;
      if (pa !== pb) return pa ? 1 : -1;
      return pa ? time(b.startsAt) - time(a.startsAt) : time(a.startsAt) - time(b.startsAt);
    });
  }, [query, category, sort]);

  const featured = events.filter((e) => e.featured).slice(0, 3);
  const filtering = query.trim() !== "" || category !== "All";

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="pt-10 pb-6 sm:pt-14">
        <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.05] sm:text-5xl">
          Find your people. <span className="text-primary">Discover your next experience.</span>
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
          Explore events, meet like-minded people, and make every moment count.
        </p>

        <div className="relative mt-7 max-w-2xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, organizers, cities…"
            aria-label="Search events"
            className="h-14 w-full rounded-2xl border bg-card pl-12 pr-12 text-base shadow-card outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </section>

      <div className="flex flex-col gap-4 border-b pb-5 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label="Filter by category" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
          {(["All", ...CATEGORIES] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={cn(
                "h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors",
                category === c ? "border-foreground bg-foreground text-background" : "bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          Sort by
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="h-10 rounded-full border bg-card px-4 font-semibold text-foreground outline-none focus:border-primary">
            {sorts.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
      </div>

      {!filtering && (
        <section className="pt-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Featured this season</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        </section>
      )}

      <section className="pt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold">{filtering ? "Results" : "All events"}</h2>
          <span className="text-sm text-muted-foreground">{results.length} event{results.length === 1 ? "" : "s"}</span>
        </div>
        {results.length === 0 ? (
          <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed bg-card px-6 py-16 text-center">
            <SearchX className="h-10 w-10 text-primary" />
            <h3 className="mt-4 text-xl font-bold">No events match your search</h3>
            <p className="mt-2 max-w-sm text-muted-foreground">Try a different keyword, city or category.</p>
            <button onClick={() => { setQuery(""); setCategory("All"); }} className="mt-6 h-11 rounded-full bg-primary px-6 font-semibold text-primary-foreground hover:bg-primary/90">Reset filters</button>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        )}
      </section>
    </main>
  );
}
