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
        id: product.KategoriID ?? undefined,
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

    // Fetch product downloads and their categories in a single query
    const downloadData = await prisma.$queryRaw`
      SELECT 
        uy.id,
        uy.aciklama,
        uy.aciklamaEn,
        uy.url_path,
        uy.dosya_adi,
        uy.version,
        uy.type,
        uy.datetime,
        y.id as category_id,
        y.baslik as category_name,
        y.baslikEn as category_name_en,
        y.dosya_yolu
      FROM nokta_urunler_yuklemeler uy
      LEFT JOIN nokta_yuklemeler y ON uy.yukleme_id = y.id
      WHERE uy.urun_id = ${product.id}
      AND uy.is_active = true
      ORDER BY y.order_by ASC, uy.order_by ASC
    ` as Array<{
      id: number;
      aciklama: string | null;
      aciklamaEn: string | null;
      url_path: string | null;
      dosya_adi: string | null;
      version: string | null;
      type: string | null;
      datetime: Date | null;
      category_id: number;
      category_name: string | null;
      category_name_en: string | null;
      dosya_yolu: string | null;
    }>;

    // Group downloads by category
    const groupedDownloads: Product['downloads'] = [];
    const processedCategories = new Set<string>();

    downloadData.forEach(download => {
      const categoryName = download.category_name || download.category_name_en || 'Other';
      
      if (!processedCategories.has(categoryName)) {
        processedCategories.add(categoryName);
        groupedDownloads.push({
          name: categoryName,
          items: []
        });
      }

      const categoryGroup = groupedDownloads.find(group => group.name === categoryName);
      if (categoryGroup) {
        categoryGroup.items.push({
          id: download.id,
          name: download.aciklama || download.aciklamaEn || download.dosya_adi || 'Unknown',
          url: download.url_path 
            ? `https://noktanet.s3.eu-central-1.amazonaws.com${download.url_path}`
            : (download.dosya_yolu 
              ? `https://noktanet.s3.eu-central-1.amazonaws.com${download.dosya_yolu}`
              : '#'),
          version: download.version || '',
          type: download.type || '',
          date: download.datetime ? download.datetime.toISOString() : null
        });
      }
    });

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
      seo_link: product.seo_link || '',
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
      images: images.map(img => 
        img.KResim ? `${BASE_IMAGE_URL}${img.KResim}` : DEFAULT_IMAGE
      ),
      technicalSpecs: {
        BilgiTR: product.BilgiTR || '',
        BilgiEN: product.BilgiEN || ''
      },
      generalFeatures: {
        OzelliklerTR: product.OzelliklerTR || '',
        OzelliklerEN: product.OzelliklerEN || ''
      },
      applications: {
        UygulamalarTr: product.UygulamalarTr || '',
        UygulamalarEn: product.UygulamalarEn || ''
      },
      isNew: product.YeniUrun || false,
      isActive: product.aktif || false,
      createdAt: product.create_date?.toISOString() || null,
      modifiedAt: product.modify_date?.toISOString() || null,
      downloads: groupedDownloads,
      similarProducts: similarProductsWithImages.map(product => ({
        id: product.id,
        name: {
          UrunAdiTR: product.UrunAdiTR || '',
          UrunAdiEN: product.UrunAdiEN || ''
        },
        image: product.image,
        seo_link: product.seo_link || ''
      }))
    }

    return transformedProduct
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}
