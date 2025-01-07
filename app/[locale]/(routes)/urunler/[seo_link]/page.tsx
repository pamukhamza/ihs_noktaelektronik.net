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
      <div className="bg-gradient-to-r from-blue-900 to-sky-600 text-white py-6">
        <div className="container mx-auto text-center">
        </div>
      </div>
      <ProductsList initialCategory={resolvedParams.seo_link} />
    </div>
  );
}
