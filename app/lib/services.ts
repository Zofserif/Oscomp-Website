const cctvImages = Array.from(
  { length: 15 },
  (_, index) =>
    `/assets/img/services/cctv-installation/Service-slideshow-${String(
      index + 1,
    ).padStart(2, "0")}.jpg`,
);

const repairImages = Array.from(
  { length: 7 },
  (_, index) =>
    `/assets/img/services/computer-repair/Computer-repair-${String(
      index + 1,
    ).padStart(2, "0")}.jpg`,
);

const itImages = Array.from(
  { length: 4 },
  (_, index) =>
    `/assets/img/services/it-solution/IT-Solution-${String(index + 1).padStart(
      2,
      "0",
    )}.jpg`,
);

const websiteImages = Array.from(
  { length: 6 },
  (_, index) =>
    `/assets/img/services/marketing-website-solution/Website-Solution-${String(
      index + 1,
    ).padStart(2, "0")}.jpg`,
);

const softwareImages = Array.from(
  { length: 6 },
  (_, index) =>
    `/assets/img/services/custom-software-solution/Software-Solution-${String(
      index + 1,
    ).padStart(2, "0")}.jpg`,
);

function serviceFallbackMedia(images: string[], alt: string): ServiceMedia[] {
  return images.map((src, index) => ({
    type: "image",
    src,
    alt: `${alt} ${index + 1}`,
  }));
}

export type Service = {
  slug: string;
  eyebrow: string;
  title: string;
  category: string;
  description: string;
  detailDescription: string;
  bullets: ServiceBullet[];
  detailBullets: ServiceBullet[];
  cta: string;
  mediaFolder: string;
  fallbackMedia: ServiceMedia[];
  alt: string;
  seoDescription: string;
};

export type ServiceMedia = {
  type: "image" | "video";
  src: string;
  alt?: string;
  title?: string;
};

export type ServiceBullet =
  | string
  | {
      label: string;
      href: string;
    };

