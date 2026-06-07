import { deleteProduct, saveProduct } from "@/app/actions";
import { AdminLogin } from "@/components/admin-login";
import { SignOutButton } from "@/components/sign-out-button";
import { SubmitButton } from "@/components/submit-button";
import { getProducts } from "@/lib/products";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getAuthenticatedUser } from "@/lib/supabase/server";

const inputClassName = "field-base";

export default async function AdminPage() {
  const configured = isSupabaseConfigured();

  if (!configured) {
    return (
      <div className="min-h-screen bg-zinc-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-lg border border-white/10 bg-white/5 p-8">
          <span className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-400">
            Admin Setup
          </span>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Supabase belum dikonfigurasi.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">
            Isi file <code>.env.local</code> berdasarkan <code>.env.example</code>,
            lalu jalankan SQL yang saya sediakan ke project Supabase Anda.
          </p>
        </div>
      </div>
    );
  }

  const user = await getAuthenticatedUser();

  if (!user) {
    return <AdminLogin />;
  }

  const products = await getProducts({
    includeUnavailable: true,
    fallbackToDefault: false,
  });

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 rounded-lg border border-white/10 bg-white/5 p-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-400">
              Private Dashboard
            </span>
            <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
              Kelola katalog produk
            </h1>
            <p className="mt-3 text-sm leading-6 text-zinc-300 sm:text-base">
              Login sebagai <span className="font-medium text-white">{user.email}</span>
            </p>
          </div>
          <SignOutButton />
        </div>

        <div className="grid gap-8 xl:grid-cols-[360px_1fr]">
          <section className="rounded-lg border border-white/10 bg-white p-6 text-zinc-950">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Tambah produk</h2>
              <p className="text-sm leading-6 text-zinc-600">
                Gunakan form ini untuk menambahkan item baru ke tabel
                <code className="ml-1 rounded bg-zinc-100 px-1.5 py-0.5 text-xs">
                  products
                </code>
                .
              </p>
            </div>

            <form action={saveProduct} className="mt-6 space-y-4">
              <input name="name" placeholder="Nama produk" className={inputClassName} required />
              <input
                name="category"
                placeholder="Kategori, mis. Proyektor"
                className={inputClassName}
                defaultValue="General"
                required
              />
              <input
                name="price"
                placeholder="Harga, mis. Rp 350.000 / 3 jam"
                className={inputClassName}
                required
              />
              <input
                name="image_url"
                placeholder="URL gambar produk"
                className={inputClassName}
              />
              <input
                name="sort_order"
                type="number"
                min="0"
                placeholder="Urutan tampil"
                className={inputClassName}
                defaultValue={0}
              />
              <textarea
                name="description"
                placeholder="Deskripsi singkat produk"
                className={`${inputClassName} min-h-28`}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-3 rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium">
                  <input type="checkbox" name="status" defaultChecked className="checkbox-base" />
                  Produk tersedia
                </label>
                <label className="flex items-center gap-3 rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium">
                  <input type="checkbox" name="featured" className="checkbox-base" />
                  Tampilkan di homepage
                </label>
              </div>
              <SubmitButton label="Simpan produk" pendingLabel="Menyimpan..." />
            </form>
          </section>

          <section className="space-y-4">
            <div className="rounded-lg border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-semibold">Daftar produk</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                Semua item dapat diedit langsung. Produk yang dinonaktifkan akan
                tetap terlihat di dashboard, tetapi tidak tampil di halaman publik.
              </p>
            </div>

            {products.length === 0 ? (
              <div className="rounded-lg border border-dashed border-white/15 bg-white/5 p-8 text-sm text-zinc-300">
                Tabel produk masih kosong. Jalankan file SQL seed, lalu refresh halaman ini.
              </div>
            ) : (
              <div className="grid gap-4">
                {products.map((product) => (
                  <form
                    key={product.id}
                    action={saveProduct}
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
                          Produk tersedia
                        </label>
                        <label className="flex items-center gap-3 rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium">
                          <input
                            type="checkbox"
                            name="featured"
                            defaultChecked={product.featured}
                            className="checkbox-base"
                          />
                          Produk unggulan
                        </label>
                      </div>
                    </div>
                    <textarea
                      name="description"
                      defaultValue={product.description}
                      className={`${inputClassName} mt-4 min-h-28`}
                    />
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <SubmitButton label="Update produk" pendingLabel="Mengupdate..." />
                      <button
                        type="submit"
                        formAction={deleteProduct.bind(null, product.id)}
                        className="button-danger"
                      >
                        Hapus produk
                      </button>
                    </div>
                  </form>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
