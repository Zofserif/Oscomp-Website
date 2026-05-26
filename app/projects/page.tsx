import type { Metadata } from "next";
import Link from "next/link";
import { metadataFor } from "../lib/site";

export const metadata: Metadata = metadataFor({
  title: "Projects",
  description:
    "View OSCOMP project highlights for CCTV installation, computer service, hardware support, and practical IT solution work.",
  path: "/projects"
});

const projects = [
  {
    badge: "CCTV",
    title: "Security camera installation",
    description:
      "CCTV installation and configuration for homes and small businesses using supported security brands.",
    image: "/assets/img/products/1.jpg",
    alt: "Installed CCTV security equipment"
  },
  {
    badge: "Repair",
    title: "Computer and laptop repair",
    description:
      "Computer repair, laptop service, Windows installation, and device troubleshooting support.",
    image: "/assets/img/products/2.jpg",
    alt: "Computer repair project"
  },
  {
    badge: "IT Solution",
    title: "Networking and cybersecurity",
    description:
      "Technology support for networking, cybersecurity, office applications, and business IT needs.",
    image: "/assets/img/products/3.jpg",
    alt: "IT solution hardware project"
  },
  {
    badge: "Hardware",
    title: "Device setup and accessories",
    description:
      "Hardware support and accessory setup for clients that need reliable technology assistance.",
    image: "/assets/img/products/HP-4.jpg",
    alt: "Hardware setup project"
  }
];

export default function ProjectsPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Project gallery</p>
          <h1>OSCOMP work highlights</h1>
          <p>
            A practical look at OSCOMP work across CCTV installation, computer
            repair, hardware support, and IT solution services.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="project-grid">
            {projects.map((project) => (
              <article className="project-card" key={project.title}>
                <img
                  src={project.image}
                  alt={project.alt}
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <span className="badge bg-primary">{project.badge}</span>
                  <h2>{project.title}</h2>
                  <p>{project.description}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="center-actions">
            <Link className="btn btn-primary shadow" href="/quotation">
              Start your project
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
