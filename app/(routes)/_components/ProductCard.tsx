/* eslint-disable @typescript-eslint/no-unused-vars */
// components/ProductCard.tsx

import React from "react";
import Image from "next/image";
import Link from "next/link";

// Define the type for the `product` prop
interface Product {
  id: number;
  seo_link: string;
  UrunAdiTR: string;
  MarkaID?: number;
  image: string;
  marka?: {
    title: string;
  };
}

interface ProductCardProps {
  product: Product;
  viewMode: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode }) => {
  return (
    <div className={`group w-full h-full p-4 border rounded-lg shadow-md bg-white transition-transform duration-300 hover:scale-105 ${
      viewMode === 'grid' ? 'max-w-full' : 'flex flex-row items-center'
    }`}>
      <Link href={`/urun/${product.seo_link}`} passHref>
        <div className={`cursor-pointer ${viewMode === 'grid' ? 'flex flex-col h-full' : 'flex flex-row items-center gap-4 w-full'}`}>
          <div className={`relative ${
            viewMode === 'grid' 
              ? 'w-full aspect-square mb-4' 
              : 'w-[200px] aspect-square'
          }`}>
            <Image
              src={product.image}
              alt={product.UrunAdiTR || 'Nokta Elektronik Ürün'}
              fill
              className="object-contain rounded-md"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className={`flex flex-col ${viewMode === 'grid' ? 'flex-grow' : 'flex-1'}`}>
            <div className="flex flex-col h-full">
              <span className="inline-flex items-center mb-2">
                <span className="text-xs uppercase tracking-wider text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded">
                  {product.marka?.title || 'Marka'}
                </span>
              </span>
              <h4 className="font-medium text-base text-gray-900 line-clamp-2 mb-auto leading-snug hover:text-primary transition-colors">
                {product.UrunAdiTR}
              </h4>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
