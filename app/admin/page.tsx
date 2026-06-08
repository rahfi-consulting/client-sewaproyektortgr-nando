import { AdminLogin } from "@/components/admin-login";
import { AdminDashboard } from "@/components/admin-dashboard";
import { SignOutButton } from "@/components/sign-out-button";
import { getProducts } from "@/lib/products";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getAuthenticatedAdminContext } from "@/lib/supabase/server";

export default async function AdminPage() {
  const configured = isSupabaseConfigured();

  if (!configured) {
    return (
      <div className="min-h-screen bg-zinc-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-lg border border-white/10 bg-white/5 p-8">
          <span className="text-sm font-bold uppercase tracking-[0.1em] text-zinc-400">
            Admin Setup
          </span>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Database is Not Configured
          </h1>
          <p className="mt-4 max-w-2xl text-justify leading-7 text-zinc-300">
            Fill the <b>Environment Variables</b> in your deployments or if in local development, the <code>.env.local</code> file based on the <code>.env.example</code> file,
            then run the SQL script provided on your <b>Supabase</b> project.
          </p>
        </div>
      </div>
    );
  }

  const { user, adminUser } = await getAuthenticatedAdminContext();

  if (!user) {
    return <AdminLogin />;
  }

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-zinc-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-lg border border-white/10 bg-white/5 p-8">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-400">
            Access Restricted
          </span>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Email this hasn&apos;t been registered as an admin.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">
            Add this email to the <code>public.admin_users</code> table in Supabase,
            then log in again to access the dashboard.
          </p>
          <div className="mt-6">
            <SignOutButton />
          </div>
        </div>
      </div>
    );
  }

  const products = await getProducts({
    includeUnavailable: true,
  });

  return <AdminDashboard products={products} userEmail={user.email || ""} />;
}
