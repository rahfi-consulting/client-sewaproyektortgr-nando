import { ProductCatalog } from "@/components/product-catalog";
import { getProducts } from "@/lib/products";
import { getSiteSettings } from "@/lib/site-content";

export const metadata = {
  title: "Katalog",
};

export default async function ProductsPage() {
  const [products, settings] = await Promise.all([getProducts(), getSiteSettings()]);

  return (
    <div className="py-16 sm:py-20">
      <div className="section-shell">
        <div className="max-w-3xl">
          <h1 className="display-1">Katalog</h1>
          <p className="lede mt-6">
            Paket proyektor per durasi, layar, audio, dan perlengkapan tambahan.
            Harga sudah termasuk pengantaran di {settings.address}.
          </p>
        </div>

        <div className="mt-12">
          <ProductCatalog
            products={products}
            siteName={settings.siteName}
            whatsappNumber={settings.whatsappNumber}
            phoneNumber={settings.phoneNumber}
          />
        </div>
      </div>
    </div>
  );
}
