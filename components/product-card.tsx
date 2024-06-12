/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/NscAFoMGpdh
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/schemas/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="flex flex-col items-start gap-6 bg-white p-8 shadow-lg rounded-lg dark:bg-gray-950">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">{product.name}</h2>
        <p className="text-gray-500 dark:text-gray-400">
          {product.description}
        </p>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold">${product.price}</span>
        {product.type === "subscription" ? (
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            /month
          </span>
        ) : null}
      </div>
      <Button className="w-full">
        {product.type === "subscription" ? "Subscribe" : "Buy"} Now
      </Button>
    </div>
  );
}
