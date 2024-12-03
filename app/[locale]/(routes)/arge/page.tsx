'use client'

import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cpu, RefreshCcw, Leaf } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

const ArgeFabrika = () => {
  const t = useTranslations('arge')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Header with Image */}
      <div className="relative bg-gradient-to-r from-blue-500 to-green-500 text-white py-12 mb-8">
        <div className="container mx-auto text-center">
          <motion.h1 
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {t('title')}
          </motion.h1>
        </div>
      </div>

      {/* Content Section with text */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.h2
          className="text-3xl font-semibold text-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          {t('subtitle')}
        </motion.h2>
        <motion.p
          className="text-lg text-gray-700 leading-relaxed mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          {t('description')}
        </motion.p>
      </div>

      {/* Cards Section with three cards */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.h2
          className="text-3xl font-semibold text-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
        >
          {t('factory.title')}
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <motion.div
            className="hover:shadow-xl transition duration-300 transform hover:scale-105 hover:translate-y-2 rounded-lg overflow-hidden shadow-md h-full"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.5 }}
          >
            <Card className="h-full flex flex-col">
              <div className="relative h-48">
                <Image
                  src="/path/to/your/image2.jpg"
                  alt={t('imageAlts.factory')}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
              <CardHeader className="flex-none">
                <CardTitle className="text-xl font-semibold text-primary flex items-center min-h-[3rem]">
                  <Cpu className="mr-3 h-6 w-6 text-blue-600 flex-shrink-0" /> 
                  <span>{t('factory.card1.title')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="text-gray-600 space-y-2">
                  {t.raw('factory.card1.items').map((item: string, index: number) => (
                    <li key={index} className="min-h-[2rem] flex items-start">
                      <span className="mt-1 mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            className="hover:shadow-xl transition duration-300 transform hover:scale-105 hover:translate-y-2 rounded-lg overflow-hidden shadow-md h-full"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 3 }}
          >
            <Card className="h-full flex flex-col">
              <div className="relative h-48">
                <Image
                  src="/path/to/your/image3.jpg"
                  alt={t('imageAlts.factory')}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
              <CardHeader className="flex-none">
                <CardTitle className="text-xl font-semibold text-primary flex items-center min-h-[3rem]">
                  <RefreshCcw className="mr-3 h-6 w-6 text-green-600 flex-shrink-0" />
                  <span>{t('factory.card2.title')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="text-gray-600 space-y-2">
                  {t.raw('factory.card2.items').map((item: string, index: number) => (
                    <li key={index} className="min-h-[2rem] flex items-start">
                      <span className="mt-1 mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            className="hover:shadow-xl transition duration-300 transform hover:scale-105 hover:translate-y-2 rounded-lg overflow-hidden shadow-md h-full"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 3.5 }}
          >
            <Card className="h-full flex flex-col">
              <div className="relative h-48">
                <Image
                  src="/path/to/your/image4.jpg"
                  alt={t('imageAlts.factory')}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
              <CardHeader className="flex-none">
                <CardTitle className="text-xl font-semibold text-primary flex items-center min-h-[3rem]">
                  <Leaf className="mr-3 h-6 w-6 text-green-600 flex-shrink-0" />
                  <span>{t('factory.card3.title')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="text-gray-600 space-y-2">
                  {t.raw('factory.card3.items').map((item: string, index: number) => (
                    <li key={index} className="min-h-[2rem] flex items-start">
                      <span className="mt-1 mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Bottom Image Section */}
      <div className="relative mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <motion.h2
              className="text-2xl font-semibold text-gray-800 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 4 }}
            >
              {t('bottomSection.title')}
            </motion.h2>
            <motion.p
              className="text-lg text-gray-700 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 4.5 }}
            >
              {t('bottomSection.description')}
            </motion.p>
          </div>

          {/* Image Section */}
          <div className="relative h-96">
            <Image
              src="/path/to/your/image5.jpg"
              alt={t('imageAlts.factory')}
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ArgeFabrika
