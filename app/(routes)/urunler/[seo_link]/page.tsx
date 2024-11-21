'use client';

import { use } from 'react';
import ProductsList from '../ProductsList';

interface Props {
  params: Promise<{
    seo_link: string
  }>
}

export default function CategoryPage({ params }: Props) {
  const resolvedParams = use(params);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-12 mb-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Products</h1>
          <p className="text-xl mb-4">Browse our products by category</p>
        </div>
      </div>
      <ProductsList initialCategory={resolvedParams.seo_link} />
    </div>
  );
}
