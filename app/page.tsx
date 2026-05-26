import type { Metadata } from "next";
import Link from "next/link";
import { LandingContact } from "./components/LandingContact";
import { metadataFor } from "./lib/site";

export const metadata: Metadata = metadataFor({
  title: "CCTV Installation, Computer Repair & IT Services",
  description:
    "OSCOMP offers CCTV sales and installation, computer repairs, and practical IT solutions for homes and businesses across CALABARZON.",
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

const services = [
  {
    title: "Computer Repairs",
    description:
      "Hardware support, Windows installation, diagnostics, and practical repairs for computers, laptops, devices, and accessories.",
    icon: "computer",
    href: "/services"
  },
  {
    title: "CCTV Sales and Installation",
    description:
      "Security camera planning, installation, configuration, warranty support, and troubleshooting for homes and businesses.",
    icon: "photo_camera",
    href: "/quotation"
  },
  {
    title: "IT Solutions",
    description:
      "Networking, cybersecurity, office applications, business device setup, and technology support for daily operations.",
    icon: "settings_ethernet",
    href: "/services"
  }
];

const highlights = [
  "CCTV brands include Hikvision, Dahua, ACTi, Axis, and TP-Link",
  "Free 1-year warranty on supported CCTV devices",
  "Computer repair, installation, networking, and cybersecurity support"
];

export default function HomePage() {
  return (
    <main>
      <header className="site-hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">One of the best in CALABARZON</p>
              <h1>Computer Repairs, CCTV Installation &amp; IT Services</h1>
              <p className="hero-lead">
                OSCOMP helps homes and businesses in Candelaria, Quezon with
                security camera systems, computer repair, and dependable IT
                support.
              </p>
              <div className="hero-actions">
                <Link className="btn btn-primary shadow" href="/quotation">
                  Request a Quotation
                </Link>
                <Link className="btn btn-outline-primary" href="/services">
                  Explore Services
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
                src="/assets/img/products/computer-repair.jpg"
                alt="OSCOMP computer repair service"
              />
              <img
                className="hero-media"
                src="/assets/img/products/HP-1.jpg"
                alt="Computer hardware serviced by OSCOMP"
              />
              <img
                className="hero-media"
                src="/assets/img/services/cctv-installation/Service-slideshow-01.jpg"
                alt="CCTV installation completed by OSCOMP"
              />
            </div>
          </div>
        </div>
      </header>

      <section className="section-pad">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Featured services</p>
            <h2>Security, repair, and IT support in one place</h2>
            <p>
              Request a custom security review or contact OSCOMP for practical
              technology support.
            </p>
          </div>
          <div className="feature-strip">
            <article>
              <img
                src="/assets/img/slideshow/Slideshow-3.jpg"
                alt="CCTV security camera setup"
                loading="lazy"
              />
              <div>
                <h3>CCTV Sales and Installation</h3>
                <p>
                  Plan and install a camera system with supported brands and
                  post-installation troubleshooting.
                </p>
                <Link href="/quotation">Request a quotation</Link>
              </div>
            </article>
            <article>
              <img
                src="/assets/img/slideshow/Slideshow-2.jpg"
                alt="Computer repair tools and hardware"
                loading="lazy"
              />
              <div>
                <h3>Computer Repairs</h3>
                <p>
                  Get help with laptop and desktop repair, Windows installation,
                  and device troubleshooting.
                </p>
                <Link href="/services">View repair services</Link>
              </div>
            </article>
            <article>
              <img
                src="/assets/img/slideshow/Slideshow-1.jpg"
                alt="IT support and networking equipment"
                loading="lazy"
              />
              <div>
                <h3>IT Solutions</h3>
                <p>
                  Support for networking, cybersecurity, office applications,
                  and business technology needs.
                </p>
                <Link href="/quotation">Request support</Link>
              </div>
            </article>
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
            <p className="eyebrow">Our services</p>
            <h2>What we can do for you</h2>
          </div>
          <div className="service-grid">
            {services.map((service) => (
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
