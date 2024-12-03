'use client'

import { Phone, Mail } from 'lucide-react'

export default function TopBar() {
  return (
    <div className="bg-gradient-to-r from-black to-gray-600 text-white py-2 relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-end items-center text-[12px]">
          <div className="flex items-center gap-6">
            <a 
              href="tel:+902122228780" 
              className="inline-flex items-center hover:text-gray-300 transition-colors cursor-pointer no-underline"
            >
              <Phone className="w-3.5 h-3.5 mr-1.5" />
              <span>+90 212 222 87 80</span>
            </a>
            <a 
              href="mailto:nokta@noktaelektronik.net" 
              className="inline-flex items-center hover:text-gray-300 transition-colors cursor-pointer no-underline"
            >
              <Mail className="w-3.5 h-3.5 mr-1.5" />
              <span>nokta@noktaelektronik.net</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
