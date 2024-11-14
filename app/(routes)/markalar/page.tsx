'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

const brands = [
  { name: "Dahua", image: "/brands/dahua.jpg", link: "/urunler?brand=1" },
  { name: "Gewiss", image: "/brands/gewiss.jpg", link: "/urunler?brand=2" },
  { name: "Uptech", image: "/brands/uptech.jpg", link: "/urunler?brand=3" },
  { name: "Planet", image: "/brands/planet.jpg", link: "/urunler?brand=3" },
  { name: "Dahua", image: "/brands/dahua.jpg", link: "/urunler?brand=1" },
  { name: "Gewiss", image: "/brands/gewiss.jpg", link: "/urunler?brand=2" },
  { name: "Uptech", image: "/brands/uptech.jpg", link: "/urunler?brand=3" },
  { name: "Planet", image: "/brands/planet.jpg", link: "/urunler?brand=3" },
  { name: "Dahua", image: "/brands/dahua.jpg", link: "/urunler?brand=1" },
  { name: "Gewiss", image: "/brands/gewiss.jpg", link: "/urunler?brand=2" },
  { name: "Uptech", image: "/brands/uptech.jpg", link: "/urunler?brand=3" },
  { name: "Planet", image: "/brands/planet.jpg", link: "/urunler?brand=3" },
  { name: "Dahua", image: "/brands/dahua.jpg", link: "/urunler?brand=1" },
  { name: "Gewiss", image: "/brands/gewiss.jpg", link: "/urunler?brand=2" },
  { name: "Uptech", image: "/brands/uptech.jpg", link: "/urunler?brand=3" },
  { name: "Planet", image: "/brands/planet.jpg", link: "/urunler?brand=3" },
  { name: "Dahua", image: "/brands/dahua.jpg", link: "/urunler?brand=1" },
  { name: "Gewiss", image: "/brands/gewiss.jpg", link: "/urunler?brand=2" },
  { name: "Uptech", image: "/brands/uptech.jpg", link: "/urunler?brand=3" },
  { name: "Planet", image: "/brands/planet.jpg", link: "/urunler?brand=3" },
  { name: "Dahua", image: "/brands/dahua.jpg", link: "/urunler?brand=1" },
  { name: "Gewiss", image: "/brands/gewiss.jpg", link: "/urunler?brand=2" },
  { name: "Uptech", image: "/brands/uptech.jpg", link: "/urunler?brand=3" },
  { name: "Planet", image: "/brands/planet.jpg", link: "/urunler?brand=3" },
]

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  hover: { scale: 1.05, boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.2)" },
}

const Markalar = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div>
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-12 mb-8">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Markalar</h1>
            <p className="text-lg mb-8">Home -- Markalar</p>
          </div>
        </div>
        <div className="container mx-auto px-4">
          {/* Grid container */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {brands.map((brand, index) => (
              <Link href={brand.link} key={index} className="block">
                <motion.div
                className='rounded-lg'
                variants={cardVariants}
                animate="visible"
                whileHover="hover"
                >
                  <motion.div
                    className="bg-white p-4 rounded-lg shadow-lg flex items-center justify-center h-32"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{
                      duration: 0.4,
                      delay: index * 0.2, // Kartlar sırasıyla görünsün
                    }}
                  >
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      width={200}
                      height={120}
                      className="object-contain"
                    />
                  </motion.div>
                </motion.div>
                <motion.p
                  className="mt-2 text-center text-sm font-medium"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                >
                  {brand.name}
                </motion.p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Markalar
