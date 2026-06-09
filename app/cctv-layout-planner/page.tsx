import type { Metadata } from "next";
import Link from "next/link";
import { CctvLayoutPlanner } from "../components/CctvLayoutPlanner";
import styles from "../components/CctvLayoutPlanner.module.css";
import { metadataFor } from "../lib/site";

export const metadata: Metadata = metadataFor({
  title: "Custom CCTV Layout App",
  description:
    "Try OSCOMP's custom CCTV layout planner to sketch rooms, place cameras, and visualize coverage before installation.",
  path: "/cctv-layout-planner",
});

export default function CctvLayoutPlannerPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Try it now</p>
          <h1>Custom CCTV Layout App</h1>
          <p>
            Sketch your room or site, place cameras, and preview likely
            coverage before talking with OSCOMP about installation.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className={styles.pageIntro}>
            <p>
              This planner is a quick self-serve way to explore layout ideas.
              You can outline walls, doors, and obstacles, then test camera
              placement and viewing angles.
            </p>
            <p>
              Need help turning the draft into a real installation plan?{" "}
              <Link className={styles.plannerCta} href="/services/cctv-consultation-and-installation">
                Ask OSCOMP for CCTV consultation
              </Link>
            </p>
          </div>
          <CctvLayoutPlanner />
        </div>
      </section>
    </main>
  );
}
