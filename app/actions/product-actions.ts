'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getProducts(skip: number = 0, take: number = 20, selectedCategory: number) {
  try {
    const fetchedProducts = await prisma.nokta_urunler.findMany({
      skip,
      take,
      orderBy: {
        id: 'asc'
      }
    })

    if (!fetchedProducts || fetchedProducts.length === 0) {
      console.error("No products found.");
      return []
    }

    const productIds = fetchedProducts.map(product => product.id)

    const productImages = await prisma.nokta_urunler_resimler.findMany({
      where: {
        UrunID: {
          in: productIds
        }
      }
    })

    if (!productImages) {
      console.error("No product images found.");
      return []
    }

    const productsWithImages = fetchedProducts.map(product => {
      const imagesForProduct = productImages
        .filter(img => img.UrunID === product.id)
        .map(img => img.KResim)
        .filter((img): img is string => img !== null)

      return {
        ...product,
        images: imagesForProduct
      }
    })

    return productsWithImages
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  } finally {
    await prisma.$disconnect()
  }
}