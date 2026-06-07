import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/supabase/env";

type AdminUserRecord = {
  id: string;
  auth_user_id: string | null;
  email: string;
  role: "admin";
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export async function createSupabaseServerClient() {
  const { url, anonKey } = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot always mutate cookies. Middleware handles refresh.
        }
      },
    },
  });
}

export async function getAuthenticatedUser() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getAuthenticatedAdminContext(): Promise<{
  user: Awaited<ReturnType<typeof getAuthenticatedUser>>;
  adminUser: AdminUserRecord | null;
}> {
  const user = await getAuthenticatedUser();

  if (!user?.email) {
    return {
      user,
      adminUser: null,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("admin_users")
    .select("id, auth_user_id, email, role, is_active, created_at, updated_at")
    .ilike("email", user.email)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return {
    user,
    adminUser: data as AdminUserRecord | null,
  };
}

export async function requireAuthenticatedUser() {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

export async function requireAdminUser() {
  const { user, adminUser } = await getAuthenticatedAdminContext();

  if (!user || !adminUser) {
    throw new Error("Unauthorized");
  }

  return {
    user,
    adminUser,
  };
}
