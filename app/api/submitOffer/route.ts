import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import emailService from '@/utils/emailService';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, company, mail, phone, description, product_id, language } = body;


        // Create offer in database
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

        // Get product details for the email
        const product = await prisma.nokta_urunler.findUnique({
            where: { id: parseInt(product_id) },
            select: { UrunAdiTR: true }
        });

        const formData = {
            name,
            company,
            phone,
            email: mail,
            description
        };

        // Send email to admin
        await emailService.sendEmail({
            to: process.env.ADMIN_EMAIL!,
            subject: language === 'tr' ? 'Yeni Ürün Teklif Talebi' : 'New Product Offer Submission',
            html: `
                ${emailService.generateFormEmailTemplate(formData)}
                <p><strong>${language === 'tr' ? 'Ürün' : 'Product'}:</strong> ${product?.UrunAdiTR || (language === 'tr' ? 'Bilinmeyen Ürün' : 'Unknown Product')}</p>
            `
        });

        // Send confirmation email to user
        await emailService.sendEmail({
            to: mail,
            subject: language === 'tr' ? 'Ürün talebiniz için teşekkürler' : 'Thank you for your product inquiry',
            html: language === 'tr' ? `
                <h2>Talebiniz için teşekkür ederiz!</h2>
                <p>Sayın ${name},</p>
                <p>${product?.UrunAdiTR || 'ürünümüz'} hakkındaki talebinizi aldık. Ekibimiz en kısa sürede sizinle iletişime geçecektir.</p>
                <p>Saygılarımızla,<br/>Nokta Elektronik ve Bilişim Sistemleri A.Ş.</p>
            ` : `
                <h2>Thank you for your inquiry!</h2>
                <p>Dear ${name},</p>
                <p>We have received your inquiry about ${product?.UrunAdiTR || 'our product'}. Our team will review your request and get back to you as soon as possible.</p>
                <p>Best regards,<br/>Nokta Elektronik ve Bilişim Sistemleri A.Ş.</p>
            `
        });

        return NextResponse.json({ success: true, data: offer });
    } catch (error) {
        console.error('Offer submission error:', error);
        return NextResponse.json(
            { error: 'Failed to process offer submission' },
            { status: 500 }
        );
    }
}
