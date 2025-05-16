import type { AppProps } from 'next/app';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { useLocale } from '@/contexts/LocaleContext';

export default function App({ Component, pageProps }: AppProps) {
  const { locale, setLocale } = useLocale();

  return (
    <LocaleProvider>
      <Component {...pageProps} />
    </LocaleProvider>
  );
} 