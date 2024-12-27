/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface ProductImage {
  UrunID: number | null;
  KResim: string | null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const categoryId = searchParams.get('categoryId');
  const seoLink = searchParams.get('seo_link');
  const brand = searchParams.get('brand');
  const query = searchParams.get('query')?.toLowerCase();
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    const whereConditions: any[] = [{ aktif: true }];
    let whereClause = {};

    if (query) {
      const searchTerms = query
        .split(/\s+/)
        .filter(term => term.length > 0)
        .map(term => term.replace(/[^\w\s]/g, ''));

      if (searchTerms.length > 0) {
        // Each term must match at least one field (AND condition between terms)
        const termConditions = searchTerms.map(term => ({
          OR: [
            { UrunAdiTR: { contains: term } },
            { UrunAdiEN: { contains: term } },
            { UrunKodu: { contains: term } }
          ]
        }));

        // Add AND condition between terms
        whereConditions.push({
          OR: termConditions
        });

        // Brand search
        try {
          const brandResults = await prisma.nokta_urun_markalar.findMany({
            where: {
              OR: searchTerms.map(term => ({
                title: { contains: term }
              }))
            },
            select: { id: true }
          });

          if (brandResults.length > 0) {
            whereConditions.push({
              MarkaID: {
                in: brandResults.map(b => b.id)
              }
            });
          }
        } catch (brandError) {
          console.error('Error searching brands:', brandError instanceof Error ? brandError.message : 'Unknown error');
        }

        // Category search
        try {
          const categoryResults = await prisma.nokta_kategoriler.findMany({
            where: {
              AND: searchTerms.map(term => ({
                OR: [
                  { KategoriAdiTr: { contains: term } },
                  { KategoriAdiEn: { contains: term } }
                ]
              }))
            },
            select: { id: true }
          });

          if (categoryResults.length > 0) {
            whereConditions.push({
              KategoriID: {
                in: categoryResults.map(c => c.id)
              }
            });
          }
        } catch (categoryError) {
          console.error('Error searching categories:', categoryError instanceof Error ? categoryError.message : 'Unknown error');
        }
      }
    }

    // Category filtering
    if (seoLink) {
      try {
        const category = await prisma.nokta_kategoriler.findFirst({
          where: { seo_link: seoLink },
          select: { id: true }
        });

        if (category) {
          const allCategories = await prisma.nokta_kategoriler.findMany({
            select: { id: true, parent_id: true }
          });

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
          whereConditions.push({ KategoriID: { in: categoryIds } });
        }
      } catch (categoryError) {
        console.error('Error processing category:', categoryError instanceof Error ? categoryError.message : 'Unknown error');
      }
    } else if (categoryId) {
      whereConditions.push({ KategoriID: parseInt(categoryId) });
    }

    // Brand filtering
    if (brand) {
      try {
        const brandRecord = await prisma.nokta_urun_markalar.findFirst({
          where: { seo_link: brand },
          select: { id: true }
        });

        if (brandRecord) {
          whereConditions.push({ MarkaID: brandRecord.id });
        }
      } catch (brandError) {
        console.error('Error processing brand:', brandError instanceof Error ? brandError.message : 'Unknown error');
      }
    }

    // Combine all conditions with AND
    whereClause = whereConditions.length > 1
      ? { AND: whereConditions }
      : whereConditions[0] || {};

    const offset = (page - 1) * limit;

    // Fetch products and total count
    const [products, total] = await Promise.all([
      prisma.nokta_urunler.findMany({
        where: whereClause,
        select: {
          id: true,
          seo_link: true,
          UrunKodu: true,
          UrunAdiTR: true,
          UrunAdiEN: true,
          aktif: true,
          MarkaID: true,
          marka: {
            select: {
              id: true,
              title: true,
              seo_link: true
            }
          }
        },
        orderBy: {
          id: 'desc'
        },
        skip: offset,
        take: limit
      }),
      prisma.nokta_urunler.count({
        where: whereClause
      })
    ]);

    if (!products.length) {
      return NextResponse.json({
        products: [],
        hasMore: false,
        total: 0,
        currentPage: page
      });
    }

    // Fetch images
    let allProductImages: ProductImage[] = [];
    try {
      const productIds = products.map(product => product.id);
      allProductImages = await prisma.nokta_urunler_resimler.findMany({
        where: {
          UrunID: { in: productIds }
        },
        select: {
          UrunID: true,
          KResim: true
        },
        orderBy: {
          Sira: 'asc'
        }
      });
    } catch (imageError) {
      console.error('Error fetching images:', imageError instanceof Error ? imageError.message : 'Unknown error');
    }

    // Create image map
    const imageMap = new Map();
    for (const image of allProductImages) {
      if (!imageMap.has(image.UrunID) && image.KResim?.trim()) {
        imageMap.set(image.UrunID, image.KResim.trim());
      }
    }

    // Format products
    const formattedProducts = products.map(product => ({
      id: product.id,
      UrunAdiTR: product.UrunAdiTR || '',
      UrunAdiEN: product.UrunAdiEN || '',
      UrunKodu: product.UrunKodu || '',
      seo_link: product.seo_link || '',
      image: imageMap.get(product.id)
        ? `https://noktanet.s3.eu-central-1.amazonaws.com/uploads/images/products/${imageMap.get(product.id)}`
        : 'https://noktanet.s3.eu-central-1.amazonaws.com/uploads/images/products/gorsel_hazirlaniyor.jpg',
      marka: product.marka ? {
        id: product.marka.id,
        title: product.marka.title || '',
        seo_link: product.marka.seo_link || ''
      } : null
    }));

    return NextResponse.json({
      products: formattedProducts,
      hasMore: total > (page * limit),
      total,
      currentPage: page
    });

  } catch (error) {
    console.error('Error in products API:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({
      products: [],
      hasMore: false,
      total: 0,
      currentPage: page,
      error: 'Failed to fetch products'
    }, { status: 500 });
  }
}