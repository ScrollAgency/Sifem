import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { Router } from 'next/router';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { LocaleProvider } from '@/contexts/LocaleContext';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: '/ingest',
      ui_host: 'https://eu.posthog.com',
      capture_pageview: 'history_change',
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