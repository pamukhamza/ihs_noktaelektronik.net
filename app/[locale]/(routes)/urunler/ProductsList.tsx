/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronDown, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ProductCard from '@/app/[locale]/(routes)/_components/ProductCard'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { getTranslatedField } from '@/lib/get-translated-field'
import { useTranslations } from 'next-intl';

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
  KategoriAdiEn: string;
  KategoriAdiDe: string;
  KategoriAdiRu: string;
  seo_link: string;
}

interface Brand {
  id: number;
  title: string;
  seo_link: string;
}

export default function ProductsList({ initialCategory }: { initialCategory?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortOption, setSortOption] = useState('newest');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [imageError, setImageError] = useState<{[key: string]: boolean}>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategorySeo, setSelectedCategorySeo] = useState<string | null>(initialCategory || null);
  const [currentParentId, setCurrentParentId] = useState<number>(0);
  const [categoryPath, setCategoryPath] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(() => {
    // Initialize selected brands from URL on component mount
    if (typeof window !== 'undefined') {
      const urlBrands = searchParams.getAll('brands');
      return urlBrands;
    }
    return [];
  });
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  const searchQuery = searchParams.get('search') || '';

  const ITEMS_PER_PAGE = 20;

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });

      let endpoint = '/api/products';

      if (searchQuery) {
        endpoint = '/api/search';
        params.append('query', searchQuery);
      } else {
        if (selectedCategorySeo) {
          params.append('seo_link', selectedCategorySeo);
        }

        if (selectedBrands.length > 0) {
          selectedBrands.forEach(brand => params.append('brands', brand));
        }
      }

      const response = await fetch(`${endpoint}?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setProducts(data.products);
      setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
      
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, selectedCategorySeo, selectedBrands, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategorySeo, selectedBrands]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Update URL with new page number
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
    // Scroll to top of products
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      setTotalPages(1);
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
      setTotalPages(1);
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
      setTotalPages(1);
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  useEffect(() => {
    const urlBrands = searchParams.getAll('brands');
    if (JSON.stringify(urlBrands) !== JSON.stringify(selectedBrands)) {
      setSelectedBrands(urlBrands);
      setProducts([]); // Reset products to trigger a new fetch
      setPage(1);
      setTotalPages(1);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isLoading) {
      setProducts([]);
      setPage(1);
      setTotalPages(1);
    }
  }, [selectedBrands]);

  const fetchBrands = async () => {
    try {
      setIsLoadingBrands(true);
      const response = await fetch('/api/brands');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Brands data:', data); // Debug log
      if (data.brands && Array.isArray(data.brands)) {
        setBrands(data.brands);
      } else {
        console.error('Invalid brands data structure:', data);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setIsLoadingBrands(false);
    }
  };

  const handleBrandClick = async (brand: Brand) => {
    const newBrands = selectedBrands.includes(brand.seo_link)
      ? selectedBrands.filter(b => b !== brand.seo_link)
      : [...selectedBrands, brand.seo_link];
    
    setSelectedBrands(newBrands);
    
    // Update URL with both category and brands
    const baseUrl = selectedCategorySeo 
      ? `/urunler/${selectedCategorySeo}` 
      : '/urunler';
    
    const searchParams = new URLSearchParams();
    if (newBrands.length > 0) {
      newBrands.forEach(b => searchParams.append('brands', b));
    }
    
    const queryString = searchParams.toString();
    // Use replace instead of push to avoid adding to history stack
    router.replace(`${baseUrl}${queryString ? `?${queryString}` : ''}`);
    
    setProducts([]);
    setPage(1);
    setTotalPages(1);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const renderCategoryName = (category: Category) => {
    // For German and Russian, use English translation
    const translationLocale = locale === 'de' || locale === 'ru' ? 'en' : locale;
    
    return getTranslatedField(
      {
        KategoriAdiTR: category.KategoriAdiTr,
        KategoriAdiEN: category.KategoriAdiEn
      },
      'KategoriAdi',
      translationLocale
    ) || category.KategoriAdiTr; // Fallback to Turkish if translation is missing
  };

  const renderProductName = (product: Product) => {
    return getTranslatedField(
      {
        UrunAdiTR: product.UrunAdiTR,
        UrunAdiEN: product.UrunAdiEN
      },
      'UrunAdi',
      locale
    ) || product.UrunAdiTR; // Fallback to Turkish if translation is missing
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Desktop Category and Brand Menu */}
        <div className="hidden md:block w-64 shrink-0">
          {/* Categories */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{t('categories')}</h2>
              {categoryPath.length > 0 && (
                <button
                  onClick={handleBackClick}
                  className="text-sm px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                  {t('back')}
                </button>
              )}
            </div>
            {categoryPath.length > 0 && (
              <div className="mb-4 text-sm text-gray-600 border-b pb-2">
                {categoryPath.map((cat, index) => (
                  <span key={cat.id}>
                    {index > 0 && " > "}
                    {renderCategoryName(cat)}
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
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedCategorySeo === category.seo_link
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'hover:bg-muted hover:shadow-sm'
                    }`}
                  >
                    {renderCategoryName(category)}
                  </button>
                ))
              ) : (
                <p className="text-gray-500 text-center py-2">No categories found</p>
              )}
            </div>
          </div>

          {/* Brands */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">{t('brands')}</h2>
            {isLoadingBrands ? (
              <div className="animate-pulse space-y-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-8 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {brands.map((brand) => (
                  <label
                    key={brand.id}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-md transition-colors hover:bg-muted cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.seo_link)}
                      onChange={() => handleBrandClick(brand)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className={`${
                      selectedBrands.includes(brand.seo_link)
                        ? 'text-primary font-medium'
                        : ''
                    }`}>
                      {brand.title}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        

        <div className="flex-1">
          {/* Mobile Menu Button */}
          <div className="md:hidden mb-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <ChevronDown className={`mr-2 h-4 w-4 transition-transform duration-200 ${
                isMobileMenuOpen ? 'rotate-180' : ''
              }`} />
              {isMobileMenuOpen ? t('hideFilters') : t('showFilters')}
            </Button>
          </div>

          {/* Sort, View Options and Popular Brands */}
          <div className="flex justify-between items-center mb-6">
            {/* Popular Brands - Desktop Only */}
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm text-gray-500 font-medium">{t('popularBrands')}</span>
              <div className="flex gap-3">
                <a href="urunler/?brands=xiaomi"><img src="/brands/7zsn68hv_link.jpg" alt="Brand 1" className="h-8 w-auto transition-all cursor-pointer" /></a>
                <a href="urunler/?brands=ignitenet"><img src="/brands/8pqgymzc_hover.jpg" alt="Brand 2" className="h-8 w-auto transition-all cursor-pointer" /></a>
                <a href="urunler/?brands=oring"><img src="/brands/3qgw7zly_hover.jpg" alt="Brand 3" className="h-8 w-auto transition-all cursor-pointer" /></a>
                <a href="urunler/?brands=planet"><img src="/brands/ulxz8zg0_hover.png" alt="Brand 4" className="h-8 w-auto transition-all cursor-pointer" /></a>
              </div>
            </div>

            {/* Sort and View Options */}
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    {t('sortBy')} <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortOption('newest')}>
                    {t('newest')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption('oldest')}>
                    {t('oldest')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-gray-100' : ''}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-gray-100' : ''}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 auto-rows-fr' 
              : 'grid-cols-1 gap-y-4'
          }`}>
            {products.map((product) => (
              <div
                key={product.id}
              >
                <ProductCard product={product} viewMode={viewMode} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {!isLoading && products.length > 0 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(pageNum => {
                  // Show first page, last page, current page, and pages around current page
                  return pageNum === 1 || 
                         pageNum === totalPages || 
                         (pageNum >= page - 2 && pageNum <= page + 2);
                })
                .map((pageNum, index, array) => {
                  // If there's a gap, show ellipsis
                  if (index > 0 && pageNum - array[index - 1] > 1) {
                    return (
                      <React.Fragment key={`ellipsis-${pageNum}`}>
                        <span className="px-2">...</span>
                        <Button
                          variant={pageNum === page ? "default" : "outline"}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      </React.Fragment>
                    );
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === page ? "default" : "outline"}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center my-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {/* No Results */}
          {!isLoading && products.length === 0 && (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600">{t('noProductsFound')}</p>
            </div>
          )}
        </div>

        {/* Mobile Menu Panel */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/25 z-40 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-xl shadow-lg md:hidden"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">{t('filters')}</h2>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>

                  {/* Categories Section */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">{t('categories')}</h3>
                      {categoryPath.length > 0 && (
                        <button
                          onClick={handleBackClick}
                          className="text-sm px-3 py-1 rounded-md bg-white hover:bg-gray-100 transition-colors flex items-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                          </svg>
                          {t('back')}
                        </button>
                      )}
                    </div>

                    {categoryPath.length > 0 && (
                      <div className="text-sm text-gray-600 mb-3">
                        {categoryPath.map((cat, index) => (
                          <span key={cat.id}>
                            {index > 0 && " > "}
                            {renderCategoryName(cat)}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="max-h-[30vh] overflow-y-auto">
                      {isLoadingCategories ? (
                        <div className="flex items-center justify-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                        </div>
                      ) : categories.length > 0 ? (
                        <div className="space-y-1">
                          {categories.map((category) => (
                            <button
                              key={category.id}
                              onClick={() => {
                                handleCategoryClick(category);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                                selectedCategorySeo === category.seo_link
                                  ? 'bg-primary/10 text-primary font-medium'
                                  : 'hover:bg-white'
                              }`}
                            >
                              {renderCategoryName(category)}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-2">{t('noCategoriesFound')}</p>
                      )}
                    </div>
                  </div>

                  {/* Brands Section */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-4">{t('brands')}</h3>
                    <div className="max-h-[30vh] overflow-y-auto">
                      {isLoadingBrands ? (
                        <div className="animate-pulse space-y-2">
                          {[1, 2, 3].map((n) => (
                            <div key={n} className="h-8 bg-white rounded"></div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {brands.map((brand) => (
                            <label
                              key={brand.id}
                              className="flex items-center gap-2 w-full px-3 py-2 rounded-md transition-colors hover:bg-white cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedBrands.includes(brand.seo_link)}
                                onChange={() => handleBrandClick(brand)}
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <span className={`${
                                selectedBrands.includes(brand.seo_link)
                                  ? 'text-primary font-medium'
                                  : ''
                              }`}>
                                {brand.title}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
