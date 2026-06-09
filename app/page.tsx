import type { Metadata } from "next";
import Link from "next/link";
import { LandingContact } from "./components/LandingContact";
import { MobileStickyCta } from "./components/MobileStickyCta";
import { breadcrumbJsonLd, metadataFor } from "./lib/site";

export const metadata: Metadata = metadataFor({
  title: "OSCOMP - CCTV and IT Solutions",
  description:
    "OSCOMP provides CCTV installation, security camera setup, attendance and access control, networking, cybersecurity, computer repair, custom software development, and practical IT solutions for homes and businesses.",
  path: "/",
});

const brandLinks = [
  {
    href: "https://www.hikvision.com/ph/",
    src: "/assets/img/brands/HIKVISION.png",
    alt: "Hikvision CCTV brand",
  },
  {
    href: "https://us.dahuasecurity.com/",
    src: "/assets/img/brands/Dahua_Technology_logo.png",
    alt: "Dahua Technology CCTV brand",
  },
  {
    href: "https://www.acti.com/",
    src: "/assets/img/brands/acti.png",
    alt: "ACTi CCTV brand",
  },
  {
    href: "https://www.axis.com/en-ph",
    src: "/assets/img/brands/Axis_Communications_logo.png",
    alt: "Axis Communications CCTV brand",
  },
  {
    href: "https://www.tp-link.com/ph/home-networking/cloud-camera/",
    src: "/assets/img/brands/TPLINK_Logo_2.png",
    alt: "TP-Link CCTV brand",
  },
];

const securityFeatures = [
  {
    title: "CCTV Planning and Installation",
    description:
      "Plan camera coverage for homes, shops, offices, and business sites with practical placement and setup support.",
    image: "/assets/img/services/cctv-installation/Service-slideshow-03.jpg",
    alt: "CCTV camera installed by OSCOMP",
    cta: "View service",
    href: "/services/cctv-consultation-and-installation",
  },
  {
    title: "Camera Setup and Maintenance",
    description:
      "Configure cameras, recorders, storage, mobile viewing, and ongoing troubleshooting for supported CCTV systems.",
    image: "/assets/img/services/cctv-installation/Service-slideshow-08.jpg",
    alt: "Security camera system configured by OSCOMP",
    cta: "View service",
    href: "/services/cctv-consultation-and-installation",
  },
  {
    title: "Security Brands and Warranty",
    description:
      "Install supported brands including Hikvision, Dahua, ACTi, Axis, and TP-Link with warranty support on eligible devices.",
    image: "/assets/img/services/cctv-installation/Service-slideshow-10.jpg",
    alt: "CCTV security equipment prepared for installation",
    cta: "View service",
    href: "/services/cctv-consultation-and-installation",
  },
];

const secondaryServices = [
  {
    title: "Attendance and Access Control",
    description:
      "Time tracking, door access systems, and biometrics installation for offices, businesses, and organizations.",
    icon: "security",
    href: "/services/attendance-and-access-control",
  },
  {
    title: "Computer Repairs",
    description:
      "Hardware diagnostics, Windows installation, and practical device support remain available through OSCOMP services.",
    icon: "computer",
    href: "/services/electronic-device-and-accessories-repairs",
  },
  {
    title: "IT Solutions",
    description:
      "Networking, cybersecurity, office applications, and business technology support are still offered as secondary services.",
    icon: "settings_ethernet",
    href: "/services/it-solutions",
  },
  {
    title: "Custom Software Solution",
    description:
      "Business process automation, inventory systems, and booking platforms — tailored software built around how your business works.",
    icon: "code",
    href: "/services/custom-software-solution",
  },
];

const highlights = [
  "CCTV installation and security camera support across CALABARZON",
  "Supported brands include Hikvision, Dahua, ACTi, Axis, and TP-Link",
  "Free 1-year warranty on supported CCTV devices",
];

