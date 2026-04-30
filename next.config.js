/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'vercel.app'],
  },
  // Ensure proper build for Vercel
  output: 'standalone',
}

module.exports = nextConfig
