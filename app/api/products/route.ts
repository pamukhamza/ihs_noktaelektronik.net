/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const categoryId = searchParams.get('categoryId');
  const seoLink = searchParams.get('seo_link');
  const brand = searchParams.get('brand');
  const query = searchParams.get('query');
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    const whereClause: any = {};

    if (query) {
      whereClause.OR = [
        { UrunAdiTR: { contains: query } },
        { UrunAdiEN: { contains: query } },
        { UrunKodu: { contains: query } }
      ];

      // Add brand search as a separate query
      const brandResults = await prisma.nokta_urun_markalar.findMany({
        where: {
          title: { contains: query }
        },
        select: { id: true }
      });

      if (brandResults.length > 0) {
        whereClause.OR.push({
          MarkaID: {
            in: brandResults.map(b => b.id)
          }
        });
      }

      // Add category search as a separate query
      const categoryResults = await prisma.nokta_kategoriler.findMany({
        where: {
          KategoriAdiTr: { contains: query }
        },
        select: { id: true }
      });

      if (categoryResults.length > 0) {
        whereClause.OR.push({
          KategoriID: {
            in: categoryResults.map(c => c.id)
          }
        });
      }
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

    // Add brand filter for single brand
    if (brand) {
      console.log('Searching for brand with seo_link:', brand); // Debug log
      const brandRecord = await prisma.nokta_urun_markalar.findFirst({
        where: {
          seo_link: brand
        },
      });

      if (brandRecord) {
        whereClause.MarkaID = brandRecord.id;
      }
    }

    const offset = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.nokta_urunler.findMany({
        where: whereClause,
        select: {
          id: true,
          UrunKodu: true,
          UrunAdiTR: true,
          UrunAdiEN: true,
          aktif: true,
          MarkaID: true,
          marka: {
            select: {
              title: true,
            },
          },
        },
        orderBy: {
          id: 'desc',
        },
        skip: offset,
        take: limit,
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
        // Only set the image if KResim exists and is not empty
        imageMap.set(image.UrunID, image.KResim && image.KResim.trim() !== '' ? image.KResim : null);
      }
    }

    // Combine products with their images and brand info
    const productsWithImages = products.map(product => ({
      ...product,
      image: imageMap.get(product.id) 
        ? `https://noktanet.s3.eu-central-1.amazonaws.com/uploads/images/products/${imageMap.get(product.id)}`
        : 'https://noktanet.s3.eu-central-1.amazonaws.com/uploads/images/products/gorsel_hazirlaniyor.jpg',
      marka: product.MarkaID ? brandMap.get(product.MarkaID) || null : null
    }));

    return NextResponse.json({
      products: productsWithImages || [],
      hasMore: total > (page * limit),
      total: total || 0,
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({
      products: [],
      hasMore: false,
      total: 0,
      currentPage: page,
      error: 'Failed to fetch products'
    }, { status: 500 });
  }
}