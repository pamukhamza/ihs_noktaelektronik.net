'use client';

import ProductsList from './ProductsList'

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-12 mb-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Discover Amazing Products</h1>
          <p className="text-xl mb-4">Find the best deals on our wide range of high-quality items</p>
        </div>
      </div>
      <ProductsList />
    </div>
  )
}