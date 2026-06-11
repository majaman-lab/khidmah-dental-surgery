import type { Metadata } from "next";
import { LockKeyhole } from "lucide-react";

import { loginAdmin } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Admin Login | Khidmah Dental Surgery",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-12">
      <form action={loginAdmin} className="w-full max-w-md rounded-lg border border-border bg-white p-6 shadow-soft sm:p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <LockKeyhole className="h-6 w-6" aria-hidden="true" />
        </span>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-primary">Secure Admin</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal">Khidmah Dental Surgery</h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          Sign in to manage appointments, content, services, gallery, blog posts, and SEO.
        </p>

        {params.error ? (
          <div className="mt-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
            {params.error}
          </div>
        ) : null}

        <input type="hidden" name="next" value={params.next || "/admin"} />

        <label className="mt-6 grid gap-2">
          <span className="text-sm font-bold">Email</span>
          <input
            name="email"
            type="email"
            defaultValue="admin@khidmahdental.com"
            autoComplete="email"
            required
            className="h-12 rounded-md border border-border bg-background px-4 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>

        <label className="mt-4 grid gap-2">
          <span className="text-sm font-bold">Password</span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="h-12 rounded-md border border-border bg-background px-4 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>

        <Button type="submit" size="lg" className="mt-6 w-full">
          Login
        </Button>

        <p className="mt-4 text-xs leading-6 text-muted-foreground">
          Default account: admin@khidmahdental.com. Change the password after first login.
        </p>
      </form>
    </main>
  );
}
