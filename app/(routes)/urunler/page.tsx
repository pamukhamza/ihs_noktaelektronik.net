/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, ChevronDown, Grid, List, Smartphone, Shirt, Book, Home, Gamepad, Dumbbell, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

const categories = [
  { name: "All", icon: Sparkles },
  { name: "Electronics", icon: Smartphone },
  { name: "Clothing", icon: Shirt },
  { name: "Books", icon: Book },
  { name: "Home & Garden", icon: Home },
  { name: "Toys", icon: Gamepad },
  { name: "Sports", icon: Dumbbell },
]

const products = [
  { id: 1, name: "Wireless Headphones", category: "Electronics", price: 99.99, date: new Date('2023-05-15'), rating: 4.5, sales: 1200 },
  { id: 2, name: "Cotton T-Shirt", category: "Clothing", price: 19.99, date: new Date('2023-06-01'), rating: 4.2, sales: 3000 },
  { id: 3, name: "Bestseller Novel", category: "Books", price: 14.99, date: new Date('2023-04-20'), rating: 4.8, sales: 5000 },
  { id: 4, name: "Garden Tools Set", category: "Home & Garden", price: 49.99, date: new Date('2023-05-10'), rating: 4.0, sales: 800 },
  { id: 5, name: "LEGO Set", category: "Toys", price: 59.99, date: new Date('2023-06-05'), rating: 4.7, sales: 2500 },
  { id: 6, name: "Yoga Mat", category: "Sports", price: 29.99, date: new Date('2023-05-25'), rating: 4.3, sales: 1500 },
]

type SortOption = 'newest' | 'price-low-high' | 'price-high-low' | 'best-selling'
type ViewMode = 'grid' | 'list'

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [sortOption, setSortOption] = useState<SortOption>('best-selling')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = products
    .filter(product => 
      (selectedCategory === "All" || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return b.date.getTime() - a.date.getTime()
        case 'price-low-high':
          return a.price - b.price
        case 'price-high-low':
          return b.price - a.price
        case 'best-selling':
          return b.sales - a.sales
        default:
          return 0
      }
    })

  const featuredProducts = products.sort((a, b) => b.sales - a.sales).slice(0, 3)

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
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 shrink-0">
            <ScrollArea className=" h-auto">
              <h2 className="text-2xl font-semibold mb-4">Categories</h2>
              <nav className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.name}
                    variant={selectedCategory === category.name ? "secondary" : "ghost"}
                    className="w-full justify-start text-lg"
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    {category.name}
                  </Button>
                ))}
              </nav>
            </ScrollArea>
          </aside>
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold"></h2>
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Sort by <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortOption('best-selling')}>
                      Best Selling
                    </DropdownMenuItem>
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
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    className={`group relative overflow-hidden rounded-lg border bg-background p-4 ${viewMode === 'list' ? 'flex items-center' : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    <div className={`aspect-h-1 aspect-w-1 overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 ${viewMode === 'list' ? 'w-40 shrink-0 mr-6' : 'w-full mb-4'}`}>
                      <Image
                        src={`/placeholder.svg?height=300&width=300`}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  )
}