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
      <section className="section-pad">
        <div className="container">
          <div className="section-heading">
            <h2>Send a CCTV and security inquiry</h2>
          </div>
          <div className="quotation-form-panel">
            <QuotationForm />
          </div>
        </div>
      </section>
    </main>
  );
}
