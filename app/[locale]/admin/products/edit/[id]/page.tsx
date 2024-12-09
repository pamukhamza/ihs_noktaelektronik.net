'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  })

  useEffect(() => {
    // Ürün bilgilerini getir
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        const data = await response.json()
        setFormData(data)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchProduct()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/admin/products')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Ürün Düzenle</h1>
      
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="block mb-1">Ürün Adı</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Açıklama</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full border rounded p-2"
            rows={4}
          />
        </div>

        <div>
          <label className="block mb-1">Fiyat</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Stok</label>
          <input
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({...formData, stock: e.target.value})}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Güncelle
          </button>
          
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  )
}