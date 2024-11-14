'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Info, Shield } from "lucide-react"
import { motion } from 'framer-motion'

const AboutUs = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-12 mb-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Hakkımızda</h1>
          <p className="text-lg mb-8">Home -- Hakkımızda</p>
        </div>
      </motion.div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.h2
          className="text-3xl font-semibold text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Biz Kimiz?
        </motion.h2>

        <motion.p
          className="text-lg text-gray-700 leading-relaxed mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Şirketimiz, teknoloji ve inovasyonun gücünden faydalanarak sektörümüzdeki liderliğimizi sürdürüyoruz. Misyonumuz,
          müşterilerimize kaliteli hizmet sunarken, sürekli olarak gelişen ve değişen teknolojilere adapte olmaktır. 
          Yüksek kaliteli ürün ve hizmetler sunma konusunda sektördeki liderler arasında yer alıyoruz.
        </motion.p>

        {/* Vision & Mission */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.4 } }
          }}
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
            <Card className="bg-blue-50">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary">Vizyonumuz</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Teknolojiyi, insan odaklı bir yaklaşım ile birleştirerek, sektördeki tüm paydaşlarımıza katma değer sağlamak. 
                  Global pazarda öncü bir marka olmayı hedefliyoruz.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
            <Card className="bg-green-50">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary">Misyonumuz</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Sürekli yenilikçi çözümler geliştirerek, müşterilerimizin iş süreçlerini iyileştirmek ve her geçen gün daha fazla 
                  değer sunmak. İş gücümüzü ve kaynaklarımızı sürdürülebilirlik adına en verimli şekilde kullanmaktayız.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Our Values */}
        <motion.h2
          className="text-3xl font-semibold text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Değerlerimiz
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.4 } }
          }}
        >
          {[{
            icon: Shield,
            title: 'Güven',
            text: 'Müşterilerimizle güvene dayalı ilişkiler kurmayı, her zaman dürüst ve şeffaf olmayı ilke ediniyoruz.',
            color: 'text-blue-600'
          },
          {
            icon: Users,
            title: 'Takım Çalışması',
            text: 'Güçlü bir takım çalışması ile başarıya ulaşmayı ve her bir takım üyesinin gelişimine katkıda bulunmayı hedefliyoruz.',
            color: 'text-green-600'
          },
          {
            icon: Info,
            title: 'Yenilikçilik',
            text: 'Sürekli gelişim ve yenilikçi çözümler üreterek sektördeki değişimlere ayak uyduruyor ve öncülük ediyoruz.',
            color: 'text-purple-600'
          }].map((value, index) => (
            <motion.div
              key={index}
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.6, delay: index * 0.4 }} // Delay for staggered animation
            >
              <Card className="hover:shadow-xl transition duration-300">
                <CardHeader>
                  <div className="flex items-center">
                    <value.icon className={`mr-3 h-6 w-6 ${value.color}`} />
                    <CardTitle className="text-lg font-semibold">{value.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{value.text}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default AboutUs;
