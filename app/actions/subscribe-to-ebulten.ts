/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

const subscribeSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
})

export async function subscribeToEbulletin(prevState: any, formData: FormData) {
  const email = formData.get('email')

  try {
    // E-posta doğrulama
    const validatedFields = subscribeSchema.parse({ email })

    // E-posta zaten var mı kontrol et
    const existingSubscription = await prisma.nokta_ebulten.findFirst({
      where: { email: validatedFields.email },
    })

    if (existingSubscription) {
      return { error: 'Bu e-posta adresi zaten kayıtlı.' }
    }

    // Veritabanına kaydet
    await prisma.nokta_ebulten.create({
      data: {
        email: validatedFields.email,
        create_date: new Date(),
      },
    })

    revalidatePath('/')
    return { success: 'E-bültene başarıyla abone oldunuz.' }
  } catch (error) {
    console.error('E-bülten aboneliği hatası:', error)
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: 'Bir hata oluştu. Lütfen tekrar deneyiniz.' }
  }
}

