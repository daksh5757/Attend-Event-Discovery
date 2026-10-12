import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bookmark, Pencil, Mail } from "lucide-react";
import { CATEGORIES, type Category } from "@/types/event";
import { useSavedEvents } from "@/context/saved-events";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Attend" },
      { name: "description", content: "Your Attend demo profile and event preferences." },
      { property: "og:title", content: "Profile — Attend" },
      { property: "og:description", content: "Your Attend demo profile and event preferences." },
    ],
  }),
  component: Profile,
});

const KEY = "attend:profile";
interface ProfileData { name: string; bio: string; categories: Category[] }
const DEFAULT: ProfileData = {
  name: "Alex Morgan",
  bio: "Product designer in Bengaluru who loves tech meetups, weekend workshops and giving back to the community.",
  categories: ["Technology", "Community"],
};

function load(): ProfileData {
  try {
    const p: unknown = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (!p || typeof p !== "object") return DEFAULT;
    const o = p as Partial<ProfileData>;
    return {
      name: typeof o.name === "string" && o.name.trim() ? o.name : DEFAULT.name,
      bio: typeof o.bio === "string" ? o.bio : DEFAULT.bio,
      categories: Array.isArray(o.categories) ? o.categories.filter((c): c is Category => (CATEGORIES as readonly string[]).includes(c)) : DEFAULT.categories,
    };
  } catch { return DEFAULT; }
}

const initials = (n: string) => n.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "AM";

function Profile() {
  const { count } = useSavedEvents();
  const [profile, setProfile] = useState<ProfileData>(DEFAULT);
  const [draft, setDraft] = useState<ProfileData>(DEFAULT);
  const [editing, setEditing] = useState(false);

  useEffect(() => { const p = load(); setProfile(p); setDraft(p); }, []);

  const save = () => {
    const next = { ...draft, name: draft.name.trim() || DEFAULT.name };
    setProfile(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
    setEditing(false);
    toast.success("Profile updated");
  };

  const toggleCat = (c: Category) =>
    setDraft((d) => ({ ...d, categories: d.categories.includes(c) ? d.categories.filter((x) => x !== c) : [...d.categories, c] }));

  return (
    <main className="mx-auto max-w-3xl px-4 pt-10 sm:px-6 sm:pt-14">
      <span className="rounded-full border border-dashed border-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">Demo account</span>
      <div className="mt-5 rounded-2xl border bg-card p-6 shadow-card sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <span className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-primary font-display text-2xl font-bold text-primary-foreground">{initials(profile.name)}</span>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-3xl font-extrabold">{profile.name}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><Mail className="h-4 w-4" />alex.morgan@demo.attend.app</p>
          </div>
          {!editing && (
            <button onClick={() => { setDraft(profile); setEditing(true); }} className="inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold hover:border-primary hover:text-primary">
              <Pencil className="h-4 w-4" />Edit profile
            </button>
          )}
        </div>

        {editing ? (
          <div className="mt-8 space-y-5">
            <label className="block">
              <span className="text-sm font-semibold">Display name</span>
              <input value={draft.name} maxLength={60} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="mt-1.5 h-11 w-full rounded-xl border bg-background px-4 outline-none focus:border-primary" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Bio</span>
              <textarea value={draft.bio} maxLength={280} rows={3} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} className="mt-1.5 w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary" />
            </label>
            <fieldset>
              <legend className="text-sm font-semibold">Preferred categories</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button key={c} type="button" aria-pressed={draft.categories.includes(c)} onClick={() => toggleCat(c)}
                    className={cn("h-10 rounded-full border px-4 text-sm font-semibold transition-colors", draft.categories.includes(c) ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground")}>
                    {c}
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="flex gap-3">
              <button onClick={save} className="h-11 rounded-full bg-primary px-6 font-semibold text-primary-foreground hover:bg-primary/90">Save changes</button>
              <button onClick={() => setEditing(false)} className="h-11 rounded-full border px-6 font-semibold hover:bg-muted">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <p className="leading-relaxed text-muted-foreground">{profile.bio || "No bio yet."}</p>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Preferred categories</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile.categories.length ? profile.categories.map((c) => <span key={c} className="rounded-full bg-primary-soft px-3 py-1 text-sm font-semibold text-accent-foreground">{c}</span>)
                  : <span className="text-sm text-muted-foreground">None selected</span>}
              </div>
            </div>
          </div>
        )}
      </div>

      <Link to="/saved" className="mt-6 flex items-center justify-between rounded-2xl border bg-card p-6 shadow-card transition hover:shadow-lift">
        <span className="flex items-center gap-3 font-semibold"><Bookmark className="h-5 w-5 text-primary" />Saved events</span>
        <span className="font-display text-3xl font-bold">{count}</span>
      </Link>
    </main>
  );
}
