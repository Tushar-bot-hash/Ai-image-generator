/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'oaidalleapiprodscus.blob.core.windows.net',
      'image.pollinations.ai',
      'images.unsplash.com', // Optional: for fallback images
      'placehold.co' // Optional: for placeholder images
    ],
    unoptimized: true,
  },
  experimental: {},
};

module.exports = nextConfig;