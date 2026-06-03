import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageCarousel } from "../../components/ImageCarousel";
import { ServiceInquiryModal } from "../../components/ServiceInquiryModal";
import { getServiceMedia } from "../../lib/service-media";
import { getServiceBySlug, services } from "../../lib/services";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  metadataFor,
  site,
  siteUrl
} from "../../lib/site";

export const revalidate = 300;

type ServicePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return metadataFor({
      title: "Service Not Found",
      description: "The requested OSCOMP service could not be found.",
      path: "/services",
    });
  }

  return metadataFor({
    title: service.title,
    description: service.seoDescription,
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const media = await getServiceMedia(service);
  const serviceUrl = `/services/${service.slug}`;
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: service.title, path: serviceUrl }
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.title,
      description: service.seoDescription,
      serviceType: service.category,
      url: absoluteUrl(serviceUrl),
      image: media
        .filter((mediaItem) => mediaItem.type === "image")
        .slice(0, 5)
        .map((mediaItem) => absoluteUrl(mediaItem.src)),
      areaServed: ["Candelaria", "Quezon", "CALABARZON"],
      provider: {
        "@type": "LocalBusiness",
        name: site.name,
        url: siteUrl,
        telephone: site.phoneGlobe,
        address: {
          "@type": "PostalAddress",
          streetAddress: "VSJ",
          addressLocality: "Candelaria",
          addressRegion: "Quezon",
          addressCountry: "PH"
        }
      }
    }
  ];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="page-hero service-page-hero">
        <div className="container">
          <Link className="service-back-link" href="/services">
            <span className="material-icons" aria-hidden="true">
              arrow_back
            </span>
            Services
          </Link>
          <p className="eyebrow">{service.eyebrow}</p>
          <h1>{service.title}</h1>
          <p>{service.detailDescription}</p>
          <div className="service-hero-actions">
            <ServiceInquiryModal
              serviceCategory={service.category}
              serviceTitle={service.title}
            />
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="service-detail-page-grid">
            <ImageCarousel
              id={`service-detail-gallery-${service.slug}`}
              media={media}
              alt={service.alt}
            />
            <div className="service-detail-copy">
              <p className="eyebrow">What is included</p>
              <h2>Service details</h2>
              <p>{service.description}</p>
              <ul className="check-list">
                {service.detailBullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <ServiceInquiryModal
                serviceCategory={service.category}
                serviceTitle={service.title}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
