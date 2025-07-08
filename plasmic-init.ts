import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";
import { LocaleToggleWrapper } from "./components/LocaleToggleWrapper";
import ExportToPDF from "./components/ExportToPDF";
import FileList from "./components/FileList";

export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: "4ZjUYhpZBK7sY7cAwDuePy",
      token: "KCdFLX9fTHV5U7ozHRgq75yueblCzISUNJq878XWPFphZXIKDnh2eqNOzKEsdsWDpL8Pj9Pr2NRdfdpDGMYw",
    },
  ],

  // By default Plasmic will use the last published version of your project.
  // For development, you can set preview to true, which will use the unpublished
  // project, allowing you to see your designs without publishing.  Please
  // only use this for development, as this is significantly slower.
  preview: false,
});

// You can register any code components that you want to use here; see
// https://docs.plasmic.app/learn/code-components-ref/
// And configure your Plasmic project to use the host url pointing at
// the /plasmic-host page of your nextjs app (for example,
// http://localhost:3000/plasmic-host).  See
// https://docs.plasmic.app/learn/app-hosting/#set-a-plasmic-project-to-use-your-app-host

PLASMIC.registerComponent(LocaleToggleWrapper, {
  name: 'LocaleToggleWrapper',
  props: {
    children: 'slot'
  },
  providesData: true,
  refActions: {
    setLocale: {
      argTypes: [
        {
          name: 'locale',
          type: 'string',
          displayName: 'Locale'
        }
      ],
      displayName: 'Set locale'
    }
  }
});

PLASMIC.registerComponent(ExportToPDF, {
  name: 'ExportToPDF',
  props: {
    elementIds: {
      type: 'array',
      displayName: 'Element IDs',
      description: 'Array of element IDs to export'
    },
    fileName: {
      type: 'string',
      displayName: 'File Name',
      defaultValue: 'export'
    },
    format: {
      type: 'choice',
      options: ['pdf', 'png'],
      displayName: 'Export Format',
      defaultValue: 'pdf'
    },
    orientation: {
      type: 'choice',
      options: ['portrait', 'landscape'],
      displayName: 'Orientation',
      defaultValue: 'portrait'
    },
    autoResize: {
      type: 'boolean',
      displayName: 'Auto Resize',
      defaultValue: true
    },
    className: {
      type: 'string',
      displayName: 'CSS Class'
    }
  },
  refActions: {
    export: {
      argTypes: [
        {
          name: 'options',
          type: 'object',
          displayName: 'Export Options'
        }
      ],
      displayName: 'Export to PDF/PNG'
    }
  }
});

PLASMIC.registerComponent(FileList, {
  name: 'FileList',
  props: {
    bucketPath: {
      type: 'string',
      displayName: 'Bucket Path',
      defaultValue: ''
    }
  },
  providesData: true,
  refActions: {
    listFiles: {
      argTypes: [
        {
          name: 'options',
          type: 'object',
          displayName: 'List Options'
        }
      ],
      displayName: 'List Files'
    }
  }
});
