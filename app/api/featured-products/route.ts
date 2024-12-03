import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const IMAGE_BASE_URL = '/product-images/';

export async function GET() {
  try {
    const products = await prisma.nokta_urunler.findMany({
      where: {
        aktif: true,
        YeniUrun: true,
      },
      take: 8,
      orderBy: {
        sira: 'asc'
      },
      select: {
        id: true,
        UrunAdiTR: true,
        UrunAdiEN: true,
        seo_link: true,
        MarkaID: true,
        resimler: {
          where: {
            Sira: {
              in: [0, 1]
            }
          },
          select: {
            KResim: true,
            Sira: true
          },
          orderBy: {
            Sira: 'asc'
          },
          take: 1
        }
      }
    });

    // Get all unique brand IDs
    const brandIds = [...new Set(products.filter(p => p.MarkaID).map(p => p.MarkaID))];

    // Fetch all brands in one query
    const brands = await prisma.nokta_urun_markalar.findMany({
      where: {
        id: {
          in: brandIds as number[]
        }
      },
      select: {
        id: true,
        title: true
      }
    });

    // Create a map of brand IDs to brand objects for efficient lookup
    const brandMap = new Map(brands.map(brand => [brand.id, brand]));

    // Transform the data to match the expected format
    const transformedProducts = products.map(product => ({
      id: product.id,
      UrunAdiTR: product.UrunAdiTR,
      UrunAdiEN: product.UrunAdiEN,
      seo_link: product.seo_link,
      marka: product.MarkaID ? brandMap.get(product.MarkaID) || null : null,
      image: product.resimler[0]?.KResim 
        ? `${IMAGE_BASE_URL}${product.resimler[0].KResim}` 
        : '/gorsel_hazirlaniyor.jpg'
    }));

    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json({ error: 'Failed to fetch featured products' }, { status: 500 });
  }
}
