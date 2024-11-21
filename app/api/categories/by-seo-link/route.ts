import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const seoLink = searchParams.get('seo_link');

    if (!seoLink) {
      return NextResponse.json(
        { error: 'seo_link parameter is required' },
        { status: 400 }
      );
    }

    const category = await prisma.nokta_kategoriler.findFirst({
      where: {
        seo_link: seoLink
      },
      select: {
        id: true,
        KategoriAdiTr: true,
        seo_link: true,
        parent_id: true,
      },
    });

    return NextResponse.json({
      category,
      success: true,
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}
