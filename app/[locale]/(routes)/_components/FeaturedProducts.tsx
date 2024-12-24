'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import ProductCard from './ProductCard'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

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

interface FeaturedProductsProps {
  viewMode: string;
}

export default function FeaturedProducts({ viewMode }: FeaturedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      slidesToScroll: 4,
      startIndex: 0,
      align: 'start'
    }, 
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );

  const t = useTranslations('home');

  const scrollTo = useCallback((index: number) => {
    if (!emblaApi) return;
    emblaApi.scrollTo(index * 4); // Scroll by groups of 4 slides
    setSelectedIndex(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const currentIndex = Math.floor(emblaApi.selectedScrollSnap() / 4);
    setSelectedIndex(currentIndex);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    emblaApi.on('select', onSelect);
    
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/featured-products');
        if (!response.ok) throw new Error('Failed to fetch featured products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-black">{t('featured_products')}</h2>
          <div className="animate-pulse grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const slideCount = Math.ceil(products.length / 4);

  return (
    <section className="py-8">
      <div className="container mx-auto px-1 md:px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-black">{t('featured_products')}</h2>
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {products.map((product) => (
                <div key={product.id} className="flex-[0_0_50%] md:flex-[0_0_25%] min-w-0 pl-2 md:pl-4">
                  <ProductCard product={product} viewMode={viewMode} />
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
            {[...Array(slideCount)].map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === selectedIndex ? 'bg-blue-600 w-6' : 'bg-gray-300 hover:bg-blue-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