export const services: Service[] = [
  {
    slug: "cctv-consultation-and-installation",
    eyebrow: "Security systems",
    title: "CCTV Consultation and Installation",
    category: "CCTV Consultation and Installation",
    description:
      "OSCOMP installs and configures CCTV systems for homes and businesses with supported brands such as HIKVISION, Dahua, ACTi, Axis, and TP-Link. CCTV device support includes a free 1-year warranty and troubleshooting support.",
    detailDescription:
      "Plan, supply, install, and configure CCTV systems around your site layout, coverage goals, and monitoring needs. OSCOMP supports home and business installations across CALABARZON.",
    bullets: [
      "Camera planning and installation",
      "Security system setup and maintenance",
      "Post-installation troubleshooting",
    ],
    detailBullets: [
      "Site-based camera placement recommendations",
      "Recorder, storage, and mobile viewing setup",
      "Supported CCTV device warranty assistance",
      "Troubleshooting support after installation",
    ],
    cta: "Inquire Now",
    mediaFolder: "services/cctv-sales-and-installation",
    fallbackMedia: serviceFallbackMedia(
      cctvImages,
      "OSCOMP CCTV installation work",
    ),
    alt: "OSCOMP CCTV installation work",
    seoDescription:
      "Inquire about OSCOMP CCTV sales and installation for homes and businesses in CALABARZON.",
  },

  {
    slug: "security-system-repair-and-maintenance",
    eyebrow: "Security Support",
    title: "Security System Repair and Maintenance",
    category: "Security System Repair and Maintenance",
    description:
      "OSCOMP provides repair and maintenance services for security systems, including CCTV troubleshooting, device repairs, and system maintenance to ensure optimal performance and security for homes and businesses.",
    detailDescription:
      "For your security system support needs, OSCOMP offers repair and maintenance services for CCTV systems, including troubleshooting, device repairs, and system maintenance to ensure optimal performance and security for homes and businesses across CALABARZON.",
    bullets: [
      "CCTV system Layout and Planning",
      {
        label: "Try the Custom CCTV Layout App now",
        href: "/cctv-layout-planner",
      },
      "Security Design and planning",
    ],
    detailBullets: [
      "Site-based camera placement recommendations",
      {
        label: "Try the Custom CCTV Layout App before requesting your consultation",
        href: "/cctv-layout-planner",
      },
      "Package design and planning for CCTV systems",
      "Alarm system layout and planning",
    ],
    cta: "Inquire Now",
    mediaFolder: "services/security-system-repair-and-maintenance",
    fallbackMedia: serviceFallbackMedia(
      cctvImages,
      "OSCOMP CCTV installation work",
    ),
    alt: "OSCOMP CCTV installation work",
    seoDescription:
      "OSCOMP Security and CCTV consultation and solution planning for homes and businesses in CALABARZON.",
  },

  {
    slug: "attendance-and-access-control",
    eyebrow: "Overall security",
    title: "Attendance and Access Control Solutions",
    category: "Attendance and Access Control Solutions",
    description:
      "OSCOMP provides comprehensive attendance and access control solutions for businesses and organizations.",
    detailDescription:
      "Control entries, manage access, and track attendance with practical security solutions for offices, businesses, and organizations.",
    bullets: [
      "Time and attendance tracking software",
      "Door access control systems",
      "Biometrics installation",
    ],
    detailBullets: [
      "Attendance tracking setup for staff and teams",
      "Door access control planning and installation",
      "Biometric device installation and configuration",
      "Support for business and organization security workflows",
    ],
    cta: "Inquire Now",
    mediaFolder: "services/attendance-and-access-control",
    fallbackMedia: serviceFallbackMedia(
      repairImages,
      "OSCOMP attendance and access control system installation work",
    ),
    alt: "OSCOMP attendance and access control system installation work",
    seoDescription:
      "Inquire about OSCOMP attendance, biometrics, and access control solutions for business sites.",
  },
  {
    slug: "electronic-device-and-accessories-repairs",
    eyebrow: "Device support",
    title: "Electronic Device and Accessories Repairs",
    category: "Electronic Device and Accessories Repairs",
    description:
      "OSCOMP supports common device repair needs, including diagnostics, Windows installation, and device setup for clients who need practical hardware help.",
    detailDescription:
      "Get practical repair and setup support for computers, laptops, landline devices, and common electronic accessories.",
    bullets: [
      "Computer and laptop repair",
      "Windows repair and installation",
      "Landline repair",
    ],
    detailBullets: [
      "Hardware diagnostics and troubleshooting",
      "Windows repair, installation, and setup",
      "Computer and laptop support",
      "Landline and accessory repair assistance",
    ],
    cta: "Inquire Now",
    mediaFolder: "services/electronic-device-and-accessories-repairs",
    fallbackMedia: serviceFallbackMedia(
      repairImages,
      "OSCOMP computer and electronic repair work",
    ),
    alt: "OSCOMP computer and electronic repair work",
    seoDescription:
      "Inquire about OSCOMP computer, laptop, landline, and electronic device repair services.",
  },
  {
    slug: "it-solutions",
    eyebrow: "Business technology",
    title: "IT Solutions",
    category: "IT Solutions",
    description:
      "OSCOMP helps clients solve technology problems across networking, cybersecurity, computer setup, office applications, and ongoing support needs.",
    detailDescription:
      "Support your home or business technology needs with networking, cybersecurity, software setup, and general IT assistance.",
    bullets: [
      "Computer and laptop Windows installation",
      "Networking and cybersecurity",
      "Office application installation",
    ],
    detailBullets: [
      "Network setup and troubleshooting",
      "Cybersecurity support and practical hardening",
      "Office application installation",
      "Computer setup and ongoing IT support",
    ],
    cta: "Inquire Now",
    mediaFolder: "services/it-solutions",
    fallbackMedia: serviceFallbackMedia(itImages, "OSCOMP IT solution service"),
    alt: "OSCOMP IT solution service",
    seoDescription:
      "Inquire about OSCOMP IT solutions, networking, cybersecurity, and computer setup support.",
  },
  {
    slug: "marketing-website-solution",
    eyebrow: "Web presence",
    title: "Marketing Website Solution",
    category: "Marketing Website Solution",
    description:
      "OSCOMP designs and builds marketing websites that help businesses establish a professional online presence, attract customers, and showcase their products or services effectively.",
    detailDescription:
      "Get a tailored marketing website built for your business — from landing pages to multi-page sites with modern design, mobile responsiveness, and SEO best practices to help you reach more customers online.",
    bullets: [
      "Business and company websites",
      "Landing pages and product showcases",
      "Mobile-responsive design",
    ],
    detailBullets: [
      "Custom website design aligned with your brand",
      "SEO-optimized content and structure",
      "Mobile and tablet responsive layouts",
      "Domain and hosting setup assistance",
      "Post-launch support and maintenance",
    ],
    cta: "Inquire Now",
    mediaFolder: "services/marketing-website-solution",
    fallbackMedia: serviceFallbackMedia(
      websiteImages,
      "OSCOMP marketing website solution work",
    ),
    alt: "OSCOMP marketing website solution work",
    seoDescription:
      "Inquire about OSCOMP marketing website design and development for businesses in CALABARZON.",
  },
  {
    slug: "custom-software-solution",
    eyebrow: "Tailored technology",
    title: "Custom Software Solution",
    category: "Custom Software Solution",
    description:
      "OSCOMP develops custom software solutions to streamline business operations, automate workflows, and solve unique challenges that off-the-shelf software cannot address.",
    detailDescription:
      "From internal tools and inventory systems to booking platforms and business automation, OSCOMP builds software tailored to how your business actually works — saving time and reducing manual effort.",
    bullets: [
      "Business process automation",
      "Inventory and management systems",
      "Booking and scheduling platforms",
    ],
    detailBullets: [
      "Requirements analysis and solution design",
      "Custom web and desktop application development",
      "Database design and data management",
      "System integration with existing tools",
      "Training, documentation, and ongoing support",
    ],
    cta: "Inquire Now",
    mediaFolder: "services/custom-software-solution",
    fallbackMedia: serviceFallbackMedia(
      softwareImages,
      "OSCOMP custom software solution work",
    ),
    alt: "OSCOMP custom software solution work",
    seoDescription:
      "Inquire about OSCOMP custom software development and business automation solutions in CALABARZON.",
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
