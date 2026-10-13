import { MessageCircle } from "lucide-react";
import { TrackedWhatsAppLink } from "@/components/tracked-whatsapp-link";
import type { Product } from "@/lib/types";
import { buildWhatsAppLink } from "@/lib/whatsapp";

type ProductCardProps = {
  product: Product;
  /** Passed down rather than read here: the number lives in Sanity, not in the client. */
  siteName: string;
  whatsappNumber: string;
};

/**
 * One item of gear.
 *
 * The photograph sits in a 4:3 screen, the ratio the equipment projects, and the
 * card itself is a hairline rectangle rather than a floating panel: the only
 * thing that glows on this site is the lamp.
 */
export function ProductCard({ product, siteName, whatsappNumber }: ProductCardProps) {
  const whatsapp = buildWhatsAppLink(whatsappNumber, siteName, product.name);

  return (
    <article className="flex h-full flex-col border border-rule bg-paper">
      <div className="screen screen-standard border-0 border-b border-rule">
        {product.imageUrl ? (
          // Served straight from Sanity's image CDN at the size the card needs.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <p className="flex h-full items-center justify-center px-6 text-center text-sm font-medium text-paper/60">
            Gambar produk belum tersedia.
          </p>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm text-muted">{product.category}</span>
          <span className={`text-sm font-medium ${product.status ? "text-ink" : "text-muted"}`}>
            {product.status ? "Tersedia" : "Tidak tersedia"}
          </span>
        </div>

        <h3 className="display-3 mt-3">{product.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-muted">{product.description}</p>

        <div className="mt-5 border-t border-rule pt-4">
          <p className="text-sm text-muted">Harga</p>
          <p className="figure mt-1 text-lg font-semibold">{product.price}</p>
        </div>

        {whatsapp ? (
          <TrackedWhatsAppLink
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ink mt-4"
            source="product_card"
            productName={product.name}
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </TrackedWhatsAppLink>
        ) : null}
      </div>
    </article>
  );
}
