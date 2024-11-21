import { Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import Link from "next/link"

type Product = {
  id: number
  name: string
  stockCode: string
  brand: string
  images: string[]
  generalFeatures: string
  technicalSpecs: string
  applications: string
  downloads: { name: string; url: string }[]
  similarProducts: {
    id: number
    name: string
    image: string
  }[]
}

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {product.images.length > 0 && (
            <div className="aspect-square relative">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          )}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(1).map((image, index) => (
                <div key={index} className="aspect-square relative">
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 2}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-lg text-gray-600 mb-4">Stok Kodu: {product.stockCode}</p>
          <Badge variant="secondary" className="mb-4">{product.brand}</Badge>
          <Button className="w-full mb-4">Teklif İste</Button>
        </div>
      </div>
            
      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="features">Özellikler</TabsTrigger>
          <TabsTrigger value="technical">Teknik</TabsTrigger>
          <TabsTrigger value="applications">Uygulamalar</TabsTrigger>
          <TabsTrigger value="downloads">İndirmeler</TabsTrigger>
        </TabsList>


        <TabsContent value="features">
          <Card className="p-4">
            <div 
              className="prose" 
              dangerouslySetInnerHTML={{ __html: product.generalFeatures }} 
            />
          </Card>
        </TabsContent>
        <TabsContent value="technical">
          <Card className="p-4">
            <div 
              className="prose" 
              dangerouslySetInnerHTML={{ __html: product.technicalSpecs }} 
            />
          </Card>
        </TabsContent>
        <TabsContent value="applications">
          <Card className="p-4">
            <div 
              className="prose" 
              dangerouslySetInnerHTML={{ __html: product.applications }} 
            />
          </Card>
        </TabsContent>
        <TabsContent value="downloads">
          <Card className="p-4">
            <div className="space-y-2">
              {product.downloads.map((download, index) => (
                <Link
                  key={index}
                  href={download.url}
                  className="block p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {download.name}
                </Link>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Similar Products */}
      {product.similarProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Benzer Ürünler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {product.similarProducts.map((similarProduct) => (
              <Link
                key={similarProduct.id}
                href={`/urun-detay/${similarProduct.id}`}
                className="group"
              >
                <div className="aspect-square relative mb-2">
                  <Image
                    src={similarProduct.image}
                    alt={similarProduct.name}
                    fill
                    className="object-cover rounded-lg group-hover:opacity-75 transition-opacity"
                  />
                </div>
                <h3 className="text-sm font-medium group-hover:text-blue-600 transition-colors">
                  {similarProduct.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}