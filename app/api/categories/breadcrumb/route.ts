import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Category {
  id: number;
  seo_link: string | null;
  KategoriAdiTr: string | null;
  KategoriAdiEn: string | null;
  parent_id: number | null;
  sira: number | null;
  resim: string | null;
  old_id: number | null;
  is_active: boolean | null;
  marka_id: number | null;
  img_path: string | null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const seo_link = searchParams.get('seo_link');

  if (!seo_link) {
    return NextResponse.json({ error: 'seo_link is required' }, { status: 400 });
  }

  try {
    // First, find the target category
    const category = await prisma.nokta_kategoriler.findFirst({
      where: { seo_link: seo_link }
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Then recursively get all parent categories
    const breadcrumbs: Category[] = [];
    async function getParentCategory(parentId: number | null) {
      if (!parentId) return;
      
      const parent = await prisma.nokta_kategoriler.findFirst({
        where: { id: parentId }
      });
      
      if (parent) {
        breadcrumbs.unshift(parent); // Add to start of array to maintain hierarchy
        await getParentCategory(parent.parent_id);
      }
    }

    // Start with the current category
    breadcrumbs.push(category);
    
    // Get all parent categories
    await getParentCategory(category.parent_id);

    return NextResponse.json({ categories: breadcrumbs });
  } catch (error) {
    console.error('Error fetching category breadcrumbs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
