import Image from "next/image";
import Link from "next/link";
import { FeaturedProductsCarousel } from "@/components/featured-products-carousel";
import { RateBoard } from "@/components/rate-board";
import { TrackedWhatsAppLink } from "@/components/tracked-whatsapp-link";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { getProducts } from "@/lib/products";
import { getSiteSettings } from "@/lib/site-content";
import type { Product } from "@/lib/types";

/**
 * A package is rented by the hour and quoted that way, as in "Rp. 650.000 / 6 Jam".
 * Everything else is priced per item, and belongs in the gear row instead.
 */
const isPackage = (product: Product) => product.price.toLowerCase().includes("jam");

export default async function HomePage() {
  const [products, settings] = await Promise.all([getProducts(), getSiteSettings()]);
  const whatsapp = buildWhatsAppLink(settings.whatsappNumber, settings.siteName);
  const packages = products.filter(isPackage).slice(0, 6);
  const gear = products.filter((product) => !isPackage(product));
  // Featured first, then the rest, so the row is never half empty.
  const featuredGear = [
    ...gear.filter((product) => product.featured),
    ...gear.filter((product) => !product.featured),
  ].slice(0, 8);

  return (
    <div>
      <section className="bg-ink text-paper">
        <div className="section-shell grid items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24">
          <div className="order-2 space-y-8 lg:order-1">
            <h1 className="display-1">{settings.tagline}</h1>
            <p className="lede text-paper/70">{settings.description}</p>

            <div className="flex flex-wrap gap-3">
              {whatsapp ? (
                <TrackedWhatsAppLink
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-lamp"
                  source="home_hero"
                >
                  Sewa lewat WhatsApp
                </TrackedWhatsAppLink>
              ) : null}
              <Link href="/products" className="btn btn-outline-light">
                Lihat katalog
              </Link>
            </div>

            {/* What a renter asks before anything else: how bright, how long, how far. */}
            <dl className="grid max-w-xl grid-cols-3 border-t border-white/15 pt-5 text-sm">
              <div className="pr-4">
                <dt className="text-paper/50">Kecerahan</dt>
                <dd className="figure mt-1 font-medium">5.500 lumens</dd>
              </div>
              <div className="border-l border-white/15 px-4">
                <dt className="text-paper/50">Durasi sewa</dt>
                <dd className="figure mt-1 font-medium">3-24 jam</dd>
              </div>
              <div className="border-l border-white/15 pl-4">
                <dt className="text-paper/50">Antar</dt>
                <dd className="mt-1 font-medium">{settings.address}</dd>
              </div>
            </dl>
          </div>

          {/* The whole decoration of the site: a lit screen in a dark room, the
              light spilling onto the wall around it. */}
          <div className="lamp-on order-1 lg:order-2">
            <div className="screen screen-wide border-white/20 shadow-[0_0_140px_-30px_rgba(255,199,74,0.75)]">
              <Image
                src={settings.heroImage}
                alt="Proyektor menyala di ruang acara"
                width={1600}
                height={900}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="section-shell grid gap-px py-10 sm:grid-cols-2 lg:grid-cols-4">
          {settings.features.map((item) => (
            <div key={item.title} className="border-rule px-0 sm:px-6 sm:first:pl-0 sm:[&+*]:border-l">
              <p className="display-3">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {packages.length > 0 ? (
        <section className="py-20">
          <div className="section-shell">
            <div className="max-w-2xl">
              <h2 className="display-2">Harga paket, dihitung per durasi</h2>
              <p className="lede mt-4">
                Satu proyektor 5.500 lumens, layar, dan dudukannya. Pilih durasi yang
                sesuai acara Anda, lalu kirim pesan untuk mengunci jadwalnya.
              </p>
            </div>

            <div className="mt-10">
              <RateBoard
                products={packages}
                siteName={settings.siteName}
                whatsappNumber={settings.whatsappNumber}
              />
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-lamp-soft py-20">
        <div className="section-shell">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <h2 className="display-2">Perlengkapan lain untuk acara</h2>
              <p className="lede mt-4">
                Layar, audio, komunikasi, dan kabel yang biasanya dibutuhkan bersamaan
                dengan proyektor.
              </p>
            </div>
            <Link href="/products" className="btn btn-ink self-start">
              Semua produk
            </Link>
          </div>

          <div className="mt-10">
            <FeaturedProductsCarousel
              products={featuredGear}
              siteName={settings.siteName}
              whatsappNumber={settings.whatsappNumber}
              phoneNumber={settings.phoneNumber}
            />
          </div>
        </div>
      </section>

      <section className="bg-ink py-20 text-paper">
        <div className="section-shell grid gap-8 lg:grid-cols-[1.2fr_auto] lg:items-end">
          <div>
            <h2 className="display-2 max-w-2xl">
              Acara besok? Masih sempat.
            </h2>
            <p className="lede mt-4 text-paper/70">
              Kirim tanggal, lokasi, dan perkiraan jumlah penonton. Kami balas dengan
              rekomendasi alat dan harga total, tanpa biaya tersembunyi.
            </p>
          </div>
          {whatsapp ? (
            <TrackedWhatsAppLink
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lamp self-start lg:self-end"
              source="home_closing"
            >
              Tanya ketersediaan
            </TrackedWhatsAppLink>
          ) : null}
        </div>
      </section>
    </div>
  );
}
