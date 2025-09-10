import * as React from "react";
import { PageParamsProvider as PageParamsProvider__ } from "@plasmicapp/react-web/lib/host";
import GlobalContextsProvider from "../components/plasmic/sifem/PlasmicGlobalContextsProvider";
import { LocaleContextProvider } from "../components/plasmic/sifem/PlasmicGlobalVariant__Locale";
import { PlasmicHomepage } from "../components/plasmic/sifem/PlasmicHomepage";
import { useRouter } from "next/router";
import { useData } from "@/contexts/DataContext";
import { usePwaAssetsProgress } from "@/hook/usePwaAssetsProgress";

function Homepage() {
  const { lesions, options, loading } = useData();
  const { progress: pwaProgress, complete: pwaComplete } = usePwaAssetsProgress();
  const allLoaded = !loading && pwaComplete;

  const queries = {
    getLesions: { data: lesions },
    getOptions: { data: options },
  };


  return (
    <LocaleContextProvider value={undefined}>
      <GlobalContextsProvider>
        <PageParamsProvider__
          route={useRouter()?.pathname}
          params={useRouter()?.query}
          query={useRouter()?.query}
        >
          {!allLoaded && (
            <PlasmicHomepage
              overrides={
                {
                  progressBar: (
                    <div className="progressBar">
                      <div
                        style={{
                          width: `${pwaProgress}%`,
                          height: "100%",
                          background: "#fff0ee",
                          borderRadius: "8px",
                          transition: "width 0.3s ease"
                        }}
                      />
                    </div>
                  )
                } as any
              }
            />
          )}
          {allLoaded && <PlasmicHomepage />}
        </PageParamsProvider__>
      </GlobalContextsProvider>
    </LocaleContextProvider>
  );
}

export default Homepage;
