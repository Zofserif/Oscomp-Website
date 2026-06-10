import type { Metadata } from "next";
import { PricingPackagesSection } from "../components/PricingPackagesSection";
import { pricingPackages } from "../lib/pricing";
import { metadataFor } from "../lib/site";

export const metadata: Metadata = metadataFor({
  title: "Pricing",
  description:
    "Compare OSCOMP CCTV packages for small spaces, small businesses, and larger business spaces, then send a package inquiry directly.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <main>
      <section className="page-hero pricing-page-hero">
        <div className="container">
          <p className="eyebrow">CCTV packages</p>
          <h1>Choose a protection package that fits your space</h1>
          <p>
            Start with a practical CCTV package, review the included coverage
            and support, and send an inquiry for the setup that fits your home
            or business.
          </p>
        </div>
      </section>

      <section className="section-pad pricing-package-section">
        <div className="container">
          <PricingPackagesSection packages={pricingPackages} />
        </div>
      </section>
    </main>
  );
}
