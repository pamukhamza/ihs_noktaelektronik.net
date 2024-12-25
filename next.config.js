/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')('./i18n.ts');
const { withSitemap } = require('next-sitemap');

const nextConfig = {
  images: {
    domains: ['noktaelektronik.net'], // Add your domain here
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

module.exports = withNextIntl(withSitemap(nextConfig));
