'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Info, Shield } from "lucide-react"
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

const AboutUs = () => {
  const t = useTranslations('hakkimizda');

  const values = [
    {
      icon: Shield,
      title: t('values.items.0.title'),
      text: t('values.items.0.description'),
      color: 'text-blue-600'
    },
    {
      icon: Users,
      title: t('values.items.1.title'),
      text: t('values.items.1.description'),
      color: 'text-green-600'
    },
    {
      icon: Info,
      title: t('values.items.2.title'),
      text: t('values.items.2.description'),
      color: 'text-purple-600'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-blue-900 to-sky-600 text-white py-12 mb-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
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
          {t('whoWeAre.title')}
        </motion.h2>

        <motion.p
          className="text-lg text-gray-700 leading-relaxed mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {t('whoWeAre.description')}
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
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} >
            <Card className="bg-blue-50 h-full flex flex-col">
              <CardHeader className="flex-none">
                <CardTitle className="text-xl font-semibold text-primary min-h-[2rem]">{t('visionMission.vision.title')}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-600">{t('visionMission.vision.description')}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} >
            <Card className="bg-green-50 h-full flex flex-col">
              <CardHeader className="flex-none">
                <CardTitle className="text-xl font-semibold text-primary min-h-[2rem]">{t('visionMission.mission.title')}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-600">{t('visionMission.mission.description')}</p>
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
          {t('values.title')}
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
          {values.map((value, index) => (
            <motion.div
              key={index}
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.6, delay: index * 0.4 }}
            >
              <Card className="hover:shadow-xl transition duration-300 h-full flex flex-col">
                <CardHeader className="flex-none">
                  <div className="flex items-center">
                    <value.icon className={`flex-shrink-0 mr-3 h-6 w-6 ${value.color}`} />
                    <CardTitle className="text-lg font-semibold min-h-[2rem]">{value.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
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
