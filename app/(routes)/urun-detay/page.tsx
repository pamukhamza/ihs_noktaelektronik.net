/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React from 'react'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronRight, Download, Star } from 'lucide-react'

const UrunDetay = () => {
  // Placeholder data
  const product = {
    name: "Endüstriyel Sensör X2000",
    stockCode: "SNS-X2000",
    brand: "TechSense",
    images: [
      "/products/1730274631_301741IBESMF_k.jpg",
      "/products/2911602I6G8U_b.jpg",
      "/products/1730274631_301741IBESMF_k.jpg",
    ],
    generalFeatures: [
      "Yüksek hassasiyet",
      "Geniş ölçüm aralığı",
      "IP68 su ve toz koruması",
      "Endüstriyel standartlara uygunluk",
    ],
    technicalSpecs: [
      { name: "Ölçüm Aralığı", value: "0-1000 psi" },
      { name: "Hassasiyet", value: "±0.1%" },
      { name: "Çalışma Sıcaklığı", value: "-40°C to 85°C" },
      { name: "Çıkış Sinyali", value: "4-20 mA" },
    ],
    applications: [
      "Petrol ve gaz endüstrisi",
      "Kimya tesisleri",
      "Su arıtma tesisleri",
      "Gıda işleme tesisleri",
    ],
    downloads: [
      { name: "Kullanım Kılavuzu", url: "#" },
      { name: "Teknik Özellikler (PDF)", url: "#" },
      { name: "Sertifikalar", url: "#" },
    ],
    similarProducts: [
      { id: 1, name: "Sensör Y3000", image: "/products/1730274631_301741IBESMF_k.jpg" },
      { id: 2, name: "Sensör Z1500", image: "/products/1730274631_301741IBESMF_k.jpg" },
      { id: 3, name: "Sensör X2500", image: "/products/1730274631_301741IBESMF_k.jpg" },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-4 text-sm">
        <a href="#" className="text-gray-500 hover:text-primary">Ana Sayfa</a>
        <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
        <a href="urunler" className="text-gray-500 hover:text-primary">Ürünler</a>
        <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
        <span className="text-primary font-medium">{product.name}</span>
      </nav>

      {/* Product Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Product Images */}
        <div className="space-y-4">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={400}
            height={400}
            className="w-full rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-lg text-gray-600 mb-4">Stok Kodu: {product.stockCode}</p>
          <Badge variant="secondary" className="mb-4">{product.brand}</Badge>
          <div className="flex space-x-4 mt-10">
            {product.images.slice(1).map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`${product.name} - ${index + 2}`}
                width={100}
                height={100}
                className="rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="general" className="mb-8">
        <TabsList className="w-full justify-start bg-gradient-to-r from-blue-900 to-sky-600 text-mycolor8 py-6 px-2">
          <TabsTrigger value="general">Genel Özellikler</TabsTrigger>
          <TabsTrigger value="technical">Teknik Özellikler</TabsTrigger>
          <TabsTrigger value="applications">Uygulamalar</TabsTrigger>
          <TabsTrigger value="downloads">İndirmeler</TabsTrigger>
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
        <TabsContent value="downloads">
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-2">
                {product.downloads.map((download, index) => (
                  <li key={index}>
                    <a href={download.url} className="flex items-center text-primary hover:underline">
                      <Download className="mr-2 h-4 w-4" />
                      {download.name}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Similar Products */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Benzer Ürünler</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {product.similarProducts.map((similarProduct) => (
            <Card key={similarProduct.id}>
              <CardContent className="p-4">
                <Image
                  src={similarProduct.image}
                  alt={similarProduct.name}
                  width={200}
                  height={200}
                  className="w-full h-48 object-cover mb-2 rounded-md"
                />
                <h3 className="font-medium text-center">{similarProduct.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UrunDetay