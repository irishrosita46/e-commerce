export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  category: "Audio" | "Desk Accessories" | "Lighting" | "Wearables" | string;
  image: string;
  inStock: boolean;
  featured?: boolean;
}
