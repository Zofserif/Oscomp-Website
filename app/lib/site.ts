import type { Metadata } from "next";

const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://www.oscompcctv.com"
    : "http://localhost:3000");

export const siteUrl = rawSiteUrl.replace(/\/$/, "");

export const site = {
  name: "OSCOMP - CCTV and IT Solutions",
  shortName: "OSCOMP",
  description:
    "OSCOMP provides CCTV installation, security camera setup, attendance and access control, networking, cybersecurity, computer repair, custom software development, and practical IT solutions for homes and businesses.",
  keywords: [
    "OSCOMP",
    "CALABARZON CCTV",
    "Candelaria CCTV",
    "CCTV installation Candelaria",
    "security camera installation Quezon",
    "CCTV maintenance CALABARZON",
    "computer repair Candelaria",
    "IT solutions Quezon",
    "attendance access control Candelaria",
    "custom software development Quezon",
    "biometrics installation CALABARZON",
  ],
  logo: "/assets/img/LOGO/LOGO.png",
  ogImage: "/assets/img/OG-image.png",
  email: "vallarta.troy@gmail.com",
  phoneGlobe: "+639959959229",
  displayPhoneGlobe: "0995 999 9229",
  address: "VSJ Candelaria, Quezon",
  mapUrl: "https://maps.app.goo.gl/WLvFCE36UHPFKPAm7",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!4v1725119934969!6m8!1m7!1siZUFpliLrVmhrZ9MDhbm5g!2m2!1d13.93486338957811!2d121.4266421657959!3f357.8809956724513!4f-1.378979128846737!5f0.7820865974627469",
  latitude: 13.93486338957811,
  longitude: 121.4266421657959,
};

export const routes = [
  { path: "/", label: "Home", priority: 1 },
  { path: "/services", label: "Services", priority: 0.9 },
  { path: "/pricing", label: "Pricing", priority: 0.85 },
  { path: "/quotation", label: "Inquiry", priority: 0.8 },
  { path: "/projects", label: "Projects", priority: 0.6 },
  { path: "/contact", label: "Contact", priority: 0.8 },
];

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function absoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${siteUrl}${path === "/" ? "" : path}`;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

type MetadataInput = {
  title: string;
  description: string;
  path: string;
};

export function metadataFor({
  title,
  description,
  path,
}: MetadataInput): Metadata {
  const canonicalPath = path === "/" ? "/" : path;

  return {
    title,
    description,
    keywords: site.keywords,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      siteName: site.name,
      type: "website",
      images: [
        {
          url: site.ogImage,
          width: 1200,
          height: 630,
          alt: "OSCOMP CCTV and IT solutions",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [site.ogImage],
    },
  };
}
