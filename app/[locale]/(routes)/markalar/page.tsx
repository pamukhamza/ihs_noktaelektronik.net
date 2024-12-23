/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getBrands } from '@/app/actions/brands';
import { useTranslations } from 'next-intl'

type Brand = {
  id: number;
  title: string | null;
  seo_link: string | null;
  hover_img: string | null;
  link_img: string | null;
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  hover: { scale: 1.05, boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.2)' },
};

const getImageUrl = (path: string | null) => {
  if (!path) return '/placeholder.jpg';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/')) return path;
  return `/brands/${path}`;
};

const Markalar = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const t = useTranslations('markalar');

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBrands();
        setBrands(data);
      } catch (error: any) {
        console.error('Error fetching brands:', error);
        setError(error?.message || 'Markalar yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (!brands || brands.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-gray-500">Henüz marka bulunmamaktadır.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <div className="bg-gradient-to-r from-blue-900 to-sky-600 text-white py-12 mb-8">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
          </div>
        </div>
        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {brands.map((brand, index) => (
              <Link href={`urunler/?brands=${brand.seo_link}`} key={brand.id} className="block">
                <motion.div
                  className="rounded-lg"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  onHoverStart={() => setHoveredId(brand.id)}
                  onHoverEnd={() => setHoveredId(null)}
                >
                  <motion.div
                    className="bg-white p-4 rounded-lg shadow-lg flex items-center justify-center h-32"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1 + 0.2,
                    }}
                  >
                    <Image
                      src={getImageUrl(hoveredId === brand.id ? brand.hover_img : brand.hover_img)}
                      alt={brand.title || 'Marka'}
                      width={200}
                      height={120}
                      className="object-contain transition-all duration-300"
                      priority={index < 5}
                      loading={index < 5 ? "eager" : "lazy"}
                    />
                  </motion.div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Markalar;