import type { AppProps } from 'next/app';
import { LocaleProvider } from '@/contexts/LocaleContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LocaleProvider>
      <Component {...pageProps} />
    </LocaleProvider>
  );
} 