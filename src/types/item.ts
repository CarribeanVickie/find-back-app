// Data model for Lost & Found items
export interface Item {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  status: "lost" | "found";
  dateReported: Date;
}

// Available categories for items
export const CATEGORIES = [
  "Electronics",
  "Books & Notes",
  "Clothing",
  "ID & Cards",
  "Keys",
  "Bags & Wallets",
  "Sports Equipment",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];
