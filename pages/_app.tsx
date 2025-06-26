import type { AppProps } from 'next/app';
import { useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Router } from 'next/router';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { LocaleProvider } from '@/contexts/LocaleContext';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
    
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: '/ingest',
      ui_host: 'https://eu.posthog.com',
      defaults: '2025-05-24', // This enables capture_pageview: 'history_change' by default
      capture_exceptions: true, // This enables capturing exceptions using Error Tracking
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug();
      },
      debug: process.env.NODE_ENV === 'development',
    });
  }, []);

  return (
    <PostHogProvider client={posthog}>
      <LocaleProvider>
        <Component {...pageProps} />
      </LocaleProvider>
    </PostHogProvider>
  );
}