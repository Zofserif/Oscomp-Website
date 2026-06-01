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

export type Service = {
  slug: string;
  eyebrow: string;
  title: string;
  category: string;
  description: string;
  detailDescription: string;
  bullets: string[];
  detailBullets: string[];
  cta: string;
  images: string[];
  alt: string;
  seoDescription: string;
};

export const services: Service[] = [
  {
    slug: "cctv-sales-and-installation",
    eyebrow: "Security systems",
    title: "CCTV Sales and Installation",
    category: "CCTV Sales and Installation",
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
    images: cctvImages,
    alt: "OSCOMP CCTV installation work",
    seoDescription:
      "Inquire about OSCOMP CCTV sales and installation for homes and businesses in CALABARZON.",
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
    images: repairImages,
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
    images: repairImages,
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
    images: itImages,
    alt: "OSCOMP IT solution service",
    seoDescription:
      "Inquire about OSCOMP IT solutions, networking, cybersecurity, and computer setup support.",
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
