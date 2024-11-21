import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'id parameter is required' },
        { status: 400 }
      );
    }

    const category = await prisma.nokta_kategoriler.findUnique({
      where: {
        id: parseInt(id),
        is_active: true
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
