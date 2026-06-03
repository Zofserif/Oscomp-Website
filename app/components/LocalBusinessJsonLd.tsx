import { site, siteUrl } from "../lib/site";

export function LocalBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    url: siteUrl,
    image: `${siteUrl}${site.ogImage}`,
    logo: `${siteUrl}${site.logo}`,
    description: site.description,
    email: site.email,
    telephone: [site.phoneGlobe],
    address: {
      "@type": "PostalAddress",
      streetAddress: "VSJ",
      addressLocality: "Candelaria",
      addressRegion: "Quezon",
      addressCountry: "PH"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.latitude,
      longitude: site.longitude
    },
    areaServed: ["Candelaria", "Quezon", "CALABARZON"],
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "CCTV installation",
          areaServed: ["Candelaria", "Quezon", "CALABARZON"]
        }
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Security camera setup",
          areaServed: ["Candelaria", "Quezon", "CALABARZON"]
        }
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "IT solutions",
          areaServed: ["Candelaria", "Quezon", "CALABARZON"]
        }
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Computer repair",
          areaServed: ["Candelaria", "Quezon", "CALABARZON"]
        }
      }
    ],
    sameAs: [site.mapUrl]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
