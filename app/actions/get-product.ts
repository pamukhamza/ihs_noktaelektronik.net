import { PrismaClient } from '@prisma/client'
import { Product } from '../types/product'

const prisma = new PrismaClient()

export async function getProduct(id: string): Promise<Product | null> {
  if (!id) {
    throw new Error('Product ID is required')
  }

  const productId = parseInt(id)
  if (isNaN(productId)) {
    throw new Error('Invalid product ID')
  }

  try {
    const [product, images] = await Promise.all([
      // Fetch product
      prisma.nokta_urunler.findUnique({
        where: { id: productId },
        select: {
          id: true,
          UrunAdiTR: true,
          UrunAdiEN: true,
          UrunKodu: true,
          OzelliklerTR: true,
          OzelliklerEN: true,
          UygulamalarTr: true,
          UygulamalarEn: true,
          datasheet: true,
          manual: true,
          SurucuIndir: true,
          firmware: true,
          sertifika: true,
          YeniUrun: true,
          aktif: true,
          create_date: true,
          modify_date: true,
          KategoriID: true
        }
      }),
      // Fetch images
      prisma.nokta_urunler_resimler.findMany({
        where: { UrunID: productId },
        select: {
          KResim: true
        },
        orderBy: {
          Sira: 'asc'
        }
      })
    ])

    if (!product) {
      return null
    }

    // Fetch similar products in parallel
    const similarProducts = await prisma.nokta_urunler.findMany({
      where: {
        AND: [
          { KategoriID: product.KategoriID },
          { id: { not: product.id } },
          { aktif: true }
        ]
      },
      take: 4,
      select: {
        id: true,
        UrunAdiTR: true,
        UrunAdiEN: true
      },
      orderBy: {
        create_date: 'desc'
      }
    })

    const similarProductsWithImages = await Promise.all(
      similarProducts.map(async (prod) => {
        const prodImages = await prisma.nokta_urunler_resimler.findMany({
          where: { UrunID: prod.id },
          select: { KResim: true },
          orderBy: { Sira: 'asc' },
          take: 1
        })
        
        return {
          id: prod.id,
          name: prod.UrunAdiTR || prod.UrunAdiEN || '',
          image: prodImages[0]?.KResim || null
        }
      })
    )

    // Transform the data to match our frontend needs
    const transformedProduct = {
      id: product.id,
      name: product.UrunAdiTR || product.UrunAdiEN || '',
      stockCode: product.UrunKodu || '',
      brand: '', // You might want to fetch this from a brands table
      images: images.map(img => img.KResim ? `/product-images/${img.KResim}` : '').filter(Boolean),
      generalFeatures: product.OzelliklerTR ? 
        product.OzelliklerTR.split('\n').filter(Boolean) : 
        product.OzelliklerEN ? 
          product.OzelliklerEN.split('\n').filter(Boolean) : 
          [],
      technicalSpecs: [], // You can parse BilgiTR/BilgiEN if they contain structured data
      applications: product.UygulamalarTr ? 
        product.UygulamalarTr.split('\n').filter(Boolean) : 
        product.UygulamalarEn ? 
          product.UygulamalarEn.split('\n').filter(Boolean) : 
          [],
      downloads: [
        product.datasheet ? { name: 'Data Sheet', url: `/product-files/${product.datasheet}` } : null,
        product.manual ? { name: 'User Manual', url: `/product-files/${product.manual}` } : null,
        product.SurucuIndir ? { name: 'Driver', url: `/product-files/${product.SurucuIndir}` } : null,
        product.firmware ? { name: 'Firmware', url: `/product-files/${product.firmware}` } : null,
        product.sertifika ? { name: 'Certificate', url: `/product-files/${product.sertifika}` } : null
      ].filter((item): item is { name: string; url: string; } => item !== null),
      similarProducts: similarProductsWithImages.map(prod => ({
        ...prod,
        image: prod.image ? `/product-images/${prod.image}` : '/gorsel_hazirlaniyor.jpg'
      })),
      isNew: product.YeniUrun || false,
      isActive: product.aktif || false,
      createdAt: product.create_date || null,
      modifiedAt: product.modify_date || null
    }

    return transformedProduct
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}