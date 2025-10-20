import { getRequestConfig } from 'next-intl/server';

const getLocaleFromStorage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('selectedLanguage') || 'tr'; // Default to 'en' if not set
  }
  return 'tr'; // Fallback for server-side rendering
};

export default getRequestConfig(async ({ locale }) => {
  const selectedLocale = getLocaleFromStorage();
  
  return {
    messages: (await import(`./messages/${selectedLocale}.json`)).default
  };
});