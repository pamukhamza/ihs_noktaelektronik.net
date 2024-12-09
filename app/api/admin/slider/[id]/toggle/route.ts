import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { is_active } = await request.json();

  const updatedSlider = await prisma.slider.update({
    where: { id: parseInt(params.id) },
    data: { is_active },
  });

  return NextResponse.json(updatedSlider);
}