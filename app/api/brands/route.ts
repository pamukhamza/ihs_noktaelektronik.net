/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { type NextRequest } from 'next/server';

async function getAllSubcategoryIds(categoryId: number): Promise<number[]> {
  const subcategories = await prisma.nokta_kategoriler.findMany({
    where: {
      parent_id: categoryId
    },
    select: {
      id: true
    }
  });

  const subcategoryIds = subcategories.map(cat => cat.id);
  const nestedSubcategoryIds = await Promise.all(
    subcategoryIds.map(id => getAllSubcategoryIds(id))
  );

  return [categoryId, ...subcategoryIds, ...nestedSubcategoryIds.flat()];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category_id');
    
    let brandIds: number[] = [];
    
    if (categoryId) {
      // Get all subcategory IDs including the current category
      const allCategoryIds = await getAllSubcategoryIds(parseInt(categoryId));
      
      // Get brand IDs from category_brand_rel for all categories
      const brandRels = await prisma.category_brand_rel.findMany({
        where: {
          kat_id: {
            in: allCategoryIds
          }
        },
        select: {
          marka_id: true
        }
      });
      
      brandIds = brandRels
        .map(rel => rel.marka_id)
        .filter((id): id is number => id !== null);
    }

    const brands = await prisma.nokta_urun_markalar.findMany({
      where: {
        web_net: true,
        ...(brandIds.length > 0 && {
          id: {
            in: brandIds
          }
        })
      },
      orderBy: {
        title: 'asc'
      },
      select: {
        id: true,
        title: true,
        seo_link: true
      }
    });

    return new NextResponse(JSON.stringify({ brands }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch brands' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
