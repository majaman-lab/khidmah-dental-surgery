import type { Metadata } from "next";
import Link from "next/link";
import {
  BarChart3,
  FileText,
  GalleryHorizontal,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";

import {
  changePassword,
  deleteRow,
  logoutAdmin,
  updateAppointmentStatus,
  updateDoctorProfile,
  updateHomepageSection,
  updateSeo,
  updateSiteSettings,
  uploadMedia,
  upsertBlogPost,
  upsertDoctorCredential,
  upsertDoctorExperience,
  upsertFaq,
  upsertGalleryImage,
  upsertService,
} from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard | Khidmah Dental Surgery",
  robots: { index: false, follow: false },
};

const tabs = [
  ["dashboard", "Overview", LayoutDashboard],
  ["content", "Homepage", Settings],
  ["doctor", "Doctor", UserRound],
  ["gallery", "Gallery", GalleryHorizontal],
  ["services", "Services", Stethoscope],
  ["appointments", "Appointments", BarChart3],
  ["blog", "Blog", FileText],
  ["faq", "FAQ", ShieldCheck],
  ["seo", "SEO", Search],
  ["media", "Media", ImageIcon],
  ["account", "Account", ShieldCheck],
] as const;

type AdminSearchParams = {
  tab?: string;
  success?: string;
  error?: string;
  q?: string;
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  const missingEnv = (
    [
      ["NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL],
      ["NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY],
    ] as const
  )
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingEnv.length > 0) {
    return <AdminSetupRequired missingEnv={missingEnv} />;
  }

  const params = await searchParams;
  const activeTab = params.tab || "dashboard";
  const { supabase, user } = await requireAdmin();

  const [
    appointmentsResult,
    blogsResult,
    galleryResult,
    sectionsResult,
    contactResult,
    doctorResult,
    credentialsResult,
    experienceResult,
    servicesResult,
    faqsResult,
    seoResult,
    mediaResult,
  ] = await Promise.all([
    supabase.from("appointments").select("*").order("created_at", { ascending: false }),
    supabase.from("blog_posts").select("*").order("updated_at", { ascending: false }),
    supabase.from("gallery_images").select("*").order("sort_order", { ascending: true }),
    supabase.from("homepage_sections").select("*").order("sort_order", { ascending: true }),
    supabase.from("site_settings").select("*").eq("key", "contact").maybeSingle(),
    supabase.from("doctor_profile").select("*").eq("id", 1).maybeSingle(),
    supabase.from("doctor_credentials").select("*").order("sort_order", { ascending: true }),
    supabase.from("doctor_experiences").select("*").order("sort_order", { ascending: true }),
    supabase.from("services").select("*").order("sort_order", { ascending: true }),
    supabase.from("faqs").select("*").order("sort_order", { ascending: true }),
    supabase.from("seo_settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("media_assets").select("*").order("created_at", { ascending: false }),
  ]);

  const appointments = appointmentsResult.data || [];
  const blogPosts = blogsResult.data || [];
  const galleryImages = galleryResult.data || [];
  const homepageSections = sectionsResult.data || [];
  const contact = (contactResult.data?.value || {}) as Record<string, string>;
  const doctor = doctorResult.data;
  const credentials = credentialsResult.data || [];
  const experiences = experienceResult.data || [];
  const services = servicesResult.data || [];
  const faqs = faqsResult.data || [];
  const seo = seoResult.data;
  const media = mediaResult.data || [];

  const query = (params.q || "").toLowerCase();
  const filteredAppointments = appointments.filter((appointment) =>
    [appointment.patient_name, appointment.mobile_number, appointment.service_needed, appointment.status]
      .join(" ")
      .toLowerCase()
      .includes(query),
  );

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur-xl">
        <div className="section-shell flex h-20 items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Admin Dashboard</p>
            <h1 className="text-xl font-bold">Khidmah Dental Surgery</h1>
          </div>
          <form action={logoutAdmin}>
            <Button type="submit" variant="outline">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Logout
            </Button>
          </form>
        </div>
      </header>

      <div className="section-shell grid gap-6 py-8 lg:grid-cols-[16rem_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav className="grid gap-2 rounded-lg border border-border bg-white p-3 shadow-sm">
            {tabs.map(([id, label, Icon]) => (
              <Link
                key={id}
                href={`/admin?tab=${id}`}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold transition ${
                  activeTab === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="grid gap-6">
          {params.success ? <Notice type="success" text={params.success} /> : null}
          {params.error ? <Notice type="error" text={params.error} /> : null}

          {activeTab === "dashboard" ? (
            <DashboardOverview
              appointments={appointments}
              blogPosts={blogPosts}
              galleryImages={galleryImages}
              userEmail={user.email || ""}
            />
          ) : null}

          {activeTab === "content" ? (
            <ContentPanel sections={homepageSections} contact={contact} />
          ) : null}

          {activeTab === "doctor" ? (
            <DoctorPanel doctor={doctor} credentials={credentials} experiences={experiences} />
          ) : null}

          {activeTab === "gallery" ? <GalleryPanel images={galleryImages} /> : null}

          {activeTab === "services" ? <ServicesPanel services={services} /> : null}

          {activeTab === "appointments" ? (
            <AppointmentsPanel appointments={filteredAppointments} query={params.q || ""} />
          ) : null}

          {activeTab === "blog" ? <BlogPanel posts={blogPosts} media={media} /> : null}

          {activeTab === "faq" ? <FaqPanel faqs={faqs} /> : null}

          {activeTab === "seo" ? <SeoPanel seo={seo} /> : null}

          {activeTab === "media" ? <MediaPanel media={media} /> : null}

          {activeTab === "account" ? <AccountPanel email={user.email || ""} /> : null}
        </section>
      </div>
    </main>
  );
}

function AdminSetupRequired({ missingEnv }: { missingEnv: string[] }) {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-12">
      <section className="w-full max-w-2xl rounded-lg border border-border bg-white p-6 shadow-soft sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Admin Setup</p>
        <h1 className="mt-3 text-3xl font-bold tracking-normal">Supabase configuration required</h1>
        <p className="mt-4 leading-8 text-muted-foreground">
          The admin dashboard is installed, but it cannot authenticate or load database content
          until Supabase environment variables are added in Vercel and the project is redeployed.
        </p>
        <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-bold">Missing variables</p>
          <p className="mt-2">{missingEnv.join(", ")}</p>
        </div>
        <Button asChild className="mt-6">
          <Link href="/admin/login">Back to login</Link>
        </Button>
      </section>
    </main>
  );
}

function Notice({ type, text }: { type: "success" | "error"; text: string }) {
  return (
    <div
      className={`rounded-lg border p-4 text-sm font-semibold ${
        type === "success" ? "border-primary/20 bg-accent/40 text-primary" : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {text}
    </div>
  );
}

function DashboardOverview({
  appointments,
  blogPosts,
  galleryImages,
  userEmail,
}: {
  appointments: any[];
  blogPosts: any[];
  galleryImages: any[];
  userEmail: string;
}) {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Appointments" value={appointments.length} />
        <StatCard label="Total Blog Posts" value={blogPosts.length} />
        <StatCard label="Gallery Images" value={galleryImages.length} />
      </div>
      <Panel title="Recent appointments" description={`Signed in as ${userEmail}`}>
        <div className="grid gap-3">
          {appointments.slice(0, 6).map((appointment) => (
            <div key={appointment.id} className="grid gap-2 rounded-lg border border-border bg-background p-4 sm:grid-cols-[1fr_auto]">
              <div>
                <p className="font-bold">{appointment.patient_name}</p>
                <p className="text-sm text-muted-foreground">
                  {appointment.service_needed} · {appointment.preferred_date} · {appointment.preferred_time}
                </p>
              </div>
              <Badge>{appointment.status}</Badge>
            </div>
          ))}
          {appointments.length === 0 ? <EmptyState text="No appointments yet." /> : null}
        </div>
      </Panel>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold text-primary">{value}</p>
    </div>
  );
}

function ContentPanel({ sections, contact }: { sections: any[]; contact: Record<string, string> }) {
  return (
    <div className="grid gap-6">
      <Panel title="Homepage sections" description="Edit hero, services, doctor, why choose, gallery, FAQ, and contact copy.">
        <div className="grid gap-4">
          {sections.map((section) => (
            <form key={section.id} action={updateHomepageSection} className="grid gap-3 rounded-lg border border-border bg-background p-4">
              <input type="hidden" name="section_key" defaultValue={section.section_key} />
              <input type="hidden" name="sort_order" defaultValue={section.sort_order} />
              <Field name="title" label={`${section.section_key} title`} defaultValue={section.title} />
              <Textarea name="description" label="Description" defaultValue={section.description} />
              <Textarea name="body" label="Body" defaultValue={section.content?.body || ""} />
              <Button type="submit" className="w-fit">Save section</Button>
            </form>
          ))}
        </div>
      </Panel>

      <Panel title="Contact information" description="Update phone, WhatsApp, address, email, social, and map embed.">
        <form action={updateSiteSettings} className="grid gap-4 sm:grid-cols-2">
          <Field name="phone" label="Phone" defaultValue={contact.phone} />
          <Field name="email" label="Email" defaultValue={contact.email} />
          <Field name="facebookUrl" label="Facebook URL" defaultValue={contact.facebookUrl} />
          <Field name="whatsappNumber" label="WhatsApp Number" defaultValue={contact.whatsappNumber} />
          <Textarea name="address" label="Chamber Address" defaultValue={contact.address} className="sm:col-span-2" />
          <Field name="mapUrl" label="Google Map URL" defaultValue={contact.mapUrl} className="sm:col-span-2" />
          <Field name="mapEmbedUrl" label="Google Map Embed URL" defaultValue={contact.mapEmbedUrl} className="sm:col-span-2" />
          <Button type="submit" className="w-fit sm:col-span-2">Save contact</Button>
        </form>
      </Panel>
    </div>
  );
}

function DoctorPanel({ doctor, credentials, experiences }: { doctor: any; credentials: any[]; experiences: any[] }) {
  return (
    <div className="grid gap-6">
      <Panel title="Doctor profile" description="Manage profile identity, introduction, registration, and photo URL.">
        <form action={updateDoctorProfile} className="grid gap-4 sm:grid-cols-2">
          <Field name="name" label="Doctor Name" defaultValue={doctor?.name} />
          <Field name="designation" label="Designation" defaultValue={doctor?.designation} />
          <Field name="bmdc_registration" label="BMDC Registration" defaultValue={doctor?.bmdc_registration} />
          <Field name="photo_url" label="Doctor Photo URL" defaultValue={doctor?.photo_url} />
          <Textarea name="introduction" label="Doctor Introduction" defaultValue={doctor?.introduction} className="sm:col-span-2" />
          <Button type="submit" className="w-fit sm:col-span-2">Save doctor</Button>
        </form>
      </Panel>
      <EditableListPanel title="Clinical Credentials" tab="doctor" table="doctor_credentials" items={credentials} action={upsertDoctorCredential} fields={["label", "title", "description", "sort_order"]} />
      <EditableListPanel title="Professional Experience" tab="doctor" table="doctor_experiences" items={experiences} action={upsertDoctorExperience} fields={["role", "organization", "sort_order"]} />
    </div>
  );
}

function GalleryPanel({ images }: { images: any[] }) {
  return (
    <EditableListPanel
      title="Gallery images"
      tab="gallery"
      table="gallery_images"
      items={images}
      action={upsertGalleryImage}
      fields={["src", "alt", "caption", "category", "width", "height", "sort_order"]}
    />
  );
}

function ServicesPanel({ services }: { services: any[] }) {
  return (
    <EditableListPanel
      title="Services"
      tab="services"
      table="services"
      items={services}
      action={upsertService}
      fields={["title", "slug", "description", "icon", "sort_order", "is_active"]}
    />
  );
}

function AppointmentsPanel({ appointments, query }: { appointments: any[]; query: string }) {
  return (
    <Panel title="Appointments" description="Search, update status, delete, and export appointment requests.">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <form className="flex flex-1 gap-2">
          <input type="hidden" name="tab" value="appointments" />
          <input
            name="q"
            defaultValue={query}
            placeholder="Search appointments"
            className="h-11 flex-1 rounded-md border border-border bg-background px-4 text-sm outline-none focus:border-primary"
          />
          <Button type="submit" variant="outline">Search</Button>
        </form>
        <Button asChild>
          <Link href="/admin/appointments/export">Export CSV</Link>
        </Button>
      </div>
      <div className="grid gap-3">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="grid gap-3 rounded-lg border border-border bg-background p-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
            <div>
              <p className="font-bold">{appointment.patient_name}</p>
              <p className="text-sm leading-6 text-muted-foreground">
                {appointment.mobile_number} · {appointment.service_needed} · {appointment.preferred_date} · {appointment.preferred_time}
              </p>
              {appointment.message ? <p className="mt-1 text-sm text-muted-foreground">{appointment.message}</p> : null}
            </div>
            <form action={updateAppointmentStatus} className="flex gap-2">
              <input type="hidden" name="id" value={appointment.id} />
              <select name="status" defaultValue={appointment.status} className="h-10 rounded-md border border-border bg-white px-3 text-sm">
                {["Pending", "Confirmed", "Completed", "Cancelled"].map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <Button type="submit" variant="outline">Update</Button>
            </form>
            <DeleteButton table="appointments" id={appointment.id} tab="appointments" />
          </div>
        ))}
      </div>
    </Panel>
  );
}

function BlogPanel({ posts, media }: { posts: any[]; media: any[] }) {
  return (
    <EditableListPanel
      title="Blog posts"
      tab="blog"
      table="blog_posts"
      items={posts}
      action={upsertBlogPost}
      fields={["title", "slug", "category", "excerpt", "content", "featured_image", "seo_title", "seo_description", "status"]}
      media={media}
    />
  );
}

function FaqPanel({ faqs }: { faqs: any[] }) {
  return <EditableListPanel title="FAQs" tab="faq" table="faqs" items={faqs} action={upsertFaq} fields={["question", "answer", "sort_order"]} />;
}

function SeoPanel({ seo }: { seo: any }) {
  return (
    <Panel title="SEO settings" description="Manage homepage metadata and Open Graph image. Sitemap is generated by Next.js at /sitemap.xml.">
      <form action={updateSeo} className="grid gap-4">
        <Field name="homepage_meta_title" label="Homepage Meta Title" defaultValue={seo?.homepage_meta_title} />
        <Textarea name="homepage_meta_description" label="Homepage Meta Description" defaultValue={seo?.homepage_meta_description} />
        <Field name="open_graph_image" label="Open Graph Image URL" defaultValue={seo?.open_graph_image} />
        <Button type="submit" className="w-fit">Save SEO</Button>
      </form>
    </Panel>
  );
}

function MediaPanel({ media }: { media: any[] }) {
  return (
    <Panel title="Media library" description="Upload reusable images into the Supabase Storage media bucket.">
      <form action={uploadMedia} className="mb-6 grid gap-4 rounded-lg border border-border bg-background p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <label className="grid gap-2">
          <span className="text-sm font-bold">Image file</span>
          <input name="file" type="file" accept="image/*" required className="text-sm" />
        </label>
        <Field name="alt" label="Alt text" />
        <Button type="submit">Upload</Button>
      </form>
      <div className="grid gap-3 md:grid-cols-2">
        {media.map((asset) => (
          <div key={asset.id} className="rounded-lg border border-border bg-background p-4">
            <p className="break-all text-sm font-bold">{asset.filename}</p>
            <p className="mt-2 break-all text-xs text-muted-foreground">{asset.url}</p>
            <div className="mt-3">
              <DeleteButton table="media_assets" id={asset.id} tab="media" />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function AccountPanel({ email }: { email: string }) {
  return (
    <Panel title="Account" description={`Logged in as ${email}`}>
      <form action={changePassword} className="grid max-w-md gap-4">
        <Field name="password" label="New Password" type="password" />
        <Button type="submit" className="w-fit">Change password</Button>
      </form>
    </Panel>
  );
}

function EditableListPanel({
  title,
  tab,
  table,
  items,
  action,
  fields,
  media,
}: {
  title: string;
  tab: string;
  table: string;
  items: any[];
  action: (formData: FormData) => Promise<void>;
  fields: string[];
  media?: any[];
}) {
  return (
    <Panel title={title} description="Add, edit, delete, and reorder records. Lower sort numbers appear first.">
      <div className="grid gap-4">
        {[{}, ...items].map((item, index) => (
          <form key={item.id || "new"} action={action} className="grid gap-3 rounded-lg border border-border bg-background p-4">
            <input type="hidden" name="id" defaultValue={item.id || ""} />
            <div className="grid gap-3 sm:grid-cols-2">
              {fields.map((field) =>
                field === "content" || field === "description" || field === "excerpt" || field === "answer" ? (
                  <Textarea key={field} name={field} label={labelize(field)} defaultValue={item[field] || ""} />
                ) : field === "is_active" ? (
                  <label key={field} className="flex items-center gap-2 text-sm font-bold">
                    <input type="checkbox" name={field} defaultChecked={item[field] ?? true} />
                    Active
                  </label>
                ) : field === "status" ? (
                  <label key={field} className="grid gap-2">
                    <span className="text-sm font-bold">Status</span>
                    <select name="status" defaultValue={item.status || "Draft"} className="h-11 rounded-md border border-border bg-white px-3 text-sm">
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                    </select>
                  </label>
                ) : field === "category" && table === "gallery_images" ? (
                  <label key={field} className="grid gap-2">
                    <span className="text-sm font-bold">Category</span>
                    <select name="category" defaultValue={item.category || "Chamber"} className="h-11 rounded-md border border-border bg-white px-3 text-sm">
                      <option value="Chamber">Chamber</option>
                      <option value="Equipment">Equipment</option>
                      <option value="Exterior">Exterior</option>
                    </select>
                  </label>
                ) : field === "featured_image" && media?.length ? (
                  <label key={field} className="grid gap-2">
                    <span className="text-sm font-bold">Featured image</span>
                    <select name={field} defaultValue={item[field] || ""} className="h-11 rounded-md border border-border bg-white px-3 text-sm">
                      <option value="">No image</option>
                      {media.map((asset) => (
                        <option key={asset.id} value={asset.url}>{asset.filename}</option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <Field key={field} name={field} label={labelize(field)} defaultValue={item[field] ?? (field === "sort_order" ? index : "")} />
                ),
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="submit">{item.id ? "Save" : "Add new"}</Button>
              {item.id ? <DeleteButton table={table} id={item.id} tab={tab} /> : null}
            </div>
          </form>
        ))}
      </div>
    </Panel>
  );
}

function DeleteButton({ table, id, tab }: { table: string; id: string; tab: string }) {
  return (
    <form
      action={async () => {
        "use server";
        throw new Error("DELETE BUTTON WORKS");
      }}
    >
      <input type="hidden" name="table" value={table} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="tab" value={tab} />

      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center rounded-md border px-5"
      >
        Delete
      </button>
    </form>
  );
}

function Panel({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-white p-5 shadow-soft sm:p-6">
      <div className="mb-5">
        <h2 className="text-2xl font-bold tracking-normal">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Field({
  name,
  label,
  defaultValue,
  type = "text",
  className = "",
}: {
  name: string;
  label: string;
  defaultValue?: string | number | null;
  type?: string;
  className?: string;
}) {
  return (
    <label className={`grid gap-2 ${className}`}>
      <span className="text-sm font-bold">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        className="h-11 rounded-md border border-border bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function Textarea({
  name,
  label,
  defaultValue,
  className = "",
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  className?: string;
}) {
  return (
    <label className={`grid gap-2 ${className}`}>
      <span className="text-sm font-bold">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={4}
        className="rounded-md border border-border bg-white px-3 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-md bg-accent px-3 py-1 text-xs font-bold text-primary">
      {children}
    </span>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="rounded-lg border border-dashed border-border bg-background p-6 text-center text-sm text-muted-foreground">{text}</p>;
}

function labelize(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
