/** @type {import("next").NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["https://zlocker-kappa.vercel.app"],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
