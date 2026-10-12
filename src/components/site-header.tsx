import { Link } from "@tanstack/react-router";
import { Bookmark, Compass, User } from "lucide-react";
import { useSavedEvents } from "@/context/saved-events";

const nav = [
  { to: "/", label: "Discover", icon: Compass },
  { to: "/saved", label: "Saved", icon: Bookmark },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="Attend home">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary font-display text-lg font-bold text-primary-foreground">A</span>
      <span className="font-display text-xl font-bold tracking-tight">Attend</span>
    </Link>
  );
}

export function SiteHeader() {
  const { count } = useSavedEvents();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="relative flex h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[status=active]:bg-primary-soft data-[status=active]:text-accent-foreground sm:px-4"
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
              {to === "/saved" && count > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">{count}</span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:px-6">
        <div className="flex items-center gap-3"><Logo /><span>Find your people.</span></div>
        <nav className="flex gap-5 font-medium">
          <Link to="/" className="hover:text-foreground">Discover</Link>
          <Link to="/saved" className="hover:text-foreground">Saved Events</Link>
          <Link to="/profile" className="hover:text-foreground">Profile</Link>
        </nav>
        <p>© 2026 Attend</p>
      </div>
    </footer>
  );
}
