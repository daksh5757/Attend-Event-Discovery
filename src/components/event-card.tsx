import { Link, useNavigate } from "@tanstack/react-router";
import { Bookmark, CalendarDays, Clock, MapPin, Users, ArrowRight } from "lucide-react";
import { useState } from "react";
import type { Event } from "@/types/event";
import { formatDate, formatTime } from "@/data/events";
import { useSavedEvents } from "@/context/saved-events";
import { cn } from "@/lib/utils";

export function EventImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <div className={cn("img-fallback grid place-items-center font-display text-3xl font-bold text-accent-foreground/40", className)} aria-label={alt}>Attend</div>
  ) : (
    <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={cn("object-cover", className)} />
  );
}

export function SaveButton({ id, title, variant = "icon" }: { id: string; title: string; variant?: "icon" | "full" }) {
  const { isSaved, toggle } = useSavedEvents();
  const saved = isSaved(id);
  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(id); }}
      aria-pressed={saved}
      aria-label={saved ? `Unsave ${title}` : `Save ${title}`}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border text-sm font-semibold transition-all",
        variant === "icon" ? "h-10 w-10" : "h-11 px-5",
        saved ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary hover:text-primary",
      )}
    >
      <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
      {variant === "full" && (saved ? "Saved" : "Save event")}
    </button>
  );
}

export function EventCard({ event }: { event: Event }) {
  const navigate = useNavigate();
  const go = () => navigate({ to: "/events/$slug", params: { slug: event.slug } });
  return (
    <article
      onClick={go}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <EventImage src={event.image} alt={event.title} className="h-full w-full transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-card/95 px-3 py-1 text-xs font-bold text-accent-foreground">{event.category}</span>
        <div className="absolute right-3 top-3"><SaveButton id={event.id} title={event.title} /></div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold leading-snug">{event.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">by {event.organizer}</p>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2"><CalendarDays className="h-4 w-4 shrink-0 text-primary" />{formatDate(event.startsAt)}</li>
          <li className="flex items-center gap-2"><Clock className="h-4 w-4 shrink-0 text-primary" />{formatTime(event.startsAt)}</li>
          <li className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0 text-primary" /><span className="truncate">{event.city === "Online" ? "Online" : `${event.venue.split(",")[0]}, ${event.city}`}</span></li>
        </ul>
        <div className="mt-auto flex items-center justify-between border-t pt-4 mt-5">
          <span className="flex items-center gap-1.5 text-sm font-semibold"><Users className="h-4 w-4 text-primary" />{event.attendees.toLocaleString("en-IN")} going</span>
          <Link
            to="/events/$slug"
            params={{ slug: event.slug }}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:gap-2 transition-all"
          >
            View details <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
