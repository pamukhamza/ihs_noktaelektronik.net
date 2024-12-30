import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    if (!query) {
      return NextResponse.json({
        products: [],
        hasMore: false,
        total: 0,
        currentPage: page
      });
    }

    const whereClause = {
      aktif: true,
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
    };

    try {
      const [products, total] = await Promise.all([
        prisma.nokta_urunler.findMany({
          where: whereClause,
          skip,
          take: limit,
          select: {
            id: true,
            UrunAdiTR: true,
            UrunAdiEN: true,
            UrunKodu: true,
            seo_link: true,
            MarkaID: true,
            marka: {
              select: {
                title: true
              }
            }
          },
          orderBy: {
            id: 'desc',
          },
        }),
        prisma.nokta_urunler.count({
          where: whereClause
        })
      ]);

      // Fetch brands and images separately
      const productsWithDetails = await Promise.all(
        products.map(async (product) => {
          try {
            const [brand, image] = await Promise.all([
              product.MarkaID ? prisma.nokta_urun_markalar.findUnique({
                where: { id: product.MarkaID },
                select: { id: true, title: true }
              }) : null,
              prisma.nokta_urunler_resimler.findFirst({
                where: { UrunID: product.id, Sira: 1 },
                select: { KResim: true }
              })
            ]);

            return {
              ...product,
              marka: brand,
              image: image?.KResim 
                ? `https://noktanet.s3.eu-central-1.amazonaws.com/uploads/images/products/${image.KResim}`
                : 'https://noktanet.s3.eu-central-1.amazonaws.com/uploads/images/products/gorsel_hazirlaniyor.jpg'
            };
          } catch (error) {
            console.error(`Error fetching details for product ${product.id}:`, error);
            return {
              ...product,
              marka: null,
              image: 'https://noktanet.s3.eu-central-1.amazonaws.com/uploads/images/products/gorsel_hazirlaniyor.jpg'
            };
          }
        })
      );

      return NextResponse.json({
        products: productsWithDetails,
        hasMore: (skip + products.length) < total,
        total,
        currentPage: page
      });
    } catch (error) {
      console.error('Database query error:', error);
      return NextResponse.json(
        { 
          error: 'Database query failed',
          products: [],
          hasMore: false,
          total: 0,
          currentPage: page
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Request processing error:', error);
    return NextResponse.json(
      { 
        error: 'Invalid request',
        products: [],
        hasMore: false,
        total: 0,
        currentPage: 1
      },
      { status: 400 }
    );
  }
}