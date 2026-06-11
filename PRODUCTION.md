# Production Deployment Notes

## Vercel

1. Import this project into Vercel.
2. Use the default Next.js settings.
3. Build command: `npm run build`
4. Install command: `npm install`
5. Output directory: leave blank for Next.js.

## Environment Variables

Set this in Vercel before enabling the appointment email workflow:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (only needed locally/server-side for the one-time admin seed script; do not expose it in client code)
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` with a verified Resend sender, for example `Khidmah Dental Surgery <appointments@your-domain.com>`

The booking server action sends appointment emails to `drmdiqbalhussain@gmail.com` using Resend.

## Supabase Admin Dashboard Setup

1. Create a Supabase project.
2. Run `supabase/migrations/001_admin_dashboard.sql` in the Supabase SQL editor or through the Supabase CLI.
3. Copy `.env.example` to `.env.local` and fill in Supabase keys.
4. Create the default admin account:

   ```bash
   npm run seed:admin
   ```

   Default credentials:

   - Email: `admin@khidmahdental.com`
   - Password: `ChangeMe123!`

5. Login at `/admin/login` and immediately change the password from the Account tab.
6. Create or verify the public Supabase Storage bucket named `media`; the migration attempts to create it automatically.
7. In Vercel, set the same public Supabase variables and Resend variables before deployment.

Admin URL after deployment:

- `/admin`
- `/admin/login`

The dashboard manages homepage sections, contact information, doctor profile, credentials, work history, gallery, services, appointments, blog posts, FAQs, SEO settings, and media assets.

## Real Chamber Photos

Add final clinic-owned photos to `public/images/gallery/`, then register them in `lib/gallery-items.ts`.

Suggested launch set:

- `doctor-consultation.jpg`
- `doctor-profile.jpg`
- `chamber-front.jpg`
- `chamber-room.jpg`
- `dental-chair.jpg`
- `equipment-sterilization.jpg`

Use landscape photos around 1600px wide, compressed before upload. Do not use patient faces unless written consent is available.
