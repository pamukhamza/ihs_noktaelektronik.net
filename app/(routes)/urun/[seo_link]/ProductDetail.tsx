'use client';

import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Download, FileArchive, FileCode, FileImage, FileText, Tag } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
type Download = {
  id: number
  name: string
  url: string
  version?: string
  type?: string
  date?: string | null
}
type DownloadCategory = {
  name: string
  items: Download[]
}
type Product = {
  id: number
  name: string
  stockCode: string
  brand: string
  images: string[]
  generalFeatures: string
  technicalSpecs: string
  applications: string
  downloads: DownloadCategory[]
  similarProducts: {
    id: number
    name: string
    image: string
    seo_link: string
  }[]
}

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(product.images[0] || '/gorsel_hazirlaniyor.jpg');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
    setSelectedImage(product.images[(currentImageIndex + 1) % product.images.length]);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
    setSelectedImage(product.images[(currentImageIndex - 1 + product.images.length) % product.images.length]);
  };
  function getFileIcon(type: string | undefined) {
    switch (type?.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-500" />
      case 'doc':
      case 'docx':
        return <FileText className="w-8 h-8 text-blue-500" />
      case 'xls':
      case 'xlsx':
        return <FileText className="w-8 h-8 text-green-500" />
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FileImage className="w-8 h-8 text-purple-500" />
      case 'zip':
      case 'rar':
        return <FileArchive className="w-8 h-8 text-yellow-500" />
      case 'exe':
        return <FileCode className="w-8 h-8 text-gray-500" />
      default:
        return <FileText className="w-8 h-8 text-gray-400" />
    }
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images Section */}
        <div className="flex flex-col space-y-4">
          {/* Main Image */}
          <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-lg bg-white border">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                  quality={100}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </motion.div>
            </AnimatePresence>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-100"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-100"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Improved Thumbnail Gallery */}
          {product.images.length > 1 && (
            <ScrollArea className="w-full">
              <div className="flex space-x-2 pb-2 p-5">
                {product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      setSelectedImage(image);
                      setCurrentImageIndex(index);
                    }}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden ${
                      selectedImage === image
                        ? 'ring-2 ring-primary ring-offset-2'
                        : 'hover:opacity-80'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute inset-0 bg-gray-200" />
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </motion.button>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <Badge variant="secondary" className="text-sm font-medium">
              {product.brand}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-lg text-muted-foreground">
              Stok Kodu: {product.stockCode}
            </p>
          </motion.div>

          <Separator />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <Button size="lg" className="w-full">
              Teklif İste
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12"
      >
        <Tabs defaultValue="features" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="features">Özellikler</TabsTrigger>
            <TabsTrigger value="technical">Teknik</TabsTrigger>
            <TabsTrigger value="applications">Uygulamalar</TabsTrigger>
            <TabsTrigger value="downloads">İndirmeler</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="features">
              <Card>
                <ScrollArea className="h-[600px] p-6">
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.generalFeatures }}
                  />
                </ScrollArea>
              </Card>
            </TabsContent>
            <TabsContent value="technical">
              <Card>
                <ScrollArea className="h-[600px] p-6">
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.technicalSpecs }}
                  />
                </ScrollArea>
              </Card>
            </TabsContent>
            <TabsContent value="applications">
              <Card>
                <ScrollArea className="h-[600px] p-6">
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.applications }}
                  />
                </ScrollArea>
              </Card>
            </TabsContent>
            
<TabsContent value="downloads">
  <Card>
    <CardContent>
      <ScrollArea className="h-[600px] pr-4">
        {product.downloads.map((category) => (
          <div key={category.name} className="mb-6 pt-10">
            <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.items.map((download) => (
                <TooltipProvider key={download.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Card className="overflow-hidden transition-all hover:shadow-md">
                        <CardContent className="p-0">
                          <Link
                            href={download.url}
                            className="flex items-start p-4 space-x-4"
                          >
                            <div className="flex-shrink-0">
                              {getFileIcon(download.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {download.name}
                              </h4>
                              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                {download.version && (
                                  <span className="inline-flex items-center">
                                    <Tag className="w-3 h-3 mr-1" />
                                    {download.version}
                                  </span>
                                )}
                                {download.type && (
                                  <span className="inline-flex items-center">
                                    <FileText className="w-3 h-3 mr-1" />
                                    {download.type}
                                  </span>
                                )}
                                {download.date && (
                                  <span className="inline-flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {new Date(download.date).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="ml-auto">
                              <Download className="w-4 h-4" />
                              <span className="sr-only">İndir</span>
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>İndirmek için tıklayın</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        ))}
      </ScrollArea>
    </CardContent>
  </Card>
</TabsContent>
          </div>
        </Tabs>
      </motion.div>

      {/* Similar Products Carousel */}
      {product.similarProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold mb-6">Benzer Ürünler</h2>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {product.similarProducts.slice(0, 8).map((similarProduct) => (
                <CarouselItem key={similarProduct.id} className="md:basis-1/4 lg:basis-1/4">
                  <Link href={`/urun/${similarProduct.seo_link}`} className="group block">
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-white border">
                      <Image
                        src={similarProduct.image}
                        alt={similarProduct.name}
                        fill
                        className="object-cover transition-all duration-300 group-hover:scale-105"
                        quality={100}
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                    <h3 className="mt-2 font-medium group-hover:text-primary transition-colors line-clamp-2">
                      {similarProduct.name}
                    </h3>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </motion.div>
      )}
    </div>
  );
}

