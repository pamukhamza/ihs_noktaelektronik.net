/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React from "react"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProductCard from "./_components/ProductCard"

const carouselItems = [
  { id: 1, image: "/slider/6721e148c9aa6.jpg", link: "/page1", title: "Page 1" },
  { id: 2, image: "/slider/6721e170c9686.jpg", link: "/page2", title: "Page 2" },
  { id: 3, image: "/slider/6721e12768c46.jpg", link: "/page3", title: "Page 3" },
]

const cardItems = [
  { id: 1, image: "/banner/661e820a1f019_04.png", title: "Card 1", content: "Content for Card 1" },
  { id: 2, image: "/banner/661e820a1f019_04.png", title: "Card 2", content: "Content for Card 2" },
  { id: 3, image: "/banner/661e820a1f019_04.png", title: "Card 3", content: "Content for Card 3" },
]

const products = [
  { id: "101", name: "Product 1", brand: "Uptech", image: "/products/1730274631_301741IBESMF_k.jpg"},
  { id: "102", name: "Product 2", brand: "Edge-Core", image: "/products/1730274631_301741IBESMF_k.jpg"},
  { id: "103", name: "Product 3", brand: "Oring Networking", image: "/products/1730274631_301741IBESMF_k.jpg"},
  { id: "104", name: "Product 4", brand: "Gewiss", image: "/products/1730274631_301741IBESMF_k.jpg"},
  { id: "105", name: "Product 5", brand: "Atek", image: "/products/1730274631_301741IBESMF_k.jpg"},
  { id: "106", name: "Product 6", brand: "Noyafa", image: "/products/1730274631_301741IBESMF_k.jpg"},
  { id: "107", name: "Product 7", brand: "Planet", image: "/products/1730274631_301741IBESMF_k.jpg"},
]

export default function Component() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <section className="relative">
        <Carousel 
          plugins={[plugin.current]} 
          className="w-full" 
          onMouseEnter={plugin.current.stop} 
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {carouselItems.map((item) => (
              <CarouselItem key={item.id}>
                <Link href={item.link} passHref>
                  <Card className="overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-[1.02]">
                    <CardContent className="p-0 relative aspect-[16/5]">
                      <Image 
                        src={item.image} 
                        alt={item.title} 
                        layout="fill" 
                        objectFit="cover" 
                        className="transition-transform duration-300 hover:scale-105"
                      />
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
        </Carousel>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cardItems.map((card) => (
          <Card key={card.id} className="overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
            <CardContent className="p-0 relative aspect-[16/10]">
              <Image
                src={card.image}
                alt={card.title}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-105"
              />
            </CardContent>
          </Card>
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-bold text-center mb-8 pb-2 border-b border-gray-200">
          Featured Products
        </h2>
        <Carousel 
          plugins={[plugin.current]} 
          className="w-full" 
          onMouseEnter={plugin.current.stop} 
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="-ml-2 md:-ml-4 py-3">
            {products.map((product) => (
              <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2" />
        </Carousel>
      </section>

      <section className="relative rounded-lg overflow-hidden shadow-lg">
        <Image 
          src="/banner-4.jpg" 
          alt="Big Sale Banner" 
          width={1200} 
          height={300} 
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 bg-blue-800 bg-opacity-60 flex items-center justify-between p-6 md:p-12">
          <div className="text-white">
            <h2 className="text-3xl md:text-4xl font-bold uppercase mb-2">
              Big Sale
            </h2>
            <p className="text-lg md:text-xl">Don&apos;t miss out on our amazing deals!</p>
          </div>
          <Button className="bg-white text-blue-800 hover:bg-blue-100 transition-colors duration-300">
            <Link href="/" className="px-6 py-3 text-lg font-medium">
              Shop Now
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}