const faqs = [
  {
    question: "How much does CCTV installation cost?",
    answer:
      "CCTV installation cost depends on the number of cameras, recorder or storage needs, cable routing, property layout, and whether the site needs remote mobile viewing or extra troubleshooting support.",
  },
  {
    question: "Do you install CCTV systems in Candelaria, Quezon?",
    answer:
      "Yes. OSCOMP provides CCTV installation in Candelaria, Quezon and supports nearby homes and businesses across CALABARZON.",
  },
  {
    question: "Can OSCOMP set up mobile viewing for security cameras?",
    answer:
      "Yes. OSCOMP can configure supported CCTV systems for mobile viewing, recorder setup, storage, camera placement, and practical post-installation support.",
  },
  {
    question: "Which CCTV brands do you support?",
    answer:
      "OSCOMP works with supported CCTV and security camera brands including Hikvision, Dahua, ACTi, Axis, and TP-Link.",
  },
  {
    question: "Do you also provide IT solutions in Quezon?",
    answer:
      "Yes. OSCOMP provides IT solutions in Quezon, including network setup, cybersecurity support, office application setup, computer repair, and ongoing technology assistance.",
  },
];

export default function HomePage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
  const breadcrumbJsonLdData = breadcrumbJsonLd([{ name: "Home", path: "/" }]);

  return (
    <main className="landing-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([faqJsonLd, breadcrumbJsonLdData]),
        }}
      />
      <header className="site-hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">
                For Businesses in CALABARZON that needs security
              </p>
              <h1>
                Your <span className="hero-highlight">24/7</span> CCTV evidence
                for your Business
              </h1>
              <p className="hero-lead">
                Professional CCTV and security system services that help protect
                your business location and provide clear records of your
                surroundings.
              </p>
              <div className="hero-actions">
                <Link
                  className="btn btn-primary hero-primary-cta"
                  href="/quotation"
                >
                  <span>Get Free Security Consultation</span>{" "}
                  <span className="material-icons" aria-hidden="true">
                    arrow_forward
                  </span>
                </Link>
              </div>
              {/*<ul className="hero-highlights">
                {highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>*/}
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
          <div
            className="hero-partner-strip"
            aria-label="OSCOMP partnered brands"
          >
            <p>Partnered with</p>
            <div className="hero-partner-logos">
              <div className="hero-partner-logo-track">
                <div className="hero-partner-logo-set">
                  {brandLinks.map((brand) => (
                    <a
                      href={brand.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={brand.href}
                    >
                      <img src={brand.src} alt={brand.alt} />
                    </a>
                  ))}
                </div>
                <div
                  className="hero-partner-logo-set hero-partner-logo-set-duplicate"
                  aria-hidden="true"
                >
                  {brandLinks.map((brand) => (
                    <span
                      className="hero-partner-logo-duplicate"
                      key={brand.href}
                    >
                      <img src={brand.src} alt="" />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <MobileStickyCta />

      <section className="section-pad">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Featured services</p>
            <h2>Security camera service from planning to support</h2>
            <p>
              Build a CCTV installation in Candelaria, Quezon around your site,
              coverage needs, equipment, and maintenance requirements.
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

      <section className="section-pad">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Also available</p>
            <h2>Other OSCOMP services</h2>
            <p>
              Attendance and access control, custom software development,
              computer repair, and IT solutions in Quezon are also available
              while this page focuses on CCTV and security installation.
            </p>
          </div>
          <div className="service-grid service-grid-secondary">
            {secondaryServices.map((service) => (
              <article className="service-card" key={service.title}>
                <span
                  className="service-icon material-icons"
                  aria-hidden="true"
                >
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
          <div className="section-heading">
            <p className="eyebrow">Common questions</p>
            <h2>CCTV installation and IT support FAQ</h2>
            <p>
              Practical answers for homeowners and businesses planning security
              camera setup, network support, or IT solutions in Quezon.
            </p>
          </div>
          <div className="faq-list">
            {faqs.map((faq) => (
              <details className="faq-item" key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
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
