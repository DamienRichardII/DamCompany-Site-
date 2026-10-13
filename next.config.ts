import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Préserve le SEO de l'ancien site statique (doc 08/16-D.3) : chaque
  // ancienne URL .html renvoie en 301 vers son équivalent le plus proche
  // dans la nouvelle arborescence.
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/sites-web.html", destination: "/services", permanent: true },
      { source: "/applications.html", destination: "/services", permanent: true },
      { source: "/ia.html", destination: "/services", permanent: true },
      { source: "/data.html", destination: "/services", permanent: true },
      { source: "/automatisation.html", destination: "/services", permanent: true },
      { source: "/crm.html", destination: "/services", permanent: true },
      { source: "/consulting.html", destination: "/services", permanent: true },
      { source: "/contact.html", destination: "/contact", permanent: true },
    ];
  },
};

export default nextConfig;
