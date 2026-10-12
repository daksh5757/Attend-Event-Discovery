import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { events } from "@/data/events";

const KEY = "attend:saved-events";
const validIds = new Set(events.map((e) => e.id));

interface SavedCtx {
  savedIds: string[];
  isSaved: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  count: number;
}

const Ctx = createContext<SavedCtx | null>(null);

function readStorage(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.filter((x): x is string => typeof x === "string" && validIds.has(x)))];
  } catch {
    return [];
  }
}

export function SavedEventsProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSavedIds(readStorage());
    setLoaded(true);
    const onStorage = (e: StorageEvent) => { if (e.key === KEY) setSavedIds(readStorage()); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { window.localStorage.setItem(KEY, JSON.stringify(savedIds)); } catch { /* ignore quota */ }
  }, [savedIds, loaded]);

  const title = (id: string) => events.find((e) => e.id === id)?.title ?? "Event";

  const toggle = useCallback((id: string) => {
    setSavedIds((prev) => {
      const has = prev.includes(id);
      if (has) toast(`Removed "${title(id)}" from saved`);
      else toast.success(`Saved "${title(id)}"`);
      return has ? prev.filter((x) => x !== id) : [...prev, id];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setSavedIds((prev) => prev.filter((x) => x !== id));
    toast(`Removed "${title(id)}" from saved`);
  }, []);

  const value = useMemo<SavedCtx>(() => ({
    savedIds, count: savedIds.length, toggle, remove,
    isSaved: (id) => savedIds.includes(id),
  }), [savedIds, toggle, remove]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSavedEvents() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSavedEvents must be used within SavedEventsProvider");
  return c;
}
