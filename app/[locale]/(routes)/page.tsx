/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, Stethoscope, Code, ChevronRight} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { type CarouselApi } from "@/components/ui/carousel"
import FeaturedProducts from './_components/FeaturedProducts'
import Autoplay from 'embla-carousel-autoplay'
import Link from 'next/link'
import { WhatsAppButton } from "@/components/whatsapp-button"

const mainSliderItems = [
  { id: 1, image: "/slider/1.jpg?height=600&width=1600", titleKey: "slider.innovative.title", subtitleKey: "slider.innovative.subtitle" },
  { id: 2, image: "/slider/2.jpg?height=600&width=1600", titleKey: "slider.security.title", subtitleKey: "slider.security.subtitle" },
  { id: 3, image: "/slider/3.jpg?height=600&width=1600", titleKey: "slider.medical.title", subtitleKey: "slider.medical.subtitle" },
]

interface Product {
  id: number;
  name: string;
  image: string;
}

const solutions = [
  { id: 1, nameKey: "solutions.cctv", icon: "🎥" },
  { id: 2, nameKey: "solutions.fireAlarms", icon: "🚨" },
  { id: 3, nameKey: "solutions.accessControl", icon: "🔐" },
  { id: 4, nameKey: "solutions.patientMonitoring", icon: "💓" },
  { id: 5, nameKey: "solutions.telemedicine", icon: "🏥" },
  { id: 6, nameKey: "solutions.ehrSystems", icon: "📊" },
  { id: 7, nameKey: "solutions.customSoftware", icon: "💻" },
  { id: 8, nameKey: "solutions.mobileApps", icon: "📱" },
  { id: 9, nameKey: "solutions.cloudSolutions", icon: "☁️" },
  { id: 10, nameKey: "solutions.aiIntegration", icon: "🤖" },
]


