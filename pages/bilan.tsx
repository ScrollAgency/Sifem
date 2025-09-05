import * as React from "react";
import { useRouter } from "next/router";
import GlobalContextsProvider from "../components/plasmic/sifem/PlasmicGlobalContextsProvider";
import { LocaleContextProvider } from "../components/plasmic/sifem/PlasmicGlobalVariant__Locale";
import { PageParamsProvider } from "@plasmicapp/react-web/lib/host";
import { PlasmicBilan } from "../components/plasmic/sifem/PlasmicBilan";
import { useData } from "@/contexts/DataContext";


function Bilan() {
  const router = useRouter();
  const { lesions, options, loading } = useData();

  if (loading) return <div>Chargement...</div>;

  return (
    <LocaleContextProvider value={undefined}>
      <GlobalContextsProvider>
        <PageParamsProvider route={router.pathname} query={router.query} params={router.query}>
          <PlasmicBilan />
        </PageParamsProvider>
      </GlobalContextsProvider>
    </LocaleContextProvider>
  );
}

export default Bilan;
