'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import React, { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { useTranslations } from 'next-intl'
import { Link } from 'next/link'
import { subscribeToEbulletin } from '@/app/actions/subscribe-to-ebulten'

function SubscribeButton() {
  const t = useTranslations('footer');
  const { pending } = useFormStatus()
  
  return (
    <Button type="submit" disabled={pending} className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
      {pending ? t('gonderiliyor')+'...' : t('abone-ol')}
    </Button>
  )
}

const Footer = () => {
  const t = useTranslations('footer');
  const locale = useRouter().locale;
  const [state, formAction] = useActionState(subscribeToEbulletin, null)

  return (
    <footer className="bg-gradient-to-r from-black to-gray-700">
      <div className="mx-auto w-full max-w-screen-xl container">
        <div className="grid grid-cols-2 gap-8 px-1 md:px-4 py-6 lg:py-8 md:grid-cols-4">
          <div>
            <h2 className="mb-6 text-sm font-semibold  text-white uppercase ">{t('cozumler')}</h2>
            <ul className="text-white text-sm">
              <li className="mb-4"><Link href={`/${locale}/urunler/cctv-cozumleri-326`} className="hover:underline">{t('cctv-cozumleri')}</Link></li>
              <li className="mb-4"><Link href={`/${locale}/urunler/aktif-network-urunleri-2384`} className="hover:underline">{t('aktif-network')}</Link></li>
              <li className="mb-4"><Link href={`/${locale}/urunler/pasif-network-urunleri-2389`} className="hover:underline">{t('pasif-network')}</Link></li>
              <li className="mb-4"><Link href={`/${locale}/urunler/medikal-urun-cozumleri-10556`} className="hover:underline">{t('medikal-urun')}</Link></li>
              <li className="mb-4"><Link href={`/${locale}/urunler/yangin-algilama-sistemleri-10629`} className="hover:underline">{t('yangin-algilama')}</Link></li>
              <li className="mb-4"><Link href={`/${locale}/urunler/bariyer-ve-otopark-cozumleri-10638`} className="hover:underline">{t('bariyer-otopark')}</Link></li>
              <li className="mb-4"><Link href={`/${locale}/software`} className="hover:underline">{t('yazilim-cozumleri')}</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold  uppercase text-white">{t('destek')}</h2>
            <ul className="text-white text-sm">
              <li className="mb-4"><Link href="https://www.noktaelektronik.com.tr/tr/teknik-destek" className="hover:underline">{t('teknik-destek-prog')}</Link></li>
              <li className="mb-4"><Link href={`/${locale}/arge`} className="hover:underline">{t('arge-uretim')}</Link></li>
              <li className="mb-4"><Link href={`/${locale}/software`} className="hover:underline">{t('yazilim')}</Link></li>
              <li className="mb-4"><Link href={`/${locale}/hakkimizda`} className="hover:underline">{t('hakkimizda')}</Link></li>
              <li className="mb-4"><Link href={`/${locale}/iletisim`} className="hover:underline">{t('iletisim')}</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold uppercase text-white">{t('bize-ulasin')}</h2>
            <ul className=" text-white text-sm">
              <li className="mb-4"><Link href={`/${locale}/iletisim`} className="hover:underline">{t('adreslerimiz')}</Link></li>
              <li className="mb-4">{t('tel')}<a href="tel:02122228780" className="hover:underline"> 0212 222 87 80</a></li>
              <li className="mb-4">{t('e-posta')}: <a href="mailto:nokta@noktaelektronik.net" className="hover:underline">nokta@noktaelektronik.net</a></li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold  uppercase text-white">{t('e-bulten')}</h2>
            <p className="mt-2 mb-2 text-sm text-white">{t('yeniliklerden')}</p>
            <form action={formAction} className="space-y-4">
              <div>
                <Label htmlFor="email" className="sr-only">{t('e-posta')}</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder= {t('e-posta-adresiniz')}
                  className="w-full px-3 py-2 textone bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <SubscribeButton />
              {state?.error && (
                <p className="text-red-500 text-sm" role="alert">{state.error}</p>
              )}
              {state?.success && (
                <p className="text-green-500 text-sm" role="alert">{state.success}</p>
              )}
            </form>
          </div>
        </div>
        <div className="px-4 py-6 md:flex md:items-center md:justify-between border-t borderone">
          <span className="text-sm text-white sm:text-center"> 2024 <Link href="https://www.noktaelektronik.net/">Nokta Elektronik</Link>. {t('tum-haklar')}.</span>
          <div className="flex mt-4 sm:justify-center md:mt-0 space-x-5 rtl:space-x-reverse">
            <a href="https://www.facebook.com/nebsis/" className="text-white">
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 8 19">
                <path fillRule="evenodd" d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z" clipRule="evenodd"/>
              </svg>
              <span className="sr-only">Facebook page</span>
            </a>
            <a href="https://twitter.com/NEBSIS?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor" className="text-white">
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 17">
                <path fillRule="evenodd" d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z" clipRule="evenodd"/>
              </svg>
              <span className="sr-only">Twitter page</span>
            </a>
            <a href="https://www.instagram.com/noktaelektronik/" className="text-white">
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2c-2.716 0-3.056.012-4.123.06-1.064.049-1.791.218-2.427.465a4.901 4.901 0 0 0-1.772 1.153A4.902 4.902 0 0 0 2.525 5.45c-.247.636-.416 1.363-.465 2.427C2.012 8.944 2 9.284 2 12s.012 3.056.06 4.123c.049 1.064.218 1.791.465 2.427a4.902 4.902 0 0 0 1.153 1.772 4.901 4.901 0 0 0 1.772 1.153c.636.247 1.363.416 2.427.465 1.067.048 1.407.06 4.123.06s3.056-.012 4.123-.06c1.064-.049 1.791-.218 2.427-.465a4.902 4.902 0 0 0 1.772-1.153 4.902 4.902 0 0 0 1.153-1.772c.247-.636.416-1.363.465-2.427.048-1.067.06-1.407.06-4.123s-.012-3.056-.06-4.123c-.049-1.064-.218-1.791-.465-2.427a4.902 4.902 0 0 0-1.153-1.772 4.901 4.901 0 0 0-1.772-1.153c-.636-.247-1.363-.416-2.427-.465C15.056 2.012 14.716 2 12 2zm0 1.802c2.67 0 2.986.01 4.04.058.976.045 1.505.207 1.858.344.466.182.8.399 1.15.748.35.35.566.684.748 1.15.137.353.3.882.344 1.857.048 1.055.058 1.37.058 4.041 0 2.67-.01 2.986-.058 4.04-.045.976-.207 1.505-.344 1.858-.182.466-.399.8-.748 1.15-.35.35-.684.566-1.15.748-.353.137-.882.3-1.857.344-1.054.048-1.37.058-4.041.058-2.67 0-2.987-.01-4.04-.058-.976-.045-1.505-.207-1.858-.344a3.097 3.097 0 0 1-1.15-.748 3.098 3.098 0 0 1-.748-1.15c-.137-.353-.3-.882-.344-1.857-.048-1.055-.058-1.37-.058-4.041 0-2.67.01-2.986.058-4.04.045-.976.207-1.505.344-1.858.182-.466.399-.8.748-1.15.35-.35.684-.566 1.15-.748.353-.137.882-.3 1.857-.344 1.055-.048 1.37-.058 4.041-.058zm0 3.064a5.134 5.134 0 1 0 0 10.268 5.134 5.134 0 0 0 0-10.268zm0 8.466a3.332 3.332 0 1 1 0-6.664 3.332 3.332 0 0 1 0 6.664zm6.538-8.671a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" clipRule="evenodd"/>
              </svg>
              <span className="sr-only">Instagram page</span>
            </a>
            <a href="https://www.linkedin.com/company/nokta-elektronik-ve-bili%C5%9Fim-sistemleri/" className="text-white">
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"/>
              </svg>
              <span className="sr-only">LinkedIn page</span>
            </a>
            <a href="#" className="text-white">
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.
505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" clipRule="evenodd"/>
              </svg>
              <span className="sr-only">YouTube channel</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
