import type { Metadata } from "next";
import Link from "next/link";
import { ImageCarousel } from "../components/ImageCarousel";
import { metadataFor } from "../lib/site";

export const metadata: Metadata = metadataFor({
  title: "Services",
  description:
    "Explore OSCOMP services including CCTV sales and installation, electronic device repair, computer repair, networking, cybersecurity, and IT support.",
  path: "/services"
});

const cctvImages = Array.from(
  { length: 15 },
  (_, index) =>
    `/assets/img/services/cctv-installation/Service-slideshow-${String(
      index + 1
    ).padStart(2, "0")}.jpg`
);

const repairImages = Array.from(
  { length: 7 },
  (_, index) =>
    `/assets/img/services/computer-repair/Computer-repair-${String(
      index + 1
    ).padStart(2, "0")}.jpg`
);

const itImages = Array.from(
  { length: 4 },
  (_, index) =>
    `/assets/img/services/it-solution/IT-Solution-${String(index + 1).padStart(
      2,
      "0"
    )}.jpg`
);

const services = [
  {
    id: "cctv",
    eyebrow: "Security systems",
    title: "CCTV Sales and Installation",
    description:
      "OSCOMP installs and configures CCTV systems for homes and businesses with supported brands such as HIKVISION, Dahua, ACTi, Axis, and TP-Link. CCTV device support includes a free 1-year warranty and troubleshooting support.",
    bullets: [
      "Camera planning and installation",
      "NVR setup and storage configuration",
      "Indoor and outdoor camera packages",
      "Post-installation troubleshooting"
    ],
    cta: "Send an inquiry",
    href: "/quotation",
    images: cctvImages,
    alt: "OSCOMP CCTV installation work"
  },
  {
    id: "repair",
    eyebrow: "Device support",
    title: "Electronic Device and Accessories Repairs",
    description:
      "OSCOMP supports common device repair needs, including diagnostics, Windows installation, and device setup for clients who need practical hardware help.",
    bullets: [
      "Computer and laptop repair",
      "Windows repair and installation",
      "Landline repair",
      "Biometrics repair and installation"
    ],
    cta: "Send repair inquiry",
    href: "/quotation",
    images: repairImages,
    alt: "OSCOMP computer and electronic repair work"
  },
  {
    id: "it",
    eyebrow: "Business technology",
    title: "IT Solutions",
    description:
      "OSCOMP helps clients solve technology problems across networking, cybersecurity, computer setup, office applications, and ongoing support needs.",
    bullets: [
      "Networking and cybersecurity",
      "Computer and laptop Windows installation",
      "Premium application installation",
      "Office application installation"
    ],
    cta: "Send IT inquiry",
    href: "/quotation",
    images: itImages,
    alt: "OSCOMP IT solution service"
  }
];

export default function ServicesPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Our services</p>
          <h1>What we can do for you</h1>
          <p>
            Practical support for security camera installation, device repair,
            networking, cybersecurity, and IT needs in Candelaria, Quezon.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="service-detail-list">
            {services.map((service, index) => (
              <article
                className={`service-detail${index % 2 === 1 ? " service-detail-reverse" : ""}`}
                key={service.id}
              >
                <div>
                  <ImageCarousel
                    id={`service-gallery-${service.id}`}
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
                  <Link className="btn btn-primary shadow" href={service.href}>
                    {service.cta}
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
