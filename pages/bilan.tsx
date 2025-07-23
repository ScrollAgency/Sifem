import * as React from "react";
import { PageParamsProvider as PageParamsProvider__ } from "@plasmicapp/react-web/lib/host";
import GlobalContextsProvider from "../components/plasmic/electric_sifem_for_production/PlasmicGlobalContextsProvider";
import { LocaleContextProvider } from "../components/plasmic/electric_sifem_for_production/PlasmicGlobalVariant__Locale";
import { PlasmicBilan } from "../components/plasmic/electric_sifem_for_production/PlasmicBilan";
import { useRouter } from "next/router";

function Bilan() {


  return (
    <LocaleContextProvider value={undefined}>
      <GlobalContextsProvider>
        <PageParamsProvider__
          route={useRouter()?.pathname}
          params={useRouter()?.query}
          query={useRouter()?.query}
        >
          <PlasmicBilan />
        </PageParamsProvider__>
      </GlobalContextsProvider>
    </LocaleContextProvider>
  );
}

export default Bilan;
