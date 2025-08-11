import * as React from "react";
import { PageParamsProvider as PageParamsProvider__ } from "@plasmicapp/react-web/lib/host";
import GlobalContextsProvider from "../components/plasmic/sifem/PlasmicGlobalContextsProvider";
import { LocaleContextProvider } from "../components/plasmic/sifem/PlasmicGlobalVariant__Locale";
import { PlasmicHomepage } from "../components/plasmic/sifem/PlasmicHomepage";
import { useRouter } from "next/router";
import { useData } from "@/contexts/DataContext";
import { useMediaLoadingProgress } from "@/hook/useMediaLoadingProgress";

function Homepage() {
  const { lesions, options, loading } = useData();
  const { progress: mediaProgress, complete: mediaComplete } = useMediaLoadingProgress();

  if (loading) return <div>Chargement...</div>;

  const queries = {
    getLesions: { data: lesions },
    getOptions: { data: options },
  };

  function MediaProgressBar({ progress }: { progress: number }) {
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
    background: "red", // temporairement
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
          {!mediaComplete && (
  <>
    <MediaProgressBar progress={mediaProgress} />
    <p style={{ position: "fixed", top: "10px", right: "10px", background: "#fff", zIndex: 10000 }}>
      Chargement des médias : {mediaProgress}%
    </p>
  </>
)}

          <PlasmicHomepage />
        </PageParamsProvider__>
      </GlobalContextsProvider>
    </LocaleContextProvider>
  );
}

export default Homepage;
