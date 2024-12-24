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
import { Menu, Search, Languages, X } from 'lucide-react'
import Logo from '@/components/Logo'
import { useRouter as useNextRouter } from 'next/navigation'
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';
import { useTranslations } from 'next-intl'
import Image from "next/image"

interface SearchResult {
  id: number
  UrunAdiTR: string
  UrunAdiEN: string
  UrunKodu: string
  seo_link: string
  marka: string | null
  KResim: string | null
}

const LOCALES = ["en", "tr", "ru", "de"] as const;
type Locale = typeof LOCALES[number];

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

  const navItems = [
    { href: "/urunler", label: t('products') },
    { href: "/arge", label: t('rAndD') },
    { href: "/software", label: t('software') },
    { href: "/markalar", label: t('brands') },
    { href: "/hakkimizda", label: t('about') },
    { href: "/iletisim", label: t('contact') },
  ]

  const switchLocale = (newLocale: Locale) => {
    console.log(`Switching locale to: ${newLocale}`); // Debugging log
    localStorage.setItem('selectedLanguage', newLocale); 
    intlRouter.replace(pathname, { locale: newLocale });
    window.location.reload(); // Reload after replacing the locale
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
      router.push(`/urunler?query=${encodeURIComponent(searchQuery)}`);
      handleCloseSearch();
      e.preventDefault();
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    
    if (query.length >= 2) {
      setIsLoading(true)
      try {
        console.log('Fetching search results for:', query)
        const response = await fetch(`/api/products/search?query=${encodeURIComponent(query)}&limit=5`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const text = await response.text()
        console.log('Raw response:', text)
        
        let data
        try {
          data = JSON.parse(text)
        } catch (e) {
          console.error('JSON parse error:', e)
          throw new Error('Invalid JSON response')
        }
        
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
                    {result.marka}
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
        <div className="container flex h-16 items-center justify-between">
        <ScrollProgressBar />
            <div className="w-[150px] md:w-[205px] flex-shrink-0 mr-4">
              <Logo />
            </div>
            <nav className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Toggle search"
              className="hover:bg-transparent"
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
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden hover:bg-transparent">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-lg font-medium transition-colors hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-6 space-y-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Languages className="mr-2 h-4 w-4" />
                        <span>Language</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[300px] sm:w-[400px]">
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