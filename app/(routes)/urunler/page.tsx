'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { ChevronDown, Grid, List } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getProducts } from '@/app/actions/product-actions'
import { ScrollArea } from "@/components/ui/scroll-area"

type Product = {
  id: string
  UrunAdiTR?: string | null
  UrunAdiEN?: string | null
  brand?: string | null
  images: string[]
  create_date?: Date
}

type SortOption = 'newest'
type ViewMode = 'grid' | 'list'

// Sample categories - replace with your actual categories
const categories = [
  { id: 1, name: "Network Devices", count: 120 },
  { id: 2, name: "Switches", count: 45 },
  { id: 3, name: "Routers", count: 32 },
  { id: 4, name: "Access Points", count: 28 },
  { id: 5, name: "Network Cables", count: 65 },
  { id: 6, name: "Fiber Optic", count: 42 },
  { id: 7, name: "Tools", count: 89 },
  { id: 8, name: "Test Equipment", count: 37 },
]

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [sortOption, setSortOption] = useState<SortOption>('newest')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const observer = useRef<IntersectionObserver | null>(null)
  const lastProductElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  useEffect(() => {
    fetchProducts()
  }, [page])

  async function fetchProducts() {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const fetchedProducts = await getProducts(page * 20, 20)
      setProducts(prevProducts => [...prevProducts, ...fetchedProducts])
      setHasMore(fetchedProducts.length === 20)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products
    .filter(product => 
      product.UrunAdiTR?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
      product.UrunAdiEN?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return (b.create_date?.getTime() || 0) - (a.create_date?.getTime() || 0)
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-12 mb-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Discover Amazing Products</h1>
          <p className="text-xl mb-4">Find the best deals on our wide range of high-quality items</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Categories Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Categories</h2>
              <ScrollArea className="h-[calc(100vh-240px)]">
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-200 ${
                        selectedCategory === category.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{category.name}</span>
                        <span className="text-sm text-gray-500">{category.count}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex justify-end mb-6">
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      Sort by <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSortOption('newest')}>
                      Newest First
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <AnimatePresence>
              <motion.div
                className={`grid gap-3 sm:gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={`${product.id}-${index}`}
                    className={`group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    ref={index === filteredProducts.length - 1 ? lastProductElementRef : null}
                    onClick={() => router.push(`/urun-detay/${product.id}`)}
                  >
                    <div className={`relative ${viewMode === 'list' ? 'w-48 h-48' : 'aspect-square w-full'}`}>
                      <Image
                        src={product.images[0] ? `/product-images/${product.images[0]}` : '/gorsel_hazirlaniyor.jpg'}
                        alt={product.UrunAdiTR || product.UrunAdiEN || 'Product Image'}
                        fill
                        className="object-contain p-2 transform transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null
                          currentTarget.src = '/gorsel_hazirlaniyor.jpg'
                        }}
                      />
                    </div>
                    <div className={`p-3 sm:p-4 border-t border-gray-100 bg-white ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 hover:text-blue-600 transition-colors duration-200 text-sm sm:text-base">
                        {product.UrunAdiTR || product.UrunAdiEN || 'Unnamed Product'}
                      </h3>
                      {product.brand && (
                        <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">{product.brand}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
            
            {loading && (
              <div className="text-center py-4">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              </div>
            )}
            {!hasMore && !loading && (
              <p className="text-center text-gray-500 mt-6">No more products to load</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}