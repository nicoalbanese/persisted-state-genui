import { z } from "zod";

export const productSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  type: z.enum(["one-off", "subscription"]),
});

export const productsSchema = z.object({
  products: z.array(productSchema).min(5),
});

export type Product = z.infer<typeof productSchema>;
