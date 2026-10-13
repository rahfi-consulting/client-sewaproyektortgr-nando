import { ProductCatalog } from "@/components/product-catalog";
import { getProducts } from "@/lib/products";
import { getSiteSettings } from "@/lib/site-content";

export default async function ProductsPage() {
  const [products, settings] = await Promise.all([getProducts(), getSiteSettings()]);

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="section-shell">
        <div className="max-w-3xl">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Product Catalog
          </span>
          <h1 className="mt-3 text-4xl font-semibold text-zinc-950 sm:text-5xl">
            Semua Produk Sewa Proyektor dan Perlengkapan Event.
          </h1>
          <p className="mt-4 text-base leading-7 text-zinc-600 sm:text-lg">
            Cari paket proyektor, layar, audio, dan perlengkapan tambahan yang
            sesuai dengan durasi dan skala acara Anda.
          </p>
        </div>

        <div className="mt-10">
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
