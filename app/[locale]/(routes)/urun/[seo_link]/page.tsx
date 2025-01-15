import { notFound } from 'next/navigation'
import ProductDetail from './ProductDetail'
import { getProduct } from '@/app/actions/get-product'
import { Suspense } from 'react'
import Loading from './loading'
import { Metadata, ResolvingMetadata } from 'next'

interface PageParams {
  seo_link: string;
  locale: string;
}

interface Props {
  params: Promise<PageParams>;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { seo_link, locale } = await params;
  
  try {
    const product = await getProduct(seo_link)
    
    if (!product) {
      return {
        title: 'Product Not Found',
      }
    }

    const productName = locale === 'tr' ? product.name.UrunAdiTR : product.name.UrunAdiEN;
    const productDescription = locale === 'tr' 
      ? product.generalFeatures.OzelliklerTR 
      : product.generalFeatures.OzelliklerEN;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.noktaelektronik.net';

    return {
      title: productName,
      description: productDescription,
      openGraph: {
        title: productName,
        description: productDescription,
        images: product.images.map(image => ({
          url: image.startsWith('http') ? image : `${baseUrl}${image}`,
          width: 800,
          height: 600,
          alt: productName,
        })),
        type: 'website',
        siteName: 'Nokta',
        locale: locale,
      },
    }
  } catch (error) {
    return {
      title: 'Error',
      description: 'Error loading product',
    }
  }
}

export default async function ProductPage({ params }: Props) {
  const { seo_link } = await params;
  
  try {
    const product = await getProduct(seo_link)

    if (!product) {
      return notFound()
    }

    return (
      <Suspense fallback={<Loading />}>
        <ProductDetail product={product} />
      </Suspense>
    )
  } catch (error) {
    console.error('Error loading product:', error)
    return notFound()
  }
}
