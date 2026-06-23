"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/types";
import { PHONE_NUMBER } from "@/lib/site-config";

export function ProductCatalog({ products }: { products: Product[] }) {
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

  return (
    <div className="space-y-8">
      <div className="grid gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 shadow-[0_18px_50px_rgba(17,17,17,0.05)] md:grid-cols-[1fr_240px]">
        <label className="relative block">
          <span className="pointer-events-none absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500">
            <Search className="h-4 w-4" />
          </span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari produk..."
            className="field-base min-h-14 rounded-xl !pl-14 pr-4 placeholder:text-zinc-400"
          />
        </label>
        <div className="relative" ref={categoryMenuRef}>
          <button
            type="button"
            onClick={() => setIsCategoryOpen((open) => !open)}
            className={`field-base flex min-h-14 items-center justify-between rounded-xl pr-4 text-left ${isCategoryOpen ? "border-zinc-950 shadow-[0_0_0_3px_rgba(17,17,17,0.08)]" : ""
              }`}
            aria-haspopup="listbox"
            aria-expanded={isCategoryOpen}
          >
            <span className="truncate text-[0.95rem] text-zinc-950">{categoryLabel}</span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform ${isCategoryOpen ? "rotate-180" : ""
                }`}
            />
          </button>

          {isCategoryOpen ? (
            <div className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_24px_60px_rgba(17,17,17,0.14)]">
              <div className="border-b border-zinc-100 px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500">
                Pilih kategori
              </div>
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
                      className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm ${isActive
                        ? "bg-zinc-950 text-white"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                        }`}
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
        <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center text-sm text-zinc-500">
          {products.length === 0 && !hasActiveFilters
            ? `Katalog produk masih kosong. SIlahkan cek kembali nanti atau hubungi Admin: ${PHONE_NUMBER}`
            : "Tidak ada produk yang cocok dengan pencarian Anda."}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
