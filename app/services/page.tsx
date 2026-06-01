import type { Metadata } from "next";
import Link from "next/link";
import { ImageCarousel } from "../components/ImageCarousel";
import { services } from "../lib/services";
import { metadataFor } from "../lib/site";

export const metadata: Metadata = metadataFor({
  title: "Services",
  description:
    "Explore OSCOMP services including CCTV sales and installation, electronic device repair, computer repair, networking, cybersecurity, and IT support.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Our services</p>
          <h1>What we can do for you</h1>
          <p>
            Practical support for security camera installation and maintenance,
            device repair, networking, and IT needs in CALABARZON.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="service-detail-list">
            {services.map((service, index) => (
              <article
                className={`service-detail${index % 2 === 1 ? " service-detail-reverse" : ""}`}
                key={service.slug}
              >
                <div>
                  <ImageCarousel
                    id={`service-gallery-${service.slug}`}
                    images={service.images}
                    alt={service.alt}
                  />
                </div>
                <div className="service-detail-copy">
                  <p className="eyebrow">{service.eyebrow}</p>
                  <h2>{service.title}</h2>
                  <p>{service.description}</p>
                  <ul className="check-list">
                    {service.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  <Link
                    className="btn btn-primary shadow"
                    href={`/services/${service.slug}`}
                  >
                    View service
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
