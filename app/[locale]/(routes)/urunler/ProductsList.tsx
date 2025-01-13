/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronDown, Grid, List, ChevronLeft, ChevronRight, Home } from 'lucide-react'
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
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: number;
  seo_link: string;
  UrunAdiTR: string;
  UrunAdiEN: string;
  UrunKodu: string;
  MarkaID?: number;
  image: string;
  marka?: {
    title: string;
  };
}

interface Category {
  id: number;
  KategoriAdiTr: string;
  KategoriAdiEn: string;
  seo_link: string;
  img_path?: string;
  parent_id?: number;
}

interface CategoryCardProps {
  category: Category;
  locale: string;
}

const CategoryCard = ({ category, locale }: CategoryCardProps) => {
  const [imageError, setImageError] = useState(false);
  const searchParams = useSearchParams();
  const imageUrl = category.img_path 
    ? `https://noktanet.s3.eu-central-1.amazonaws.com/uploads/images/categories/${category.img_path}`
    : 'https://noktanet.s3.eu-central-1.amazonaws.com/uploads/images/products/gorsel_hazirlaniyor.jpg';

  // Build URL with brand parameter if it exists
  const brandParam = searchParams?.get('brand');
  const href = brandParam 
    ? `/urunler/${category.seo_link}?brand=${brandParam}`
    : `/urunler/${category.seo_link}`;

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 group border">
      <Link href={href} className="block">
        {/* Image Container */}
        <div className="relative aspect-[1/1] overflow-hidden rounded-t-lg bg-gray-50 flex items-center justify-center">
          <Image
            src={imageError ? 'https://noktanet.s3.eu-central-1.amazonaws.com/uploads/images/products/gorsel_hazirlaniyor.jpg' : imageUrl}
            alt={locale === 'tr' ? category.KategoriAdiTr : category.KategoriAdiEn}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            priority
          />
        </div>
        
        {/* Content */}
        <div className="p-5">
          <div>
            <span className="inline-block w-full px-4 py-2.5 bg-gray-700 group-hover:bg-gray-900 text-white text-center rounded-md transition-colors text-sm font-medium">
              {locale === 'tr' ? category.KategoriAdiTr : category.KategoriAdiEn}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

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
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);
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
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  const [categoryBreadcrumbs, setCategoryBreadcrumbs] = useState<Category[]>([]);
  const [hasSubcategories, setHasSubcategories] = useState<boolean | null>(null);
  const searchQuery = searchParams ? searchParams.get('query') || '' : '';
  const brandParam = searchParams ? searchParams.get('brand') : null;
  
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      
      if (brandParam && brandParam !== selectedBrands[0]) {
        setSelectedBrands([brandParam]);
        setProducts([]);
        setPage(1);
        setTotalPages(1);
      } else if (!brandParam && selectedBrands.length > 0) {
        setSelectedBrands([]);
        setProducts([]);
        setPage(1);
        setTotalPages(1);
      }
    }
  }, [searchParams]);

  const handleBrandToggle = (brandSeoLink: string) => {
    // If the brand is already selected, deselect it
    if (selectedBrands.includes(brandSeoLink)) {
      setSelectedBrands([]);
      // Remove brand parameter from URL
      if (searchParams) {
        const params = new URLSearchParams(searchParams);
        params.delete('brand');
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    } else {
      // Select the new brand (replacing any existing selection)
      setSelectedBrands([brandSeoLink]);
      // Update URL with new brand
      if (searchParams) {
        const params = new URLSearchParams(searchParams);
        params.set('brand', brandSeoLink);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }
    
    // Reset products to trigger new fetch
    setProducts([]);
    setPage(1);
    setTotalPages(1);
  };

  // Fetch products only if category has no subcategories or if there's a search query
  const fetchProducts = useCallback(async () => {
    // Only fetch products if:
    // 1. There's a search query OR
    // 2. We're in a category with no subcategories
    if ((!selectedCategorySeo || hasSubcategories !== false) && !searchQuery && !brandParam) {
      return;
    }

    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();
      queryParams.set('page', page.toString());
      queryParams.set('limit', ITEMS_PER_PAGE.toString());
      
      if (selectedCategorySeo && !searchQuery) {
        queryParams.set('seo_link', selectedCategorySeo);
      }

      if (selectedBrands.length > 0) {
        queryParams.set('brand', selectedBrands[0]);
      }

      if (searchQuery) {
        queryParams.set('query', searchQuery);
      }

      const response = await fetch(`/api/products?${queryParams.toString()}`);
      const data = await response.json();

      if (data.products) {
        setProducts(data.products);
        setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
      } else {
        setProducts([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [page, selectedCategorySeo, selectedBrands, searchQuery, ITEMS_PER_PAGE, hasSubcategories]);

  // Fetch products when search query changes or when we know there are no subcategories
  useEffect(() => {
    if (searchQuery || (!isLoadingCategory && selectedCategorySeo && hasSubcategories === false)) {
      fetchProducts();
    }
  }, [fetchProducts, selectedCategorySeo, hasSubcategories, isLoadingCategory, searchQuery]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Update URL with new page number
    if (searchParams) {
      const params = new URLSearchParams(searchParams);
      params.set('page', newPage.toString());
      router.push(`${pathname}?${params.toString()}`);
    }
    // Scroll to top of products
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchCategories = async (parentId: number = 0) => {
    try {
      setIsLoadingCategories(true);
      const brandParam = searchParams?.get('brand');
      const url = `/api/categories?parent_id=${parentId}${brandParam ? `&brand=${brandParam}` : ''}`;
      const response = await fetch(url);
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

  const checkForSubcategories = async (parentId: number) => {
    try {
      const response = await fetch(`/api/categories?parent_id=${parentId}`);
      const data = await response.json();
      return data.categories && data.categories.length > 0;
    } catch (error) {
      console.error('Error checking subcategories:', error);
      return false;
    }
  };

  // Modified category click handler
  const handleCategoryClick = async (category: Category) => {
    setIsLoadingCategory(true);
    
    try {
      // Always build the full category path
      const fullPath = await buildCategoryPath(category);
      if (fullPath.length === 0) {
        throw new Error('Failed to build category path');
      }
      
      setCategoryPath(fullPath);
      setSelectedCategorySeo(category.seo_link);
      
      // Update URL
      const params = new URLSearchParams(searchParams?.toString() || '');
      const brandParam = params.get('brand');
      const newPath = `/urunler/${category.seo_link}${brandParam ? `?brand=${brandParam}` : ''}`;
      
      // Reset products and page before navigation
      setProducts([]);
      setPage(1);
      setTotalPages(1);
      
      await router.push(newPath);
    } catch (error) {
      console.error('Error handling category click:', error);
      // Optionally show an error message to the user
      setProducts([]); // Clear products on error
      setPage(1);
      setTotalPages(1);
    } finally {
      setIsLoadingCategory(false);
    }
  };

  // Optimize back click handler
  const handleBackClick = async () => {
    try {
      const brandParam = searchParams?.get('brand');
      
      if (categoryPath.length <= 1) {
        // Going back to root
        const baseUrl = '/urunler';
        const newUrl = brandParam ? `${baseUrl}?brand=${brandParam}` : baseUrl;
        router.push(newUrl);
        setSelectedCategorySeo(null);
        setCategoryPath([]);
        
        // Fetch root data in parallel
        const [categoriesData, brandsData] = await Promise.all([
          fetch(`/api/categories?parent_id=0${brandParam ? `&brand=${brandParam}` : ''}`).then(res => res.json()),
          fetch('/api/brands').then(res => res.json())
        ]);
        
        setCategories(categoriesData.categories || []);
        setBrands(brandsData.brands || []);
        setHasSubcategories(null);
      } else {
        // Going back to previous category
        const newPath = [...categoryPath];
        newPath.pop();
        const previousCategory = newPath[newPath.length - 1];
        setCategoryPath(newPath);
        
        if (previousCategory?.seo_link) {
          const baseUrl = `/urunler/${previousCategory.seo_link}`;
          const newUrl = brandParam ? `${baseUrl}?brand=${brandParam}` : baseUrl;
          router.push(newUrl);
          setSelectedCategorySeo(previousCategory.seo_link);
          
          // Fetch previous category data in parallel
          const [categoriesData, brandsData] = await Promise.all([
            fetch(`/api/categories?parent_id=${previousCategory.id}${brandParam ? `&brand=${brandParam}` : ''}`).then(res => res.json()),
            fetch(`/api/brands?category_id=${previousCategory.id}`).then(res => res.json())
          ]);
          
          setCategories(categoriesData.categories || []);
          setBrands(brandsData.brands || []);
          setHasSubcategories(categoriesData.categories && categoriesData.categories.length > 0);
        }
      }
    } catch (error) {
      console.error('Error in handleBackClick:', error);
      setCategories([]);
      setBrands([]);
      setHasSubcategories(null);
    }
  };

  // Optimize initial load
  const loadInitialData = async () => {
    try {
      const brandParam = searchParams?.get('brand');

      if (selectedCategorySeo) {
        const category = await fetchCategoryBySeoLink(selectedCategorySeo);
        if (category) {
          // Always build the full category path
          const fullPath = await buildCategoryPath(category);
          setCategoryPath(fullPath);
          setSelectedCategorySeo(category.seo_link);
          
          // Fetch category data in parallel
          const [subcategoriesData, brandsData] = await Promise.all([
            fetch(`/api/categories?parent_id=${category.id}${brandParam ? `&brand=${brandParam}` : ''}`).then(res => res.json()),
            fetch(`/api/brands?category_id=${category.id}`).then(res => res.json())
          ]);
          
          const hasSubcats = subcategoriesData.categories && subcategoriesData.categories.length > 0;
          setHasSubcategories(hasSubcats);
          setCategories(subcategoriesData.categories || []);
          setBrands(brandsData.brands || []);
        }
      } else {
        // Load root level data in parallel
        const [categoriesData, brandsData] = await Promise.all([
          fetch(`/api/categories?parent_id=0${brandParam ? `&brand=${brandParam}` : ''}`).then(res => res.json()),
          fetch('/api/brands').then(res => res.json())
        ]);
        
        setCategories(categoriesData.categories || []);
        setBrands(brandsData.brands || []);
        setHasSubcategories(null);
        setCategoryPath([]);
      }
    } catch (error) {
      console.error('Error in loadInitialData:', error);
      setCategories([]);
      setBrands([]);
      setHasSubcategories(null);
      setCategoryPath([]);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [selectedCategorySeo, searchParams]);

  useEffect(() => {
    const loadInitialData = async () => {
      if (initialCategory) {
        try {
          const category = await fetchCategoryBySeoLink(initialCategory);
          if (category) {
            const path = await buildCategoryPath(category);
            setCategoryPath(path);
            setSelectedCategorySeo(category.seo_link);
          }
        } catch (error) {
          console.error('Error loading initial category:', error);
        }
      }
    };

    loadInitialData();
  }, [initialCategory]);

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
      if (!currentCat.parent_id || currentCat.parent_id === 0) break;
      
      try {
        const response = await fetch(`/api/categories/by-id?id=${currentCat.parent_id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data.success || !data.category) {
          throw new Error('Category not found');
        }
        currentCat = data.category;
      } catch (error) {
        console.error('Error fetching parent category:', error);
        break; // Stop the loop but return what we have so far
      }
    }
    
    return path;
  };

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

  // Add fetchCategoryBySeoLink function
  const fetchCategoryBySeoLink = async (seoLink: string) => {
    try {
      const response = await fetch(`/api/categories/by-seo-link?seo_link=${seoLink}`);
      if (!response.ok) throw new Error('Failed to fetch category');
      const data = await response.json();
      return data.category;
    } catch (error) {
      console.error('Error fetching category:', error);
      return null;
    }
  };

  // Simplified brand click handler
  const handleBrandClick = (brand: Brand) => {
    handleBrandToggle(brand.seo_link);
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
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'hover:bg-blue-100'
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
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-md transition-colors hover:bg-blue-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.seo_link)}
                      onChange={() => handleBrandClick(brand)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <span className={`${
                      selectedBrands.includes(brand.seo_link)
                        ? 'text-blue-600 font-medium'
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

          {/* View Options and Breadcrumbs */}
          {categoryPath.length > 0 && (
          <div className="flex justify-between items-center mb-6">
            {/* Breadcrumbs*/}
            
              <div className="hidden md:flex items-center gap-2">
                <Link 
                  href={searchParams?.get('brand') ? `/urunler?brand=${searchParams.get('brand')}` : '/urunler'} 
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Home className="h-5 w-5" />
                </Link>
                {categoryPath.map((category, index) => (
                  <React.Fragment key={category.id}>
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                    {index === categoryPath.length - 1 ? (
                      <span className="text-blue-600">{renderCategoryName(category)}</span>
                    ) : (
                      <Link 
                        href={searchParams?.get('brand') 
                          ? `/urunler/${category.seo_link}?brand=${searchParams.get('brand')}`
                          : `/urunler/${category.seo_link}`
                        }
                        className="text-gray-600 hover:text-gray-900"
                      >
                        {renderCategoryName(category)}
                      </Link>
                    )}
                  </React.Fragment>
                ))}
              </div>

            {/* Sort and View Options */}
            <div className={`flex items-center gap-4 ${categoryPath.length === 0 ? 'ml-auto' : ''}`}>
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
        )}
          {/* Products or Categories Grid */}
          <div className={`grid gap-6 ${
            !searchQuery && (!selectedCategorySeo || hasSubcategories)
              ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4' // Categories grid
              : viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4' // Products grid
                : 'grid-cols-1 gap-y-4' // List view
          }`}>
            {/* Loading State */}
            {isLoadingCategory && !searchQuery && (
              <div className="col-span-full flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* Categories - Only show if no search query */}
            {!isLoadingCategory && !searchQuery && (!selectedCategorySeo || hasSubcategories) && (
              categories.map((category) => (
                <CategoryCard key={category.id} category={category} locale={locale} />
              ))
            )}
            
            {/* Products - Show when in search mode or when category has no subcategories */}
            {(searchQuery || (!isLoadingCategory && selectedCategorySeo && hasSubcategories === false)) && (
              <>
                {isLoading ? (
                  <div className="col-span-full flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <div key={product.id}>
                      <ProductCard product={product} viewMode={viewMode} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    {t('no_products_found')}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Pagination - Only show when displaying products */}
          {(searchQuery || (!isLoadingCategory && selectedCategorySeo && hasSubcategories === false)) && !isLoading && products.length > 0 && (
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
          {isLoadingCategory && (
            <div className="col-span-full flex justify-center items-center my-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
                                  ? 'bg-blue-600 text-white'
                                  : 'hover:bg-blue-100'
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
                            <button
                              key={brand.id}
                              onClick={() => handleBrandToggle(brand.seo_link)}
                              className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                                selectedBrands.includes(brand.seo_link)
                                  ? 'bg-gray-900 text-white'
                                  : 'hover:bg-gray-100'
                              }`}
                            >
                              {brand.title}
                            </button>
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