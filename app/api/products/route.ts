import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const categoryId = searchParams.get('categoryId');
  const seoLink = searchParams.get('seo_link');
  const brands = searchParams.getAll('brands') || [];
  const skip = (page - 1) * limit;

  console.log('Received brands:', brands); // Debug log

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

    // Add brand filter for multiple brands
    if (brands.length > 0) {
      console.log('Searching for brands with seo_links:', brands); // Debug log
      const brandRecords = await prisma.nokta_urun_markalar.findMany({
        where: {
          seo_link: {
            in: brands
          }
        },
      });

      console.log('Found brand records:', brandRecords); // Debug log

      if (brandRecords.length > 0) {
        whereClause.MarkaID = {
          in: brandRecords.map(brand => brand.id)
        };
        console.log('Added brand IDs to where clause:', brandRecords.map(brand => brand.id)); // Debug log
      }
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
          MarkaID: true
        },
        orderBy: {
          id: 'desc',
        },
      }),
      prisma.nokta_urunler.count({
        where: whereClause
      }),
    ]);

    // Fetch brands for products that have MarkaID
    const markaIds = products
      .map(product => product.MarkaID)
      .filter((id): id is number => id !== null);

    const productBrands = markaIds.length > 0
      ? await prisma.nokta_urun_markalar.findMany({
          where: {
            id: {
              in: markaIds
            }
          },
          select: {
            id: true,
            title: true
          }
        })
      : [];

    // Create a map of brands for quick lookup
    const brandMap = new Map(productBrands.map(brand => [brand.id, brand]));

    // Fetch images for the products and combine with brand info
    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const image = await prisma.nokta_urunler_resimler.findFirst({
          where: { UrunID: product.id },
          select: { KResim: true },
          orderBy: { Sira: 'asc' },
        });
        
        return {
          ...product,
          marka: product.MarkaID ? brandMap.get(product.MarkaID) || null : null,
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