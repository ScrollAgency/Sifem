import { useEffect, useState } from "react";

export function useMediaLoadingProgress() {
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    let loaded = 0;
    let total = 0;
    let hasCompleted = false;

    const updateProgress = () => {
      if (total === 0) return;
      const percent = Math.round((loaded / total) * 100);
      setProgress(percent);
      if (percent >= 100 && !hasCompleted) {
        setComplete(true);
        hasCompleted = true;
      }
    };

    const handleMedia = (el: HTMLImageElement | HTMLVideoElement) => {
      total++;
      if ((el as any).complete || (el as HTMLVideoElement).readyState >= 3) {
        loaded++;
        updateProgress();
      } else {
        const onLoad = () => {
          loaded++;
          updateProgress();
          cleanup();
        };
        const onError = () => {
          loaded++;
          updateProgress();
          cleanup();
        };

        const cleanup = () => {
          el.removeEventListener("load", onLoad);
          el.removeEventListener("error", onError);
          el.removeEventListener("loadeddata", onLoad);
        };

        el.addEventListener("load", onLoad);
        el.addEventListener("error", onError);
        el.addEventListener("loadeddata", onLoad);
      }
    };

    const scanAndTrack = () => {
      const mediaElements = Array.from(
        document.querySelectorAll("img, video")
      ) as (HTMLImageElement | HTMLVideoElement)[];
      console.log("🔍 Media detected:", mediaElements.length);
      console.log("🔍 Media Liste:", mediaElements);

      mediaElements.forEach((el) => {
        if (!(el as any)._alreadyTracked) {
          (el as any)._alreadyTracked = true;
          handleMedia(el);
        }
      });
    };

    // Initial scan
    scanAndTrack();

    // Observe DOM for new media elements
    const observer = new MutationObserver(() => {
      scanAndTrack();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return { progress, complete };
}
