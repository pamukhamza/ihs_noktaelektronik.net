/* eslint-disable @typescript-eslint/no-unused-vars */
// components/ProductCard.tsx

import React from "react";
import Image from "next/image";
import Link from "next/link";

// Define the type for the `product` prop
interface Product {
  id: string;       // ID of the product (could be string or number)
  image: string;    // URL for the product image
  name: string;     // Name of the product
  brand: string;    // Brand of the product
}

interface ProductCardProps {
  product: Product; // Use the `Product` type for the `product` prop
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="p-4 border rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
      <Link href={`/products/${product.id}`} passHref>
        <div className="cursor-pointer">
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={200}
            className="w-full h-auto rounded-md mb-4 object-cover"
          />
          <p className="text-gray-500 mb-1">{product.brand}</p>
          <h4 className="font-semibold text-lg mb-2">{product.name}</h4>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
