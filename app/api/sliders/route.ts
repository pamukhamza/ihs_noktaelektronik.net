import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

const BASE_IMAGE_URL = 'https://noktanet.s3.eu-central-1.amazonaws.com/uploads/images/slider/';

export async function GET() {
  try {
    const sliders = await prisma.slider.findMany({
      where: {
        is_active: 1,
        site: 'net'
      },
      orderBy: {
        order_by: 'asc'
      },
      select: {
        id: true,
        link: true,
        photo: true
      }
    })

    // Transform the response to include full image URLs
    const transformedSliders = sliders.map(slider => ({
      ...slider,
      photo: slider.photo ? `${BASE_IMAGE_URL}${slider.photo}` : null
    }))

    return NextResponse.json({ sliders: transformedSliders })
  } catch (error) {
    console.error('Error fetching sliders:', error)
    return NextResponse.json({ error: 'Failed to fetch sliders' }, { status: 500 })
  }
}