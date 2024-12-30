import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { name, company, mail, phone, description, product_id, recaptchaToken } = body;

    // Verify reCAPTCHA token
    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
    });

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success) {
        return NextResponse.json(
            { error: "Invalid reCAPTCHA" },
            { status: 400 }
        );
    }

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
}
