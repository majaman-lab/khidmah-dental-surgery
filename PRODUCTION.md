# Production Deployment Notes

## Vercel

1. Import this project into Vercel.
2. Use the default Next.js settings.
3. Build command: `npm run build`
4. Install command: `npm install`
5. Output directory: leave blank for Next.js.

## Environment Variables

Set this in Vercel before enabling the appointment email workflow:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` with a verified Resend sender, for example `Khidmah Dental Surgery <appointments@your-domain.com>`

The booking server action sends appointment emails to `drmdiqbalhussain@gmail.com` using Resend.

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
