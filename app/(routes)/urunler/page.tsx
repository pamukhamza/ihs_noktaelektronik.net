/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { ChevronDown, Grid, List } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Prisma } from '@prisma/client'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { getProducts } from '@/app/actions/product-actions'

type Product = {
  id: number
  UrunAdiTR: string | null
  UrunAdiEN: string | null
  KategoriID: number | null
  create_date: Date | null
  images: string[]
}

type SortOption = 'newest'
type ViewMode = 'grid' | 'list'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [sortOption, setSortOption] = useState<SortOption>('newest')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)

  const observer = useRef<IntersectionObserver | null>(null)
  const lastProductElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1)
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
    const fetchedProducts = await getProducts(page * 20, 20)
    const convertedProducts = fetchedProducts.map(product => ({
      ...product,
    }))

    setProducts(prevProducts => [...prevProducts, ...convertedProducts])
    setLoading(false)
    setHasMore(fetchedProducts.length === 20)
  }

  const filteredProducts = products
    .filter(product => 
      product.UrunAdiTR?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      product.UrunAdiEN?.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="flex flex-col min-h-screen">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-12 mb-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Discover Amazing Products</h1>
          <p className="text-xl mb-8">Find the best deals on our wide range of high-quality items</p>
          <Input
            type="search"
            placeholder="Search products..."
            className="max-w-md mx-auto bg-white text-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="container mx-auto px-4">
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Products</h2>
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Sort by <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortOption('newest')}>
                    Newest
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? "secondary" : "ghost"}
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
              className={viewMode === 'grid' ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-6"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className={`group relative overflow-hidden rounded-lg border bg-background p-4 ${viewMode === 'list' ? 'flex items-center' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  layout
                  ref={index === filteredProducts.length - 1 ? lastProductElementRef : null}
                >
                  <div className={`aspect-h-1 aspect-w-1 overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 ${viewMode === 'list' ? 'w-40 shrink-0 mr-6' : 'w-full mb-4'}`}>
                    <Image
                      src={product.images[0] ? `/product-images/${product.images[0]}` : '/gorsel_hazirlaniyor.jpg'}
                      alt={product.UrunAdiTR || product.UrunAdiEN || 'Product Image'}
                      width={300}
                      height={300}
                      className="h-full w-full object-cover object-center"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/gorsel_hazirlaniyor.jpg';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{product.UrunAdiTR || product.UrunAdiEN}</h3>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
          {loading && <p className="text-center mt-4">Loading more products...</p>}
          {!hasMore && <p className="text-center mt-4">No more products to load</p>}
        </main>
      </div>
    </div>
  )
}
