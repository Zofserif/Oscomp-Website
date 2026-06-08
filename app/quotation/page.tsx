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
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Inquiry form</p>
          <h1>Send a CCTV and security inquiry</h1>
          <p>
            Share your security camera needs and service location so OSCOMP can
            review the details and recommend the right next step.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="quotation-form-panel">
            <QuotationForm />
          </div>
        </div>
      </section>
    </main>
  );
}
