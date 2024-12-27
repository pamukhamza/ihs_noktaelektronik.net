import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, company, mail, phone, description, product_id } = body;

    const offer = await prisma.net_offers.create({
      data: {
        name,
        company,
        mail,
        phone,
        description,
        prod_id: parseInt(product_id)
      },
    });

    return NextResponse.json(offer);
  } catch (error) {
    return NextResponse.json(
      { error: "Error submitting offer" },
      { status: 500 }
    );
  }
}
