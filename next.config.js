/** @type {import("next").NextConfig} */
const nextConfig = {
  // Explicitly set webpack as the bundler
  experimental: {
    turbo: false,
  },
};

module.exports = nextConfig;
