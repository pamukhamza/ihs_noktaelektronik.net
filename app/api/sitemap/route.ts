import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { nokta_urunler, nokta_kategoriler } from '@prisma/client';

type ProductWithSeoLink = Pick<nokta_urunler, 'seo_link'>;
type CategoryWithSeoLink = Pick<nokta_kategoriler, 'seo_link'>;

const BASE_URL = 'https://www.noktaelektronik.net';

function generateSiteMap(
  products: ProductWithSeoLink[],
  categories: CategoryWithSeoLink[],
): string {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static pages -->
  <url>
    <loc>${BASE_URL}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/tr</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/tr/urunler</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${BASE_URL}/tr/arge</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/tr/software</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/tr/markalar</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${BASE_URL}/tr/hakkimizda</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${BASE_URL}/tr/iletisim</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <!-- Products -->
  ${products
    .map(
      (product) => `
  <url>
    <loc>${BASE_URL}/tr/urun/${product.seo_link}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('\n')}
  <!-- Categories -->
  ${categories
    .map(
      (category) => `
  <url>
    <loc>${BASE_URL}/tr/urunler/${category.seo_link}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join('\n')}
</urlset>`;

  return xml;
}

export async function GET() {
  try {
    // Fetch all active products
    const products = await prisma.nokta_urunler.findMany({
      where: {
        aktif: true,
      },
      select: {
        seo_link: true,
      },
    });

    // Fetch all categories
    const categories = await prisma.nokta_kategoriler.findMany({
      where: {
        is_active: true,
      },
      select: {
        seo_link: true,
      },
    });

    // Generate sitemap XML
    const sitemap = generateSiteMap(products, categories);

    // Return the response with XML content type
    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
