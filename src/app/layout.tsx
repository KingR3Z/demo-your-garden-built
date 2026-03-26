import type { Metadata } from "next";
import { client } from "@/config/client";
import "./globals.css";

export const metadata: Metadata = {
  title: client.seo.title,
  description: client.seo.description,
  openGraph: {
    title: client.seo.title,
    description: client.seo.description,
    type: "website",
    locale: "en_GB",
    siteName: client.name,
  },
  twitter: {
    card: "summary_large_image",
    title: client.seo.title,
    description: client.seo.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // JSON-LD structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: client.name,
    description: client.description,
    telephone: client.phone,
    email: client.email,
    url: client.website,
    address: {
      "@type": "PostalAddress",
      streetAddress: client.address,
      addressLocality: client.city,
      addressRegion: client.county,
      postalCode: client.postcode,
      addressCountry: "GB",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: client.googleRating,
      reviewCount: client.reviewCount,
      bestRating: "5",
    },
  };

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
