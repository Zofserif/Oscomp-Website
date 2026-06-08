import type { Metadata } from "next";
import Link from "next/link";
import { ImageCarousel } from "../components/ImageCarousel";
import { ServiceInquiryModal } from "../components/ServiceInquiryModal";
import { getServiceMedia } from "../lib/service-media";
import { services } from "../lib/services";
import { metadataFor } from "../lib/site";

export const revalidate = 300;

export const metadata: Metadata = metadataFor({
  title: "Services",
  description:
    "Explore OSCOMP services for CCTV installation, security camera setup, attendance and access control, computer repair, custom software development, networking, cybersecurity, and practical IT solutions.",
  path: "/services",
});

export default async function ServicesPage() {
  const serviceMedia = await Promise.all(
    services.map(async (service) => ({
      service,
      media: await getServiceMedia(service),
    })),
  );

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Our services</p>
          <h1>What we can do for you</h1>
          <p>
            Practical support for security camera installation and maintenance,
            attendance and access control, device repair, custom software
            development, networking, and IT needs in CALABARZON.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="service-detail-list">
            {serviceMedia.map(({ service, media }, index) => (
              <article
                className={`service-detail${index % 2 === 1 ? " service-detail-reverse" : ""}`}
                key={service.slug}
              >
                <div>
                  <ImageCarousel
                    id={`service-gallery-${service.slug}`}
                    media={media}
                    alt={service.alt}
                  />
                </div>
                <div className="service-detail-copy">
                  <p className="eyebrow">{service.eyebrow}</p>
                  <h2>
                    <Link href={`/services/${service.slug}`}>
                      {service.title}
                    </Link>
                  </h2>
                  <p>{service.description}</p>
                  <ul className="check-list">
                    {service.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  <ServiceInquiryModal
                    serviceCategory={service.category}
                    serviceTitle={service.title}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
