'use client';

import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Download, FileArchive, FileCode, FileImage, FileText, Tag } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {Tooltip,TooltipContent,TooltipProvider,TooltipTrigger,} from "@/components/ui/tooltip"
import {Card,CardContent,} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {Carousel,CarouselContent,CarouselItem,CarouselNext,CarouselPrevious,} from "@/components/ui/carousel"
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Product } from "@/types/product"
import { BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb"
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/use-toast"

interface ProductDetailProps {
  product: Product
}
export default function ProductDetail({ product }: ProductDetailProps) {
  const t = useTranslations('productDetail');
  const { toast } = useToast();
  const locale = useLocale();
  const [selectedImage, setSelectedImage] = useState(product.images[0] || '/gorsel_hazirlaniyor.jpg');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', company: '', phone: '', email: '', description: '' });
  const getTranslatedContent = (trContent: string, enContent: string) => {
    if (locale === 'de' || locale === 'ru') {
      return enContent || trContent || '';
    }
    if (locale === 'tr') {
      return trContent || enContent || '';
    }
    return enContent || trContent || '';
  };
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/submitOffer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          mail: formData.email,
          phone: formData.phone,
          description: formData.description,
          product_id: product.id
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit offer');
      }
      toast({
        title: t('offerSuccess'),
        description: t('offerSuccessDescription'),
        variant: "default"
      });
      setIsModalOpen(false);
      // Reset form data
      setFormData({ name: '', company: '', phone: '', email: '', description: '' });
    } catch (error) {
      toast({
        title: t('offerError'),
        description: t('offerErrorDescription'),
        variant: "destructive"
      });
    }
  };
  return (
    <div className="bg-gray-100">
      <div className="container mx-auto md:px-4 px-2 py-8 ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-4 md:p-10 rounded-lg">
          {/* Breadcrumb */}
          <div className="col-span-full bg-white/60 backdrop-blur-sm p-4 rounded-lg shadow-sm">
            <nav aria-label="Breadcrumb" className="flex items-center space-x-1 text-sm text-muted-foreground">
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="flex items-center hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <span className="text-muted-foreground/40 mx-1">›</span>
              {Array.isArray(product.categories) && product.categories.length > 0 ? (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink 
                      href={`/urunler/${product.categories[0].seo_link}`}
                      className="hover:text-primary transition-colors"
                    >
                      {getTranslatedContent(product.categories[0].name.KategoriAdiTR, product.categories[0].name.KategoriAdiEN)}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <span className="text-muted-foreground/40 mx-1">›</span>
                  <BreadcrumbItem>
                    <BreadcrumbLink 
                      href={`/urun/${product.seo_link ?? ''}`} 
                      className="font-medium text-foreground"
                    >
                      {getTranslatedContent(product.name.UrunAdiTR, product.name.UrunAdiEN)}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              ) : null}
            </nav>
          </div>

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
                  transition={{ duration: 0.1 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={selectedImage}
                    alt={getTranslatedContent(product.name.UrunAdiTR, product.name.UrunAdiEN)}
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
              <div className="relative">
                {/* Left Slide Button */}
                <Button
                  onClick={() => setStartIndex((prev) => Math.max(prev - visibleCount, 0))}
                  className="absolute left-0 z-10 top-1/2 transform -translate-y-1/2"
                  disabled={startIndex === 0} // Disable if at the start
                >
                  <ChevronLeft />
                </Button>
                <ScrollArea className="w-full">
                  <div className="flex space-x-2 pb-2 p-2 md:p-5">
                    {product.images.slice(startIndex, startIndex + visibleCount).map((image, index) => (
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
                          alt={`${getTranslatedContent(product.name.UrunAdiTR, product.name.UrunAdiEN)} ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </motion.button>
                    ))}
                  </div>
                </ScrollArea>
                {/* Right Slide Button */}
                <Button
                  onClick={() => setStartIndex((prev) => Math.min(prev + visibleCount, product.images.length - visibleCount))}
                  className="absolute right-0 z-10 top-1/2 transform -translate-y-1/2"
                  disabled={startIndex + visibleCount >= product.images.length} // Disable if at the end
                >
                  <ChevronRight />
                </Button>
              </div>
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
              <h1 className="text-3xl font-bold tracking-tight">
                {getTranslatedContent(product.name.UrunAdiTR, product.name.UrunAdiEN)}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t('stockCode')}: {product.stockCode}
              </p>
            </motion.div>
            <Separator />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              <Button size="lg" className="w-full" onClick={() => setIsModalOpen(true)}>
                {t('requestQuote')}
              </Button>
            </motion.div>
          </div>
        </div>
        {/* Product Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 bg-white p-4 md:p-10 rounded-lg"
        >
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="features">{t('features')}</TabsTrigger>
              <TabsTrigger value="technical">{t('technical')}</TabsTrigger>
              <TabsTrigger value="applications">{t('applications')}</TabsTrigger>
              <TabsTrigger value="downloads">{t('downloads')}</TabsTrigger>
            </TabsList>
            <div className="mt-6">
              <TabsContent value="features">
                <Card>
                  <ScrollArea className=" p-6">
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: getTranslatedContent(
                          product.generalFeatures.OzelliklerTR, 
                          product.generalFeatures.OzelliklerEN
                        ) 
                      }}
                    />
                  </ScrollArea>
                </Card>
              </TabsContent>
              <TabsContent value="technical">
                <Card>
                  <ScrollArea className=" p-6">
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: getTranslatedContent(
                          product.technicalSpecs.BilgiTR, 
                          product.technicalSpecs.BilgiEN
                        ) 
                      }}
                    />
                  </ScrollArea>
                </Card>
              </TabsContent>
              <TabsContent value="applications">
                <Card>
                  <ScrollArea className=" p-6">
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: getTranslatedContent(
                          product.applications.UygulamalarTr, 
                          product.applications.UygulamalarEn
                        ) 
                      }}
                    />
                  </ScrollArea>
                </Card>
              </TabsContent>
              <TabsContent value="downloads">
                <Card>
                  <CardContent>
                    <ScrollArea className=" pr-4">
                      {product.downloads.map((category) => (
                        <div key={category.name} className="mb-6 pt-5">
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
                                            <span className="sr-only">{t('download')}</span>
                                          </Button>
                                        </Link>
                                      </CardContent>
                                    </Card>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{t('clickToDownload')}</p>
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
            className="mt-12 bg-white p-10 rounded-lg"
          >
            <h2 className="text-2xl font-bold mb-6">{t('similarProducts')}</h2>
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
                          alt={getTranslatedContent(
                            similarProduct.name.UrunAdiTR,
                            similarProduct.name.UrunAdiEN
                          )}
                          fill
                          className="object-contain transition-all group-hover:scale-105"
                        />
                      </div>
                      <h3 className="mt-2 text-sm font-medium text-gray-900 truncate">
                        {getTranslatedContent(
                          similarProduct.name.UrunAdiTR,
                          similarProduct.name.UrunAdiEN
                        )}
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
      {/* Modal for Request Quote */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="company"
          placeholder="Company Name"
          value={formData.company}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
        <button onClick={handleSubmit} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-200">
          Send
        </button>
      </Modal>
    </div>
  );
}
