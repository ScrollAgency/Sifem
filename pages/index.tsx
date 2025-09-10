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

  function PwaProgressBar({ progress }: { progress: number }) {
    return (
      <div style={{
        width: "100%",
        height: "6px",
        background: "#eee",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999
      }}>
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "#1976d2",
            transition: "width 0.3s ease",
          }}
        />
      </div>
    );
  }

  return (
    <LocaleContextProvider value={undefined}>
      <GlobalContextsProvider>
        <PageParamsProvider__
          route={useRouter()?.pathname}
          params={useRouter()?.query}
          query={useRouter()?.query}
        >
          {!allLoaded && (
            <>
              <PlasmicHomepage
                overrides={
                  {
                    progressBar: <PwaProgressBar progress={pwaProgress} />
                  } as any
                }
              />
            </>
          )}
          {allLoaded && <PlasmicHomepage />}
        </PageParamsProvider__>
      </GlobalContextsProvider>
    </LocaleContextProvider>
  );
}

export default Homepage;
