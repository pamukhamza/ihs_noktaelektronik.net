/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const categoryId = searchParams.get('categoryId');
  const seoLink = searchParams.get('seo_link');
  const brands = searchParams.getAll('brands') || [];
  const query = searchParams.get('query');
  const skip = (page - 1) * limit;

  try {
    const whereClause: any = {
      aktif: true,  // Only get active products
    };

    if (query) {
      whereClause.OR = [
        { UrunAdiTR: { contains: query } },
        { UrunAdiEN: { contains: query } },
        { UrunKodu: { contains: query } },
        {
          Marka: {
            title: { contains: query }
          }
        },
        {
          Kategori: {
            KategoriAdiTr: { contains: query }
          }
        }
      ];
    }

    if (seoLink) {
      // First, find the category by seo_link
      const category = await prisma.nokta_kategoriler.findFirst({
        where: { seo_link: seoLink },
      });

      if (category) {
        // Fetch all categories in a single query
        const allCategories = await prisma.nokta_kategoriler.findMany({
          select: {
            id: true,
            parent_id: true,
          },
        });

        // Build parent-child relationships in memory
        const categoryMap = new Map(allCategories.map(cat => [cat.id, cat]));
        const getSubcategoryIds = (parentId: number): number[] => {
          const subcategoryIds = [parentId];
          allCategories
            .filter(cat => cat.parent_id === parentId)
            .forEach(cat => {
              subcategoryIds.push(...getSubcategoryIds(cat.id));
            });
          return subcategoryIds;
        };

        const categoryIds = getSubcategoryIds(category.id);
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

      if (brandRecords.length > 0) {
        whereClause.MarkaID = {
          in: brandRecords.map(brand => brand.id)
        };
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

    // Fetch all images for all products in a single query
    const productIds = products.map(product => product.id);
    const allProductImages = await prisma.nokta_urunler_resimler.findMany({
      where: {
        UrunID: {
          in: productIds
        }
      },
      select: {
        UrunID: true,
        KResim: true
      },
      orderBy: {
        Sira: 'asc'
      }
    });

    // Create a map of first images for each product
    const imageMap = new Map();
    for (const image of allProductImages) {
      if (!imageMap.has(image.UrunID)) {
        imageMap.set(image.UrunID, image.KResim);
      }
    }

    // Combine products with their images and brand info
    const productsWithImages = products.map(product => ({
      ...product,
      image: imageMap.get(product.id) ? `/product-images/${imageMap.get(product.id)}` : '/gorsel_hazirlaniyor.jpg',
      marka: product.MarkaID ? brandMap.get(product.MarkaID) || null : null
    }));

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