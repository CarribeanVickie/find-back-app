import { Item } from "@/types/item";

// Initial mock data - some found items for demo purposes
export const initialItems: Item[] = [
  {
    id: "1",
    name: "Blue iPhone 14",
    category: "Electronics",
    description: "Found near the library entrance. Has a clear case with stickers.",
    image: "/placeholder.svg",
    status: "found",
    dateReported: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Student ID Card",
    category: "ID & Cards",
    description: "Found in Science Building, Room 204. Name partially visible.",
    image: "/placeholder.svg",
    status: "found",
    dateReported: new Date("2024-01-16"),
  },
  {
    id: "3",
    name: "Calculus Textbook",
    category: "Books & Notes",
    description: "Stewart Calculus 8th Edition. Found in cafeteria.",
    image: "/placeholder.svg",
    status: "found",
    dateReported: new Date("2024-01-17"),
  },
  {
    id: "4",
    name: "Car Keys with Red Keychain",
    category: "Keys",
    description: "Toyota keys with red heart keychain. Found in parking lot B.",
    image: "/placeholder.svg",
    status: "found",
    dateReported: new Date("2024-01-18"),
  },
  {
    id: "5",
    name: "Black North Face Backpack",
    category: "Bags & Wallets",
    description: "Contains notebooks. Found in gym locker room.",
    image: "/placeholder.svg",
    status: "found",
    dateReported: new Date("2024-01-19"),
  },
];
