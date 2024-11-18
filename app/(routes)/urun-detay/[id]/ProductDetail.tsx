'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronRight, Download, Star, ZoomIn, ChevronLeft, ChevronRight as ChevronRightIcon, X } from 'lucide-react'

type Product = {
  id: number
  name: string
  stockCode: string
  brand: string
  images: string[]
  generalFeatures: string[]
  technicalSpecs: { name: string; value: string }[]
  applications: string[]
  downloads: { name: string; url: string }[]
  similarProducts: { id: number; name: string; image: string }[]
}

export default function ProductDetail({ product }: { product: Product }) {
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-4 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-500 hover:text-primary">
                Ana Sayfa
              </Link>
            </li>
            <ChevronRight className="h-4 w-4 text-gray-400" aria-hidden="true" />
            <li>
              <Link href="/urunler" className="text-gray-500 hover:text-primary">
                Ürünler
              </Link>
            </li>
            <ChevronRight className="h-4 w-4 text-gray-400" aria-hidden="true" />
            <li>
              <span className="text-primary font-medium" aria-current="page">{product.name}</span>
            </li>
          </ol>
        </nav>

        {/* Product Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 group">
              <Image
                src={product.images[selectedImage] || '/gorsel_hazirlaniyor.jpg'}
                alt={product.name}
                fill
                priority
                className="object-contain transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <button
                  onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))}
                  className="p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() => setSelectedImage((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))}
                  className="p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
                  aria-label="Next image"
                >
                  <ChevronRightIcon className="h-6 w-6" />
                </button>
              </div>
              <button
                className="absolute bottom-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all opacity-0 group-hover:opacity-100"
                onClick={() => setIsZoomed(!isZoomed)}
                aria-label="Zoom image"
              >
                <ZoomIn className="h-6 w-6" />
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-primary' : 'hover:opacity-75'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} - ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-lg text-gray-600 mb-4">Stok Kodu: {product.stockCode}</p>
            <Badge variant="secondary" className="mb-4">{product.brand}</Badge>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400" fill={i < 4 ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-sm text-gray-500">(4.0)</span>
            </div>
            <Button className="w-full mb-4">Teklif İste</Button>
            <Separator className="my-6" />
            <h2 className="text-xl font-semibold mb-2">Ürün Açıklaması</h2>
            <p className="text-gray-600">
              {product.name}, endüstriyel uygulamalar için tasarlanmış yüksek hassasiyetli bir sensördür. 
              Geniş ölçüm aralığı ve dayanıklı yapısı ile zorlu ortamlarda güvenilir performans sunar.
            </p>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="general" className="mb-8">
          <TabsList className="w-full justify-start bg-gradient-to-r from-blue-900 to-sky-600 text-white py-2 px-2 rounded-t-lg">
            <TabsTrigger value="general" className="data-[state=active]:bg-white data-[state=active]:text-primary">Genel Özellikler</TabsTrigger>
            <TabsTrigger value="technical" className="data-[state=active]:bg-white data-[state=active]:text-primary">Teknik Özellikler</TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-white data-[state=active]:text-primary">Uygulamalar</TabsTrigger>
            <TabsTrigger value="downloads" className="data-[state=active]:bg-white data-[state=active]:text-primary">İndirmeler</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <Card>
              <CardContent className="pt-6">
                <ul className="list-disc pl-5 space-y-2">
                  {product.generalFeatures.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="technical">
            <Card>
              <CardContent className="pt-6">
                <table className="w-full">
                  <tbody>
                    {product.technicalSpecs.map((spec, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                        <td className="py-2 px-4 font-medium">{spec.name}</td>
                        <td className="py-2 px-4">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="applications">
            <Card>
              <CardContent className="pt-6">
                <ul className="list-disc pl-5 space-y-2">
                  {product.applications.map((app, index) => (
                    <li key={index}>{app}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="downloads" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                {product.downloads.length > 0 ? (
                  <ul className="space-y-2">
                    {product.downloads.map((download, index) => (
                      <li key={index}>
                        <a 
                          href={download.url} 
                          className="flex items-center text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          {download.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center">No downloads available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Similar Products Section */}
        {product.similarProducts && product.similarProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Benzer Ürünler</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {product.similarProducts.map((similarProduct) => (
                <Card key={similarProduct.id} className="group cursor-pointer hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4">
                    <div className="relative aspect-square mb-3">
                      <Image
                        src={similarProduct.image}
                        alt={similarProduct.name}
                        fill
                        className="object-contain p-2 transform transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                        onClick={() => router.push(`/urun-detay/${similarProduct.id}`)}
                      />
                    </div>
                    <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                      {similarProduct.name}
                    </h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            aria-label="Close zoom view"
          >
            <X className="h-6 w-6 text-white" />
          </button>
          <div className="relative w-full h-full max-w-7xl max-h-[90vh] m-4">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-between px-4">
              <button
                onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-8 w-8 text-white" />
              </button>
              <button
                onClick={() => setSelectedImage((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                aria-label="Next image"
              >
                <ChevronRightIcon className="h-8 w-8 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}