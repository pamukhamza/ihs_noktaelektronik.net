import { notFound } from 'next/navigation'
import ProductDetail from './ProductDetail'
import { getProduct } from '@/app/actions/get-product'
import { Suspense } from 'react'
import Loading from './loading'

interface PageParams {
  seo_link: string;
  locale: string;
}

interface Props {
  params: Promise<PageParams>;
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
