import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { nokta_urunler, nokta_kategoriler } from '@prisma/client';

type ProductWithDetails = Pick<nokta_urunler, 'seo_link' | 'UrunAdiTR' | 'UrunAdiEN' | 'UrunKodu'> & {
  resimler?: {
    KResim: string | null;
  }[];
};
type CategoryWithDetails = Pick<nokta_kategoriler, 'seo_link' | 'KategoriAdiTr' | 'img_path'>;

const BASE_URL = 'https://www.noktaelektronik.net';
const BASE_IMAGE_URL = 'https://noktanet.s3.eu-central-1.amazonaws.com/uploads/images/products/';
const DEFAULT_IMAGE = 'https://noktanet.s3.eu-central-1.amazonaws.com/uploads/images/products/gorsel_hazirlaniyor.jpg';

function generateSiteMap(
  products: ProductWithDetails[],
  categories: CategoryWithDetails[],
): string {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <!-- Static pages -->
  <url>
    <loc>${BASE_URL}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="tr" href="${BASE_URL}/tr"/>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/en"/>
  </url>
  <url>
    <loc>${BASE_URL}/tr</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="tr" href="${BASE_URL}/tr"/>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/en"/>
  </url>
  <url>
    <loc>${BASE_URL}/tr/urunler</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="tr" href="${BASE_URL}/tr/urunler"/>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/en/products"/>
  </url>
  <url>
    <loc>${BASE_URL}/tr/arge</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="tr" href="${BASE_URL}/tr/arge"/>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/en/rnd"/>
  </url>
  <url>
    <loc>${BASE_URL}/tr/software</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="tr" href="${BASE_URL}/tr/software"/>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/en/software"/>
  </url>
  <url>
    <loc>${BASE_URL}/tr/markalar</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="tr" href="${BASE_URL}/tr/markalar"/>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/en/brands"/>
  </url>
  <url>
    <loc>${BASE_URL}/tr/hakkimizda</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="tr" href="${BASE_URL}/tr/hakkimizda"/>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/en/about"/>
  </url>
  <url>
    <loc>${BASE_URL}/tr/iletisim</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="tr" href="${BASE_URL}/tr/iletisim"/>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/en/contact"/>
  </url>
  <!-- Products -->
  ${products
    .map(
      (product) => `
  <url>
    <loc>${BASE_URL}/tr/urun/${product.seo_link}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="tr" href="${BASE_URL}/tr/urun/${product.seo_link}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/en/product/${product.seo_link}"/>
    ${product.resimler && product.resimler.length > 0 ? product.resimler.map(img => 
      img.KResim ? `
    <image:image>
      <image:loc>${BASE_IMAGE_URL}${img.KResim}</image:loc>
      <image:title>${product.UrunAdiTR || ''}</image:title>
      <image:caption>${product.UrunKodu || ''} - ${product.UrunAdiTR || ''}</image:caption>
    </image:image>`
    : '').join('') : `
    <image:image>
      <image:loc>${DEFAULT_IMAGE}</image:loc>
      <image:title>${product.UrunAdiTR || ''}</image:title>
      <image:caption>${product.UrunKodu || ''} - ${product.UrunAdiTR || ''}</image:caption>
    </image:image>`}
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
    <xhtml:link rel="alternate" hreflang="tr" href="${BASE_URL}/tr/urunler/${category.seo_link}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/en/products/${category.seo_link}"/>
    ${category.img_path ? `
    <image:image>
      <image:loc>${BASE_IMAGE_URL}${category.img_path}</image:loc>
      <image:title>${category.KategoriAdiTr || ''}</image:title>
      <image:caption>${category.KategoriAdiTr || ''}</image:caption>
    </image:image>` : ''}
  </url>`
    )
    .join('\n')}
</urlset>`;

  return xml;
}

export async function GET() {
  try {
    // Fetch all active products with images
    const products = await prisma.nokta_urunler.findMany({
      where: {
        aktif: true,
      },
      select: {
        seo_link: true,
        UrunAdiTR: true,
        UrunAdiEN: true,
        UrunKodu: true,
        resimler: {
          select: {
            KResim: true,
          },
          orderBy: {
            Sira: 'asc',
          },
          take: 5, // Limit to first 5 images per product
        },
      },
    });

    // Fetch all categories with images
    const categories = await prisma.nokta_kategoriler.findMany({
      where: {
        is_active: true,
      },
      select: {
        seo_link: true,
        KategoriAdiTr: true,
        img_path: true,
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
