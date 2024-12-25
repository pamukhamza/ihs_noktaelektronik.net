import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const limit = parseInt(searchParams.get('limit') || '5');

  if (!query) {
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
        MarkaID: true,
        marka: {
          select: {
            id: true,
            title: true,
            seo_link: true
          }
        }
      },
      take: limit,
      orderBy: {
        id: 'desc'
      }
    });

    // Get all images for the products
    const productIds = products.map(product => product.id);
    const allProductImages = await prisma.nokta_urunler_resimler.findMany({
      where: {
        UrunID: {
          in: productIds
        }
      },
      select: {
        UrunID: true,
        KResim: true,
        Sira: true
      },
      orderBy: {
        Sira: 'asc'
      }
    });

    // Create a map of first images for each product
    const imageMap = new Map();
    for (const image of allProductImages) {
      if (!imageMap.has(image.UrunID) && image.KResim) {
        const trimmedImage = image.KResim.trim();
        if (trimmedImage !== '') {
          imageMap.set(image.UrunID, trimmedImage);
          console.log(`Set image for product ${image.UrunID}:`, trimmedImage);
        }
      }
    }

    // Transform products with images and brand info
    const transformedProducts = products.map(product => {
      const productImage = imageMap.get(product.id);
      
      return {
        id: product.id,
        UrunAdiTR: product.UrunAdiTR,
        UrunAdiEN: product.UrunAdiEN,
        UrunKodu: product.UrunKodu,
        seo_link: product.seo_link,
        marka: product.marka?.title || null,
        KResim: productImage || null
      };
    });
    return NextResponse.json({
      products: transformedProducts,
      total: products.length
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Search failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}