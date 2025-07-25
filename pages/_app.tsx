import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useRouter } from "next/router";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PUBLIC_ROUTES } from "../utils/publicRoutes";
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { DataProvider } from "@/contexts/DataContext";

export default function App({ Component, pageProps }: AppProps) {

  const router = useRouter();
  const isPublic = PUBLIC_ROUTES.some(route =>
    new RegExp(`^${route.replace("[recovery_token]", ".*")}$`).test(router.pathname)
  );

  //const ComponentToRender = isPublic ? Component : withAuthProtection(Component);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
    
    // Configuration avec fallback au cas où le proxy ne marche pas
    const isProduction = process.env.NODE_ENV === 'production';
    
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: isProduction ? process.env.NEXT_PUBLIC_POSTHOG_HOST : '/ingest',
      ui_host: 'https://eu.posthog.com',
      defaults: '2025-05-24', // This enables capture_pageview: 'history_change' by default
      capture_exceptions: false, // Désactivé temporairement pour éviter l'erreur 304
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug();
        console.log('PostHog initialisé avec:', {
          api_host: isProduction ? process.env.NEXT_PUBLIC_POSTHOG_HOST : '/ingest',
          environment: process.env.NODE_ENV
        });
      },
      debug: process.env.NODE_ENV === 'development',
    });
  }, []);

  return (
    <PostHogProvider client={posthog}>
      <LocaleProvider>
        <DataProvider>
          <Component {...pageProps} />
        </DataProvider>
      </LocaleProvider>
    </PostHogProvider>
  );
}