'use client';

import { Suspense } from 'react';
import ProductsList from './ProductsList'
import { useTranslations } from 'next-intl';

export default function ProductsPage() {
  const t = useTranslations('products');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-12 mb-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
          <p className="text-xl mb-4">{t('subtitle')}</p>
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