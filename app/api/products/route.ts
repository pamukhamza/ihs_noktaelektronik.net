import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const categoryId = searchParams.get('categoryId');
  const seoLink = searchParams.get('seo_link');
  const skip = (page - 1) * limit;

  try {
    const whereClause: any = {
      aktif: true,  // Only get active products
    };
    
    if (seoLink) {
      // First, find the category by seo_link
      const category = await prisma.nokta_kategoriler.findFirst({
        where: { seo_link: seoLink },
      });

      if (category) {
        // Get all subcategories recursively
        const getAllSubcategories = async (parentId: number): Promise<number[]> => {
          const subcategories = await prisma.nokta_kategoriler.findMany({
            where: { parent_id: parentId },
          });

          const subcategoryIds = [parentId];
          for (const sub of subcategories) {
            const childIds = await getAllSubcategories(sub.id);
            subcategoryIds.push(...childIds);
          }

          return subcategoryIds;
        };

        const categoryIds = await getAllSubcategories(category.id);
        whereClause.KategoriID = {
          in: categoryIds,
        };
      }
    } else if (categoryId) {
      whereClause.KategoriID = parseInt(categoryId);
    }

    const [products, total] = await Promise.all([
      prisma.nokta_urunler.findMany({
        where: whereClause,
        skip,
        take: limit,
        select: {
          id: true,
          UrunAdiTR: true,
          UrunAdiEN: true,
          seo_link: true,
          marka: {
            select: {
              id: true,
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
      }),
    ]);

    // Fetch images for the products
    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const image = await prisma.nokta_urunler_resimler.findFirst({
          where: { UrunID: product.id },
          select: { KResim: true },
          orderBy: { Sira: 'asc' },
        });
        
        return {
          ...product,
          image: image?.KResim ? `/product-images/${image.KResim}` : '/gorsel_hazirlaniyor.jpg',
        };
      })
    );

    return NextResponse.json({
      products: productsWithImages,
      hasMore: (skip + products.length) < total,
      total,
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
