import * as React from "react";
import { useRouter } from "next/router";
import GlobalContextsProvider from "../components/plasmic/copy_of_sifem_production_for_update_electric/PlasmicGlobalContextsProvider";
import { LocaleContextProvider } from "../components/plasmic/copy_of_sifem_production_for_update_electric/PlasmicGlobalVariant__Locale";
import { PageParamsProvider } from "@plasmicapp/react-web/lib/host";
import { PlasmicDataSourceContextProvider } from "@plasmicapp/react-web";
import { PlasmicBilan } from "../components/plasmic/copy_of_sifem_production_for_update_electric/PlasmicBilan";

import { useLesions } from "../hook/useLesions";
import { useOptions } from "../hook/useOptions";

function Bilan() {
  const router = useRouter();
  const lesions = useLesions();
  const options = useOptions();

  const queries = {
    getLesions: { data: lesions },
    getOptions: { data: options },
  };

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

