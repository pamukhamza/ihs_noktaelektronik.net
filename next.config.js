/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')('./i18n.ts');

const nextConfig = {
  images: {
    domains: ['www.noktaelektronik.net', 'noktaelektronik.net'], // Her iki versiyonu da ekledik
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
  async redirects() {
    return [
      {
        source: '/',
        destination: '/tr',
        permanent: true,
      },
    ];
  },
}

module.exports = withNextIntl(nextConfig);