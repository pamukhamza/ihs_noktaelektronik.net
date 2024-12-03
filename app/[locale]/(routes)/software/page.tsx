'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useAnimation } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { BrainCircuit, Cpu, Database, Network, Fingerprint, Microscope, Code, Film, Gamepad2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

const NeuralNetworkAnimation = () => {
  return (
    <div className="relative w-full h-64 md:h-96">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-400 rounded-full"
          initial={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%' }}
          animate={{
            x: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
            y: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i + 20}
          className="absolute bg-blue-300 opacity-20"
          style={{
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            width: '30%',
            height: '1px',
            transformOrigin: '0 0',
          }}
          animate={{
            scaleX: [1, 0.5, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}
    </div>
  )
}

const AITextEffect = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('')
  const fullText = text

  useEffect(() => {
    let i = 0
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setDisplayText(fullText.slice(0, i + 1))
        i++
      } else {
        clearInterval(typingInterval)
      }
    }, 100)

    return () => clearInterval(typingInterval)
  }, [fullText])

  return (
    <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
      {displayText}
      <span className="animate-blink">|</span>
    </h1>
  )
}

export default function Software() {
  const t = useTranslations('software');

  const expertiseAreas = [
    { name: "React", icon: BrainCircuit },
    { name: "Java", icon: Cpu },
    { name: "JavaScript", icon: Network },
    { name: "Python", icon: Microscope },
    { name: "MySQL", icon: Database },
    { name: "Next.js", icon: Cpu },
    { name: "TensorFlow", icon: BrainCircuit },
    { name: "Nginx", icon: Network },
    { name: "NumPy", icon: Microscope },
    { name: "OpenCV", icon: BrainCircuit },
    { name: "PyTorch", icon: Microscope },
    { name: "Docker", icon: Cpu },
    { name: "Django", icon: Network },
    { name: "Figma", icon: BrainCircuit },
    { name: "MongoDB", icon: Database },
    { name: "PostgreSQL", icon: Database },
    { name: "Unity", icon: Network },
    { name: "NVIDIA", icon: Cpu },
  ];
  
  const aiSolutions = [
    { icon: BrainCircuit, title: t('aiSolutions.solutions.0.title'), description: t('aiSolutions.solutions.0.description') },
    { icon: Cpu, title: t('aiSolutions.solutions.1.title'), description: t('aiSolutions.solutions.1.description') },
    { icon: Database, title: t('aiSolutions.solutions.2.title'), description: t('aiSolutions.solutions.2.description') },
    { icon: Network, title: t('aiSolutions.solutions.3.title'), description: t('aiSolutions.solutions.3.description') },
    { icon: Fingerprint, title: t('aiSolutions.solutions.4.title'), description: t('aiSolutions.solutions.4.description') },
    { icon: Microscope, title: t('aiSolutions.solutions.5.title'), description: t('aiSolutions.solutions.5.description') },
  ];

  const aiApplications = t.raw('aiApplications.areas');

  const aiServices = [
    { icon: BrainCircuit, title: t('services.items.0.title'), description: t('services.items.0.description') },
    { icon: Microscope, title: t('services.items.1.title'), description: t('services.items.1.description') },
    { icon: Code, title: t('services.items.2.title'), description: t('services.items.2.description') },
    { icon: Gamepad2, title: t('services.items.3.title'), description: t('services.items.3.description') },
    { icon: Code, title: t('services.items.4.title'), description: t('services.items.4.description') },
    { icon: Film, title: t('services.items.5.title'), description: t('services.items.5.description') },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % aiServices.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [aiServices.length]);

  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  })
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const controls = useAnimation()

  useEffect(() => {
    controls.start(i => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 }
    }))
  }, [controls])

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      <motion.div 
        ref={targetRef}
        style={{ opacity, scale, y }} 
        className="relative h-screen flex flex-col items-center justify-center"
      >
        <motion.div className="text-center">
          <AITextEffect text={aiServices[currentIndex].title} />
          <motion.p
            key={currentIndex}
            className="text-xl md:text-2xl text-blue-300"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{
              duration: 1.2,
              ease: [0.42, 0, 0.58, 1],
              delay: 0.3,
            }}
          >
            {aiServices[currentIndex].description}
          </motion.p>
        </motion.div>
        <NeuralNetworkAnimation />
      </motion.div>

      <section className="relative pb-5  px-4 md:px-8">
        <h2 className="text-4xl font-bold mb-16 text-center text-gray-900 dark:text-gray-100">
          {t('aiSolutions.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {aiSolutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="relative bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-300 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 opacity-0 group-hover:opacity-25 transition-opacity duration-300" />
                <div className="p-6 relative">
                  <solution.icon className="w-14 h-14 mb-4 text-blue-400 mx-auto" />
                  <h3 className="text-2xl font-semibold text-center text-white mb-4 min-h-[3rem]">
                    {solution.title}
                  </h3>
                  <p className="text-gray-300 text-center">
                    {solution.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative py-20 px-4 md:px-8 bg-gray-900">
        <h2 className="text-4xl font-bold mb-16 text-center text-gray-100">
          {t('aiApplications.title')}
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          {aiApplications.map((area: string, index: number) => (
            <motion.div
              key={index}
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full px-8 py-4 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.1, boxShadow: "0px 0px 12px rgba(124, 58, 237, 0.8)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay:  0.1 }}
            >
              {area}
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative py-20 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 opacity-50" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-6xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-white">
            {t('services.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aiServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-md border-gray-200/20 hover:bg-white/20 transition-all duration-300 group h-full">
                  <CardContent className="p-6">
                    <service.icon className="w-12 h-12 mb-4 text-blue-400 group-hover:text-purple-400 transition-colors duration-300" />
                    <h3 className="text-2xl font-semibold mb-2 text-white group-hover:text-blue-300 transition-colors duration-300 min-h-[3rem]">{service.title}</h3>
                    <p className="text-gray-300 group-hover:text-white transition-colors duration-300">{service.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-900 to-transparent" />
      </section>

      <section className="relative py-20 px-4 md:px-8 bg-gray-900">
        <h2 className="text-4xl font-bold mb-12 text-center">{t('expertise.title')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {expertiseAreas.map((area, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center justify-center p-6 bg-gray-800 border-gray-700 rounded-lg shadow-lg hover:shadow-xl group h-full"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <area.icon className="w-12 h-12 mb-4 text-blue-400 group-hover:text-purple-500 transition-all duration-300" />
              <h3 className="text-lg font-semibold text-white min-h-[2rem]">{area.name}</h3>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}