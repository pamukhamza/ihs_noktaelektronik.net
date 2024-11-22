'use client'

import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star, Shield, Stethoscope, Code, ChevronRight } from 'lucide-react'

const mainSliderItems = [
  { id: 1, image: "/placeholder.svg?height=600&width=1600", title: "Innovative Solutions", subtitle: "Discover our range of cutting-edge products" },
  { id: 2, image: "/placeholder.svg?height=600&width=1600", title: "Security First", subtitle: "Protect what matters most" },
  { id: 3, image: "/placeholder.svg?height=600&width=1600", title: "Medical Excellence", subtitle: "Advanced technology for healthcare" },
]

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  image: string;
}

const products: Product[] = [
  { id: 1, name: "Smart CCTV Camera", price: 199.99, rating: 4.5, image: "/placeholder.svg?height=300&width=300" },
  { id: 2, name: "Fire Alarm System", price: 299.99, rating: 4.8, image: "/placeholder.svg?height=300&width=300" },
  { id: 3, name: "Patient Monitoring Device", price: 599.99, rating: 4.7, image: "/placeholder.svg?height=300&width=300" },
  { id: 4, name: "Custom ERP Solution", price: 999.99, rating: 4.6, image: "/placeholder.svg?height=300&width=300" },
]

const solutions = [
  { id: 1, name: "CCTV Systems", icon: "🎥" },
  { id: 2, name: "Fire Alarms", icon: "🚨" },
  { id: 3, name: "Access Control", icon: "🔐" },
  { id: 4, name: "Patient Monitoring", icon: "💓" },
  { id: 5, name: "Telemedicine", icon: "🏥" },
  { id: 6, name: "EHR Systems", icon: "📊" },
  { id: 7, name: "Custom Software", icon: "💻" },
  { id: 8, name: "Mobile Apps", icon: "📱" },
  { id: 9, name: "Cloud Solutions", icon: "☁️" },
  { id: 10, name: "AI Integration", icon: "🤖" },
]

const ProductCard = ({ product }: { product: Product }) => (
  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
    <CardContent className="p-4">
      <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
        <Image
          src={product.image}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 hover:scale-110"
        />
      </div>
      <h3 className="text-base font-semibold mb-1 line-clamp-2">{product.name}</h3>
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-400 mr-1" />
          <span className="text-sm text-gray-600">{product.rating}</span>
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <section className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {mainSliderItems.map((item) => (
              <CarouselItem key={item.id}>
                <div className="relative aspect-[16/6] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    layout="fill"
                    objectFit="cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-gray-700/30 flex flex-col justify-center items-start text-white p-8 md:p-16">
                    <h2 className="text-4xl md:text-6xl font-bold mb-2">{item.title}</h2>
                    <p className="text-xl md:text-2xl mb-6">{item.subtitle}</p>
                    <Button size="lg" className="bg-white text-gray-800 hover:bg-gray-200">
                      Learn More
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2" />
          <CarouselNext className="absolute right-4 top-1/2" />
        </Carousel>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Our Solutions</h2>
          <Carousel className="w-full" opts={{ align: "start", loop: true }}>
            <CarouselContent className="-ml-2 md:-ml-4">
              {[...solutions, ...solutions].map((solution, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                  <Card className="h-full transition-transform duration-300 hover:scale-105 hover:shadow-lg bg-white">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <span className="text-4xl mb-2">{solution.icon}</span>
                      <h3 className="text-lg font-semibold text-center text-gray-800">{solution.name}</h3>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      <section className="bg-gradient-to-r from-gray-800 to-gray-900 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Featured Products</h2>
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {products.map((product) => (
                <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2" />
          </Carousel>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-8 md:p-12">
                <Badge className="mb-4 bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">New Product Launch</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Introducing Smart Office Suite</h2>
                <p className="text-lg mb-6 text-gray-600">Revolutionize your workspace with our integrated security, medical, and software solutions. Boost productivity and ensure safety like never before.</p>
                <ul className="mb-8 space-y-2">
                  {['AI-powered security', 'Health monitoring', 'Workflow automation'].map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <ChevronRight className="w-5 h-5 mr-2 text-blue-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Learn More <ArrowRight className="ml-2" />
                </Button>
              </div>
              <div className="md:w-1/2">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Smart Office Suite"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-red-50 to-red-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">Security Solutions</h2>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=400&width=600&text=Fire+Alarm+GIF"
                  alt="Fire Alarm System in action"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h3 className="text-2xl font-semibold mb-4 flex items-center">
                <Shield className="mr-2 text-red-500" />
                Cutting-edge Protection
              </h3>
              <p className="text-gray-700 mb-6">
                Our state-of-the-art CCTV systems and fire alarm products are designed to keep your premises safe and secure. With advanced features like AI-powered threat detection and real-time alerts, you can have peace of mind knowing your property is protected 24/7.
              </p>
              <ul className="list-disc list-inside mb-6 text-gray-700">
                <li>AI-powered surveillance systems</li>
                <li>Smart fire detection and prevention</li>
                <li>24/7 monitoring and instant alerts</li>
                <li>Integration with smart home systems</li>
              </ul>
              <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white">
                Explore Security Products
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-green-50 to-green-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">Medical Electronics</h2>
          <div className="flex flex-col md:flex-row-reverse items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="relative w-full h-64 md:h-96">
                <motion.svg width="100%" height="100%" viewBox="0 0 300 200">
                  <motion.path
                    id="motionPath"
                    d="M0,100 Q75,0 150,100 T300,100"
                    fill="none"
                    stroke="#4CAF50"
                    strokeWidth="4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 4, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
                  />
                  <motion.g>
                    <motion.circle
                      r="8"
                      fill="#4CAF50"
                      style={{
                        offsetPath: "path('M0,100 Q75,0 150,100 T300,100')",
                        offsetDistance: "0%"
                      }}
                      animate={{
                        offsetDistance: "100%"
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "linear"
                      }}
                    />
                  </motion.g>
                </motion.svg>
              </div>
            </div>
            <div className="md:w-1/2 md:pr-12">
              <h3 className="text-2xl font-semibold mb-4 flex items-center">
                <Stethoscope className="mr-2 text-green-500" />
                Advanced Healthcare Technology
              </h3>
              <p className="text-gray-700 mb-6">
                Our cutting-edge electronic products are designed for modern healthcare facilities and hospitals. From patient monitoring systems to advanced diagnostic tools, we provide innovative solutions that improve patient care and streamline medical processes.
              </p>
              <ul className="list-disc list-inside mb-6 text-gray-700">
                <li>Real-time patient monitoring devices</li>
                <li>Telemedicine platforms</li>
                <li>AI-assisted diagnostic tools</li>
                <li>Electronic health record systems</li>
              </ul>
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white">
                Discover Medical Products
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">Software Solutions</h2>
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
                Innovative Digital Solutions
              </h3>
              <p className="text-gray-700 mb-6">
                Our team of expert developers creates custom software solutions tailored to your business needs. From enterprise resource planning (ERP) systems to mobile applications, we deliver innovative digital solutions that drive efficiency and growth for your organization.
              </p>
              <ul className="list-disc list-inside mb-6 text-gray-700">
                <li>Custom ERP and CRM systems</li>
                <li>Mobile app development</li>
                <li>Cloud-based solutions</li>
                <li>AI and machine learning integration</li>
              </ul>
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">
                Explore Software Services
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
