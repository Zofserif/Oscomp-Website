import type { Metadata } from "next";
import { metadataFor, site } from "../lib/site";

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

export const metadata: Metadata = metadataFor({
  title: "Contact",
  description:
    "Contact OSCOMP for CCTV installation, computer repair, electronic repair, networking, cybersecurity, and IT solution inquiries in Candelaria, Quezon.",
  path: "/contact"
});

export default function ContactPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Contact OSCOMP</p>
          <h1>Reach OSCOMP directly</h1>
          <p>
            Call, email, or visit OSCOMP for CCTV installation, computer repair,
            and practical IT support inquiries in Candelaria, Quezon.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="contact-info-shell">
            <div className="contact-info-copy">
              <div>
                <p className="eyebrow">Contact information</p>
                <h2>Talk to OSCOMP about your technology needs</h2>
                <p>
                  Use the details below for direct support, inquiries, location
                  questions, or follow-up on an ongoing service request.
                </p>
              </div>
              <div className="contact-info-list">
                {contactItems.map((item) => (
                  <a
                    className="contact-info-card"
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    key={item.label}
                  >
                    <span className="contact-info-icon material-icons" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span>
                      <strong>{item.label}</strong>
                      <span>{item.value}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="contact-map-panel" id="location-map">
              <div>
                <strong>OSCOMP location</strong>
                <a href={site.mapUrl} target="_blank" rel="noopener noreferrer">
                  Open in Google Maps
                </a>
              </div>
              <iframe
                src={site.mapEmbedUrl}
                className="contact-page-map"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                title="OSCOMP location in Candelaria, Quezon"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
