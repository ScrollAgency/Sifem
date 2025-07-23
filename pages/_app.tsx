import { useRouter } from "next/router";
import { withAuthProtection } from "../components/withAuthProtection";
import { PUBLIC_ROUTES } from "../utils/publicRoutes";
import type { AppProps } from "next/app";

import { LocaleProvider } from '@/contexts/LocaleContext'

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isPublic = PUBLIC_ROUTES.some(route =>
    new RegExp(`^${route.replace("[recovery_token]", ".*")}$`).test(router.pathname)
  );

  const ComponentToRender = isPublic ? Component : withAuthProtection(Component);

  return (
    <LocaleProvider>
      <ComponentToRender {...pageProps} />
    </LocaleProvider>
  );
}
