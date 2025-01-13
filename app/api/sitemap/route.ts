import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { nokta_urunler, nokta_kategoriler } from '@prisma/client';

type ProductWithSeoLink = Pick<nokta_urunler, 'seo_link'>;
type CategoryWithSeoLink = Pick<nokta_kategoriler, 'seo_link'>;

function generateSiteMap(
  products: ProductWithSeoLink[],
  categories: CategoryWithSeoLink[],
) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Static pages -->
     <url>
       <loc>${process.env.NEXT_PUBLIC_BASE_URL}</loc>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>

     <!-- Products -->
     ${products
       .map((product) => {
         return `
       <url>
           <loc>${process.env.NEXT_PUBLIC_BASE_URL}/tr/urun/${product.seo_link}</loc>
           <changefreq>daily</changefreq>
           <priority>0.8</priority>
       </url>
     `;
       })
       .join('')}

     <!-- Categories -->
     ${categories
       .map((category) => {
         return `
       <url>
           <loc>${process.env.NEXT_PUBLIC_BASE_URL}/tr/urunler/${category.seo_link}</loc>
           <changefreq>weekly</changefreq>
           <priority>0.7</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}


export async function GET() {
  try {
    // Fetch all active products
    const products: ProductWithSeoLink[] = await prisma.nokta_urunler.findMany({
      where: {
        aktif: true,
      },
      select: {
        seo_link: true
      },
    });

    // Fetch all categories
    const categories: CategoryWithSeoLink[] = await prisma.nokta_kategoriler.findMany({
      where: {
        is_active: true,  // Only include active categories
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
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
