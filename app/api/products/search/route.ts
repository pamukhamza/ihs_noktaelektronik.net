import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  console.log('Search API called');
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const limit = parseInt(searchParams.get('limit') || '5');

  console.log('Search params:', { query, limit });

  if (!query) {
    console.log('No query provided');
    return NextResponse.json({ products: [] });
  }

  try {
    console.log('Executing Prisma query with params:', { query, limit });
    const products = await prisma.nokta_urunler.findMany({
      where: {
        AND: [
          { aktif: true },
          {
            OR: [
              { UrunAdiTR: { contains: query } },
              { UrunAdiEN: { contains: query } },
              { UrunKodu: { contains: query } },
              {
                marka: {
                  title: { contains: query }
                }
              }
            ]
          }
        ]
      },
      select: {
        id: true,
        UrunAdiTR: true,
        UrunAdiEN: true,
        UrunKodu: true,
        seo_link: true,
        marka: {
          select: {
            title: true
          }
        },
        resimler: {
          where: {
            Sira: 0
          },
          select: {
            KResim: true
          },
          take: 1
        }
      },
      take: limit,
      orderBy: {
        id: 'desc'
      }
    });

    console.log('Raw products data:', JSON.stringify(products, null, 2));

    const formattedProducts = products.map(product => {
      // Safely access the first image
      const firstImage = product.resimler && product.resimler[0];
      
      return {
        id: product.id,
        UrunAdiTR: product.UrunAdiTR ?? '',
        UrunAdiEN: product.UrunAdiEN ?? '',
        UrunKodu: product.UrunKodu ?? '',
        seo_link: product.seo_link ?? '',
        marka: product.marka?.title ?? null,
        KResim: firstImage?.KResim ?? null
      };
    });

    console.log('Formatted products:', JSON.stringify(formattedProducts, null, 2));

    console.log('Sending response with products');
    return NextResponse.json({ products: formattedProducts });
  } catch (error) {
    console.error('Prisma query error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { 
        error: 'Search failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
