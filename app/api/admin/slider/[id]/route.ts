import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const formData = await request.formData();
  const link = formData.get('link') as string;
  const photo = formData.get('photo') as File;

  // Burada photo'yu bir cloud storage'a yükleyip URL'ini almalısınız
  const photoUrl = photo ? `/uploads/${photo.name}` : undefined;

  const updatedSlider = await prisma.slider.update({
    where: { id: parseInt(params.id) },
    data: {
      link,
      ...(photoUrl && { photo: photoUrl }),
    },
  });

  return NextResponse.json(updatedSlider);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.slider.delete({
    where: { id: parseInt(params.id) },
  });

  return NextResponse.json({ success: true });
}