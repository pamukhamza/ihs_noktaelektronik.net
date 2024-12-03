import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const brands = await prisma.nokta_urun_markalar.findMany({
      where: {
        is_active: true
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