export default function Home() {
  const t = useTranslations('home')
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [solutionsApi, setSolutionsApi] = useState<CarouselApi>()
  const [currentSolution, setCurrentSolution] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  useEffect(() => {
    if (!solutionsApi) {
      return
    }

    solutionsApi.on("select", () => {
      setCurrentSolution(solutionsApi.selectedScrollSnap())
    })
  }, [solutionsApi])

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="relative">
        <div className="md:container md:mx-auto -mx-4 md:mx-0">
          <Carousel 
            className="w-full md:max-w-[1600px] md:mx-auto relative group"
            opts={{
              loop: true,
              align: "start",
            }}
            setApi={setApi}
            plugins={[
              Autoplay({
                delay: 5000,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
          >
            <CarouselContent>
              {mainSliderItems.map((item, index) => (
                <CarouselItem key={item.id}>
                  {/* Desktop Version */}
                  <div className="hidden md:block relative aspect-[16/6] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={t(item.titleKey)}
                      fill
                      priority={index === 0}
                      className="object-contain"
                      sizes="(max-width: 1600px) 100vw, 1600px"
                      quality={100}
                    />
                  </div>
                  {/* Mobile Version */}
                  <div className="md:hidden relative aspect-[16/9] overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image
                        src={item.image}
                        alt={t(item.titleKey)}
                        fill
                        priority={index === 0}
                        className="object-contain"
                        sizes="100vw"
                        quality={100}
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 px-4 py-2 rounded-full bg-black/20 backdrop-blur-sm">
              {mainSliderItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`relative h-2.5 transition-all duration-500 ease-out ${
                    index === current ? 'w-12 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/60'
                  } rounded-full overflow-hidden group`}
                >
                  <span className={`absolute inset-0 w-full h-full transition-all duration-500 ${
                    index === current ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    <span className="absolute inset-0 animate-pulse bg-white/60" />
                  </span>
                </button>
              ))}
            </div>
          </Carousel>
        </div>
      </section>
              
      <section className="py-10 bg-gradient-to-br from-blue-200 via-blue-50 to-indigo-200 relative">
        <div className="absolute inset-0 bg-[linear-gradient(30deg,#cce1ff_12%,transparent_12.5%,transparent_87%,#cce1ff_87.5%,#cce1ff_100%)] opacity-80"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">{t('ourSolutions')}</h2>
            <div className="w-24 h-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 mx-auto rounded-full shadow-md"></div>
          </div>
          
          <Carousel 
            className="w-full max-w-7xl mx-auto"
            opts={{
              align: "start",
              loop: true,
            }}
            setApi={setSolutionsApi}
            plugins={[
              Autoplay({
                delay: 2000,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {solutions.map((solution, index) => (
                <CarouselItem 
                  key={index} 
                  className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                >
                  <Card className="h-full group transition-all duration-300 hover:scale-105 hover:shadow-xl border-none bg-white rounded-xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors duration-300">
                          <span className="text-4xl text-blue-600">{solution.icon}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                          {t(solution.nameKey)}
                        </h3>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="flex justify-center mt-8 space-x-2">
              {solutions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => solutionsApi?.scrollTo(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSolution === index ? 'bg-blue-600 w-6' : 'bg-gray-300 hover:bg-blue-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </Carousel>
        </div>
      </section>

      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 relative">
          <FeaturedProducts viewMode="grid" />
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-8 md:p-12">
                <Badge className="mb-4 bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                  {t('b2b.badge')}
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">{t('b2b.title')}</h2>
                <p className="text-lg mb-6 text-gray-600">
                  {t('b2b.description')}
                </p>
                <ul className="mb-8 space-y-2">
                  {[
                    t('b2b.features.wholesale'),
                    t('b2b.features.account'),
                    t('b2b.features.delivery'),
                    t('b2b.features.support')
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <ChevronRight className="w-5 h-5 mr-2 text-blue-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-4">
                  <Button 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    asChild
                  >
                    <Link 
                      href="https://www.noktaelektronik.com.tr/?ref=nokta" 
                      target="_blank"
                      rel="noopener"
                    >
                      {t('b2b.cta')} <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 p-8 md:p-12 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="h-full flex flex-col justify-center space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-lg p-6 shadow-lg"
                  >
                    <h3 className="text-xl font-semibold text-blue-600 mb-2">{t('b2b.cards.pricing.title')}</h3>
                    <p className="text-gray-600">{t('b2b.cards.pricing.description')}</p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-lg p-6 shadow-lg"
                  >
                    <h3 className="text-xl font-semibold text-purple-600 mb-2">{t('b2b.cards.delivery.title')}</h3>
                    <p className="text-gray-600">{t('b2b.cards.delivery.description')}</p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-white rounded-lg p-6 shadow-lg"
                  >
                    <h3 className="text-xl font-semibold text-indigo-600 mb-2">{t('b2b.cards.support.title')}</h3>
                    <p className="text-gray-600">{t('b2b.cards.support.description')}</p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-red-50 to-red-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">{t('security.title')}</h2>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500"
              >
                <h4 className="text-xl font-semibold text-red-600 mb-2">{t('security.fire.title')}</h4>
                <p className="text-gray-600">
                  {t('security.fire.description')}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500"
              >
                <h4 className="text-xl font-semibold text-red-600 mb-2">{t('security.cctv.title')}</h4>
                <p className="text-gray-600">
                  {t('security.cctv.description')}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500"
              >
                <h4 className="text-xl font-semibold text-red-600 mb-2">{t('security.barrier.title')}</h4>
                <p className="text-gray-600">
                  {t('security.barrier.description')}
                </p>
              </motion.div>
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h3 className="text-2xl font-semibold mb-4 flex items-center">
                <Shield className="mr-2 text-red-500" />
                {t('security.subtitle')}
              </h3>
              <p className="text-gray-700 mb-6">
                {t('security.description')}
              </p>
              <ul className="list-disc list-inside mb-6 text-gray-700">
                {[
                  t('security.features.ai'),
                  t('security.features.fire'),
                  t('security.features.monitoring'),
                  t('security.features.integration')
                ].map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white">
                <Link 
                  href="/urunler?brands=dahua" 
                  rel="noopener"
                >
                  {t('exploreSecurityProducts')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-green-50 to-green-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">{t('medical.title')}</h2>
          <div className="flex flex-col md:flex-row-reverse items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 rounded-lg shadow-lg border-r-4 border-green-500"
              >
                <h4 className="text-xl font-semibold text-green-600 mb-2">{t('medical.systems.nurse.title')}</h4>
                <p className="text-gray-600">
                  {t('medical.systems.nurse.description')}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white p-6 rounded-lg shadow-lg border-r-4 border-green-500"
              >
                <h4 className="text-xl font-semibold text-green-600 mb-2">{t('medical.systems.clock.title')}</h4>
                <p className="text-gray-600">
                  {t('medical.systems.clock.description')}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white p-6 rounded-lg shadow-lg border-r-4 border-green-500"
              >
                <h4 className="text-xl font-semibold text-green-600 mb-2">{t('medical.systems.pager.title')}</h4>
                <p className="text-gray-600">
                  {t('medical.systems.pager.description')}
                </p>
              </motion.div>
            </div>
            <div className="md:w-1/2 md:pr-12">
              <h3 className="text-2xl font-semibold mb-4 flex items-center">
                <Stethoscope className="mr-2 text-green-500" />
                {t('medical.subtitle')}
              </h3>
              <p className="text-gray-700 mb-6">
                {t('medical.description')}
              </p>
              <ul className="list-disc list-inside mb-6 text-gray-700">
                {[
                  t('medical.features.nursecall'),
                  t('medical.features.clock'),
                  t('medical.features.pager'),
                  t('medical.features.roomcontrol')
                ].map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white">
                <Link 
                  href="/urunler?brands=atek" 
                  rel="noopener"
                >
                  {t('discoverMedicalProducts')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">{t('software.title')}</h2>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="relative w-full h-64 md:h-96 bg-gray-900 rounded-lg overflow-hidden font-mono text-sm">
                {['function innovate() {', '  const ideas = ', '    [\'AI\', \'IoT\', \'Cloud\'];', '  return ideas.map(idea =>', '    `${idea} Solution`);', '}', '', 'console.log(innovate());'].map((line, index) => (
                  <motion.div
                    key={index}
                    className="text-green-400 px-4 py-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    {line}
                  </motion.div>
                ))}
                <motion.div
                  className="absolute bottom-4 right-4 w-3 h-6 bg-green-400"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                />
              </div>
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h3 className="text-2xl font-semibold mb-4 flex items-center">
                <Code className="mr-2 text-blue-500" />
                {t('software.subtitle')}
              </h3>
              <p className="text-gray-700 mb-6">
                {t('software.description')}
              </p>
              <ul className="list-disc list-inside mb-6 text-gray-700">
                {[
                  t('software.features.erp'),
                  t('software.features.mobile'),
                  t('software.features.cloud'),
                  t('software.features.ai')
                ].map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">
                <Link 
                  href="/software" 
                  rel="noopener"
                >
                  {t('exploreSoftwareServices')} 
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 relative">
          <WhatsAppButton />
        </div>
      </section>
    </main>
  )
}
