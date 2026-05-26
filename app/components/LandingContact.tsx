import Link from "next/link";
import { site } from "../lib/site";

const contactItems = [
  {
    label: "Phone",
    value: `GLOBE: ${site.displayPhoneGlobe}`,
    href: `tel:${site.phoneGlobe}`,
    icon: "phone"
  },
  {
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    icon: "mail"
  },
  {
    label: "Location",
    value: site.address,
    href: site.mapUrl,
    icon: "location_on",
    external: true
  }
];

export function LandingContact() {
  return (
    <div className="landing-contact">
      <div className="landing-contact-copy">
        <p className="eyebrow">Contact OSCOMP</p>
        <h2>Ready for a service review?</h2>
        <p>
          Send the project details and OSCOMP will review your CCTV, repair, or
          IT support request.
        </p>
        <div className="landing-contact-actions">
          <Link className="btn btn-primary shadow" href="/quotation">
            Request a Quotation
          </Link>
          <Link className="btn btn-outline-primary" href="/contact">
            Contact page
          </Link>
        </div>
      </div>

      <div className="landing-contact-panel">
        <div className="landing-contact-cards">
          {contactItems.map((item) => (
            <a
              className="landing-contact-card"
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              key={item.label}
            >
              <span className="landing-contact-icon material-icons" aria-hidden="true">
                {item.icon}
              </span>
              <span>
                <strong>{item.label}</strong>
                <span>{item.value}</span>
              </span>
            </a>
          ))}
        </div>
        <div className="landing-contact-map-card">
          <div>
            <strong>Map preview</strong>
            <a href={site.mapUrl} target="_blank" rel="noopener noreferrer">
              Open in Google Maps
            </a>
          </div>
          <iframe
            src={site.mapEmbedUrl}
            className="landing-contact-map"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="OSCOMP location in Candelaria, Quezon"
          />
        </div>
      </div>
    </div>
  );
}
