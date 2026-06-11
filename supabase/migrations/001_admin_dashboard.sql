create extension if not exists pgcrypto;

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.homepage_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  title text not null,
  description text not null default '',
  content jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.doctor_profile (
  id integer primary key default 1 check (id = 1),
  name text not null,
  designation text not null,
  introduction text not null default '',
  bmdc_registration text not null default '',
  photo_url text not null default '/images/doctor-portrait.png',
  updated_at timestamptz not null default now()
);

create table if not exists public.doctor_credentials (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  title text not null,
  description text not null default '',
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.doctor_experiences (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  organization text not null,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  src text not null,
  alt text not null default '',
  caption text not null,
  category text not null check (category in ('Chamber', 'Equipment', 'Exterior')),
  width integer,
  height integer,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  icon text not null default 'Smile',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  mobile_number text not null,
  service_needed text not null,
  preferred_date date not null,
  preferred_time text not null,
  message text not null default '',
  status text not null default 'Pending' check (status in ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null,
  excerpt text not null default '',
  content text not null default '',
  featured_image text not null default '',
  seo_title text not null default '',
  seo_description text not null default '',
  status text not null default 'Draft' check (status in ('Draft', 'Published')),
  published_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  filename text not null,
  alt text not null default '',
  bucket text not null default 'media',
  created_at timestamptz not null default now()
);

create table if not exists public.seo_settings (
  id integer primary key default 1 check (id = 1),
  homepage_meta_title text not null,
  homepage_meta_description text not null,
  open_graph_image text not null default '/images/IMG_0905.JPG',
  updated_at timestamptz not null default now()
);

alter table public.admin_profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.homepage_sections enable row level security;
alter table public.doctor_profile enable row level security;
alter table public.doctor_credentials enable row level security;
alter table public.doctor_experiences enable row level security;
alter table public.gallery_images enable row level security;
alter table public.services enable row level security;
alter table public.appointments enable row level security;
alter table public.blog_posts enable row level security;
alter table public.faqs enable row level security;
alter table public.media_assets enable row level security;
alter table public.seo_settings enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create policy "public read site settings" on public.site_settings for select using (true);
create policy "public read homepage sections" on public.homepage_sections for select using (true);
create policy "public read doctor profile" on public.doctor_profile for select using (true);
create policy "public read doctor credentials" on public.doctor_credentials for select using (true);
create policy "public read doctor experiences" on public.doctor_experiences for select using (true);
create policy "public read gallery" on public.gallery_images for select using (true);
create policy "public read services" on public.services for select using (true);
create policy "public read published blog" on public.blog_posts for select using (status = 'Published');
create policy "public read faqs" on public.faqs for select using (true);
create policy "public read seo" on public.seo_settings for select using (true);
create policy "public create appointments" on public.appointments for insert with check (true);

create policy "admins manage profiles" on public.admin_profiles for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage site settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage homepage sections" on public.homepage_sections for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage doctor profile" on public.doctor_profile for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage credentials" on public.doctor_credentials for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage experiences" on public.doctor_experiences for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage gallery" on public.gallery_images for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage services" on public.services for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage appointments" on public.appointments for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage blog" on public.blog_posts for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage faqs" on public.faqs for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage media" on public.media_assets for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage seo" on public.seo_settings for all using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media objects" on storage.objects
for select using (bucket_id = 'media');

create policy "admins upload media objects" on storage.objects
for insert with check (bucket_id = 'media' and public.is_admin());

create policy "admins update media objects" on storage.objects
for update using (bucket_id = 'media' and public.is_admin());

create policy "admins delete media objects" on storage.objects
for delete using (bucket_id = 'media' and public.is_admin());

insert into public.site_settings (key, value) values
('contact', '{
  "phone": "01727-529609",
  "email": "drmdiqbalhussain@gmail.com",
  "facebookUrl": "https://www.facebook.com/khidmahdental",
  "whatsappNumber": "8801727529609",
  "address": "Nimar Ali Mansion (2nd Floor), Nimtola, Beanibazar, Sylhet 3170",
  "mapUrl": "https://maps.app.goo.gl/tCgshywFHaJxF4eE6",
  "mapEmbedUrl": "https://www.google.com/maps?q=Khidmah%20Dental%20Surgery%20Nimar%20Ali%20Mansion%202nd%20Floor%20Nimtola%20Beanibazar%20Sylhet%203170&z=18&output=embed"
}'::jsonb)
on conflict (key) do nothing;

insert into public.homepage_sections (section_key, title, description, content, sort_order) values
('hero', 'Khidmah Dental Surgery', 'Professional dental care in Beanibazar by Dr. Md. Iqbal Hossain.', '{"body":"A quiet single-doctor dental chamber for calm consultations, clear treatment explanation, and appointment-based care in Sylhet."}'::jsonb, 1),
('services', 'Focused dental care for confident smiles', 'Essential dental treatments delivered through a personal chamber model with careful consultation and clear next steps.', '{}'::jsonb, 2),
('doctor', 'Dr. Md. Iqbal Hossain', 'Khidmah Dental Surgery is intentionally positioned as a personal chamber, not a hospital or multi-doctor clinic.', '{}'::jsonb, 3),
('why_choose', 'Why patients choose Khidmah Dental', 'A personal dental chamber experience shaped around trust, comfort, and practical appointment conversion.', '{}'::jsonb, 4),
('gallery', 'Real chamber moments', 'Browse official Khidmah Dental Surgery photos of the chamber, treatment room, reception, and location.', '{}'::jsonb, 5),
('faq', 'Before your appointment', 'Quick answers that set the right expectation for a personal dental chamber.', '{}'::jsonb, 6),
('contact', 'Book a chamber visit', 'For the best experience, request an appointment before visiting Khidmah Dental Surgery.', '{}'::jsonb, 7)
on conflict (section_key) do nothing;

insert into public.doctor_profile (id, name, designation, introduction, bmdc_registration, photo_url) values
(1, 'Dr. Md. Iqbal Hossain', 'Owner & Chief Consultant, Khidmah Dental Surgery, Beanibazar', 'Patients meet the doctor, understand their dental condition, and receive a practical treatment path shaped around trust and comfort.', 'BMDC Registration', '/images/doctor-portrait.png')
on conflict (id) do nothing;

insert into public.doctor_credentials (label, title, description, sort_order) values
('Degree', 'BDS (DU)', 'Bachelor of Dental Surgery, University of Dhaka', 1),
('Advanced Training', 'PGT Oral & Maxillofacial Surgery', 'Post-graduate training focused on oral and maxillofacial surgical care', 2),
('Registration', 'BMDC Registration', 'Registered dental practitioner under Bangladesh Medical & Dental Council', 3),
('Institution', 'TMSS', 'Professional training and clinical exposure', 4)
on conflict do nothing;

insert into public.doctor_experiences (role, organization, sort_order) values
('Owner & Chief Consultant', 'Khidmah Dental Surgery', 1),
('Former Honorary Medical Officer (HMO)', 'Dhaka Medical College Hospital', 2),
('Former Dental Surgeon', 'Laser Dental Care', 3),
('Former Dental Surgeon', 'Specialized Dental Care', 4),
('Former Intern Doctor', 'Pioneer Dental College & Hospital', 5)
on conflict do nothing;

insert into public.gallery_images (src, alt, caption, category, width, height, sort_order) values
('/images/IMG_0905.JPG', 'Treatment room at Khidmah Dental Surgery', 'Dental Equipment', 'Equipment', 4032, 3024, 1),
('/images/IMG_3849.JPG', 'Chamber interior at Khidmah Dental Surgery', 'Treatment Chamber', 'Chamber', 960, 720, 2),
('/images/IMG_3847.JPG', 'Reception and waiting area at Khidmah Dental Surgery', 'Reception Area', 'Chamber', 960, 720, 3),
('/images/IMG_3569.JPG', 'Chamber entrance at Khidmah Dental Surgery', 'Clinic Entrance', 'Exterior', 3024, 4032, 4),
('/images/IMG_3579.JPG', 'Entrance signboard at Khidmah Dental Surgery', 'Entrance Signboard', 'Exterior', 4032, 3024, 5),
('/images/IMG_3955.JPG', 'Exterior building view of Khidmah Dental Surgery', 'Exterior View', 'Exterior', 4032, 3024, 6)
on conflict do nothing;

insert into public.seo_settings (id, homepage_meta_title, homepage_meta_description, open_graph_image) values
(1, 'Khidmah Dental Surgery | Dental Chamber in Beanibazar, Sylhet', 'Professional dental care by Dr. Md. Iqbal Hossain in Beanibazar, Sylhet. Root canal treatment, scaling, cosmetic filling, crown and bridge, braces consultation and more.', '/images/IMG_0905.JPG')
on conflict (id) do nothing;
