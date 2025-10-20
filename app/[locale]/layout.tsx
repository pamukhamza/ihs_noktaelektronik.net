/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { locales } from '@/config';
import { setRequestLocale } from 'next-intl/server';

// Generate static params for all supported locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

async function getMessages(locale: string) {
  try {
    return (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

type Props = {
  children: React.ReactNode;
  params: { locale: typeof locales[number] };
};

export default async function LocaleLayout({
  children,
  params,
}: Props) {
  const locale = params.locale;
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as typeof locales[number])) {
    notFound();
  }

  // Set the locale for the request
  setRequestLocale(locale);

  // Get messages for the locale
  const messages = await getMessages(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
