// plasmic-host.tsx
import * as React from "react";
import { PlasmicCanvasHost, registerComponent } from "@plasmicapp/host";
import * as PlasmicLibrary from "@plasmic-library/components";

// Composants custom avec importPath explicite
function registerComponents(library: Record<string, any>) {
  for (const key of Object.keys(library)) {
    if (!key.includes("Meta")) {
      const component = library[key];
      const metaKey = `${key}Meta`;
      const meta = library[metaKey];

      if (meta) {
        registerComponent(component, {
          ...meta,
          //importPath: meta.importPath,
        });
      }
    }
  }
}
registerComponents(PlasmicLibrary);

export default function PlasmicHost() {
  return <PlasmicCanvasHost />;
}
