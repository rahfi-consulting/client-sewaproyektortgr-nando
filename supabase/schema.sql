CREATE EXTENSION if NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  name TEXT NOT NULL,
  description TEXT,
  price TEXT NOT NULL,
  image_url TEXT,
  status BOOLEAN NOT NULL DEFAULT TRUE,
  category TEXT NOT NULL DEFAULT 'General',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  auth_user_id uuid UNIQUE REFERENCES auth.users (id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT admin_users_role_check CHECK (role IN ('admin'))
);

CREATE UNIQUE INDEX if NOT EXISTS admin_users_email_lower_key ON public.admin_users (lower(email));

CREATE OR REPLACE FUNCTION public.set_updated_at () returns trigger language plpgsql AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;

CREATE OR REPLACE FUNCTION public.normalize_admin_user_email () returns trigger language plpgsql AS $$
begin
  new.email = lower(trim(new.email));
  return new;
end;
$$;

CREATE OR REPLACE FUNCTION public.sync_admin_user_auth_id () returns trigger language plpgsql security definer
SET
  search_path = public,
  auth AS $$
begin
  if new.email is null then
    return new;
  end if;

  update public.admin_users
  set
    auth_user_id = new.id,
    email = lower(new.email),
    updated_at = now()
  where auth_user_id = new.id or email = lower(new.email);

  return new;
end;
$$;

DROP TRIGGER if EXISTS products_set_updated_at ON public.products;

CREATE TRIGGER products_set_updated_at before
UPDATE ON public.products FOR each ROW
EXECUTE function public.set_updated_at ();

DROP TRIGGER if EXISTS admin_users_normalize_email ON public.admin_users;

CREATE TRIGGER admin_users_normalize_email before insert
OR
UPDATE ON public.admin_users FOR each ROW
EXECUTE function public.normalize_admin_user_email ();

DROP TRIGGER if EXISTS admin_users_set_updated_at ON public.admin_users;

CREATE TRIGGER admin_users_set_updated_at before
UPDATE ON public.admin_users FOR each ROW
EXECUTE function public.set_updated_at ();

DROP TRIGGER if EXISTS sync_admin_user_auth_id ON auth.users;

CREATE TRIGGER sync_admin_user_auth_id
AFTER insert
OR
UPDATE of email ON auth.users FOR each ROW
EXECUTE function public.sync_admin_user_auth_id ();

ALTER TABLE public.products enable ROW level security;

ALTER TABLE public.admin_users enable ROW level security;

DROP POLICY if EXISTS "Admins can read own access record" ON public.admin_users;

CREATE POLICY "Admins can read own access record" ON public.admin_users FOR
SELECT
  TO authenticated USING (
    is_active = TRUE
    AND email = lower(coalesce(auth.jwt () ->> 'email', ''))
  );

DROP POLICY if EXISTS "Public can read available products" ON public.products;

CREATE POLICY "Public can read available products" ON public.products FOR
SELECT
  TO anon,
  authenticated USING (status = TRUE);

DROP POLICY if EXISTS "Authenticated users can manage all products" ON public.products;

DROP POLICY if EXISTS "Authorized admins can manage all products" ON public.products;

CREATE POLICY "Authorized admins can manage all products" ON public.products FOR ALL TO authenticated USING (
  EXISTS (
    SELECT
      1
    FROM
      public.admin_users admin_user
    WHERE
      admin_user.is_active = TRUE
      AND admin_user.email = lower(coalesce(auth.jwt () ->> 'email', ''))
  )
)
WITH
  CHECK (
    EXISTS (
      SELECT
        1
      FROM
        public.admin_users admin_user
      WHERE
        admin_user.is_active = TRUE
        AND admin_user.email = lower(coalesce(auth.jwt () ->> 'email', ''))
    )
  );

-- Add allowed admin emails manually after running this schema.
-- Example:
-- insert into public.admin_users (email) values ('admin@example.com');
INSERT INTO
  public.products (
    name,
    description,
    price,
    image_url,
    status,
    category,
    featured,
    sort_order
  )
