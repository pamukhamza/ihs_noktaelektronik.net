'use client';

import { Suspense } from 'react';
import ProductsList from './ProductsList'

export default function ProductsPage() {

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-900 to-sky-600 text-white py-6">
        <div className="container mx-auto text-center">
        </div>
      </div>
      <Suspense fallback={
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      }>
        <ProductsList />
      </Suspense>
    </div>
  )
}