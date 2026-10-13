import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FeaturedProductsCarousel } from "@/components/featured-products-carousel";
import { TrackedWhatsAppLink } from "@/components/tracked-whatsapp-link";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { getFeaturedProducts } from "@/lib/products";
import { getSiteSettings } from "@/lib/site-content";

export default async function HomePage() {
  const [featuredProducts, settings] = await Promise.all([
    getFeaturedProducts(),
    getSiteSettings(),
  ]);
  const whatsapp = buildWhatsAppLink(settings.whatsappNumber, settings.siteName);

  return (
    <div>
      <section className="bg-ink text-paper">
        <div className="section-shell grid items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24">
          <div className="order-2 space-y-7 lg:order-1">
            <span className="inline-flex border border-white/25 px-3 py-1 text-xs font-semibold text-paper/70">
              Provide Your Visual Needs
            </span>
            <div className="space-y-5">
              <h1 className="display-1">{settings.tagline}</h1>
              <p className="lede text-paper/70">{settings.description}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {whatsapp ? (
                <TrackedWhatsAppLink
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-lamp"
                  source="home_hero"
                >
                  SEWA SEKARANG
                  <ArrowRight className="h-4 w-4" />
                </TrackedWhatsAppLink>
              ) : null}
              <Link href="/products" className="btn btn-outline-light">
                KATALOG PRODUK
              </Link>
            </div>
          </div>

          {/* The whole decoration of the site: a lit screen in a dark room, the
              light spilling onto the wall around it. */}
          <div className="lamp-on order-1 lg:order-2">
            <div className="screen screen-wide border-white/20 shadow-[0_0_140px_-30px_rgba(255,199,74,0.75)]">
              <Image
                src={settings.heroImage}
                alt="Projector setup for event presentation"
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
        <div className="section-shell grid py-10 sm:grid-cols-2 lg:grid-cols-4">
          {settings.features.map((item) => (
            <div key={item.title} className="border-rule px-0 sm:px-6 sm:first:pl-0 sm:[&+*]:border-l">
              <p className="display-3">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-lamp-soft py-20">
        <div className="section-shell text-center">
          <span className="text-sm font-semibold text-muted">
            Easy Process, Clear Execution
          </span>
          <h2 className="display-2 mx-auto mt-4 max-w-4xl">
            Rental Proyektor Siap Pakai: Kualitas Terbaik, Langsung Antar ke Lokasi
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-muted sm:text-lg">
            Solusi visual tepercaya tanpa kendala teknis. Kami menyediakan proyektor dengan kondisi mesin yang terawat secara profesional, ditambah layanan pengiriman kilat yang memastikan peralatan Anda sudah siap digunakan sebelum acara dimulai.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="section-shell">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-sm font-semibold text-muted">
                Featured Product
              </span>
              <h2 className="display-2 mt-3">
                Produk Unggulan Kami
              </h2>
            </div>
            <Link href="/products" className="btn btn-ink self-start">
              Semua Produk
            </Link>
          </div>
          <div className="mt-10">
            <FeaturedProductsCarousel
              products={featuredProducts}
              siteName={settings.siteName}
              whatsappNumber={settings.whatsappNumber}
              phoneNumber={settings.phoneNumber}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
