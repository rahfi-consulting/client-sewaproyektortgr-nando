"use client";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/types";
import { PHONE_NUMBER } from "@/lib/site-config";

export function FeaturedProductsCarousel({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50 p-8 text-center text-sm text-zinc-500">
        Produk unggulan belum tersedia, Silahkan cek kembali nanti atau hubungi Admin: {PHONE_NUMBER}
      </div>
    );
  }

  return (
    <Swiper
      modules={[Autoplay]}
      spaceBetween={20}
      slidesPerView={1}
      loop={products.length > 4}
      speed={900}
      grabCursor
      simulateTouch
      autoplay={{
        delay: 2800,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      breakpoints={{
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
        1280: {
          slidesPerView: 4,
        },
      }}
    >
      {products.map((product) => (
        <SwiperSlide key={product.id} className="h-auto">
          <div className="h-full">
            <ProductCard product={product} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
