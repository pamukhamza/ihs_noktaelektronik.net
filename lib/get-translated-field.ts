type TranslatedField = {
  [key: string]: string | null | undefined;
};

export function getTranslatedField(
  obj: TranslatedField,
  field: string,
  locale: string = 'tr'
): string | null | undefined {
  const normalizedLocale = locale.toLowerCase();
  
  // For German and Russian, use English as fallback
  if (normalizedLocale === 'de' || normalizedLocale === 'ru') {
    return obj[`${field}EN`] || obj[`${field}TR`];
  }

  const suffix = normalizedLocale === 'tr' ? 'TR' : 'EN';
  const fieldName = `${field}${suffix}`;
  
  return obj[fieldName] || obj[`${field}EN`] || obj[`${field}TR`];
}

export function createTranslatedFields(
  field: string,
  translations: {
    tr?: string;
    en?: string;
  }
): TranslatedField {
  return {
    [`${field}TR`]: translations.tr || null,
    [`${field}EN`]: translations.en || null
  };
}
