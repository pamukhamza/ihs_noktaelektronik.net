/* eslint-disable @typescript-eslint/no-unused-vars */
// components/ProductCard.tsx

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from 'next-intl'
import { getTranslatedField } from '@/lib/get-translated-field'

// Define the type for the `product` prop
interface Product {
  id: number;
  seo_link: string;
  UrunAdiTR: string;
  UrunAdiEN: string;
  UrunKodu: string;
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
  const locale = useLocale();
  const [imgSrc, setImgSrc] = useState(product.image);
  const defaultImage = 'https://noktanet.s3.eu-central-1.amazonaws.com/uploads/images/products/gorsel_hazirlaniyor.jpg';

  const productName = getTranslatedField(
    {
      UrunAdiTR: product.UrunAdiTR,
      UrunAdiEN: product.UrunAdiEN
    },
    'UrunAdi',
    locale
  ) || product.UrunAdiTR;

  const handleImageError = () => {
    setImgSrc(defaultImage);
  };

  return (
    <div className={`group w-full h-full p-4 border rounded-lg shadow-md bg-white overflow-hidden ${
      viewMode === 'grid' ? 'max-w-full sm:max-w-[calc(100vw-2rem)]' : 'flex flex-row items-center'
    }`}>
      <Link href={`/urun/${product.seo_link}`} passHref>
        <div className={`cursor-pointer ${viewMode === 'grid' ? 'flex flex-col h-full' : 'flex flex-row items-center gap-4 w-full'}`}>
          <div className={`relative overflow-hidden ${
            viewMode === 'grid' 
              ? 'w-full aspect-square mb-4' 
              : 'w-[200px] aspect-square'
          }`}>
            <Image
              src={imgSrc}
              alt={productName}
              fill
              priority={false}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain rounded-md transition-transform duration-300 group-hover:scale-110"
              onError={handleImageError}
              loading="lazy"
            />
          </div>
          <div className={`flex flex-col ${viewMode === 'grid' ? 'flex-grow' : 'flex-1'}`}>
            <div className="flex flex-col h-full">
              <span className="inline-flex items-center mb-2">
                <span className="text-[11px] uppercase tracking-wider text-black-500 font-medium bg-gradient-to-r from-blue-100 to-green-100 px-2 py-1 rounded">
                  {product.marka?.title || 'Marka'}
                </span>
              </span>
              <span className="inline-flex items-center mb-2">
                <span className="text-[11px] uppercase tracking-wider text-black-600 bg-gradient-to-r from-purple-100 to-pink-100 px-2 py-1 rounded">
                  {product.UrunKodu}
                </span>
              </span>
              <h4 className="font-bold text-base text-gray-800 line-clamp-2 mb-auto leading-snug hover:text-primary transition-colors">
                {productName}
              </h4>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
