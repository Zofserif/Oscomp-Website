import type { Metadata } from "next";
import Link from "next/link";
import { LandingContact } from "./components/LandingContact";
import { metadataFor } from "./lib/site";

export const metadata: Metadata = metadataFor({
  title: "CCTV Installation & Security Camera Services",
  description:
    "OSCOMP provides CCTV sales, security camera installation, maintenance, and support for homes and businesses across CALABARZON.",
  path: "/"
});

const brandLinks = [
  {
    href: "https://www.hikvision.com/ph/",
    src: "/assets/img/brands/HIKVISION.png",
    alt: "Hikvision CCTV brand"
  },
  {
    href: "https://us.dahuasecurity.com/",
    src: "/assets/img/brands/Dahua_Technology_logo.png",
    alt: "Dahua Technology CCTV brand"
  },
  {
    href: "https://www.acti.com/",
    src: "/assets/img/brands/acti.png",
    alt: "ACTi CCTV brand"
  },
  {
    href: "https://www.axis.com/en-ph",
    src: "/assets/img/brands/Axis_Communications_logo.png",
    alt: "Axis Communications CCTV brand"
  },
  {
    href: "https://www.tp-link.com/ph/home-networking/cloud-camera/",
    src: "/assets/img/brands/TPLINK_Logo_2.png",
    alt: "TP-Link CCTV brand"
  }
];

const securityFeatures = [
  {
    title: "CCTV Planning and Installation",
    description:
      "Plan camera coverage for homes, shops, offices, and business sites with practical placement and setup support.",
    image: "/assets/img/services/cctv-installation/Service-slideshow-03.jpg",
    alt: "CCTV camera installed by OSCOMP",
    cta: "View service",
    href: "/services/cctv-sales-and-installation"
  },
  {
    title: "Camera Setup and Maintenance",
    description:
      "Configure cameras, recorders, storage, mobile viewing, and ongoing troubleshooting for supported CCTV systems.",
    image: "/assets/img/services/cctv-installation/Service-slideshow-08.jpg",
    alt: "Security camera system configured by OSCOMP",
    cta: "View service",
    href: "/services/cctv-sales-and-installation"
  },
  {
    title: "Security Brands and Warranty",
    description:
      "Install supported brands including Hikvision, Dahua, ACTi, Axis, and TP-Link with warranty support on eligible devices.",
    image: "/assets/img/services/cctv-installation/Service-slideshow-10.jpg",
    alt: "CCTV security equipment prepared for installation",
    cta: "View service",
    href: "/services/cctv-sales-and-installation"
  }
];

const secondaryServices = [
  {
    title: "Computer Repairs",
    description:
      "Hardware diagnostics, Windows installation, and practical device support remain available through OSCOMP services.",
    icon: "computer",
    href: "/services/electronic-device-and-accessories-repairs"
  },
  {
    title: "IT Solutions",
    description:
      "Networking, cybersecurity, office applications, and business technology support are still offered as secondary services.",
    icon: "settings_ethernet",
    href: "/services/it-solutions"
  }
];

const highlights = [
  "CCTV installation and security camera support across CALABARZON",
  "Supported brands include Hikvision, Dahua, ACTi, Axis, and TP-Link",
  "Free 1-year warranty on supported CCTV devices"
];

export default function HomePage() {
  return (
    <main>
      <header className="site-hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">CCTV installer in CALABARZON</p>
              <h1>CCTV Installation and Security Camera Support</h1>
              <p className="hero-lead">
                OSCOMP helps homes and businesses secure their property with
                CCTV sales, installation, camera setup, maintenance, and
                troubleshooting support.
              </p>
              <div className="hero-actions">
                <Link
                  className="btn btn-primary hero-primary-cta"
                  href="/quotation"
                >
                  <span>Inquire Now</span>
                  <span className="material-icons" aria-hidden="true">
                    arrow_forward
                  </span>
                </Link>
              </div>
              <ul className="hero-highlights">
                {highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
            <div className="hero-media-grid" aria-label="OSCOMP service images">
              <img
                className="hero-media hero-media-large"
                src="/assets/img/services/cctv-installation/Service-slideshow-01.jpg"
                alt="OSCOMP CCTV installation work"
              />
              <img
                className="hero-media"
                src="/assets/img/services/cctv-installation/Service-slideshow-09.jpg"
                alt="CCTV monitoring setup completed by OSCOMP"
              />
              <img
                className="hero-media"
                src="/assets/img/services/cctv-installation/Service-slideshow-14.jpg"
                alt="Security camera equipment prepared for installation"
              />
            </div>
          </div>
        </div>
      </header>

      <section className="section-pad">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Featured services</p>
            <h2>Security camera service from planning to support</h2>
            <p>
              Build a CCTV setup around your site, coverage needs, equipment,
              and maintenance requirements.
            </p>
          </div>
          <div className="feature-strip">
            {securityFeatures.map((feature) => (
              <Link
                className="feature-tile-link"
                href={feature.href}
                key={feature.title}
              >
                <article>
                  <img src={feature.image} alt={feature.alt} loading="lazy" />
                  <div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                    <span className="feature-tile-cta">{feature.cta}</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad section-soft">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Offered brands</p>
            <h2>Everything you need for security is here</h2>
          </div>
          <div className="brand-cloud">
            {brandLinks.map((brand) => (
              <a
                href={brand.href}
                target="_blank"
                rel="noopener noreferrer"
                key={brand.href}
              >
                <img src={brand.src} alt={brand.alt} loading="lazy" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Also available</p>
            <h2>Other OSCOMP services</h2>
            <p>
              Computer repair and IT support are still offered, while this page
              currently focuses on CCTV and security installation.
            </p>
          </div>
          <div className="service-grid service-grid-secondary">
            {secondaryServices.map((service) => (
              <article className="service-card" key={service.title}>
                <span className="service-icon material-icons" aria-hidden="true">
                  {service.icon}
                </span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <Link className="btn btn-primary btn-sm" href={service.href}>
                  Learn more
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <LandingContact />
        </div>
      </section>
    </main>
  );
}
