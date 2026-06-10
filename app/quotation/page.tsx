import type { Metadata } from "next";
import { QuotationForm } from "../components/QuotationForm";
import { metadataFor } from "../lib/site";

export const metadata: Metadata = metadataFor({
  title: "Inquiry",
  description:
    "Send OSCOMP an inquiry for CCTV installation, security camera setup, computer repair, networking, cybersecurity, and IT solution services.",
  path: "/quotation",
});

export default function QuotationPage() {
  return (
    <main>
      <section className="page-hero quotation-page-hero">
        <div className="container">
          <p className="eyebrow">Inquiry</p>
          <h1>Send a CCTV and security inquiry</h1>
          <p>
            Share your site location, service needs, and any planning details so
            OSCOMP can review the right next step for your setup.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="section-heading quotation-section-heading">
            <p className="eyebrow">Request details</p>
            <h2>Tell OSCOMP what you need</h2>
            <p>
              Use the form below for installation, repair, maintenance, or
              wider IT support inquiries.
            </p>
          </div>
          <div className="quotation-form-panel quotation-form-panel-standalone">
            <QuotationForm />
          </div>
        </div>
      </section>
    </main>
  );
}
