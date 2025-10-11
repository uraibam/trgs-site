/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // TEMPORARY: do not fail the build if type checks fail
    ignoreBuildErrors: true,
  },
  eslint: {
    // TEMPORARY: do not fail the build on eslint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
