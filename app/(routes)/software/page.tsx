'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform,  useAnimation } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { BrainCircuit, Cpu, Database, Network, Fingerprint,  Microscope } from 'lucide-react'

const aiSolutions = [
  { icon: BrainCircuit, title: 'Derin Öğrenme', description: 'Karmaşık veri setlerinden anlamlı içgörüler çıkarma' },
  { icon: Cpu, title: 'Doğal Dil İşleme', description: 'İnsan dilini anlama ve işleme yeteneği' },
  { icon: Database, title: 'Büyük Veri Analizi', description: 'Büyük ölçekli veri setlerinden değer elde etme' },
  { icon: Network, title: 'Makine Öğrenimi', description: 'Veriden öğrenen ve tahminler yapan sistemler' },
  { icon: Fingerprint, title: 'Biyometrik AI', description: 'Gelişmiş kimlik doğrulama ve güvenlik çözümleri' },
  { icon: Fingerprint, title: 'Robotik Süreç Otomasyonu', description: 'İş süreçlerinin AI ile otomatikleştirilmesi' },
  { icon: Microscope, title: 'Bilimsel AI', description: 'Araştırma ve geliştirmede AI uygulamaları' },
]

const aiApplications = [
  'Sağlık Hizmetleri', 'Finans', 'Üretim', 'Perakende', 'Eğitim', 'Ulaşım', 'Enerji', 'Tarım'
]

const aiServices = [
  'Özel AI Modelleri Geliştirme', 'AI Entegrasyonu', 'Veri Analizi ve Görselleştirme', 
  'Chatbot ve Sanal Asistan Geliştirme', 'Görüntü ve Ses Tanıma Sistemleri', 'Tahmine Dayalı Bakım Çözümleri'
]

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
  { name: "Sophgo", icon: BrainCircuit },
]
export default function Software () {
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
        <AITextEffect text="Yapay Zeka Çözümleri" />
        <motion.p 
          className="text-xl md:text-2xl mb-8 text-blue-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Geleceği Şekillendiren AI Teknolojileri
        </motion.p>
        <NeuralNetworkAnimation />
      </motion.div>

      <section className="relative py-20 px-4 md:px-8">
        <h2 className="text-4xl font-bold mb-12 text-center">AI Çözümlerimiz</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {aiSolutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={controls}
              custom={index}
            >
              <Card className="bg-gray-800 border-gray-700 overflow-hidden group">
                <CardContent className="p-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  <solution.icon className="w-12 h-12 mb-4 text-blue-400" />
                  <h3 className="text-2xl font-semibold mb-2">{solution.title}</h3>
                  <p className="text-gray-300">{solution.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative py-20 px-4 md:px-8 bg-gray-800">
        <h2 className="text-4xl font-bold mb-12 text-center">AI Uygulama Alanları</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {aiApplications.map((area, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full px-6 py-3 text-white font-semibold"
              whileHover={{ scale: 1.1, boxShadow: "0px 0px 8px rgb(124, 58, 237)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
              custom={index}
            >
              {area}
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative py-20 px-4 md:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 opacity-50" />
        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-12 text-center">Yapay Zeka Hizmetlerimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aiServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={controls}
                custom={index}
              >
                <Card className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors duration-300">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-semibold mb-2">{service}</h3>
                    <p className="text-gray-300">En son AI teknolojileri ile {service.toLowerCase()} çözümleri sunuyoruz.</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="relative py-20 px-4 md:px-8 bg-gray-900">
        <h2 className="text-4xl font-bold mb-12 text-center">Uzmanlık Alanlarımız</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {expertiseAreas.map((area, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center justify-center p-6 bg-gray-800 border-gray-700 rounded-lg shadow-lg hover:shadow-xl group"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <area.icon className="w-12 h-12 mb-4 text-blue-400 group-hover:text-purple-500 transition-all duration-300" />
              <h3 className="text-lg font-semibold text-white">{area.name}</h3>
            </motion.div>
          ))}
        </div>
      </section>


      
    </div>
  )
}