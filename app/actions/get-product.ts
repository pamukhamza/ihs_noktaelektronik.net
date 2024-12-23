import { prisma } from "@/lib/prisma"
import { Product } from "@/types/product"

const BASE_IMAGE_URL = 'https://noktanet.s3.eu-central-1.amazonaws.com/uploads/images/products/';
const DEFAULT_IMAGE = 'https://noktanet.s3.eu-central-1.amazonaws.com/uploads/images/products/gorsel_hazirlaniyor.jpg';

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
        MarkaID: true,
        seo_link: true
      }
    })

    if (!product) {
      return null
    }

    // Fetch categories
    const categories = await prisma.nokta_kategoriler.findMany({
      where: {
        id: product.KategoriID ?? undefined,  // Use nullish coalescing to handle null
        is_active: true
      },
      select: {
        id: true,
        KategoriAdiTr: true,
        KategoriAdiEn: true,
        seo_link: true,
      }
    });

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
    const groupedDownloads: Product['downloads'] = []
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
        url: download.url_path ? `https://noktanet.s3.eu-central-1.amazonaws.com${download.url_path}` : '#',
        version: download.version || '',
        type: download.type || '',
        date: download.datetime ? download.datetime.toISOString() : null
      })
    })

    // Add existing downloads to appropriate categories
    const addToCategory = (name: string, item: Product['downloads'][0]['items'][0]) => {
      let category = groupedDownloads.find(cat => cat.name === name)
      if (!category) {
        category = { name, items: [] }
        groupedDownloads.push(category)
      }
      category.items.push(item)
    }

    if (product.datasheet) {
      addToCategory('Data Sheet', { id: 0, name: 'Data Sheet', url: `https://noktanet.s3.eu-central-1.amazonaws.com${product.datasheet}` })
    }
    if (product.manual) {
      addToCategory('User Manual', { id: 0, name: 'User Manual', url: `https://noktanet.s3.eu-central-1.amazonaws.com${product.manual}` })
    }
    if (product.SurucuIndir) {
      addToCategory('Driver', { id: 0, name: 'Driver', url: `https://noktanet.s3.eu-central-1.amazonaws.com${product.SurucuIndir}` })
    }
    if (product.firmware) {
      addToCategory('Firmware', { id: 0, name: 'Firmware', url: `https://noktanet.s3.eu-central-1.amazonaws.com${product.firmware}` })
    }
    if (product.sertifika) {
      addToCategory('Certificate', { id: 0, name: 'Certificate', url: `https://noktanet.s3.eu-central-1.amazonaws.com/${product.sertifika}` })
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
          image: prodImages[0]?.KResim 
            ? `${BASE_IMAGE_URL}${prodImages[0].KResim}` 
            : DEFAULT_IMAGE
        }
      })
    )

    // Transform the data to match our frontend needs
    const transformedProduct: Product = {
      id: product.id,
      name: {
        UrunAdiTR: product.UrunAdiTR || '',
        UrunAdiEN: product.UrunAdiEN || ''
      },
      stockCode: product.UrunKodu || '',
      brand: brand?.title || 'Unknown',
      categories: categories.map(cat => ({
        id: cat.id,
        name: {
          KategoriAdiTR: cat.KategoriAdiTr || '',
          KategoriAdiEN: cat.KategoriAdiEn || ''
        },
        seo_link: cat.seo_link || ''
      })),
      images: images.map(img => img.KResim ? `${BASE_IMAGE_URL}${img.KResim}` : '').filter(Boolean),
      generalFeatures: {
        OzelliklerTR: product.OzelliklerTR || '',
        OzelliklerEN: product.OzelliklerEN || ''
      },
      technicalSpecs: {
        BilgiTR: product.BilgiTR || '',
        BilgiEN: product.BilgiEN || ''
      },
      applications: {
        UygulamalarTr: product.UygulamalarTr || '',
        UygulamalarEn: product.UygulamalarEn || ''
      },
      downloads: groupedDownloads,
      similarProducts: similarProductsWithImages.map(prod => ({
        id: prod.id,
        name: {
          UrunAdiTR: prod.UrunAdiTR || '',
          UrunAdiEN: prod.UrunAdiEN || ''
        },
        image: prod.image || '', 
        seo_link: prod.seo_link || ''
      })),
      seo_link: product.seo_link || '',
      isNew: product.YeniUrun || false,
      isActive: product.aktif || false,
      createdAt: product.create_date ? new Date(product.create_date).toISOString() : null,
      modifiedAt: product.modify_date ? new Date(product.modify_date).toISOString() : null
    }

    return transformedProduct
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}
