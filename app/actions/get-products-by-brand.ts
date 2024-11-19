'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getProductsByBrandId(brandId: number) {
  try {
    const products = await prisma.nokta_urunler.findMany({
      where: {
        MarkaID: brandId,
        aktif: true
      },
      select: {
        id: true,
        UrunAdiTR: true,
        UrunAdiEN: true,
        UrunKodu: true,
      },
      orderBy: {
        create_date: 'desc'
      }
    });

    // Fetch the first image for each product
    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const images = await prisma.nokta_urunler_resimler.findMany({
          where: { UrunID: product.id },
          select: { KResim: true },
          orderBy: { Sira: 'asc' },
          take: 1
        });

        return {
          id: product.id,
          title: product.UrunAdiTR || product.UrunAdiEN || '',
          code: product.UrunKodu || '',
          image: images[0]?.KResim ? `/product-images/${images[0].KResim}` : '/gorsel_hazirlaniyor.jpg'
        };
      })
    );

    return productsWithImages;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}
