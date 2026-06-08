"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, LoaderCircle, TriangleAlert, Trash2 } from "lucide-react";
import { deleteProduct, saveProduct } from "@/app/actions";
import { SignOutButton } from "@/components/sign-out-button";
import type { Product, ProductMutationState } from "@/lib/types";

const inputClassName = "field-base";

type AdminDashboardProps = {
  products: Product[];
  userEmail: string;
};

type FeedbackState = {
  title: string;
  detail: string;
  tone: "pending" | "success" | "error";
  statusLabel?: string;
  refreshOnClose?: boolean;
};

export function AdminDashboard({ products, userEmail }: AdminDashboardProps) {
  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 rounded-lg border border-white/10 bg-white/5 p-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.1em] text-zinc-400">
              Private Dashboard
            </span>
            <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
              Kelola Katalog Produk
            </h1>
            <p className="mt-3 text-sm leading-6 text-zinc-300 sm:text-base">
              Login as <span className="font-medium text-white">{userEmail}</span>
            </p>
          </div>
          <SignOutButton />
        </div>

        <div className="grid gap-8 xl:grid-cols-[360px_1fr]">
          <section className="rounded-lg border border-white/10 bg-white p-6 text-zinc-950">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Tambah Produk</h2>
              <p className="text-sm leading-6 text-zinc-600">
                Gunakan form ini untuk menambahkan item baru ke tabel
                <code className="ml-1 rounded bg-zinc-100 px-1.5 py-0.5 text-xs">
                  products
                </code>
                .
              </p>
            </div>

            <AdminCreateProductForm />
          </section>

          <section className="space-y-4">
            <div className="rounded-lg border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-semibold">Daftar Produk</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                Semua item dapat diedit langsung. Produk yang dinonaktifkan akan
                tetap terlihat di dashboard, tetapi tidak tampil di halaman publik.
              </p>
            </div>

            {products.length === 0 ? (
              <div className="rounded-lg border border-dashed border-white/15 bg-white/5 p-8 text-sm text-zinc-300">
                Tabel produk masih kosong. Tambahkan produk pertama Anda melalui form admin di sebelah kiri.
              </div>
            ) : (
              <div className="grid gap-4">
                {products.map((product) => (
                  <AdminProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function AdminCreateProductForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setFeedback({
      title: "Menyimpan produk",
      detail: "Mohon tunggu. Data produk sedang dikirim ke server.",
      tone: "pending",
    });

    startTransition(async () => {
      const result = await saveProduct(formData);
      setFeedback(mapResultToFeedback(result));

      if (result.ok) {
        formRef.current?.reset();
      }
    });
  }

  return (
    <>
      <form
        ref={formRef}
        action={handleSubmit}
        className="mt-6 space-y-4"
      >
        <input name="name" placeholder="Nama Produk" className={inputClassName} required />
        <input
          name="category"
          placeholder="Kategori, exs. Proyektor"
          className={inputClassName}
          defaultValue="General"
          required
        />
        <input
          name="price"
          placeholder="Harga, ex. Rp 350.000 / 3 jam"
          className={inputClassName}
          required
        />
        <div className="space-y-2">
          <input
            name="image_url"
            placeholder="URL Gambar Produk"
            className={inputClassName}
          />
          <p className="text-xs leading-5 text-zinc-500">
            Gunakan URL gambar publik berbasis HTTPS. Paling aman untuk project ini:
            Supabase Storage atau Cloudinary.
          </p>
        </div>
        <input
          name="sort_order"
          type="number"
          min="0"
          placeholder="Urutan Tampil"
          className={inputClassName}
          defaultValue={0}
        />
        <textarea
          name="description"
          placeholder="Deskripsi Singkat Produk"
          className={`${inputClassName} min-h-28`}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-3 rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium">
            <input type="checkbox" name="status" defaultChecked className="checkbox-base" />
            Produk Tersedia
          </label>
          <label className="flex items-center gap-3 rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium">
            <input type="checkbox" name="featured" className="checkbox-base" />
            Tampilkan di Homepage
          </label>
        </div>
        <button type="submit" disabled={isPending} className="button-dark">
          {isPending ? "Menyimpan..." : "Simpan Produk"}
        </button>
      </form>
      <AdminFeedbackDialog
        feedback={feedback}
        onClose={() => {
          const shouldRefresh = feedback?.refreshOnClose;
          setFeedback(null);

          if (shouldRefresh) {
            router.refresh();
          }
        }}
      />
    </>
  );
}

function AdminProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave(formData: FormData) {
    setFeedback({
      title: "Mengupdate produk",
      detail: "Mohon tunggu. Data perubahan sedang dikirim ke server.",
      tone: "pending",
    });

    startTransition(async () => {
      const result = await saveProduct(formData);
      setFeedback(mapResultToFeedback(result));
    });
  }

  function handleDelete(formData: FormData) {
    setFeedback({
      title: "Menghapus produk",
      detail: "Mohon tunggu. Produk sedang dihapus dari katalog.",
      tone: "pending",
    });

    startTransition(async () => {
      const result = await deleteProduct(formData);
      setFeedback(mapResultToFeedback(result));
    });
  }

  return (
    <>
      <form
        action={handleSave}
        className="rounded-lg border border-white/10 bg-white p-6 text-zinc-950"
      >
        <input type="hidden" name="id" value={product.id} />
        <div className="grid gap-4 lg:grid-cols-2">
          <input
            name="name"
            defaultValue={product.name}
            className={inputClassName}
            required
          />
          <input
            name="category"
            defaultValue={product.category}
            className={inputClassName}
            required
          />
          <input
            name="price"
            defaultValue={product.price}
            className={inputClassName}
            required
          />
          <input
            name="image_url"
            defaultValue={product.imageUrl}
            className={inputClassName}
          />
          <input
            name="sort_order"
            type="number"
            min="0"
            defaultValue={product.sortOrder}
            className={inputClassName}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-3 rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium">
              <input
                type="checkbox"
                name="status"
                defaultChecked={product.status}
                className="checkbox-base"
              />
              Produk Tersedia
            </label>
            <label className="flex items-center gap-3 rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={product.featured}
                className="checkbox-base"
              />
              Produk Unggulan
            </label>
          </div>
        </div>
        <textarea
          name="description"
          defaultValue={product.description}
          className={`${inputClassName} mt-4 min-h-28`}
        />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button type="submit" disabled={isPending} className="button-dark">
            {isPending ? "Memproses..." : "Update Produk"}
          </button>
          <button
            type="submit"
            formAction={handleDelete}
            disabled={isPending}
            className="button-danger"
          >
            <Trash2 className="h-4 w-4" />
            {isPending ? "Memproses..." : "Hapus Produk"}
          </button>
        </div>
      </form>
      <AdminFeedbackDialog
        feedback={feedback}
        onClose={() => {
          const shouldRefresh = feedback?.refreshOnClose;
          setFeedback(null);

          if (shouldRefresh) {
            router.refresh();
          }
        }}
      />
    </>
  );
}

function AdminFeedbackDialog({
  feedback,
  onClose,
}: {
  feedback: FeedbackState | null;
  onClose: () => void;
}) {
  if (!feedback) {
    return null;
  }

  const icon =
    feedback.tone === "pending" ? (
      <LoaderCircle className="h-8 w-8 animate-spin text-white" />
    ) : feedback.tone === "success" ? (
      <CheckCircle2 className="h-8 w-8 text-emerald-400" />
    ) : (
      <TriangleAlert className="h-8 w-8 text-rose-400" />
    );

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-6 text-white shadow-2xl shadow-black/40">
        <div className="flex items-start gap-4">
          <div className="mt-1 shrink-0">{icon}</div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-semibold">{feedback.title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-300">{feedback.detail}</p>
            {feedback.statusLabel ? (
              <p className="mt-4 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200">
                Status Produk: <span className="font-semibold text-white">{feedback.statusLabel}</span>
              </p>
            ) : null}
          </div>
        </div>
        {feedback.tone !== "pending" ? (
          <div className="mt-6 flex justify-end">
            <button type="button" onClick={onClose} className="button-light">
              Tutup
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function mapResultToFeedback(result: ProductMutationState): FeedbackState {
  return {
    title: result.ok ? "Perubahan berhasil" : "Perubahan gagal",
    detail: result.message,
    tone: result.ok ? "success" : "error",
    statusLabel: result.productStatusLabel,
    refreshOnClose: result.ok,
  };
}
