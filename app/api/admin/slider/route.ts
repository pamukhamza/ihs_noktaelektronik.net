import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const sliders = await prisma.slider.findMany({
    orderBy: { order_by: 'asc' },
  });
  return NextResponse.json(sliders);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const link = formData.get('link') as string;
  const photo = formData.get('photo') as File;

  // Burada photo'yu bir cloud storage'a yükleyip URL'ini almalısınız
  // Örnek olarak doğrudan dosya adını kullanıyoruz
  const photoUrl = photo ? `/uploads/${photo.name}` : null;

  const lastSlider = await prisma.slider.findFirst({
    orderBy: { order_by: 'desc' },
  });

  const newSlider = await prisma.slider.create({
    data: {
      link,
      photo: photoUrl,
      is_active: 1,
      order_by: lastSlider ? (lastSlider.order_by || 0) + 1 : 1,
    },
  });

  return NextResponse.json(newSlider);
}