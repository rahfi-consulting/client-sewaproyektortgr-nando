create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price text not null,
  image_url text,
  status boolean not null default true,
  category text not null default 'General',
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

alter table public.products enable row level security;

drop policy if exists "Public can read available products" on public.products;
create policy "Public can read available products"
on public.products
for select
to anon, authenticated
using (status = true);

drop policy if exists "Authenticated users can manage all products" on public.products;
create policy "Authenticated users can manage all products"
on public.products
for all
to authenticated
using (true)
with check (true);

insert into public.products (
  name,
  description,
  price,
  image_url,
  status,
  category,
  featured,
  sort_order
)
values
  (
    'Proyektor Panasonic 5500 Lumens - Nobar',
    'Paket proyektor untuk nobar dan presentasi singkat selama 3 jam.',
    'Rp 350.000 / 3 jam',
    'https://images.pexels.com/photos/31726719/pexels-photo-31726719.jpeg?auto=compress&cs=tinysrgb&w=1200',
    true,
    'Proyektor',
    true,
    1
  ),
  (
    'Proyektor Panasonic 5500 Lumens - 6 Jam',
    'Pilihan sewa proyektor dengan durasi menengah untuk rapat, seminar, dan kelas.',
    'Rp 650.000 / 6 jam',
    'https://images.pexels.com/photos/31726719/pexels-photo-31726719.jpeg?auto=compress&cs=tinysrgb&w=1200',
    true,
    'Proyektor',
    true,
    2
  ),
  (
    'Proyektor Panasonic 5500 Lumens - 12 Jam',
    'Paket sewa proyektor harian untuk event dan kebutuhan produksi lebih panjang.',
    'Rp 800.000 / 12 jam',
    'https://images.pexels.com/photos/31726719/pexels-photo-31726719.jpeg?auto=compress&cs=tinysrgb&w=1200',
    true,
    'Proyektor',
    true,
    3
  ),
  (
    'Proyektor Panasonic 5500 Lumens - 24 Jam',
    'Durasi penuh 24 jam untuk kebutuhan event satu hari penuh.',
    'Rp 950.000 / 24 jam',
    'https://images.pexels.com/photos/31726719/pexels-photo-31726719.jpeg?auto=compress&cs=tinysrgb&w=1200',
    true,
    'Proyektor',
    true,
    4
  ),
  (
    'Layar Stand 1,7 x 1,7 m',
    'Layar proyektor dengan stand untuk kebutuhan presentasi dan gathering kecil.',
    'Rp 350.000 / 6 jam',
    'https://images.pexels.com/photos/5955016/pexels-photo-5955016.jpeg?auto=compress&cs=tinysrgb&w=1200',
    true,
    'Layar',
    true,
    5
  ),
  (
    'Layar Stand 2,4 x 2,4 m',
    'Layar ukuran lebih besar dengan stand untuk panggung dan ruangan luas.',
    'Rp 650.000 / 6 jam',
    'https://images.pexels.com/photos/5955016/pexels-photo-5955016.jpeg?auto=compress&cs=tinysrgb&w=1200',
    true,
    'Layar',
    true,
    6
  ),
  (
    'Layar Tanpa Stand 2 x 3,5 m',
    'Layar gantung tanpa stand untuk pemasangan pada struktur venue.',
    'Rp 200.000',
    'https://images.pexels.com/photos/5955016/pexels-photo-5955016.jpeg?auto=compress&cs=tinysrgb&w=1200',
    true,
    'Layar',
    false,
    7
  ),
  (
    'Layar Tanpa Stand 3 x 5 m',
    'Layar gantung ukuran besar untuk area tontonan dan acara publik.',
    'Rp 300.000',
    'https://images.pexels.com/photos/5955016/pexels-photo-5955016.jpeg?auto=compress&cs=tinysrgb&w=1200',
    true,
    'Layar',
    false,
    8
  ),
  (
    'Speaker Kecil',
    'Speaker ringkas untuk ruangan kecil dan presentasi internal.',
    'Rp 150.000 / 6 jam',
    'https://images.pexels.com/photos/1034651/pexels-photo-1034651.jpeg?auto=compress&cs=tinysrgb&w=1200',
    true,
    'Audio',
    false,
    9
  ),
  (
    'Single Speaker + 2 Mic',
    'Paket audio praktis untuk MC, rapat, dan acara komunitas.',
    'Rp 450.000 / 6 jam',
    'https://images.pexels.com/photos/1034651/pexels-photo-1034651.jpeg?auto=compress&cs=tinysrgb&w=1200',
    true,
    'Audio',
    false,
    10
  ),
  (
    'Double Speaker + 2 Mic',
    'Paket audio untuk area lebih luas dengan distribusi suara lebih merata.',
    'Rp 800.000 / 6 jam',
    'https://images.pexels.com/photos/1034651/pexels-photo-1034651.jpeg?auto=compress&cs=tinysrgb&w=1200',
    true,
    'Audio',
    false,
    11
  ),
  (
    'Stand Proyektor',
    'Tambahan stand untuk kebutuhan setup proyektor yang lebih stabil.',
    'Rp 100.000',
    'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1200',
    true,
    'Perlengkapan',
    false,
    12
  ),
  (
    'Pointer Laser',
    'Perangkat bantu presentasi untuk pengarah materi di layar.',
    'Rp 100.000',
    'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1200',
    true,
    'Perlengkapan',
    false,
    13
  ),
  (
    'Wireless Type-C to HDMI',
    'Konektor nirkabel untuk presentasi langsung dari perangkat Type-C.',
    'Rp 150.000',
    'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1200',
    true,
    'Perlengkapan',
    false,
    14
  ),
  (
    'Wireless HDMI / USB',
    'Aksesori wireless untuk koneksi layar yang lebih fleksibel.',
    'Rp 250.000',
    'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1200',
    true,
    'Perlengkapan',
    false,
    15
  ),
  (
    'Kabel Roll 10 m',
    'Tambahan distribusi daya untuk venue dengan titik listrik terbatas.',
    'Rp 50.000 / 6 jam',
    'https://images.pexels.com/photos/4219862/pexels-photo-4219862.jpeg?auto=compress&cs=tinysrgb&w=1200',
    true,
    'Kabel',
    false,
    16
  ),
  (
    'Kabel Roll 20 m',
    'Ekstensi kabel untuk setup panggung dan area sedang.',
    'Rp 75.000 / 6 jam',
    'https://images.pexels.com/photos/4219862/pexels-photo-4219862.jpeg?auto=compress&cs=tinysrgb&w=1200',
    true,
    'Kabel',
    false,
    17
  ),
  (
    'Kabel Roll 30 m',
    'Pilihan kabel terpanjang untuk venue besar dan area outdoor terbatas daya.',
    'Rp 100.000 / 6 jam',
    'https://images.pexels.com/photos/4219862/pexels-photo-4219862.jpeg?auto=compress&cs=tinysrgb&w=1200',
    true,
    'Kabel',
    false,
    18
  ),
  (
    'HT (Walkie Talkie) - 2 Unit',
    'Perangkat komunikasi lapangan untuk koordinasi kru selama 12 jam.',
    'Rp 150.000 / 12 jam',
    'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1200',
    true,
    'Komunikasi',
    false,
    19
  )
on conflict do nothing;
