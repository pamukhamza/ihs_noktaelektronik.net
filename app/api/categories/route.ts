import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

const BASE_IMAGE_URL = 'https://noktanet.s3.eu-central-1.amazonaws.com/uploads/images/products/';
const DEFAULT_IMAGE = 'gorsel_hazirlaniyor.jpg';
const CATEGORY_IMAGE_URL = 'https://noktanet.s3.eu-central-1.amazonaws.com/uploads/images/categories/';

async function getCategoryImage(categoryId: number): Promise<string | null> {
  try {
    // First try to get an image from a direct product
    const productWithImage = await prisma.nokta_urunler.findFirst({
      where: {
        KategoriID: categoryId,
        aktif: true,
      },
      select: {
        id: true,
        resimler: {
          where: { Sira: 1 },
          select: { KResim: true },
          take: 1
        }
      }
    });

    if (productWithImage?.resimler[0]?.KResim) {
      return `${BASE_IMAGE_URL}${productWithImage.resimler[0].KResim}`;
    }

    // If no direct product image, get subcategories
    const subcategories = await prisma.nokta_kategoriler.findMany({
      where: { parent_id: categoryId },
      select: { id: true }
    });

    // If there are no subcategories, try to get more products from the current category
    if (subcategories.length === 0) {
      const moreProducts = await prisma.nokta_urunler.findMany({
        where: {
          KategoriID: categoryId,
          aktif: true,
        },
        select: {
          id: true,
          resimler: {
            where: { Sira: 1 },
            select: { KResim: true },
            take: 1
          }
        },
        take: 5 // Try a few more products in case the first one didn't have an image
      });

      for (const product of moreProducts) {
        if (product.resimler[0]?.KResim) {
          return `${BASE_IMAGE_URL}${product.resimler[0].KResim}`;
        }
      }
    }

    // If still no image and there are subcategories, try them
    for (const subcat of subcategories) {
      const subcatProductImage = await prisma.nokta_urunler.findFirst({
        where: {
          KategoriID: subcat.id,
          aktif: true,
        },
        select: {
          id: true,
          resimler: {
            where: { Sira: 1 },
            select: { KResim: true },
            take: 1
          }
        }
      });

      if (subcatProductImage?.resimler[0]?.KResim) {
        return `${BASE_IMAGE_URL}${subcatProductImage.resimler[0].KResim}`;
      }
    }

    return `${BASE_IMAGE_URL}${DEFAULT_IMAGE}`;
  } catch (error) {
    console.error('Error getting category image:', error);
    return `${BASE_IMAGE_URL}${DEFAULT_IMAGE}`;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = parseInt(searchParams.get('parent_id') || '0');
    const brandSeoLink = searchParams.get('brand');

    if (isNaN(parentId)) {
      return NextResponse.json({
        categories: [],
        success: false,
        error: 'Invalid parent_id'
      }, { status: 400 });
    }

    let whereClause: Prisma.nokta_kategorilerWhereInput = {
      parent_id: parentId,
      is_active: true
    };

    if (brandSeoLink) {
      // Get the brand ID from seo_link
      const brand = await prisma.nokta_urun_markalar.findFirst({
        where: { seo_link: brandSeoLink },
        select: { id: true }
      });

      if (!brand) {
        return NextResponse.json({ categories: [] });
      }

      // Get all category IDs that are related to this brand
      const categoryRelations = await prisma.category_brand_rel.findMany({
        where: { marka_id: brand.id },
        select: { kat_id: true }
      });

      const categoryIds = categoryRelations.map(rel => rel.kat_id).filter(id => id !== null) as number[];

      if (parentId === 0) {
        // For root level, get all parent categories that have relations
        const rootCategories = await prisma.nokta_kategoriler.findMany({
          where: {
            id: { in: categoryIds },
            parent_id: 0,
            is_active: true
          },
          select: { id: true }
        });

        whereClause = {
          is_active: true,
          parent_id: 0,
          id: { in: rootCategories.map(cat => cat.id) }
        };
      } else {
        // For subcategories, get direct children of the specified parent
        whereClause = {
          is_active: true,
          parent_id: parentId,
          id: { in: categoryIds }
        };
      }
    }

    const categories = await prisma.nokta_kategoriler.findMany({
      where: whereClause,
      select: {
        id: true,
        KategoriAdiTr: true,
        KategoriAdiEn: true,
        seo_link: true,
        img_path: true,
        parent_id: true
      },
      orderBy: {
        sira: 'asc'
      }
    });

    // Get product images for non-root categories
    const categoriesWithImages = await Promise.all(
      categories.map(async (category) => {
        if (category.parent_id === 0) {
          // For root categories, use the original img_path
          return {
            ...category,
            img_path: category.img_path ? 
              `${CATEGORY_IMAGE_URL}${category.img_path}` : 
              `${BASE_IMAGE_URL}${DEFAULT_IMAGE}`
          };
        }

        // For non-root categories, try to get a product image
        const productImage = await getCategoryImage(category.id);
        
        return {
          ...category,
          img_path: productImage || `${BASE_IMAGE_URL}${DEFAULT_IMAGE}`
        };
      })
    );

    return NextResponse.json({ categories: categoriesWithImages });
  } catch (error) {
    console.error('Error in categories API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}