import type { Metadata } from "next";
import { QuotationForm } from "../components/QuotationForm";
import { metadataFor } from "../lib/site";

export const metadata: Metadata = metadataFor({
  title: "Request a Quotation",
  description:
    "Request a custom OSCOMP quotation for CCTV installation, computer repair, networking, cybersecurity, and IT solution services.",
  path: "/quotation"
});

export default function QuotationPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Quotation basis</p>
          <h1>Request a custom quotation</h1>
          <p>
            Share your service needs and project location so OSCOMP can review
            the details and recommend the right next step.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="quotation-layout">
            <div className="quotation-copy">
              <p className="eyebrow">Custom scope</p>
              <h2>Every quotation is based on your actual requirements</h2>
              <p>
                CCTV coverage, repair work, and IT support vary by equipment,
                site conditions, scope, and schedule. Send the details and OSCOMP
                will review your request.
              </p>
              <ul className="check-list">
                <li>CCTV installation and site coverage needs</li>
                <li>Computer repair, diagnostics, and setup requests</li>
                <li>Networking, cybersecurity, and office IT support</li>
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
