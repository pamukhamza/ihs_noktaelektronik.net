/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['noktanetwork.com'], // Add your domain here
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
