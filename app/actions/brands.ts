/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';

import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

type Brand = {
  id: number;
  title: string | null;
  seo_link: string | null;
  hover_img: string | null;
  link_img: string | null;
};

export async function getBrands() {
  try {
    const brands = await prisma.nokta_urun_markalar.findMany({
      select: {
        id: true,
        title: true,
        seo_link: true,
        hover_img: true,
        link_img: true,
      },
      where: {
        web_net: true,
      },
      orderBy: {
        order_by: 'asc',
      },
    });

    if (!brands) {
      throw new Error('Markalar bulunamadı');
    }

    return brands;
  } catch (error: any) {
    console.error('Database error:', error);
    throw new Error(`Veritabanı hatası: ${error.message}`);
  }
}
