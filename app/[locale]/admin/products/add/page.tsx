'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Category {
  id: number
  KategoriAdiTr: string
  children?: Category[]
}

interface Brand {
  id: number
  title: string
}

export default function AddProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [formData, setFormData] = useState({
    UrunKodu: '',
    UrunAdiTR: '',
    UrunAdiEN: '',
    OzelliklerTR: '',
    OzelliklerEN: '',
    BilgiTR: '',     // Teknik Özellikler TR
    BilgiEN: '',     // Teknik Özellikler EN
    UygulamalarTr: '',
    UygulamalarEn: '',
    KategoriID: '',
    MarkaID: '',
    aktif: true
  })

  useEffect(() => {
    // Fetch categories and brands when component mounts
    fetchCategories()
    fetchBrands()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands')
      if (response.ok) {
        const data = await response.json()
        setBrands(data)
      }
    } catch (error) {
      console.error('Error fetching brands:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/admin/products')
      } else {
        const error = await response.json()
        alert('Hata: ' + error.message)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Bir hata oluştu')
    }
  }
  const RenderCategoryOption = ({ category, level = 0 }: { category: Category, level?: number }) => {
    return (
      <>
        <option key={category.id} value={category.id}>
          {level > 0 ? '└' + '─'.repeat(level) + ' ' : ''}{category.KategoriAdiTr}
        </option>
        {category.children?.map((child) => (
          <RenderCategoryOption key={child.id} category={child} level={level + 1} />
        ))}
      </>
    )
  }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Yeni Ürün Ekle</h1>
      
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Ürün Kodu */}
          <div>
            <label className="block mb-1 font-medium">Ürün Kodu</label>
            <input
              type="text"
              value={formData.UrunKodu}
              onChange={(e) => setFormData({...formData, UrunKodu: e.target.value})}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block mb-1 font-medium">Kategori</label>
            <select
              value={formData.KategoriID}
              onChange={(e) => setFormData({...formData, KategoriID: e.target.value})}
              className="w-full border rounded p-2"
              required
            >
              <option value="">Kategori Seçin</option>
              {categories.map((category) => (
                <RenderCategoryOption key={category.id} category={category} />
              ))}
            </select>
          </div>

          {/* Ürün Adı TR */}
          <div>
            <label className="block mb-1 font-medium">Ürün Adı (TR)</label>
            <input
              type="text"
              value={formData.UrunAdiTR}
              onChange={(e) => setFormData({...formData, UrunAdiTR: e.target.value})}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Ürün Adı EN */}
          <div>
            <label className="block mb-1 font-medium">Ürün Adı (EN)</label>
            <input
              type="text"
              value={formData.UrunAdiEN}
              onChange={(e) => setFormData({...formData, UrunAdiEN: e.target.value})}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Marka */}
          <div>
            <label className="block mb-1 font-medium">Marka</label>
            <select
              value={formData.MarkaID}
              onChange={(e) => setFormData({...formData, MarkaID: e.target.value})}
              className="w-full border rounded p-2"
              required
            >
              <option value="">Marka Seçin</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Genel Özellikler TR */}
        <div>
          <label className="block mb-1 font-medium">Genel Özellikler (TR)</label>
          <textarea
            value={formData.OzelliklerTR}
            onChange={(e) => setFormData({...formData, OzelliklerTR: e.target.value})}
            className="w-full border rounded p-2"
            rows={4}
          />
        </div>

        {/* Genel Özellikler EN */}
        <div>
          <label className="block mb-1 font-medium">Genel Özellikler (EN)</label>
          <textarea
            value={formData.OzelliklerEN}
            onChange={(e) => setFormData({...formData, OzelliklerEN: e.target.value})}
            className="w-full border rounded p-2"
            rows={4}
          />
        </div>

        {/* Teknik Özellikler TR */}
        <div>
          <label className="block mb-1 font-medium">Teknik Özellikler (TR)</label>
          <textarea
            value={formData.BilgiTR}
            onChange={(e) => setFormData({...formData, BilgiTR: e.target.value})}
            className="w-full border rounded p-2"
            rows={4}
          />
        </div>

        {/* Teknik Özellikler EN */}
        <div>
          <label className="block mb-1 font-medium">Teknik Özellikler (EN)</label>
          <textarea
            value={formData.BilgiEN}
            onChange={(e) => setFormData({...formData, BilgiEN: e.target.value})}
            className="w-full border rounded p-2"
            rows={4}
          />
        </div>

        {/* Uygulamalar TR */}
        <div>
          <label className="block mb-1 font-medium">Uygulamalar (TR)</label>
          <textarea
            value={formData.UygulamalarTr}
            onChange={(e) => setFormData({...formData, UygulamalarTr: e.target.value})}
            className="w-full border rounded p-2"
            rows={4}
          />
        </div>

        {/* Uygulamalar EN */}
        <div>
          <label className="block mb-1 font-medium">Uygulamalar (EN)</label>
          <textarea
            value={formData.UygulamalarEn}
            onChange={(e) => setFormData({...formData, UygulamalarEn: e.target.value})}
            className="w-full border rounded p-2"
            rows={4}
          />
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Ürün Ekle
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  )
}