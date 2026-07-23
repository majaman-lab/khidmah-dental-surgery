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
  upsertAppointmentSlot,
  upsertBlogPost,
  upsertDoctorCredential,
  upsertDoctorExperience,
  upsertFaq,
  upsertGalleryImage,
  upsertService,
  upsertUnavailableDay,
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

type AdminTab = (typeof tabs)[number][0];

type AdminSearchParams = {
  tab?: string;
  success?: string;
  error?: string;
  q?: string;
  date?: string;
  status?: string;
  sort?: string;
  dir?: string;
  page?: string;
};

type AppointmentStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

type AppointmentSort = "created_at" | "preferred_date" | "preferred_time" | "patient_name" | "service_needed" | "status";

const appointmentStatuses: AppointmentStatus[] = ["Pending", "Confirmed", "Completed", "Cancelled"];
const appointmentSortFields: AppointmentSort[] = [
  "created_at",
  "preferred_date",
  "preferred_time",
  "patient_name",
  "service_needed",
  "status",
];
const appointmentPageSize = 10;

function isAdminTab(tab: string | undefined): tab is AdminTab {
  return tabs.some(([id]) => id === tab);
}

function getDhakaDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

function appointmentHref(
  params: AdminSearchParams,
  updates: Partial<Pick<AdminSearchParams, "q" | "date" | "status" | "sort" | "dir" | "page">>,
) {
  const next = new URLSearchParams();
  next.set("tab", "appointments");

  (["q", "date", "status", "sort", "dir", "page"] as const).forEach((key) => {
    const value = updates[key] ?? params[key];

    if (value && !(key === "page" && value === "1")) {
      next.set(key, value);
    }
  });

  return `/admin?${next.toString()}`;
}

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
  const activeTab = isAdminTab(params.tab) ? params.tab : "dashboard";
  const { supabase, user } = await requireAdmin();

  let appointments: any[] = [];
  let appointmentCount = 0;
  let blogPostCount = 0;
  let galleryImageCount = 0;
  let blogPosts: any[] = [];
  let galleryImages: any[] = [];
  let homepageSections: any[] = [];
  let contact: Record<string, string> = {};
  let doctor: any = null;
  let credentials: any[] = [];
  let experiences: any[] = [];
  let services: any[] = [];
  let faqs: any[] = [];
  let seo: any = null;
  let media: any[] = [];
  let appointmentSlots: any[] = [];
  let unavailableDays: any[] = [];
  let appointmentStats = {
    today: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    upcoming: 0,
  };
  let recentAppointments: any[] = [];
  let appointmentTotal = 0;

  if (activeTab === "dashboard") {
    const [appointmentsResult, blogsResult, galleryResult] = await Promise.all([
      supabase
        .from("appointments")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .limit(6),
      supabase.from("blog_posts").select("id", { count: "exact", head: true }),
      supabase.from("gallery_images").select("id", { count: "exact", head: true }),
    ]);

    appointments = appointmentsResult.data || [];
    appointmentCount = appointmentsResult.count || 0;
    blogPostCount = blogsResult.count || 0;
    galleryImageCount = galleryResult.count || 0;
  }

  if (activeTab === "content") {
    const [sectionsResult, contactResult] = await Promise.all([
      supabase.from("homepage_sections").select("*").order("sort_order", { ascending: true }),
      supabase.from("site_settings").select("*").eq("key", "contact").maybeSingle(),
    ]);

    homepageSections = sectionsResult.data || [];
    contact = (contactResult.data?.value || {}) as Record<string, string>;
  }

  if (activeTab === "doctor") {
    const [doctorResult, credentialsResult, experienceResult] = await Promise.all([
      supabase.from("doctor_profile").select("*").eq("id", 1).maybeSingle(),
      supabase.from("doctor_credentials").select("*").order("sort_order", { ascending: true }),
      supabase.from("doctor_experiences").select("*").order("sort_order", { ascending: true }),
    ]);

    doctor = doctorResult.data;
    credentials = credentialsResult.data || [];
    experiences = experienceResult.data || [];
  }

  if (activeTab === "gallery") {
    const galleryResult = await supabase.from("gallery_images").select("*").order("sort_order", { ascending: true });
    galleryImages = galleryResult.data || [];
  }

  if (activeTab === "services") {
    const servicesResult = await supabase.from("services").select("*").order("sort_order", { ascending: true });
    services = servicesResult.data || [];
  }

  if (activeTab === "appointments") {
    const appointmentQuery = (params.q || "").trim();
    const selectedDate = params.date?.trim() || "";
    const selectedStatus = appointmentStatuses.includes(params.status as AppointmentStatus)
      ? (params.status as AppointmentStatus)
      : "";
    const sortField = appointmentSortFields.includes(params.sort as AppointmentSort)
      ? (params.sort as AppointmentSort)
      : "created_at";
    const sortDirection = params.dir === "asc" ? "asc" : "desc";
    const currentPage = Math.max(1, Number(params.page) || 1);
    const from = (currentPage - 1) * appointmentPageSize;
    const to = from + appointmentPageSize - 1;
    const today = getDhakaDate();

    let appointmentsQuery = supabase
      .from("appointments")
      .select("*", { count: "exact" });

    if (appointmentQuery) {
      const escapedQuery = appointmentQuery.replace(/[,%()]/g, " ").trim();
      if (escapedQuery) {
        appointmentsQuery = appointmentsQuery.or(
          [
            `patient_name.ilike.%${escapedQuery}%`,
            `patient_email.ilike.%${escapedQuery}%`,
            `mobile_number.ilike.%${escapedQuery}%`,
            `service_needed.ilike.%${escapedQuery}%`,
            `reference_number.ilike.%${escapedQuery}%`,
          ].join(","),
        );
      }
    }

    if (selectedDate) {
      appointmentsQuery = appointmentsQuery.eq("preferred_date", selectedDate);
    }

    if (selectedStatus) {
      appointmentsQuery = appointmentsQuery.eq("status", selectedStatus);
    }

    const [
      appointmentsResult,
      todayResult,
      pendingResult,
      confirmedResult,
      completedResult,
      cancelledResult,
      upcomingResult,
      recentResult,
      slotsResult,
      unavailableDaysResult,
    ] = await Promise.all([
      appointmentsQuery
        .order(sortField, { ascending: sortDirection === "asc" })
        .range(from, to),
      supabase.from("appointments").select("id", { count: "exact", head: true }).eq("preferred_date", today),
      supabase.from("appointments").select("id", { count: "exact", head: true }).eq("status", "Pending"),
      supabase.from("appointments").select("id", { count: "exact", head: true }).eq("status", "Confirmed"),
      supabase.from("appointments").select("id", { count: "exact", head: true }).eq("status", "Completed"),
      supabase.from("appointments").select("id", { count: "exact", head: true }).eq("status", "Cancelled"),
      supabase
        .from("appointments")
        .select("id", { count: "exact", head: true })
        .gte("preferred_date", today)
        .neq("status", "Cancelled"),
      supabase.from("appointments").select("*").order("created_at", { ascending: false }).limit(5),
      supabase.from("appointment_slots").select("*").order("slot_date", { ascending: true }).order("slot_time", { ascending: true }),
      supabase.from("appointment_unavailable_days").select("*").order("unavailable_date", { ascending: true }),
    ]);

    appointments = appointmentsResult.data || [];
    appointmentTotal = appointmentsResult.count || 0;
    appointmentStats = {
      today: todayResult.count || 0,
      pending: pendingResult.count || 0,
      confirmed: confirmedResult.count || 0,
      completed: completedResult.count || 0,
      cancelled: cancelledResult.count || 0,
      upcoming: upcomingResult.count || 0,
    };
    recentAppointments = recentResult.data || [];
    appointmentSlots = slotsResult.data || [];
    unavailableDays = unavailableDaysResult.data || [];
  }

  if (activeTab === "blog") {
    const [blogsResult, mediaResult] = await Promise.all([
      supabase.from("blog_posts").select("*").order("updated_at", { ascending: false }),
      supabase.from("media_assets").select("*").order("created_at", { ascending: false }),
    ]);

    blogPosts = blogsResult.data || [];
    media = mediaResult.data || [];
  }

  if (activeTab === "faq") {
    const faqsResult = await supabase.from("faqs").select("*").order("sort_order", { ascending: true });
    faqs = faqsResult.data || [];
  }

  if (activeTab === "seo") {
    const seoResult = await supabase.from("seo_settings").select("*").eq("id", 1).maybeSingle();
    seo = seoResult.data;
  }

  if (activeTab === "media") {
    const mediaResult = await supabase.from("media_assets").select("*").order("created_at", { ascending: false });
    media = mediaResult.data || [];
  }

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
              appointmentCount={appointmentCount}
              blogPostCount={blogPostCount}
              galleryImageCount={galleryImageCount}
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
            <AppointmentsPanel
              appointments={appointments}
              appointmentStats={appointmentStats}
              recentAppointments={recentAppointments}
              total={appointmentTotal}
              slots={appointmentSlots}
              unavailableDays={unavailableDays}
              params={params}
            />
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
  appointmentCount,
  blogPostCount,
  galleryImageCount,
  userEmail,
}: {
  appointments: any[];
  appointmentCount: number;
  blogPostCount: number;
  galleryImageCount: number;
  userEmail: string;
}) {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Appointments" value={appointmentCount} />
        <StatCard label="Total Blog Posts" value={blogPostCount} />
        <StatCard label="Gallery Images" value={galleryImageCount} />
      </div>
      <Panel title="Recent appointments" description={`Signed in as ${userEmail}`}>
        <div className="grid gap-3">
          {appointments.slice(0, 6).map((appointment) => (
            <div key={appointment.id} className="grid gap-2 rounded-lg border border-border bg-background p-4 sm:grid-cols-[1fr_auto]">
              <div>
                <p className="font-bold">{appointment.patient_name}</p>
                <p className="text-sm text-muted-foreground">
                  {appointment.service_needed} - {appointment.preferred_date} - {appointment.preferred_time}
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

function AppointmentsPanel({
  appointments,
  appointmentStats,
  recentAppointments,
  total,
  slots,
  unavailableDays,
  params,
}: {
  appointments: any[];
  appointmentStats: {
    today: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    upcoming: number;
  };
  recentAppointments: any[];
  total: number;
  slots: any[];
  unavailableDays: any[];
  params: AdminSearchParams;
}) {
  const currentPage = Math.max(1, Number(params.page) || 1);
  const totalPages = Math.max(1, Math.ceil(total / appointmentPageSize));
  const sortField = appointmentSortFields.includes(params.sort as AppointmentSort)
    ? (params.sort as AppointmentSort)
    : "created_at";
  const sortDirection = params.dir === "asc" ? "asc" : "desc";
  const firstItem = total === 0 ? 0 : (currentPage - 1) * appointmentPageSize + 1;
  const lastItem = Math.min(currentPage * appointmentPageSize, total);
  const pageStart = Math.max(1, Math.min(currentPage - 2, Math.max(1, totalPages - 4)));
  const visiblePages = Array.from({ length: Math.min(5, totalPages) }, (_, index) => pageStart + index);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Today's Appointments" value={appointmentStats.today} />
        <StatCard label="Pending" value={appointmentStats.pending} />
        <StatCard label="Confirmed" value={appointmentStats.confirmed} />
        <StatCard label="Completed" value={appointmentStats.completed} />
        <StatCard label="Cancelled" value={appointmentStats.cancelled} />
        <StatCard label="Upcoming" value={appointmentStats.upcoming} />
      </div>

      <Panel title="Recent Activity" description="Latest appointment requests received by the chamber.">
        <div className="grid gap-3">
          {recentAppointments.map((appointment) => (
            <div key={appointment.id} className="grid gap-2 rounded-lg border border-border bg-background p-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="font-bold">{appointment.patient_name}</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {appointment.service_needed} - {appointment.preferred_date} - {formatAdminTime(appointment.preferred_time)}
                </p>
                {appointment.reference_number ? (
                  <p className="mt-1 text-xs font-semibold text-primary">{appointment.reference_number}</p>
                ) : null}
              </div>
              <Badge>{appointment.status}</Badge>
            </div>
          ))}
          {recentAppointments.length === 0 ? <EmptyState text="No recent appointment activity." /> : null}
        </div>
      </Panel>

      <Panel title="Available appointment slots" description="Create date-specific slots, edit times, disable individual slots, and remove unused slots.">
        <div className="grid gap-4">
          <form action={upsertAppointmentSlot} className="grid gap-3 rounded-lg border border-border bg-background p-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end">
            <Field name="slot_date" label="Slot Date" type="date" />
            <Field name="slot_time" label="Slot Time" type="time" />
            <Field name="note" label="Admin Note" />
            <label className="flex h-11 items-center gap-2 text-sm font-bold">
              <input type="checkbox" name="is_enabled" defaultChecked />
              Enabled
            </label>
            <Button type="submit" className="w-fit sm:col-span-4">Add slot</Button>
          </form>

          <div className="grid gap-3">
            {slots.map((slot) => (
              <div key={slot.id} className="grid gap-3 rounded-lg border border-border bg-background p-4 lg:grid-cols-[1fr_auto] lg:items-end">
                <form action={upsertAppointmentSlot} className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end">
                  <input type="hidden" name="id" value={slot.id} />
                  <Field name="slot_date" label="Slot Date" type="date" defaultValue={slot.slot_date} />
                  <Field name="slot_time" label="Slot Time" type="time" defaultValue={slot.slot_time} />
                  <Field name="note" label="Admin Note" defaultValue={slot.note} />
                  <label className="flex h-11 items-center gap-2 text-sm font-bold">
                    <input type="checkbox" name="is_enabled" defaultChecked={slot.is_enabled} />
                    Enabled
                  </label>
                  <Button type="submit" variant="outline" className="w-fit sm:col-span-4">Save slot</Button>
                </form>
                <DeleteButton table="appointment_slots" id={slot.id} tab="appointments" />
              </div>
            ))}
            {slots.length === 0 ? <EmptyState text="No appointment slots created yet." /> : null}
          </div>
        </div>
      </Panel>

      <Panel title="Unavailable days" description="Mark full dates as holiday or leave. Patients will not see slots on these dates.">
        <div className="grid gap-4">
          <form action={upsertUnavailableDay} className="grid gap-3 rounded-lg border border-border bg-background p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <Field name="unavailable_date" label="Unavailable Date" type="date" />
            <Field name="reason" label="Reason" />
            <Button type="submit">Add unavailable day</Button>
          </form>

          <div className="grid gap-3 md:grid-cols-2">
            {unavailableDays.map((day) => (
              <div key={day.id} className="grid gap-3 rounded-lg border border-border bg-background p-4">
                <form action={upsertUnavailableDay} className="grid gap-3">
                  <input type="hidden" name="id" value={day.id} />
                  <Field name="unavailable_date" label="Unavailable Date" type="date" defaultValue={day.unavailable_date} />
                  <Field name="reason" label="Reason" defaultValue={day.reason} />
                  <Button type="submit" variant="outline" className="w-fit">Save day</Button>
                </form>
                <DeleteButton table="appointment_unavailable_days" id={day.id} tab="appointments" />
              </div>
            ))}
            {unavailableDays.length === 0 ? <EmptyState text="No unavailable days marked." /> : null}
          </div>
        </div>
      </Panel>

      <Panel title="Appointments" description="Search, update status, delete, and export appointment requests.">
        <form className="mb-5 grid gap-3 rounded-lg border border-border bg-background p-4 lg:grid-cols-[1fr_auto_auto_auto] lg:items-end">
          <input type="hidden" name="tab" value="appointments" />
          <label className="grid gap-2">
            <span className="text-sm font-bold">Search</span>
            <input
              name="q"
              defaultValue={params.q || ""}
              placeholder="Name, phone, email, service, reference"
              className="h-11 rounded-md border border-border bg-white px-4 text-sm outline-none focus:border-primary"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-bold">Date Filter</span>
            <input
              type="date"
              name="date"
              defaultValue={params.date || ""}
              className="h-11 rounded-md border border-border bg-white px-3 text-sm outline-none focus:border-primary"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-bold">Status Filter</span>
            <select
              name="status"
              defaultValue={params.status || ""}
              className="h-11 rounded-md border border-border bg-white px-3 text-sm outline-none focus:border-primary"
            >
              <option value="">All statuses</option>
              {appointmentStatuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" variant="outline">Apply</Button>
            <Button asChild variant="outline">
              <Link href="/admin?tab=appointments">Reset</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/appointments/export">Export CSV</Link>
            </Button>
          </div>
        </form>

        <div className="mb-3 flex flex-col gap-2 text-sm font-semibold text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Showing {firstItem}-{lastItem} of {total} appointments</p>
          <p>Sorted by {labelize(sortField)} {sortDirection === "asc" ? "ascending" : "descending"}</p>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[980px] border-collapse bg-white text-sm">
            <thead className="bg-background text-left">
              <tr>
                <SortableHeader label="Patient" field="patient_name" params={params} activeField={sortField} direction={sortDirection} />
                <th className="border-b border-border px-4 py-3 font-bold">Contact</th>
                <SortableHeader label="Service" field="service_needed" params={params} activeField={sortField} direction={sortDirection} />
                <SortableHeader label="Date" field="preferred_date" params={params} activeField={sortField} direction={sortDirection} />
                <SortableHeader label="Time" field="preferred_time" params={params} activeField={sortField} direction={sortDirection} />
                <th className="border-b border-border px-4 py-3 font-bold">Reference</th>
                <SortableHeader label="Status" field="status" params={params} activeField={sortField} direction={sortDirection} />
                <th className="border-b border-border px-4 py-3 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="align-top">
                  <td className="border-b border-border px-4 py-4">
                    <p className="font-bold">{appointment.patient_name}</p>
                    {appointment.message ? (
                      <p className="mt-1 max-w-56 text-xs leading-5 text-muted-foreground">{appointment.message}</p>
                    ) : null}
                  </td>
                  <td className="border-b border-border px-4 py-4">
                    <p className="font-semibold">{appointment.mobile_number}</p>
                    {appointment.patient_email ? (
                      <p className="mt-1 text-xs text-muted-foreground">{appointment.patient_email}</p>
                    ) : null}
                  </td>
                  <td className="border-b border-border px-4 py-4 text-muted-foreground">{appointment.service_needed}</td>
                  <td className="border-b border-border px-4 py-4 font-semibold">{appointment.preferred_date}</td>
                  <td className="border-b border-border px-4 py-4 font-semibold">{formatAdminTime(appointment.preferred_time)}</td>
                  <td className="border-b border-border px-4 py-4">
                    <p className="font-bold text-primary">{appointment.reference_number || "Not set"}</p>
                    {appointment.appointment_slot_id ? (
                      <p className="mt-1 max-w-40 truncate text-xs text-muted-foreground" title={appointment.appointment_slot_id}>
                        Slot: {appointment.appointment_slot_id}
                      </p>
                    ) : null}
                  </td>
                  <td className="border-b border-border px-4 py-4">
                    <Badge>{appointment.status}</Badge>
                  </td>
                  <td className="border-b border-border px-4 py-4">
                    <div className="flex min-w-48 flex-col gap-2">
                      <form action={updateAppointmentStatus} className="flex gap-2">
                        <input type="hidden" name="id" value={appointment.id} />
                        <select name="status" defaultValue={appointment.status} className="h-10 rounded-md border border-border bg-white px-3 text-sm">
                          {appointmentStatuses.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                        <Button type="submit" variant="outline">Update</Button>
                      </form>
                      <DeleteButton table="appointments" id={appointment.id} tab="appointments" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {appointments.length === 0 ? <EmptyState text="No appointments found." /> : null}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link
                href={appointmentHref(params, { page: String(Math.max(1, currentPage - 1)) })}
                aria-disabled={currentPage <= 1}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
              >
                Previous
              </Link>
            </Button>
            {visiblePages.map((page) => (
              <Button key={page} variant={page === currentPage ? "default" : "outline"} asChild>
                <Link href={appointmentHref(params, { page: String(page) })}>{page}</Link>
              </Button>
            ))}
            <Button variant="outline" asChild>
              <Link
                href={appointmentHref(params, { page: String(Math.min(totalPages, currentPage + 1)) })}
                aria-disabled={currentPage >= totalPages}
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
              >
                Next
              </Link>
            </Button>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function SortableHeader({
  label,
  field,
  params,
  activeField,
  direction,
}: {
  label: string;
  field: AppointmentSort;
  params: AdminSearchParams;
  activeField: AppointmentSort;
  direction: "asc" | "desc";
}) {
  const isActive = activeField === field;
  const nextDirection = isActive && direction === "asc" ? "desc" : "asc";

  return (
    <th className="border-b border-border px-4 py-3 font-bold">
      <Link
        href={appointmentHref(params, { sort: field, dir: nextDirection, page: "1" })}
        className="inline-flex items-center gap-1 text-foreground hover:text-primary"
      >
        {label}
        <span className="text-xs text-muted-foreground">
          {isActive ? (direction === "asc" ? "ASC" : "DESC") : "SORT"}
        </span>
      </Link>
    </th>
  );
}

function formatAdminTime(value: string) {
  if (!value?.includes(":")) {
    return value;
  }

  const [hourValue, minuteValue] = value.split(":");
  const hour = Number(hourValue);
  const minute = Number(minuteValue);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(2000, 0, 1, hour, minute));
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
          <div key={item.id || "new"} className="grid gap-3 rounded-lg border border-border bg-background p-4">
            <form action={action} className="grid gap-3">
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
              </div>
            </form>
            <div className="flex flex-wrap gap-2">
              {item.id ? <DeleteButton table={table} id={item.id} tab={tab} /> : null}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function DeleteButton({ table, id, tab }: { table: string; id: string; tab: string }) {
  return (
    <form action={deleteRow}>
      <input type="hidden" name="table" value={table} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="tab" value={tab} />
      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-border bg-background px-5 text-sm font-semibold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
