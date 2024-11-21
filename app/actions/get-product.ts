import { PrismaClient } from '@prisma/client'
import { Product } from '../types/product'

const prisma = new PrismaClient()
export async function getProduct(seo_link: string): Promise<Product | null> {

  const productSeolink = seo_link
  try {
    // İlk olarak product'u alıyoruz
    const product = await prisma.nokta_urunler.findFirst({
      where: { seo_link: productSeolink },
      select: {
        id: true,
        UrunAdiTR: true,
        UrunAdiEN: true,
        UrunKodu: true,
        OzelliklerTR: true,
        OzelliklerEN: true,
        BilgiTR: true,
        BilgiEN: true,
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
        KategoriID: true,
        MarkaID: true
      }
    })

    if (!product) {
      return null
    }

    // Şimdi images'leri alabiliriz çünkü product artık var
    const images = await prisma.nokta_urunler_resimler.findMany({
      where: { UrunID: product.id },
      select: {
        KResim: true
      },
      orderBy: {
        Sira: 'asc'
      }
    })

    // Fetch brand information
    const brand = product.MarkaID
      ? await prisma.nokta_urun_markalar.findUnique({
          where: { id: product.MarkaID },
          select: { title: true }
        })
      : null

    // Fetch similar products
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

    // Fetch images for similar products
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
      brand: brand?.title || 'Unknown',
      images: images.map(img => img.KResim ? `/product-images/${img.KResim}` : '').filter(Boolean),
      generalFeatures: product.OzelliklerTR ? product.OzelliklerTR : 
        product.OzelliklerEN ? product.OzelliklerEN : [],
      technicalSpecs: product.BilgiTR ? product.BilgiTR :
        product.BilgiEN ? product.BilgiEN : [],
      applications: product.UygulamalarTr ? product.UygulamalarTr : 
        product.UygulamalarEn ? product.UygulamalarEn : [],
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
