import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const brands = await prisma.nokta_urun_markalar.findMany({
      where: {
        is_active: true
      },
      select: {
        id: true,
        title: true
      },
      orderBy: {
        order_by: 'asc'
      }
    })
    return NextResponse.json(brands)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching brands' },
      { status: 500 }
    )
  }
}