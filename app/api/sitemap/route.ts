import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface SitemapProduct {
  seo_link: string;
}

interface SitemapCategory {
  seo_link: string;
}

const BASE_URL = 'https://www.noktaelektronik.net';

function generateSiteMap(products: SitemapProduct[], categories: SitemapCategory[]): string {
  const today = new Date().toISOString();
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}</loc>
    <lastmod>${today}</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/urunler</loc>
    <lastmod>${today}</lastmod>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${BASE_URL}/markalar</loc>
    <lastmod>${today}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/hakkimizda</loc>
    <lastmod>${today}</lastmod>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${BASE_URL}/iletisim</loc>
    <lastmod>${today}</lastmod>
    <priority>0.7</priority>
  </url>
${categories.map(category => `  <url>
    <loc>${BASE_URL}/urunler/${category.seo_link}</loc>
    <lastmod>${today}</lastmod>
    <priority>0.8</priority>
  </url>`).join('\n')}
${products.map(product => `  <url>
    <loc>${BASE_URL}/urun/${product.seo_link}</loc>
    <lastmod>${today}</lastmod>
    <priority>0.6</priority>
  </url>`).join('\n')}
</urlset>`;
}

export async function GET() {
  try {
    // Fetch all active products
    const products = await prisma.nokta_urunler.findMany({
      where: {
        aktif: true,
        seo_link: { not: null }
      },
      select: {
        seo_link: true,
      },
    }) as SitemapProduct[];

    // Fetch all active categories
    const categories = await prisma.nokta_kategoriler.findMany({
      where: {
        is_active: true,
        seo_link: { not: null }
      },
      select: {
        seo_link: true,
      },
    }) as SitemapCategory[];

    // Generate sitemap XML
    const sitemap = generateSiteMap(products, categories);

    // Return the response with XML content type
    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
