import { TrackedWhatsAppLink } from "@/components/tracked-whatsapp-link";
import type { Product } from "@/lib/types";
import { buildWhatsAppLink } from "@/lib/whatsapp";

type RateBoardProps = {
  products: Product[];
  siteName: string;
  whatsappNumber: string;
};

/**
 * The duration packages, written the way a rental counter writes them: one row
 * each, figures lining up, no card around anything.
 *
 * The price field is one string, as the business quotes it, so the rate and its
 * duration are split here only for display and fall back to the whole string
 * when there is no slash to split on.
 */
function splitPrice(price: string) {
  const [rate, duration] = price.split("/").map((part) => part.trim());
  return { rate: rate || price, duration: duration ?? "" };
}

export function RateBoard({ products, siteName, whatsappNumber }: RateBoardProps) {
  return (
    <div>
      {products.map((product) => {
        const { rate, duration } = splitPrice(product.price);
        const whatsapp = buildWhatsAppLink(whatsappNumber, siteName, product.name);

        return (
          <div key={product.id} className="rate-row">
            <p className="figure display-3 md:text-base">{duration || "Paket"}</p>
            <div className="min-w-0">
              <p className="font-medium">{product.name}</p>
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted md:line-clamp-1">
                {product.description}
              </p>
            </div>
            <p className="figure text-lg font-semibold md:text-right">{rate}</p>
            {whatsapp ? (
              <TrackedWhatsAppLink
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline justify-self-start md:justify-self-end"
                source="rate_board"
                productName={product.name}
              >
                Pesan
              </TrackedWhatsAppLink>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
