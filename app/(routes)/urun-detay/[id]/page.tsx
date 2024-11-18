import { notFound } from 'next/navigation'
import ProductDetail from './ProductDetail'
import { getProduct } from '@/app/actions/get-product'
import { Suspense } from 'react'
import Loading from './loading'

interface Props {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: Props) {
  try {
    const id = String(params?.id)
    const product = await getProduct(id)

    if (!product) {
      return notFound()
    }

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <Suspense fallback={<Loading />}>
          <ProductDetail product={product} />
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error('Error loading product:', error)
    return notFound()
  }
}