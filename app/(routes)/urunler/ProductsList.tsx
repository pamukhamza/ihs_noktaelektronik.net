'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { ChevronDown, Grid, List } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ProductCard from '@/app/(routes)/_components/ProductCard'
import { useRouter, useSearchParams } from 'next/navigation'

interface Product {
  id: number;
  UrunAdiTR: string;
  UrunAdiEN: string;
  seo_link: string;
  image: string;
}

interface Category {
  id: number;
  KategoriAdiTr: string;
  seo_link: string;
}

export default function ProductsList({ initialCategory }: { initialCategory?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([])
  const [viewMode, setViewMode] = useState('grid')
  const [sortOption, setSortOption] = useState('newest')
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const observer = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef(false)
  const [imageError, setImageError] = useState<{[key: string]: boolean}>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategorySeo, setSelectedCategorySeo] = useState<string | null>(initialCategory || null);
  const [currentParentId, setCurrentParentId] = useState<number>(0);
  const [categoryPath, setCategoryPath] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const lastProductRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading || !hasMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  const fetchProducts = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    
    try {
      setIsLoading(true);
      loadingRef.current = true;
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
      });

      if (selectedCategorySeo) {
        params.append('seo_link', selectedCategorySeo);
      }

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();
      
      if (page === 1) {
        setProducts(data.products);
      } else {
        setProducts(prev => [...prev, ...data.products]);
      }
      
      setHasMore(data.products.length === 12);
      loadingRef.current = false;
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [page, selectedCategorySeo]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const fetchCategories = async (parentId: number = 0) => {
    try {
      setIsLoadingCategories(true);
      const response = await fetch(`/api/categories?parent_id=${parentId}`);
      const data = await response.json();
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const handleCategoryClick = async (category: Category) => {
    try {
      // Add current category to path
      setCategoryPath(prev => [...prev, category]);
      
      // Fetch subcategories
      setIsLoadingCategories(true);
      const response = await fetch(`/api/categories?parent_id=${category.id}`);
      const data = await response.json();
      
      // Update subcategories list
      if (data.categories) {
        setCategories(data.categories);
        setCurrentParentId(category.id);
      }

      // Always update products for the clicked category
      setProducts([]);
      setPage(1);
      setHasMore(true);
      setSelectedCategorySeo(category.seo_link);
      router.push(`/urunler/${category.seo_link}`);
      
    } catch (error) {
      console.error('Error in handleCategoryClick:', error);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const handleBackClick = async () => {
    if (categoryPath.length <= 1) {
      // If at root level, just fetch root categories
      setCurrentParentId(0);
      setCategoryPath([]);
      await fetchCategories(0);
      
      // Clear category filter
      setSelectedCategorySeo(null);
      router.push('/urunler');
      setProducts([]);
      setPage(1);
      setHasMore(true);
    } else {
      // Go back to previous category
      const newPath = [...categoryPath];
      newPath.pop(); // Remove current category
      const previousCategory = newPath[newPath.length - 1];
      setCurrentParentId(previousCategory?.id || 0);
      setCategoryPath(newPath);
      await fetchCategories(previousCategory?.id || 0);

      // Update products to show previous category's products
      setSelectedCategorySeo(previousCategory?.seo_link || null);
      if (previousCategory?.seo_link) {
        router.push(`/urunler/${previousCategory.seo_link}`);
      } else {
        router.push('/urunler');
      }
      setProducts([]);
      setPage(1);
      setHasMore(true);
    }
  };

  const getCategoryBySeoLink = async (seoLink: string) => {
    try {
      const response = await fetch(`/api/categories/by-seo-link?seo_link=${seoLink}`);
      const data = await response.json();
      return data.category;
    } catch (error) {
      console.error('Error fetching category:', error);
      return null;
    }
  };

  const buildCategoryPath = async (category: any) => {
    const path: Category[] = [];
    let currentCat = category;
    
    while (currentCat) {
      path.unshift(currentCat);
      if (currentCat.parent_id === 0) break;
      
      const response = await fetch(`/api/categories/by-id?id=${currentCat.parent_id}`);
      const data = await response.json();
      currentCat = data.category;
    }
    
    return path;
  };

  useEffect(() => {
    const initializeCategory = async () => {
      if (initialCategory) {
        try {
          setIsLoadingCategories(true);
          // Get current category
          const category = await getCategoryBySeoLink(initialCategory);
          
          if (category) {
            // Build category path
            const path = await buildCategoryPath(category);
            setCategoryPath(path);
            
            // Set current parent ID
            setCurrentParentId(category.id);
            setSelectedCategorySeo(category.seo_link);
            
            // Fetch subcategories of current category
            const subResponse = await fetch(`/api/categories?parent_id=${category.id}`);
            const subData = await subResponse.json();
            if (subData.categories) {
              setCategories(subData.categories);
            }
          }
        } catch (error) {
          console.error('Error initializing category:', error);
        } finally {
          setIsLoadingCategories(false);
        }
      } else {
        // Load root categories if no initial category
        fetchCategories(0);
      }
    };

    initializeCategory();
  }, [initialCategory]);

  useEffect(() => {
    const seoLink = searchParams.get('seo_link');
    if (seoLink) {
      setSelectedCategorySeo(seoLink);
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Desktop Category Menu */}
        <div className="hidden md:block w-64 shrink-0">
          <div className="sticky top-24 bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Categories</h2>
              {categoryPath.length > 0 && (
                <button
                  onClick={handleBackClick}
                  className="text-sm px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                  Back
                </button>
              )}
            </div>
            {categoryPath.length > 0 && (
              <div className="mb-4 text-sm text-gray-600 border-b pb-2">
                {categoryPath.map((cat, index) => (
                  <span key={cat.id}>
                    {index > 0 && " > "}
                    {cat.KategoriAdiTr}
                  </span>
                ))}
              </div>
            )}
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {isLoadingCategories ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                </div>
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors hover:scale-[1.02] ${
                      selectedCategorySeo === category.seo_link
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'hover:bg-muted hover:shadow-sm'
                    }`}
                  >
                    {category.KategoriAdiTr}
                  </button>
                ))
              ) : (
                <p className="text-gray-500 text-center py-2">No categories found</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1">
          {/* Mobile Category Button */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full px-4 py-3 bg-white rounded-lg shadow-md flex items-center justify-between"
            >
              <span className="text-lg font-semibold">Categories</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-180' : ''}`}
              >
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
          </div>

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
                  <DropdownMenuItem onClick={() => setSortOption('oldest')}>
                    Oldest First
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

          <div className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 auto-rows-fr' 
              : 'grid-cols-1 gap-y-4'
          }`}>
            {products.map((product, index) => (
              <div
                key={product.id}
                ref={index === products.length - 1 ? lastProductRef : null}
                className="w-full h-full"
              >
                <ProductCard product={product} viewMode={viewMode} />
              </div>
            ))}
          </div>

          {isLoading && (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
        </div>

        {/* Mobile Category Menu Panel */}
        <div className={`
          fixed inset-0 z-50 md:hidden transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'}
        `}>
          <div className="absolute inset-0 bg-black/20" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute bottom-0 w-full bg-white rounded-t-xl shadow-lg">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Categories</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18"/>
                    <path d="m6 6 12 12"/>
                  </svg>
                </button>
              </div>

              {categoryPath.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={handleBackClick}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                  </button>
                  <div className="text-sm text-gray-600 truncate">
                    {categoryPath.map((cat, index) => (
                      <span key={cat.id}>
                        {index > 0 && " > "}
                        {cat.KategoriAdiTr}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="max-h-[60vh] overflow-y-auto">
                {isLoadingCategories ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                  </div>
                ) : categories.length > 0 ? (
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          handleCategoryClick(category);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                          selectedCategorySeo === category.seo_link
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {category.KategoriAdiTr}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No categories found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
