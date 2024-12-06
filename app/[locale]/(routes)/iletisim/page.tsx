'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react"
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { WhatsAppButton } from "@/components/whatsapp-button"


const phoneNumber = "+90 (212) 222 87 80"
const sirketMail = "nokta@noktaelektronik.net"

const Iletisim = () => {
  const navigationT = useTranslations('navigation');
  const t = useTranslations('iletisim');

  const categorizedAddresses = {
    [t('satis-magazalari')]: [
      { title: t('istanbul-satis-magazasi') + " 1", address: "Perpa Ticaret Merkezi B Blok Kat 8 No. 906-907 34384 Şişli / İstanbul" },
      { title: t('istanbul-satis-magazasi') + " 2", address: "Perpa Ticaret Merkezi A Blok Kat 8 No. 841 34384 Şişli / İstanbul"},
      { title: t('ankara-satis-magazasi') + " 2", address: "Timko İş Yerleri Sitesi Timko Sk. E Blok No. 4 06200 Yenimahalle / Ankara"},
    ],
    [t('ofisler')]: [
      { title:  t('genel-merkez') , address: "Perpa Ticaret Merkezi A Blok Kat 2 No.1 34384 Şişli / İstanbul" },
      { title:  t('ankara-bolge-ofisi') , address: "Timko İş Yerleri Sitesi Timko Sk. E Blok No.4 06200 Yenimahalle / Ankara" },
    ],
    [t('teknik-servisler')]: [
      { title:  t('teknik-servis') , address: "Perpa Ticaret Merkezi B Blok Kat 8 No. 906-907 34384 Şişli / İstanbul" },
    ],
    [t('arge-uretim-merkezi')]: [
      { title: t('arge-uretim-merkezi') + " (İzmir)", address: "Tuna Mah. Sanat Cad. No. 17/220 Bornova / İzmir" },
      { title: t('arge-uretim-merkezi') + " (Ankara)", address: "Çamlıca Mah. Anadolu Bulvarı 28/10 Gimat / Yenimahalle / Ankara" },
    ],
  }
  const [activeTab, setActiveTab] = useState(Object.keys(categorizedAddresses)[0])
  
  // Function to generate Google Maps embed URL
  const generateMapUrl = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps?q=${encodedAddress}&output=embed`;
  };

  return (
    <motion.div
    initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-12 mb-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4"> {navigationT('contact')} </h1>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8 lg:pb-12 lg:pt-2 lg:px-2 bg-gradient-to-r from-blue-900 to-sky-600  text-mycolor8 pb-24 pt-4 px-4">
            {Object.keys(categorizedAddresses).map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="text-lg font-medium"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.entries(categorizedAddresses).map(([category, addresses]) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {addresses.map((item, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className="relative h-48">
                      {/* Google Maps iFrame */}
                      <iframe
                        src={generateMapUrl(item.address)}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        title={`Map of ${item.title}`}
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-primary">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <MapPin className="mr-2 h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                          <p className="text-sm">{item.address}</p>
                        </div>
                        <div className="flex items-center">
                          <Phone className="mr-2 h-5 w-5 text-muted-foreground" />
                          <p className="text-sm">{phoneNumber}</p>
                        </div>
                        <div className="flex items-center">
                          <Mail className="mr-2 h-5 w-5 text-muted-foreground" />
                          <p className="text-sm">{sirketMail}</p>
                        </div>
                        <a
                          href={generateMapUrl(item.address)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-primary hover:underline mt-2"
                        >
                          Haritada Gör
                          <ExternalLink className="ml-1 h-4 w-4" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <WhatsAppButton phoneNumber="905555555555" message="Merhaba, sizinle iletişime geçmek istiyorum." />
    </motion.div>
  )
}

export default Iletisim
