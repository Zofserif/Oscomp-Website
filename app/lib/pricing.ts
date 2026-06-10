export type PricingPackageFeature = {
  label: string;
  value: string;
};

export type PricingPackage = {
  slug: string;
  name: string;
  subtitle: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
  details: string[];
  features: PricingPackageFeature[];
  highlighted?: boolean;
};

export const pricingPackages: PricingPackage[] = [
  {
    slug: "basic-protection",
    name: "Basic Protection",
    subtitle: "Best for small spaces",
    price: "₱39,990",
    imageSrc: "/assets/img/pricing/basic-protection-layout.png",
    imageAlt: "Sample CCTV layout for the Basic Protection package",
    details: [
      "4 cameras with 2 indoor and 2 outdoor coverage points",
      "4-channel NVR with 1TB storage",
      "Layout planning, installation, and staff training included",
    ],
    features: [
      { label: "Starting Price", value: "₱39,990" },
      { label: "Best For", value: "Small spaces" },
      { label: "Cameras Included", value: "4" },
      { label: "Indoor Cameras", value: "2" },
      { label: "Outdoor Cameras", value: "2" },
      { label: "Recorder", value: "4-channel NVR" },
      { label: "HDD Storage", value: "1TB" },
      { label: "Estimated 24-Hour Recording", value: "Up to 14 days" },
      { label: "Layout Planning", value: "Included" },
      { label: "Cabling and Installation", value: "Included" },
      { label: "Staff Training", value: "Included" },
      { label: "Device Warranty", value: "1 year" },
      { label: "1-Month Adjustment Check", value: "Included" },
      { label: "6-Month Health Check", value: "Included" },
      { label: "Incident Report Document Credits", value: "1" },
      { label: "CCTV Signage", value: "Included" },
      { label: "Call Support", value: "9 AM – 4 PM" },
      { label: "Repair Discount", value: "Available" },
      { label: "UPS Upgrade", value: "Available" },
      { label: "Recommended Plan", value: "Good starter" },
    ],
  },
  {
    slug: "standard-protection",
    name: "Standard System",
    subtitle: "Best for small businesses",
    price: "₱59,990",
    imageSrc: "/assets/img/pricing/standard-system-layout.png",
    imageAlt: "Sample CCTV layout for the Standard Protection package",
    details: [
      "6 cameras with balanced indoor and outdoor coverage",
      "8-channel NVR with 1TB storage",
      "Most popular setup for growing shops and offices",
    ],
    highlighted: true,
    features: [
      { label: "Starting Price", value: "₱59,990" },
      { label: "Best For", value: "Small businesses" },
      { label: "Cameras Included", value: "6" },
      { label: "Indoor Cameras", value: "3" },
      { label: "Outdoor Cameras", value: "3" },
      { label: "Recorder", value: "8-channel NVR" },
      { label: "HDD Storage", value: "1TB" },
      { label: "Estimated 24-Hour Recording", value: "Up to 5 days" },
      { label: "Layout Planning", value: "Included" },
      { label: "Cabling and Installation", value: "Included" },
      { label: "Staff Training", value: "Included" },
      { label: "Device Warranty", value: "1 year" },
      { label: "1-Month Adjustment Check", value: "Included" },
      { label: "6-Month Health Check", value: "Included" },
      { label: "Incident Report Document Credits", value: "1" },
      { label: "CCTV Signage", value: "Available" },
      { label: "Call Support", value: "9 AM – 4 PM" },
      { label: "Repair Discount", value: "Up to 20%" },
      { label: "UPS Upgrade", value: "Available" },
      { label: "Recommended Plan", value: "Most Popular" },
    ],
  },
  {
    slug: "enterprise-essentials",
    name: "Enterprise Essentials",
    subtitle: "Best for larger business spaces",
    price: "₱75,990",
    imageSrc: "/assets/img/pricing/enterprise-essentials-layout.png",
    imageAlt: "Sample CCTV layout for the Enterprise Essentials package",
    details: [
      "8 cameras designed for wider business coverage",
      "8-channel NVR with 2TB storage",
      "Priority support plus extra incident report credits",
    ],
    features: [
      { label: "Starting Price", value: "₱75,990" },
      { label: "Best For", value: "Larger business spaces" },
      { label: "Cameras Included", value: "8" },
      { label: "Indoor Cameras", value: "4" },
      { label: "Outdoor Cameras", value: "4" },
      { label: "Recorder", value: "8-channel NVR" },
      { label: "HDD Storage", value: "2TB" },
      { label: "Estimated 24-Hour Recording", value: "Up to 5 days" },
      { label: "Layout Planning", value: "Included" },
      { label: "Cabling and Installation", value: "Included" },
      { label: "Staff Training", value: "Included" },
      { label: "Device Warranty", value: "1 year" },
      { label: "1-Month Adjustment Check", value: "Included" },
      { label: "6-Month Health Check", value: "Included" },
      { label: "Incident Report Document Credits", value: "2" },
      { label: "CCTV Signage", value: "Included" },
      { label: "Call Support", value: "Priority support" },
      { label: "Repair Discount", value: "Up to 20%" },
      { label: "UPS Upgrade", value: "Available" },
      { label: "Recommended Plan", value: "Best for wider coverage" },
    ],
  },
];

export function getPricingPackageBySlug(slug: string) {
  return pricingPackages.find((item) => item.slug === slug);
}
