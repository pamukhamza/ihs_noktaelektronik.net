import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = parseInt(searchParams.get('parent_id') || '0');

    if (isNaN(parentId)) {
      return NextResponse.json({
        categories: [],
        success: false,
        error: 'Invalid parent_id'
      }, { status: 400 });
    }

    const categories = await prisma.nokta_kategoriler.findMany({
      where: {
        parent_id: parentId,
        is_active: true
      },
      select: {
        id: true,
        KategoriAdiTr: true,
        KategoriAdiEn: true,
        seo_link: true,
        parent_id: true,
      },
      orderBy: {
        KategoriAdiTr: 'asc',
      },
    });

    if (!categories) {
      return NextResponse.json({
        categories: [],
        success: true
      });
    }

    // Ensure seo_link is not null
    const validCategories = categories.map(cat => ({
      ...cat,
      KategoriAdiTr: cat.KategoriAdiTr || '',
      KategoriAdiEn: cat.KategoriAdiEn || '',
      seo_link: cat.seo_link || `category-${cat.id}` // Fallback if seo_link is null
    }));

    return NextResponse.json({
      categories: validCategories,
      success: true,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { parent_id } = await request.json();
    
    if (isNaN(parent_id)) {
      return NextResponse.json({
        categories: [],
        success: false,
        error: 'Invalid parent_id'
      }, { status: 400 });
    }

    const categories = await prisma.nokta_kategoriler.findMany({
      where: {
        parent_id: parent_id,
        is_active: true
      },
      select: {
        id: true,
        KategoriAdiTr: true,
        KategoriAdiEn: true,
        seo_link: true,
        parent_id: true,
      }
    });

    if (!categories) {
      return NextResponse.json({
        categories: [],
        success: true
      });
    }

    // Ensure seo_link is not null
    const validCategories = categories.map(cat => ({
      ...cat,
      KategoriAdiTr: cat.KategoriAdiTr || '',
      KategoriAdiEn: cat.KategoriAdiEn || '',
      seo_link: cat.seo_link || `category-${cat.id}` // Fallback if seo_link is null
    }));

    return NextResponse.json({
      categories: validCategories,
      success: true,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}