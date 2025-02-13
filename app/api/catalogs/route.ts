import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const catalogs = await prisma.catalogs.findMany({
      where: {
        web_net: 1
      },
      orderBy: {
        sira: 'asc'
      },
      select: {
        id: true,
        title: true,
        title_en: true,
        img: true,
        file: true,
        sira: true
      }
    })

    return NextResponse.json({ catalogs })
  } catch (error) {
    console.error('Error fetching catalogs:', error)
    return NextResponse.json({ error: 'Failed to fetch catalogs' }, { status: 500 })
  }
} 