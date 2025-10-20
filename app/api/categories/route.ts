import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

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
      web_net: 1
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
            web_net: 1
          },
          select: { id: true }
        });

        whereClause = {
          web_net: 1,
          parent_id: 0,
          id: { in: rootCategories.map(cat => cat.id) }
        };
      } else {
        // For subcategories, get direct children of the specified parent
        whereClause = {
          web_net: 1,
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
        img_path: true
      },
      orderBy: {
        sira: 'asc'
      }
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error in categories API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}