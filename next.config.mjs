/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/index.html",
        destination: "/",
        permanent: true
      },
      {
        source: "/services.html",
        destination: "/services",
        permanent: true
      },
      {
        source: "/pricing",
        destination: "/quotation",
        permanent: true
      },
      {
        source: "/pricing.html",
        destination: "/quotation",
        permanent: true
      },
      {
        source: "/contacts.html",
        destination: "/contact",
        permanent: true
      },
      {
        source: "/projects.html",
        destination: "/projects",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
