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
-- INSERT INTO public.admin_users (email) VALUES ('admin@example.com');
-- Product catalog starts empty by default.
-- Add products manually from the admin dashboard after setup.