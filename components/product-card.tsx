import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="flex h-full flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold tracking-[0.1em] text-zinc-500">
            {product.category}
          </span>
          <span
            className={`text-xs font-semibold tracking-[0.1em] ${product.status ? "text-emerald-600" : "text-rose-600"
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
        <a
          href={buildWhatsAppLink(product.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg border border-[#25D366] bg-[#25D366] px-4 py-3 text-sm font-semibold text-white"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </div>
    </article>
  );
}
