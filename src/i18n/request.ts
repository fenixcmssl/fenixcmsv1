import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { locales, defaultLocale } from './config';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  let locale = cookieStore.get('NEXT_LOCALE')?.value || defaultLocale;
  if (!locales.includes(locale as any)) { locale = defaultLocale; }
  return { locale, messages: (await import(`../../messages/${locale}.json`)).default };
});
