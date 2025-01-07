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
      <div className="relative bg-gradient-to-r from-blue-900 to-sky-600 text-white py-12 mb-8">
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

      {/* Bottom Image Section */}
      
      <div className="relative mt-2">
        <div className="container mx-auto px-4 py-5">
          {/* Image Section */}
          <div className="relative h-96">
            <motion.p
              className="text-lg text-gray-700 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <Image
                src="https://noktanet.s3.eu-central-1.amazonaws.com/uploads/images/arge/fabrika.jpg"
                alt={t('imageAlts.factory')}
                layout="fill"
                objectFit="cover"
                className="rounded-lg shadow-lg"
              />
            </motion.p>
          </div>
          <div className="text-center  py-10">
            <motion.h1
              className="text-3xl font-semibold text-gray-800 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.4 }}
            >
              {t('bottomSection.title')}
            </motion.h1>
            <motion.p
              className="text-lg text-gray-700 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.8 }}
            >
              {t('bottomSection.description')}<br/><br/>
              {t('description')}
            </motion.p>
          </div>
        </div>
      </div>
      {/* Cards Section with three cards */}
      <div className="container mx-auto px-4 py-8 pb-20 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <motion.div
            className="hover:shadow-xl transition duration-300 transform hover:scale-105 hover:translate-y-2 rounded-lg overflow-hidden shadow-md h-full"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.2 }}
          >
            <Card className="h-full flex flex-col">
              <div className="relative h-48">
                <Image
                  src="https://noktanet.s3.eu-central-1.amazonaws.com/uploads/images/arge/Yüksek-Teknoloji.jpg"
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
            transition={{ duration: 0.8, delay: 2.6 }}
          >
            <Card className="h-full flex flex-col">
              <div className="relative h-48">
                <Image
                  src="https://noktanet.s3.eu-central-1.amazonaws.com/uploads/images/arge/arge.webp"
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
            transition={{ duration: 0.8, delay: 3 }}
          >
            <Card className="h-full flex flex-col">
              <div className="relative h-48">
                <Image
                  src="https://noktanet.s3.eu-central-1.amazonaws.com/uploads/images/arge/sürdürülebilir.webp"
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

      
    </motion.div>
  )
}

export default ArgeFabrika
