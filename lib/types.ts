export type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  status: boolean;
  category: string;
  featured: boolean;
  sortOrder: number;
};

export type ProductRecord = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  image_url: string | null;
  status: boolean;
  category: string | null;
  featured: boolean | null;
  sort_order: number | null;
};

export type ProductMutationState = {
  ok: boolean;
  operation: "create" | "update" | "delete";
  message: string;
  productName: string;
  productStatusLabel: string;
};
