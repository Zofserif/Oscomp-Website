import type { Metadata } from "next";
import Link from "next/link";
import { ProjectGallery } from "../components/ProjectGallery";
import { getProjectImages, sortedProjects } from "../lib/projects";
import { metadataFor, site, siteUrl } from "../lib/site";

export const metadata: Metadata = metadataFor({
  title: "Completed CCTV, Computer Repair & IT Projects",
  description:
    "See OSCOMP completed work across CCTV installation, security camera support, computer repair, networking, and IT solutions in CALABARZON.",
  path: "/projects"
});

const projectsJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "OSCOMP completed projects",
  description:
    "Completed OSCOMP project highlights for CCTV installation, security camera support, computer repair, and IT solutions in CALABARZON.",
  url: `${siteUrl}/projects`,
  publisher: {
    "@type": "LocalBusiness",
    name: site.name,
    url: siteUrl,
    logo: `${siteUrl}${site.logo}`
  },
  mainEntity: sortedProjects.map((project, index) => ({
    "@type": "CreativeWork",
    position: index + 1,
    name: project.title,
    description: project.excerpt,
    about: project.tags,
    datePublished: project.completedAt,
    dateModified: project.updatedAt,
    image: getProjectImages(project).map((image) => `${siteUrl}${image.src}`),
    locationCreated: {
      "@type": "Place",
      name: project.location
    },
    provider: {
      "@type": "LocalBusiness",
      name: site.name,
      url: siteUrl
    }
  }))
};

export default function ProjectsPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsJsonLd) }}
      />
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Completed projects</p>
          <h1>Recent OSCOMP work for security and IT clients</h1>
          <p>
            Browse completed CCTV installation, security camera support,
            computer repair, networking, and IT solution projects across
            Candelaria, Quezon and CALABARZON.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="projects-intro">
            <div>
              <p className="eyebrow">Past work</p>
              <h2>Project stories with photos and videos</h2>
            </div>
            <p>
              Click any project tile to view more project media. The project
              details stay visible on this page so visitors and search engines
              can understand the kind of work OSCOMP completes.
            </p>
          </div>

          <ProjectGallery projects={sortedProjects} />

          <div className="center-actions">
            <Link className="btn btn-primary shadow" href="/quotation">
              Start your project inquiry
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
