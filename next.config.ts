import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/group", destination: "/about", permanent: false },
      { source: "/books", destination: "/resources", permanent: false },
      { source: "/advice", destination: "/resources", permanent: false },
      { source: "/resources/philosophy", destination: "/resources", permanent: false },
      { source: "/resources/technical", destination: "/resources/analysis", permanent: false },
      { source: "/resources/fundamental", destination: "/resources/analysis", permanent: false },
    ];
  },
};

export default nextConfig;
