/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu, Search, Languages, X, Building2, Wrench } from 'lucide-react'
import Logo from '@/components/Logo'
import { useRouter as useNextRouter } from 'next/navigation'
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';
import { useTranslations } from 'next-intl'
import Image from "next/image"

interface SearchResult {
  id: number;
  UrunAdiTR: string;
  UrunAdiEN: string;
  UrunKodu: string;
  seo_link: string;
  marka: {
    id: number;
    title: string;
    seo_link: string;
  } | null;
  KResim: string | null;
}

const LOCALES = ["en", "tr", "ru", "de"] as const;
type Locale = typeof LOCALES[number];

const MENU_ITEMS = [
  { href: "/urunler", label: 'products' },
  { href: "/arge", label: 'rAndD' },
  { href: "/software", label: 'software' },
  { href: "/markalar", label: 'brands' },
  { href: "/hakkimizda", label: 'about' },
  { href: "/iletisim", label: 'contact' },
]

export default function Navbar() {
  const t = useTranslations('navigation');
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useNextRouter()
  const locale = useLocale();
  const intlRouter = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    localStorage.setItem('selectedLanguage', newLocale); 
    intlRouter.replace(pathname, { locale: newLocale });
    setTimeout(() => {
      window.location.reload(); // Reload after replacing the locale
    }, 200);
    setIsMobileMenuOpen(false);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchResults([]);
    setSearchQuery('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Normalize the query by only trimming spaces
      const normalizedQuery = searchQuery.trim().replace(/\s+/g, ' ');

      if (normalizedQuery) {
        router.push(`/urunler?query=${encodeURIComponent(normalizedQuery)}`);
        handleCloseSearch();
      }
      e.preventDefault();
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    
    if (query.length >= 2) {
      setIsLoading(true)
      try {
        // Normalize the query by only trimming spaces
        const normalizedQuery = query.trim().replace(/\s+/g, ' ');
        const response = await fetch(`/api/products/search?query=${encodeURIComponent(normalizedQuery)}&limit=5`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (!data || !Array.isArray(data.products)) {
          console.error('Invalid data structure:', data)
          throw new Error('Invalid response format')
        }
        
        setSearchResults(data.products)
      } catch (error) {
        console.error('Error fetching search results:', error)
        setSearchResults([])
      } finally {
        setIsLoading(false)
    }
    } else {
      setSearchResults([])
    }
  }

  const handleSeeAll = () => {
    if (searchQuery) {
      router.push(`/urunler?search=${encodeURIComponent(searchQuery)}`);
      handleCloseSearch();
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isSearchOpen])

  useEffect(() => {
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsSearchOpen(false)
        setIsMobileMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscKey)
    return () => document.removeEventListener('keydown', handleEscKey)
  }, [])

  const ScrollProgressBar = () => {
    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, {
      stiffness: 100,
      damping: 30,
      restDelta: 0.001
    })

    return (
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 origin-left z-50"
        style={{ scaleX }}
      />
    )
  }

  const SearchResults = ({ results, onClose }: { results: SearchResult[], onClose: () => void }) => {
    return (
      <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg overflow-hidden z-50">
        {results.map((result) => (
          <Link
            key={result.id}
            href={`/urun/${result.seo_link}`}
            className="flex items-center p-2 hover:bg-gray-100 transition-colors"
            onClick={onClose}
          >
            <div className="w-16 h-16 flex-shrink-0 mr-4">
              {result.KResim ? (
                <Image
                  src={`https://noktanet.s3.eu-central-1.amazonaws.com/uploads/images/products/${result.KResim}`}
                  alt={result.UrunAdiTR}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Image
                    src="https://noktanet.s3.eu-central-1.amazonaws.com/uploads/images/products/gorsel_hazirlaniyor.jpg"
                    alt="No image available"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            <div className="flex-grow min-w-0">
              <div className="font-medium text-gray-900 truncate">
                {result.UrunAdiTR}
              </div>
              {result.UrunAdiEN && (
                <div className="text-sm text-gray-600 truncate">
                  {result.UrunAdiEN}
                </div>
              )}
              <div className="flex items-center mt-1 space-x-2">
                {result.UrunKodu && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {result.UrunKodu}
                  </span>
                )}
                {result.marka && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {result.marka.title}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b navbgone backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="w-[120px] md:w-[150px] lg:w-[205px] flex-shrink-0">
            <Logo />
          </div>
          <nav className="hidden items-center space-x-3 md:space-x-4 lg:space-x-6 lg:flex">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs md:text-sm font-medium transition-colors hover:text-foreground/80 ${
                  pathname.startsWith(item.href)
                    ? 'text-foreground'
                    : 'text-foreground/60'
                }`}
              >
                {t(item.label)}
              </Link>
            ))}
          </nav>
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="hidden items-center gap-1.5 md:gap-2 lg:flex">
              <Button
                variant="outline"
                size="sm"
                className="flex h-7 md:h-8 items-center gap-1.5 rounded-full px-2.5 md:px-3 text-xs font-medium transition-colors bg-blue-500 text-white hover:bg-blue-600"
                asChild
              >
                <Link href="https://www.noktaelektronik.com.tr/tr/giris">
                  <Building2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t('b2bLogin')}</span>
                </Link>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="flex h-7 md:h-8 items-center gap-1.5 rounded-full px-2.5 md:px-3 text-xs font-medium transition-colors bg-emerald-500 text-white hover:bg-emerald-600"
                asChild
              >
                <Link href="https://www.noktaelektronik.com.tr/tr/teknik-destek">
                  <Wrench className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t('technicalService')}</span>
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-muted/50"
                onClick={() => {
                  setIsSearchOpen(true)
                  setTimeout(() => {
                    inputRef.current?.focus()
                  }, 200)
                }}
              >
                <Search className="h-4 w-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-transparent">
                    <Languages className="h-4 w-4" />
                    <span className="sr-only">Select language</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[180px]">
                  <DropdownMenuItem onClick={() => switchLocale('tr')} className={locale === 'tr' ? 'bg-accent' : ''}>
                    <Image
                      src="/flags/tr.svg"
                      alt="Turkish Flag"
                      width={24}
                      height={16}
                      className="mr-2"
                    />
                    Türkçe
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => switchLocale('en')} className={locale === 'en' ? 'bg-accent' : ''}>
                    <Image
                      src="/flags/gb.svg"
                      alt="British Flag"
                      width={24}
                      height={16}
                      className="mr-2"
                    />
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => switchLocale('ru')} className={locale === 'ru' ? 'bg-accent' : ''}>
                    <Image
                      src="/flags/ru.svg"
                      alt="Russian Flag"
                      width={24}
                      height={16}
                      className="mr-2"
                    />
                    Русский
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => switchLocale('de')} className={locale === 'de' ? 'bg-accent' : ''}>
                    <Image
                      src="/flags/de.svg"
                      alt="German Flag"
                      width={24}
                      height={16}
                      className="mr-2"
                    />
                    Deutsch
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Search and Menu */}
            <div className="flex lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-muted/50"
                onClick={() => {
                  setIsSearchOpen(true)
                  setTimeout(() => {
                    inputRef.current?.focus()
                  }, 200)
                }}
              >
                <Search className="h-5 w-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-transparent">
                    <Languages className="h-5 w-5" />
                    <span className="sr-only">Select language</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => switchLocale('tr')} className={locale === 'tr' ? 'bg-accent' : ''}>
                    <Image
                      src="/flags/tr.svg"
                      alt="Turkish Flag"
                      width={24}
                      height={16}
                      className="mr-2"
                    />
                    Türkçe
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => switchLocale('en')} className={locale === 'en' ? 'bg-accent' : ''}>
                    <Image
                      src="/flags/gb.svg"
                      alt="British Flag"
                      width={24}
                      height={16}
                      className="mr-2"
                    />
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => switchLocale('ru')} className={locale === 'ru' ? 'bg-accent' : ''}>
                    <Image
                      src="/flags/ru.svg"
                      alt="Russian Flag"
                      width={24}
                      height={16}
                      className="mr-2"
                    />
                    Русский
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => switchLocale('de')} className={locale === 'de' ? 'bg-accent' : ''}>
                    <Image
                      src="/flags/de.svg"
                      alt="German Flag"
                      width={24}
                      height={16}
                      className="mr-2"
                    />
                    Deutsch
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden hover:bg-transparent">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[540px]">
                <SheetHeader className="mb-8">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-6">
                  

                  <div className="flex flex-col space-y-4">
                    {MENU_ITEMS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="text-lg font-medium transition-colors hover:text-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {t(item.label)}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-6 space-y-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <Languages className="mr-2 h-4 w-4" />
                          <span>Language</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-full sm:w-[540px]">
                        <DropdownMenuItem onClick={() => switchLocale('tr')} className={locale === 'tr' ? 'bg-accent' : ''}>
                          <Image
                            src="/flags/tr.svg"
                            alt="Turkish Flag"
                            width={24}
                            height={16}
                            className="mr-2"
                          />
                          Türkçe
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => switchLocale('en')} className={locale === 'en' ? 'bg-accent' : ''}>
                          <Image
                            src="/flags/gb.svg"
                            alt="British Flag"
                            width={24}
                            height={16}
                            className="mr-2"
                          />
                          English
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => switchLocale('ru')} className={locale === 'ru' ? 'bg-accent' : ''}>
                          <Image
                            src="/flags/ru.svg"
                            alt="Russian Flag"
                            width={24}
                            height={16}
                            className="mr-2"
                          />
                          Русский
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => switchLocale('de')} className={locale === 'de' ? 'bg-accent' : ''}>
                          <Image
                            src="/flags/de.svg"
                            alt="German Flag"
                            width={24}
                            height={16}
                            className="mr-2"
                          />
                          Deutsch
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {/* Add mobile buttons at the top */}
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex w-full items-center justify-start gap-2 rounded-lg px-4 py-2 text-left text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
                      asChild
                    >
                      <Link href="https://www.noktaelektronik.com.tr/tr/giris">
                        <Building2 className="h-4 w-4" />
                        <span>{t('b2bLogin')}</span>
                      </Link>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex w-full items-center justify-start gap-2 rounded-lg px-4 py-2 text-left text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
                      asChild
                    >
                      <Link href="https://www.noktaelektronik.com.tr/tr/teknik-destek">
                        <Wrench className="h-4 w-4" />
                        <span>{t('technicalService')}</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Apple-style search overlay */}
      <div
        className={`fixed inset-x-0 top-[75px] z-40 transform overflow-visible navbgone backdrop-blur-lg transition-all duration-300 ease-in-out ${
          isSearchOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
        ref={searchRef}
      >
        <div className="container py-8">
          <div className="relative mx-auto max-w-2xl">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="search"
                value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleKeyDown}
                placeholder="Ürün adı, stok kodu veya marka..."
                className="w-full border-none bg-muted/50 pl-10 pr-10 py-6 text-lg shadow-none ring-0 focus-visible:ring-0"
              />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
              onClick={() => {
                setIsSearchOpen(false)
                setSearchQuery('')
                setSearchResults([])
              }}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close search</span>
            </Button>
            
            {/* Search Results */}
            {searchQuery.length >= 2 && (
              <SearchResults results={searchResults} onClose={handleCloseSearch} />
            )}
          </div>
        </div>
      </div>

      {/* Overlay backdrop */}
      {(isSearchOpen || isMobileMenuOpen) && (
        <div 
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm" 
          onClick={() => {
            setIsSearchOpen(false)
            setIsMobileMenuOpen(false)
          }}
        />
      )}
    </>
  )
}