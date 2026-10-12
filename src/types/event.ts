export const CATEGORIES = ["Business", "Technology", "Education", "Community", "Church"] as const;
export type Category = (typeof CATEGORIES)[number];

export interface Event {
  id: string;
  slug: string;
  title: string;
  category: Category;
  /** ISO date-time (local) */
  startsAt: string;
  endsAt: string;
  city: string;
  venue: string;
  organizer: string;
  attendees: number;
  capacity?: number;
  description: string;
  image: string;
  tags: string[];
  featured?: boolean;
}
