import { notFound } from 'next/navigation'
import ProductDetail from './ProductDetail'
import { getProduct } from '@/app/actions/get-product'
import { Suspense } from 'react'
import Loading from './loading'
import { Product } from '@/app/types/product'

type PageProps = {
  params: {
    id: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function ProductPage({ params }: PageProps) {
  try {
    const product = await getProduct(params.id)

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