'use client'

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star } from 'lucide-react'

const mainSliderItems = [
  { id: 1, image: "/placeholder.svg?height=600&width=1600", title: "New Arrivals", subtitle: "Check out our latest collection" },
  { id: 2, image: "/placeholder.svg?height=600&width=1600", title: "Summer Sale", subtitle: "Up to 50% off on selected items" },
  { id: 3, image: "/placeholder.svg?height=600&width=1600", title: "Tech Gadgets", subtitle: "Discover innovative products" },
]

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  image: string;
}

const products: Product[] = [
  { id: 1, name: "Wireless Earbuds", price: 79.99, rating: 4.5, image: "/placeholder.svg?height=300&width=300" },
  { id: 2, name: "Smart Watch", price: 199.99, rating: 4.8, image: "/placeholder.svg?height=300&width=300" },
  { id: 3, name: "Portable Charger", price: 49.99, rating: 4.2, image: "/placeholder.svg?height=300&width=300" },
  { id: 4, name: "Bluetooth Speaker", price: 89.99, rating: 4.6, image: "/placeholder.svg?height=300&width=300" },
  { id: 5, name: "Noise-Canceling Headphones", price: 249.99, rating: 4.9, image: "/placeholder.svg?height=300&width=300" },
  { id: 6, name: "Fitness Tracker", price: 69.99, rating: 4.3, image: "/placeholder.svg?height=300&width=300" },
  { id: 7, name: "Wireless Keyboard", price: 59.99, rating: 4.4, image: "/placeholder.svg?height=300&width=300" },
  { id: 8, name: "Tablet", price: 299.99, rating: 4.7, image: "/placeholder.svg?height=300&width=300" },
  { id: 9, name: "Smart Home Hub", price: 129.99, rating: 4.5, image: "/placeholder.svg?height=300&width=300" },
  { id: 10, name: "Wireless Mouse", price: 39.99, rating: 4.1, image: "/placeholder.svg?height=300&width=300" },
]

const categories = [
  { id: 1, name: "Electronics", icon: "🖥️" },
  { id: 2, name: "Clothing", icon: "👕" },
  { id: 3, name: "Home & Garden", icon: "🏡" },
  { id: 4, name: "Sports & Outdoors", icon: "🏀" },
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
                      Shop Now
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

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link href={`/category/${category.id}`} key={category.id}>
              <Card className="h-full transition-transform duration-300 hover:scale-105 hover:shadow-lg bg-white">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <span className="text-4xl mb-2">{category.icon}</span>
                  <h3 className="text-lg font-semibold text-center text-gray-800">{category.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-gray-800 to-gray-900 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Featured Products</h2>
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {products.map((product) => (
                <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2" />
          </Carousel>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="relative rounded-lg overflow-hidden">
          <Image 
            src="/placeholder.svg?height=400&width=1200"
            alt="Special Offer Banner"
            width={1200}
            height={400}
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800/80 to-gray-700/80 flex flex-col justify-center items-center text-white p-8">
            <Badge className="mb-4 text-lg px-4 py-2 bg-white text-gray-800">Limited Time Offer</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">Summer Clearance Sale</h2>
            <p className="text-xl md:text-2xl mb-6 text-center">Get up to 70% off on selected items</p>
            <Button size="lg" className="bg-white text-gray-800 hover:bg-gray-200">
              Shop Now <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-gray-200 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Free Shipping", description: "On orders over $100", icon: "🚚" },
              { title: "24/7 Support", description: "Always here to help", icon: "💬" },
              { title: "Money-Back Guarantee", description: "30-day return policy", icon: "🔄" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 bg-white">
                  <CardContent className="flex flex-col items-center text-center p-6">
                    <span className="text-4xl mb-4">{feature.icon}</span>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}