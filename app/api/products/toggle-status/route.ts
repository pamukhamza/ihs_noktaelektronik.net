import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { id } = await request.json()
  
  try {
    const product = await prisma.nokta_urunler.findUnique({
      where: { id: Number(id) }
    })
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const updatedProduct = await prisma.nokta_urunler.update({
      where: { id: Number(id) },
      data: { aktif: !product.aktif }
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    return NextResponse.json({ error: 'Error updating product' }, { status: 500 })
  }
}