VALUES
  (
    'Proyektor Panasonic 5500 Lumens - Nobar',
    'Paket proyektor untuk nobar dan presentasi singkat selama 3 jam.',
    'Rp 350.000 / 3 jam',
    'https://images.pexels.com/photos/31726719/pexels-photo-31726719.jpeg?auto=compress&cs=tinysrgb&w=1200',
    TRUE,
    'Proyektor',
    TRUE,
    1
  ),
  (
    'Proyektor Panasonic 5500 Lumens - 6 Jam',
    'Pilihan sewa proyektor dengan durasi menengah untuk rapat, seminar, dan kelas.',
    'Rp 650.000 / 6 jam',
    'https://images.pexels.com/photos/31726719/pexels-photo-31726719.jpeg?auto=compress&cs=tinysrgb&w=1200',
    TRUE,
    'Proyektor',
    TRUE,
    2
  ),
  (
    'Proyektor Panasonic 5500 Lumens - 12 Jam',
    'Paket sewa proyektor harian untuk event dan kebutuhan produksi lebih panjang.',
    'Rp 800.000 / 12 jam',
    'https://images.pexels.com/photos/31726719/pexels-photo-31726719.jpeg?auto=compress&cs=tinysrgb&w=1200',
    TRUE,
    'Proyektor',
    TRUE,
    3
  ),
  (
    'Proyektor Panasonic 5500 Lumens - 24 Jam',
    'Durasi penuh 24 jam untuk kebutuhan event satu hari penuh.',
    'Rp 950.000 / 24 jam',
    'https://images.pexels.com/photos/31726719/pexels-photo-31726719.jpeg?auto=compress&cs=tinysrgb&w=1200',
    TRUE,
    'Proyektor',
    TRUE,
    4
  ),
  (
    'Layar Stand 1,7 x 1,7 m',
    'Layar proyektor dengan stand untuk kebutuhan presentasi dan gathering kecil.',
    'Rp 350.000 / 6 jam',
    'https://images.pexels.com/photos/5955016/pexels-photo-5955016.jpeg?auto=compress&cs=tinysrgb&w=1200',
    TRUE,
    'Layar',
    TRUE,
    5
  ),
  (
    'Layar Stand 2,4 x 2,4 m',
    'Layar ukuran lebih besar dengan stand untuk panggung dan ruangan luas.',
    'Rp 650.000 / 6 jam',
    'https://images.pexels.com/photos/5955016/pexels-photo-5955016.jpeg?auto=compress&cs=tinysrgb&w=1200',
    TRUE,
    'Layar',
    TRUE,
    6
  ),
  (
    'Layar Tanpa Stand 2 x 3,5 m',
    'Layar gantung tanpa stand untuk pemasangan pada struktur venue.',
    'Rp 200.000',
    'https://images.pexels.com/photos/5955016/pexels-photo-5955016.jpeg?auto=compress&cs=tinysrgb&w=1200',
    TRUE,
    'Layar',
    FALSE,
    7
  ),
  (
    'Layar Tanpa Stand 3 x 5 m',
    'Layar gantung ukuran besar untuk area tontonan dan acara publik.',
    'Rp 300.000',
    'https://images.pexels.com/photos/5955016/pexels-photo-5955016.jpeg?auto=compress&cs=tinysrgb&w=1200',
    TRUE,
    'Layar',
    FALSE,
    8
  ),
  (
    'Speaker Kecil',
    'Speaker ringkas untuk ruangan kecil dan presentasi internal.',
    'Rp 150.000 / 6 jam',
    'https://images.pexels.com/photos/1034651/pexels-photo-1034651.jpeg?auto=compress&cs=tinysrgb&w=1200',
    TRUE,
    'Audio',
    FALSE,
    9
  ),
  (
    'Single Speaker + 2 Mic',
    'Paket audio praktis untuk MC, rapat, dan acara komunitas.',
    'Rp 450.000 / 6 jam',
    'https://images.pexels.com/photos/1034651/pexels-photo-1034651.jpeg?auto=compress&cs=tinysrgb&w=1200',
    TRUE,
    'Audio',
    FALSE,
    10
  ),
  (
    'Double Speaker + 2 Mic',
    'Paket audio untuk area lebih luas dengan distribusi suara lebih merata.',
    'Rp 800.000 / 6 jam',
    'https://images.pexels.com/photos/1034651/pexels-photo-1034651.jpeg?auto=compress&cs=tinysrgb&w=1200',
    TRUE,
    'Audio',
    FALSE,
    11
  ),
  (
    'Stand Proyektor',
    'Tambahan stand untuk kebutuhan setup proyektor yang lebih stabil.',
    'Rp 100.000',
    'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1200',
    TRUE,
    'Perlengkapan',
    FALSE,
    12
  ),
  (
    'Pointer Laser',
    'Perangkat bantu presentasi untuk pengarah materi di layar.',
    'Rp 100.000',
    'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1200',
    TRUE,
    'Perlengkapan',
    FALSE,
    13
  ),
  (
    'Wireless Type-C to HDMI',
    'Konektor nirkabel untuk presentasi langsung dari perangkat Type-C.',
    'Rp 150.000',
    'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1200',
    TRUE,
    'Perlengkapan',
    FALSE,
    14
  ),
  (
    'Wireless HDMI / USB',
    'Aksesori wireless untuk koneksi layar yang lebih fleksibel.',
    'Rp 250.000',
    'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1200',
    TRUE,
    'Perlengkapan',
    FALSE,
    15
  ),
  (
    'Kabel Roll 10 m',
    'Tambahan distribusi daya untuk venue dengan titik listrik terbatas.',
    'Rp 50.000 / 6 jam',
    'https://images.pexels.com/photos/4219862/pexels-photo-4219862.jpeg?auto=compress&cs=tinysrgb&w=1200',
    TRUE,
    'Kabel',
    FALSE,
    16
  ),
  (
    'Kabel Roll 20 m',
    'Ekstensi kabel untuk setup panggung dan area sedang.',
    'Rp 75.000 / 6 jam',
    'https://images.pexels.com/photos/4219862/pexels-photo-4219862.jpeg?auto=compress&cs=tinysrgb&w=1200',
    TRUE,
    'Kabel',
    FALSE,
    17
  ),
  (
    'Kabel Roll 30 m',
    'Pilihan kabel terpanjang untuk venue besar dan area outdoor terbatas daya.',
    'Rp 100.000 / 6 jam',
    'https://images.pexels.com/photos/4219862/pexels-photo-4219862.jpeg?auto=compress&cs=tinysrgb&w=1200',
    TRUE,
    'Kabel',
    FALSE,
    18
  ),
  (
    'HT (Walkie Talkie) - 2 Unit',
    'Perangkat komunikasi lapangan untuk koordinasi kru selama 12 jam.',
    'Rp 150.000 / 12 jam',
    'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1200',
    TRUE,
    'Komunikasi',
    FALSE,
    19
  )
ON CONFLICT DO NOTHING;