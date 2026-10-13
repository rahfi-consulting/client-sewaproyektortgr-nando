"use client";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/types";

type FeaturedProductsCarouselProps = {
  products: Product[];
  siteName: string;
  whatsappNumber: string;
  phoneNumber: string;
};

export function FeaturedProductsCarousel({
  products,
  siteName,
  whatsappNumber,
  phoneNumber,
}: FeaturedProductsCarouselProps) {
  if (products.length === 0) {
    return (
      <div className="border border-rule bg-paper p-8 text-center text-sm text-muted">
        Produk unggulan belum tersedia, Silahkan cek kembali nanti
        {phoneNumber ? ` atau hubungi Admin: ${phoneNumber}` : ""}.
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
            <ProductCard
              product={product}
              siteName={siteName}
              whatsappNumber={whatsappNumber}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
