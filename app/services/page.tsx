import { Fragment } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ImageCarousel } from "../components/ImageCarousel";
import { ServiceInquiryModal } from "../components/ServiceInquiryModal";
import { getServiceMedia } from "../lib/service-media";
import { type ServiceBullet, services } from "../lib/services";
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
              <Fragment key={service.slug}>
                <article
                  className={`service-detail${index % 2 === 1 ? " service-detail-reverse" : ""}`}
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
                        <li
                          key={typeof bullet === "string" ? bullet : `${bullet.href}:${bullet.label}`}
                        >
                          {renderServiceBullet(bullet)}
                        </li>
                      ))}
                    </ul>
                    <ServiceInquiryModal
                      serviceCategory={service.category}
                      serviceTitle={service.title}
                    />
                  </div>
                </article>
                {service.slug === "cctv-consultation-and-installation" ? (
                  <article className="service-detail service-app-promo">
                    <div className="service-app-promo-visual" aria-hidden="true">
                      <div className="service-app-promo-grid" />
                      <div className="service-app-promo-camera service-app-promo-camera-one" />
                      <div className="service-app-promo-camera service-app-promo-camera-two" />
                      <div className="service-app-promo-beam service-app-promo-beam-one" />
                      <div className="service-app-promo-beam service-app-promo-beam-two" />
                    </div>
                    <div className="service-detail-copy">
                      <p className="eyebrow">Interactive planning tool</p>
                      <h2>
                        <Link href="/cctv-layout-planner">
                          Custom CCTV Layout App
                        </Link>
                      </h2>
                      <p>
                        Try OSCOMP&apos;s custom CCTV layout app to sketch a room,
                        place cameras, and preview likely coverage before
                        requesting installation or consultation.
                      </p>
                      <ul className="check-list">
                        <li>Plan rough wall, door, and obstacle placement</li>
                        <li>Test camera direction, field of view, and range</li>
                        <li>
                          Export the draft as an image to share during your
                          inquiry
                        </li>
                      </ul>
                      <Link className="btn btn-primary btn-lg" href="/cctv-layout-planner">
                        Try the Layout App
                      </Link>
                    </div>
                  </article>
                ) : null}
              </Fragment>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function renderServiceBullet(bullet: ServiceBullet) {
  if (typeof bullet === "string") {
    return bullet;
  }

  return <Link href={bullet.href}>{bullet.label}</Link>;
}
