import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CalendarDays, Clock, MapPin, User, Users, Check, Sparkles } from "lucide-react";
import { getEventBySlug, formatDate, formatTime } from "@/data/events";
import { EventImage, SaveButton } from "@/components/event-card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/events/$slug")({
  loader: ({ params }) => {
    const event = getEventBySlug(params.slug);
    if (!event) throw notFound();
    return { event };
  },
  head: ({ loaderData }) => {
    const e = loaderData?.event;
    if (!e) return { meta: [{ title: "Event not found — Attend" }, { name: "robots", content: "noindex" }] };
    const desc = e.description.slice(0, 155);
    return {
      meta: [
        { title: `${e.title} — Attend` },
        { name: "description", content: desc },
        { property: "og:title", content: `${e.title} — Attend` },
        { property: "og:description", content: desc },
        { property: "og:image", content: e.image },
        { name: "twitter:image", content: e.image },
      ],
    };
  },
  notFoundComponent: () => (
    <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <h1 className="text-3xl font-extrabold">We couldn't find that event</h1>
      <p className="mt-3 text-muted-foreground">It may have ended or the link might be wrong.</p>
      <Link to="/" className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-6 font-semibold text-primary-foreground hover:bg-primary/90">Back to Discover</Link>
    </main>
  ),
  component: EventDetails,
});

function EventDetails() {
  const { event: e } = Route.useLoaderData();
  const [interested, setInterested] = useState(false);
  const pct = e.capacity ? Math.min(100, Math.round((e.attendees / e.capacity) * 100)) : null;

  const rows = [
    { icon: CalendarDays, label: "Date", value: formatDate(e.startsAt) },
    { icon: Clock, label: "Time", value: `${formatTime(e.startsAt)} – ${formatTime(e.endsAt)}` },
    { icon: MapPin, label: "Location", value: e.city === "Online" ? e.venue : `${e.venue}, ${e.city}` },
    { icon: User, label: "Organizer", value: e.organizer },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Back to Discover</Link>
      <div className="mt-4 overflow-hidden rounded-2xl border shadow-card">
        <EventImage src={e.image} alt={e.title} className="aspect-[21/9] w-full max-h-[420px]" />
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <article>
          <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-accent-foreground">{e.category}</span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-5xl">{e.title}</h1>
          <h2 className="mt-8 text-lg font-bold">About this event</h2>
          <p className="mt-2 text-base leading-relaxed text-muted-foreground">{e.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {e.tags.map((t) => <span key={t} className="rounded-full border bg-card px-3 py-1 text-sm font-medium">#{t}</span>)}
          </div>
        </article>

        <aside className="h-fit rounded-2xl border bg-card p-6 shadow-card lg:sticky lg:top-24">
          <ul className="space-y-4">
            {rows.map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft"><Icon className="h-4 w-4 text-primary" /></span>
                <div><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p><p className="font-semibold">{value}</p></div>
              </li>
            ))}
          </ul>
          <div className="mt-5 border-t pt-5">
            <p className="flex items-center gap-2 font-semibold"><Users className="h-4 w-4 text-primary" />{e.attendees.toLocaleString("en-IN")} registered{e.capacity ? ` · ${e.capacity.toLocaleString("en-IN")} capacity` : ""}</p>
            {pct !== null && <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} /></div>}
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setInterested((v) => !v)}
              aria-pressed={interested}
              className={cn("inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full font-semibold transition-colors",
                interested ? "bg-success text-primary-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90")}
            >
              {interested ? <Check className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
              {interested ? "Interested" : "I'm Interested"}
            </button>
            <SaveButton id={e.id} title={e.title} />
          </div>
          {interested && <p className="mt-3 text-sm text-muted-foreground">Noted! We've marked your interest (demo only — this isn't a registration or ticket).</p>}
        </aside>
      </div>
    </main>
  );
}
