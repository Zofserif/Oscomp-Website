export type CompletedProject = {
  slug: string;
  title: string;
  service: string;
  location: string;
  completedAt: string;
  updatedAt: string;
  excerpt: string;
  summary: string;
  images: string[];
  tags: string[];
  alt: string;
};

export const projects: CompletedProject[] = [
  {
    slug: "cctv-security-camera-installation-calabarzon",
    title: "CCTV security camera installation",
    service: "CCTV Installation",
    location: "Candelaria, Quezon",
    completedAt: "2026-05-01",
    updatedAt: "2026-05-01",
    excerpt:
      "Security camera planning, installation, recorder setup, and mobile viewing support for a property in CALABARZON.",
    summary:
      "OSCOMP planned camera coverage, installed CCTV equipment, configured recording storage, and prepared the client for day-to-day monitoring and troubleshooting support.",
    images: [
      "/assets/img/services/cctv-installation/Service-slideshow-01.jpg",
      "/assets/img/services/cctv-installation/Service-slideshow-03.jpg",
      "/assets/img/services/cctv-installation/Service-slideshow-08.jpg",
      "/assets/img/services/cctv-installation/Service-slideshow-09.jpg",
      "/assets/img/services/cctv-installation/Service-slideshow-14.jpg"
    ],
    tags: ["CCTV", "Security cameras", "Installation", "CALABARZON"],
    alt: "OSCOMP CCTV security camera installation project"
  },
  {
    slug: "cctv-maintenance-and-camera-setup",
    title: "CCTV maintenance and camera setup",
    service: "Security Support",
    location: "Quezon Province",
    completedAt: "2026-04-18",
    updatedAt: "2026-04-18",
    excerpt:
      "Camera adjustment, system checking, and setup support for a CCTV installation that needed reliable monitoring.",
    summary:
      "The work focused on checking camera positioning, reviewing system configuration, and helping the client keep the CCTV setup usable for regular security monitoring.",
    images: [
      "/assets/img/services/cctv-installation/Service-slideshow-02.jpg",
      "/assets/img/services/cctv-installation/Service-slideshow-04.jpg",
      "/assets/img/services/cctv-installation/Service-slideshow-05.jpg",
      "/assets/img/services/cctv-installation/Service-slideshow-10.jpg"
    ],
    tags: ["Maintenance", "Camera setup", "Troubleshooting", "Security"],
    alt: "OSCOMP CCTV maintenance and camera setup project"
  },
  {
    slug: "computer-laptop-repair-and-windows-support",
    title: "Computer, laptop, and Windows support",
    service: "Computer Repair",
    location: "Candelaria, Quezon",
    completedAt: "2026-03-22",
    updatedAt: "2026-03-22",
    excerpt:
      "Device diagnostics, Windows support, and practical repair work for computers and laptops used in daily operations.",
    summary:
      "OSCOMP handled practical device support including diagnostics, Windows installation help, setup checks, and repair guidance for client equipment.",
    images: [
      "/assets/img/services/computer-repair/Computer-repair-01.jpg",
      "/assets/img/services/computer-repair/Computer-repair-02.jpg",
      "/assets/img/services/computer-repair/Computer-repair-03.jpg",
      "/assets/img/services/computer-repair/Computer-repair-06.jpg"
    ],
    tags: ["Computer repair", "Laptop repair", "Windows support"],
    alt: "OSCOMP computer and laptop repair project"
  },
  {
    slug: "networking-it-solutions-office-support",
    title: "Networking and IT solutions support",
    service: "IT Solutions",
    location: "CALABARZON",
    completedAt: "2026-02-12",
    updatedAt: "2026-02-12",
    excerpt:
      "Business technology support for networking, cybersecurity, office applications, and workstation setup needs.",
    summary:
      "OSCOMP supported practical IT requirements for business operations, including network-related checks, office application support, and workstation setup guidance.",
    images: [
      "/assets/img/services/it-solution/IT-Solution-01.jpg",
      "/assets/img/services/it-solution/IT-Solution-02.jpg",
      "/assets/img/services/it-solution/IT-Solution-03.jpg",
      "/assets/img/services/it-solution/IT-Solution-04.jpg"
    ],
    tags: ["IT solutions", "Networking", "Cybersecurity", "Office support"],
    alt: "OSCOMP networking and IT solutions project"
  }
];

export const sortedProjects = [...projects].sort(
  (left, right) =>
    new Date(right.completedAt).getTime() - new Date(left.completedAt).getTime()
);

export function formatProjectDate(date: string) {
  return new Intl.DateTimeFormat("en-PH", {
    month: "long",
    year: "numeric"
  }).format(new Date(`${date}T00:00:00+08:00`));
}
