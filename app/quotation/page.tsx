import type { Metadata } from "next";
import { QuotationForm } from "../components/QuotationForm";
import { metadataFor } from "../lib/site";

export const metadata: Metadata = metadataFor({
  title: "Send an Inquiry",
  description:
    "Send OSCOMP an inquiry for CCTV installation, security camera maintenance, computer repair, networking, cybersecurity, and IT solution services.",
  path: "/quotation"
});

export default function QuotationPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Inquiry form</p>
          <h1>Send a CCTV and security inquiry</h1>
          <p>
            Share your security camera needs and project location so OSCOMP can
            review the details and recommend the right next step.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="quotation-layout">
            <div className="quotation-copy">
              <p className="eyebrow">Custom inquiry</p>
              <h2>Every CCTV setup depends on your site and coverage needs</h2>
              <p>
                CCTV coverage, camera placement, device configuration, and
                maintenance needs vary by property, equipment, and schedule.
                Send the details and OSCOMP will review your inquiry.
              </p>
              <ul className="check-list">
                <li>CCTV installation and site coverage needs</li>
                <li>Camera setup, maintenance, and troubleshooting</li>
                <li>Secondary repair or IT support requests if needed</li>
              </ul>
            </div>
            <div className="quotation-form-panel">
              <QuotationForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
