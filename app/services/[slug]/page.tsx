import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageCarousel } from "../../components/ImageCarousel";
import { ServiceInquiryModal } from "../../components/ServiceInquiryModal";
import { getServiceBySlug, services } from "../../lib/services";
import { metadataFor } from "../../lib/site";

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

  return (
    <main>
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
              images={service.images}
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
