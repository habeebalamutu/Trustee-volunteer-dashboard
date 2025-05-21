// TypeScript types for volunteer opportunities used throughout the app.
export interface Opportunity {
  title: string;
  organization: string;
  location: string;
  date: string;
  category: string;
  description?: string;
  duration?: string;
  skills?: string;
  email?: string;
  owner?: string; // email of the user who created the opportunity
}
