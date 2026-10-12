import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bookmark } from "lucide-react";
import { events } from "@/data/events";
import { useSavedEvents } from "@/context/saved-events";
import { EventCard } from "@/components/event-card";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Your Saved Events — Attend" },
      { name: "description", content: "Events you've saved on Attend, ready when you are." },
      { property: "og:title", content: "Your Saved Events — Attend" },
      { property: "og:description", content: "Events you've saved on Attend, ready when you are." },
    ],
  }),
  component: Saved,
});

function Saved() {
  const { savedIds, count } = useSavedEvents();
  const saved = savedIds.map((id) => events.find((e) => e.id === id)).filter((e) => e !== undefined);

  return (
    <main className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
      <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Back to Discover</Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-4xl font-extrabold">Your Saved Events</h1>
          <p className="mt-2 text-muted-foreground">Everything you've bookmarked, in one place.</p>
        </div>
        <span className="rounded-full bg-primary-soft px-4 py-1.5 text-sm font-bold text-accent-foreground">{count} saved</span>
      </div>

      {saved.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed bg-card px-6 py-20 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-primary-soft"><Bookmark className="h-6 w-6 text-primary" /></span>
          <h2 className="mt-5 text-2xl font-bold">Nothing saved just yet.</h2>
          <p className="mt-2 max-w-sm text-muted-foreground">Find events that interest you and save them here for later.</p>
          <Link to="/" className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-6 font-semibold text-primary-foreground hover:bg-primary/90">Explore Events</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((e) => <EventCard key={e.id} event={e} />)}
        </div>
      )}
    </main>
  );
}
