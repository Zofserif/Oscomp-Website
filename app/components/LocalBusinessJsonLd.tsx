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
      "CCTV sales and installation",
      "Computer repair",
      "IT solutions",
      "Networking and cybersecurity"
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
