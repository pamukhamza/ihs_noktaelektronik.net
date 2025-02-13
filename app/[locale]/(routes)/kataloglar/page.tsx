'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

interface Catalog {
  id: number;
  title: string;
  title_en: string;
  img: string;
  file: string;
  sira: string;
}

const BASE_IMAGE_URL = 'https://noktanet.s3.eu-central-1.amazonaws.com/uploads/images/catalogs/';
const BASE_FILE_URL = 'https://noktanet.s3.eu-central-1.amazonaws.com/uploads/catalogs/';
const DEFAULT_IMAGE = 'https://noktanet.s3.eu-central-1.amazonaws.com/uploads/images/products/gorsel_hazirlaniyor.jpg';

export default function CatalogsPage() {
  const t = useTranslations('catalogs');
  const locale = useLocale();
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const response = await fetch('/api/catalogs');
        const data = await response.json();
        if (data.catalogs) {
          setCatalogs(data.catalogs);
        }
      } catch (error) {
        console.error('Error fetching catalogs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatalogs();
  }, []);

  const getTranslatedTitle = (catalog: Catalog) => {
    if (locale === 'tr') {
      return catalog.title || catalog.title_en || '';
    }
    return catalog.title_en || catalog.title || '';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {t('title')}
        </h1>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {catalogs.map((catalog) => (
            <motion.div
              key={catalog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <a 
                href={`${BASE_FILE_URL}${catalog.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="relative aspect-[4/5] bg-gray-100">
                  <Image
                    src={catalog.img ? `${BASE_IMAGE_URL}${catalog.img}` : DEFAULT_IMAGE}
                    alt={getTranslatedTitle(catalog)}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                  />
                </div>
                <div className="p-3">
                  <h2 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2">
                    {getTranslatedTitle(catalog)}
                  </h2>
                  <div className="flex items-center text-blue-600">
                    <FileText className="w-3 h-3 mr-1" />
                    <span className="text-xs">{t('viewCatalog')}</span>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </div>

        {catalogs.length === 0 && (
          <div className="text-center text-gray-500 mt-6">
            {t('noCatalogs')}
          </div>
        )}
      </div>
    </div>
  );
} 