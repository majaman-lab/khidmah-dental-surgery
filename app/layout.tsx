import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://khidmahdentalsurgery.com";
const siteTitle = "Khidmah Dental Surgery | Dental Chamber in Beanibazar, Sylhet";
const siteDescription =
  "Professional dental care by Dr. Md. Iqbal Hossain in Beanibazar, Sylhet. Root canal treatment, scaling, cosmetic filling, crown and bridge, braces consultation and more.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Khidmah Dental Surgery",
  category: "Healthcare",
  title: {
    default: siteTitle,
    template: "%s | Khidmah Dental Surgery",
  },
  description: siteDescription,
  keywords: [
    "Khidmah Dental Surgery",
    "Dr. Md. Iqbal Hossain",
    "dental chamber in Beanibazar",
    "dentist in Sylhet",
    "root canal treatment Beanibazar",
    "scaling and polishing",
    "cosmetic filling",
    "crown and bridge",
    "braces consultation",
    "dental chamber",
    "dentist appointment",
    "single doctor dental practice",
  ],
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: "Khidmah Dental Surgery",
    images: [
      {
        url: "/images/khidmah-dental-chamber.jpg",
        width: 1536,
        height: 1024,
        alt: "Khidmah Dental Surgery chamber interior",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/images/khidmah-dental-chamber.jpg"],
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: "Khidmah Dental Surgery",
    url: siteUrl,
    image: `${siteUrl}/images/khidmah-dental-chamber.jpg`,
    telephone: "01727-529609",
    email: "drmdiqbalhussain@gmail.com",
    founder: {
      "@type": "Person",
      name: "Dr. Md. Iqbal Hossain",
      jobTitle: "Owner & Chief Consultant",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Nimar Ali Mansion (2nd Floor), Nimtola",
      addressLocality: "Beanibazar",
      addressRegion: "Sylhet",
      postalCode: "3170",
      addressCountry: "BD",
    },
    medicalSpecialty: "Dentistry",
    sameAs: ["https://www.facebook.com/khidmahdental"],
  };

  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </body>
    </html>
  );
}
