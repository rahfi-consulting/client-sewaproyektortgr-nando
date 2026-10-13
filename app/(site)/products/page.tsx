import { ProductCatalog } from "@/components/product-catalog";
import { getProducts } from "@/lib/products";
import { getSiteSettings } from "@/lib/site-content";

export default async function ProductsPage() {
  const [products, settings] = await Promise.all([getProducts(), getSiteSettings()]);

  return (
    <div className="py-16 sm:py-20">
      <div className="section-shell">
        <div className="max-w-3xl">
          <span className="text-sm font-semibold text-muted">
            Product Catalog
          </span>
          <h1 className="display-1 mt-3">
            Semua Produk Sewa Proyektor dan Perlengkapan Event.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Cari paket proyektor, layar, audio, dan perlengkapan tambahan yang
            sesuai dengan durasi dan skala acara Anda.
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
