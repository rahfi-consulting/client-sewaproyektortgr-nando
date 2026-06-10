import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  PhoneCall,
  Form,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { FeaturedProductsCarousel } from "@/components/featured-products-carousel";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { FEATURE_ITEMS, SITE_DESCRIPTION, SITE_IMAGES, SITE_TAGLINE } from "@/lib/site-config";
import { getFeaturedProducts } from "@/lib/products";

const featureIcons = [Truck, Form, ShieldCheck, PhoneCall];

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="bg-white">
      <section className="bg-black text-white">
        <div className="section-shell grid min-h-[calc(100vh-80px)] items-center gap-10 py-14 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="order-2 space-y-6 lg:order-1">
            <span className="inline-flex rounded-full border border-white/20 px-3 py-1 text-xs font-bold tracking-[0.1em] text-zinc-300">
              Rental & Sales Support
            </span>
            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                {SITE_TAGLINE}
              </h1>
              <p className="max-w-xl text-base leading-7 text-zinc-300 sm:text-lg">
                {SITE_DESCRIPTION}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="button-light"
              >
                SEWA SEKARANG
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/15"
              >
                KATALOG PRODUK
              </Link>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-lg border border-white/10 bg-zinc-950">
              <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/50 to-transparent" />
              <Image
                src={SITE_IMAGES.hero}
                alt="Projector setup for event presentation"
                width={1200}
                height={900}
                className="h-[340px] w-full object-cover sm:h-[460px] lg:h-[600px]"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 text-white">
        <div className="section-shell grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURE_ITEMS.map((item, index) => {
            const Icon = featureIcons[index];

            return (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4"
              >
                <div className="rounded-lg border border-white/10 bg-white/10 p-2">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-zinc-300">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-zinc-100 py-20">
        <div className="section-shell text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.1em] text-zinc-500">
            Easy Process, Clear Execution
          </span>
          <h2 className="mt-4 text-3xl font-bold text-zinc-950 sm:text-4xl">
            Rental Proyektor Siap Pakai: Kualitas Terbaik, Langsung Antar ke Lokasi
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-zinc-600 sm:text-lg">
            Solusi visual tepercaya tanpa kendala teknis. Kami menyediakan proyektor dengan kondisi mesin yang terawat secara profesional, ditambah layanan pengiriman kilat yang memastikan peralatan Anda sudah siap digunakan sebelum acara dimulai.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="section-shell">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Featured Product
              </span>
              <h2 className="mt-3 text-3xl font-semibold text-zinc-950 sm:text-4xl">
                Produk Unggulan Kami
              </h2>
            </div>
            <Link href="/products" className="button-light self-start">
              Semua Produk
            </Link>
          </div>
          <div className="mt-10">
            <FeaturedProductsCarousel products={featuredProducts} />
          </div>
        </div>
      </section>
    </div>
  );
}
