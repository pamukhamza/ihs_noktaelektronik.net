import { notFound } from 'next/navigation'
import ProductDetail from './ProductDetail'
import { getProduct } from '@/app/actions/get-product'
import { Suspense } from 'react'
import Loading from './loading'
import { Product } from '@/app/types/product'

type PageProps = {
  params: {
    seo_link: string
  }
}

export default async function ProductPage({ params }: PageProps) {
  try {

    const product = await getProduct(params.seo_link)

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
