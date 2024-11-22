import { PrismaClient } from '@prisma/client'
import { Product, Download, DownloadCategory } from '../types/product'

const prisma = new PrismaClient()

export async function getProduct(seo_link: string): Promise<Product | null> {
  const productSeolink = seo_link
  try {
    // Fetch the product
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

    // Fetch images
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
        UrunAdiEN: true,
        seo_link: true
      },
      orderBy: {
        create_date: 'desc'
      }
    })

    // Fetch downloads with category information
    const downloads = await prisma.nokta_urunler_yuklemeler.findMany({
      where: { urun_id: product.id },
      select: {
        id: true,
        aciklama: true,
        aciklamaEn: true,
        url_path: true,
        dosya_adi: true,
        version: true,
        type: true,
        datetime: true,
        yukleme_id: true
      },
      orderBy: {
        order_by: 'asc'
      }
    })

    // Fetch download categories (headers)
    const downloadCategories = await prisma.nokta_yuklemeler.findMany({
      select: {
        id: true,
        baslik: true,
        baslikEn: true
      }
    })

    // Create a map of download categories for easy lookup
    const categoryMap = new Map(downloadCategories.map(cat => [cat.id, cat]))

    // Group downloads by category
    const groupedDownloads: DownloadCategory[] = []
    downloads.forEach(download => {
      const categoryId = download.yukleme_id
      const category = categoryId ? categoryMap.get(categoryId) : null
      const categoryName = category ? (category.baslik || category.baslikEn || 'Unknown') : 'Unknown'

      let categoryGroup = groupedDownloads.find(group => group.name === categoryName)
      if (!categoryGroup) {
        categoryGroup = { name: categoryName, items: [] }
        groupedDownloads.push(categoryGroup)
      }

      categoryGroup.items.push({
        id: download.id,
        name: download.aciklama || download.aciklamaEn || download.dosya_adi || 'Unknown',
        url: download.url_path ? `/product-files/${download.url_path}` : '#',
        version: download.version || '',
        type: download.type || '',
        date: download.datetime ? download.datetime.toISOString() : null
      })
    })

    // Add existing downloads to appropriate categories
    const addToCategory = (name: string, item: Download) => {
      let category = groupedDownloads.find(cat => cat.name === name)
      if (!category) {
        category = { name, items: [] }
        groupedDownloads.push(category)
      }
      category.items.push(item)
    }

    if (product.datasheet) {
      addToCategory('Data Sheet', { id: 0, name: 'Data Sheet', url: `/product-files/${product.datasheet}` })
    }
    if (product.manual) {
      addToCategory('User Manual', { id: 0, name: 'User Manual', url: `/product-files/${product.manual}` })
    }
    if (product.SurucuIndir) {
      addToCategory('Driver', { id: 0, name: 'Driver', url: `/product-files/${product.SurucuIndir}` })
    }
    if (product.firmware) {
      addToCategory('Firmware', { id: 0, name: 'Firmware', url: `/product-files/${product.firmware}` })
    }
    if (product.sertifika) {
      addToCategory('Certificate', { id: 0, name: 'Certificate', url: `/product-files/${product.sertifika}` })
    }

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
          ...prod,
          image: prodImages[0]?.KResim || null
        }
      })
    )

    // Transform the data to match our frontend needs
    const transformedProduct: Product = {
      id: product.id,
      name: product.UrunAdiTR || product.UrunAdiEN || '',
      stockCode: product.UrunKodu || '',
      brand: brand?.title || 'Unknown',
      images: images.map(img => img.KResim ? `/product-images/${img.KResim}` : '').filter(Boolean),
      generalFeatures: product.OzelliklerTR || product.OzelliklerEN || '',
      technicalSpecs: product.BilgiTR || product.BilgiEN || '',
      applications: product.UygulamalarTr || product.UygulamalarEn || '',
      downloads: groupedDownloads,
      similarProducts: similarProductsWithImages.map(prod => ({
        id: prod.id,
        name: prod.UrunAdiTR || prod.UrunAdiEN || '',
        image: prod.image ? `/product-images/${prod.image}` : '/gorsel_hazirlaniyor.jpg',
        seo_link: prod.seo_link || ''
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

