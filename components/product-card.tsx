import { MessageCircle } from "lucide-react";
import { TrackedWhatsAppLink } from "@/components/tracked-whatsapp-link";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
        {product.imageUrl ? (
          <>
            {/* Product URLs are admin-managed and may come from multiple external hosts. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.imageUrl}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </>
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm font-medium text-zinc-500">
            Gambar produk belum tersedia.
          </div>
        )}
      </div>
      <div className="flex h-full flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-500">
            {product.category}
          </span>
          <span
            className={`text-xs font-semibold ${product.status ? "text-emerald-600" : "text-rose-600"
              }`}
          >
            {product.status ? "Tersedia" : "Tidak tersedia"}
          </span>
        </div>
        <div className="mt-4 flex-1 space-y-3">
          <h3 className="text-xl font-semibold text-zinc-950">{product.name}</h3>
          <p className="text-sm leading-6 text-zinc-600">{product.description}</p>
        </div>
        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.1em] text-zinc-500">Harga</p>
            <p className="mt-2 text-lg font-semibold text-zinc-950">{product.price}</p>
          </div>
        </div>
        <TrackedWhatsAppLink
          href={buildWhatsAppLink(product.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg border border-[#25D366] bg-[#25D366] px-4 py-3 text-sm font-semibold text-white"
          source="product_card"
          productName={product.name}
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </TrackedWhatsAppLink>
      </div>
    </article>
  );
}
