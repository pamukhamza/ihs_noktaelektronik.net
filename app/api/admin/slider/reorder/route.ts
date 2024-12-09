import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { items } = await request.json();

  await prisma.$transaction(
    items.map((item: any) =>
      prisma.slider.update({
        where: { id: item.id },
        data: { order_by: item.order_by },
      })
    )
  );

  return NextResponse.json({ success: true });
}