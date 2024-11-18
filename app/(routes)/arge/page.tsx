'use client'

import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cpu, RefreshCcw, Leaf } from 'lucide-react'
import { motion } from 'framer-motion'  // framer-motion import

const ArgeFabrika = () => {
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
            AR-GE ve Üretim
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
          AR-GE ve Fabrikamız
        </motion.h2>
        <motion.p
          className="text-lg text-gray-700 leading-relaxed mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          Şirketimiz, teknolojiyi sürekli yeniliklerle entegre ederek sektördeki liderliğini sürdürmekte. AR-GE (Araştırma
          ve Geliştirme) bölümümüzde, sektördeki en son yenilikleri takip ediyor ve bunları ürünlerimize entegre etmek için
          sürekli çalışmalar yapıyoruz. Yenilikçi çözümler geliştirmeye devam ediyoruz ve global pazarda öncü olmak için
          yatırımlarımıza hız kesmeden devam ediyoruz.
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
          Fabrikamız ve Yatırımlarımız
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <motion.div
            className="hover:shadow-xl transition duration-300 transform hover:scale-105 hover:translate-y-2 rounded-lg overflow-hidden shadow-md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.5 }}
          >
            <Card>
              <div className="relative h-48">
                <Image
                  src="/path/to/your/image2.jpg" // Your image path for the card
                  alt="Fabrika Görseli"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary flex items-center">
                  <Cpu className="mr-3 h-6 w-6 text-blue-600" /> Yüksek Teknoloji Üretim
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-600 space-y-2">
                  <li>Son teknoloji makinelerle üretim süreçlerini hızlandırıyoruz.</li>
                  <li>Verimliliği artıran robotik sistemler kullanıyoruz.</li>
                  <li>Çevre dostu üretim tekniklerini benimsiyoruz.</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            className="hover:shadow-xl transition duration-300 transform hover:scale-105 hover:translate-y-2 rounded-lg overflow-hidden shadow-md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 3 }}
          >
            <Card>
              <div className="relative h-48">
                <Image
                  src="/path/to/your/image3.jpg" // Your image path for the card
                  alt="Fabrika Görseli"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary flex items-center">
                  <RefreshCcw className="mr-3 h-6 w-6 text-green-600" /> İleri Düzey Ar-Ge Çalışmaları
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-600 space-y-2">
                  <li>Yeni ürün geliştirme üzerine sürekli araştırmalar yapıyoruz.</li>
                  <li>Yenilikçi çözümler için AR-GE projeleri yürütüyoruz.</li>
                  <li>Sektördeki gelişmeleri takip ederek en son teknolojilere yatırım yapıyoruz.</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            className="hover:shadow-xl transition duration-300 transform hover:scale-105 hover:translate-y-2 rounded-lg overflow-hidden shadow-md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 3.5 }}
          >
            <Card>
              <div className="relative h-48">
                <Image
                  src="/path/to/your/image4.jpg" // Your image path for the card
                  alt="Fabrika Görseli"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary flex items-center">
                  <Leaf className="mr-3 h-6 w-6 text-green-600" /> Sürdürülebilir Üretim
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-600 space-y-2">
                  <li>Çevre dostu malzemelerle üretim yapıyoruz.</li>
                  <li>Atık yönetimi ve geri dönüşüm uygulamaları geliştiriyoruz.</li>
                  <li>Enerji verimliliği sağlayan sistemler kullanıyoruz.</li>
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
              Fabrikamız
            </motion.h2>
            <motion.p
              className="text-lg text-gray-700 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 4.5 }}
            >
              Fabrikamızda, yüksek kaliteli üretim süreçlerini en son teknolojilerle birleştirerek müşterilerimize en iyi
              hizmeti sunmaktayız. Yüksek kapasiteli üretim tesislerimiz, çevre dostu üretim anlayışımız ve sürdürülebilir
              çözümlerle sektördeki rekabet avantajını elde ediyoruz.
            </motion.p>
          </div>

          {/* Image Section */}
          <div className="relative h-96">
            <Image
              src="/path/to/your/image5.jpg" // Your image path for the factory
              alt="Fabrika Görseli"
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

export default ArgeFabrika;
