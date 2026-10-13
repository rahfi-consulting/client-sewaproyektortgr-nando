"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/types";

type ProductCatalogProps = {
  products: Product[];
  siteName: string;
  whatsappNumber: string;
  phoneNumber: string;
};

export function ProductCatalog({
  products,
  siteName,
  whatsappNumber,
  phoneNumber,
}: ProductCatalogProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))).sort(),
    [products],
  );

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!categoryMenuRef.current?.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsCategoryOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const categoryLabel = category === "all" ? "Semua kategori" : category;

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery) ||
        product.price.toLowerCase().includes(normalizedQuery);

      const matchesCategory = category === "all" || product.category === category;

      return matchesQuery && matchesCategory;
    });
  }, [category, products, query]);

  const hasActiveFilters = query.trim().length > 0 || category !== "all";
  const emptyCatalogueHelp = phoneNumber
    ? `Katalog produk masih kosong. Silahkan cek kembali nanti atau hubungi Admin: ${phoneNumber}`
    : "Katalog produk masih kosong. Silahkan cek kembali nanti.";

  return (
    <div className="space-y-8">
      <div className="grid gap-4 border border-rule p-4 md:grid-cols-[1fr_240px]">
        <label className="relative block">
          <span className="pointer-events-none absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-muted">
            <Search className="h-4 w-4" />
          </span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari produk..."
            className="field-base min-h-14 !pl-12 pr-4"
          />
        </label>
        <div className="relative" ref={categoryMenuRef}>
          <button
            type="button"
            onClick={() => setIsCategoryOpen((open) => !open)}
            className={`field-base flex min-h-14 items-center justify-between pr-4 text-left ${isCategoryOpen ? "border-ink" : ""
              }`}
            aria-haspopup="listbox"
            aria-expanded={isCategoryOpen}
          >
            <span className="truncate text-[0.95rem]">{categoryLabel}</span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-muted transition-transform ${isCategoryOpen ? "rotate-180" : ""
                }`}
            />
          </button>

          {isCategoryOpen ? (
            <div className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden border border-ink bg-paper">
              <div className="border-b border-rule px-4 py-3 text-sm text-muted">Pilih kategori</div>
              <div className="max-h-72 overflow-y-auto py-2" role="listbox" aria-label="Pilih kategori produk">
                {["all", ...categories].map((item) => {
                  const isActive = item === category;
                  const label = item === "all" ? "Semua kategori" : item;

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setCategory(item);
                        setIsCategoryOpen(false);
                      }}
                      className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm ${isActive ? "bg-ink text-paper" : "text-muted hover:bg-lamp-soft hover:text-ink"}`}
                      role="option"
                      aria-selected={isActive}
                    >
                      <span>{label}</span>
                      {isActive ? <Check className="h-4 w-4 shrink-0" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="border border-rule p-8 text-center text-sm text-muted">
          {products.length === 0 && !hasActiveFilters
            ? emptyCatalogueHelp
            : "Tidak ada produk yang cocok. Coba kata lain atau pilih kategori lain."}
        </div>
      ) : (
        <div className="grid gap-px bg-rule sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              siteName={siteName}
              whatsappNumber={whatsappNumber}
            />
          ))}
        </div>
      )}
    </div>
  );
}
