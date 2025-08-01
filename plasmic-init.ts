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
  },
  importPath: './components/LocaleToggleWrapper'
});

// Register ExportToPDF component with proper refActions
PLASMIC.registerComponent(ExportToPDF, {
  name: 'ExportToPDF',
  props: {
    elementIds: {
      type: 'array',
      displayName: 'Element IDs',
      description: 'Array of element IDs to export',
      itemType: {
        type: 'object'
      }
    },
    fileName: {
      type: 'string',
      displayName: 'File Name',
      description: 'Name of the exported file (without extension)',
      defaultValue: 'export'
    },
    format: {
      type: 'choice',
      displayName: 'Format',
      description: 'Format to export as',
      options: ['pdf', 'png'],
      defaultValue: 'pdf'
    },
    orientation: {
      type: 'choice',
      displayName: 'Orientation',
      description: 'Page orientation (PDF only)',
      options: ['portrait', 'landscape'],
      defaultValue: 'portrait'
    },
    autoResize: {
      type: 'boolean',
      displayName: 'Auto Resize',
      description: 'Automatically adjust page size/orientation for wide elements',
      defaultValue: true
    },
    onExport: {
      type: 'eventHandler',
      displayName: 'On Export Complete',
      description: 'Function to call when export completes',
      argTypes: []
    },
    className: {
      type: 'string',
      displayName: 'Additional Classes',
      description: 'Additional CSS classes to apply to the component'
    }
  },
  refActions: {
    export: {
      displayName: 'Export to PDF/PNG',
      description: 'Trigger export of the specified elements',
      argTypes: []
    }
  },
  importPath: './components/ExportToPDF'
});

// Register FileList component
PLASMIC.registerComponent(FileList, {
  name: 'FileList',
  props: {
    bucketPath: {
      type: 'string',
      displayName: 'Bucket Path',
      description: 'Path within the lesions bucket to list files from',
      defaultValue: ''
    },
    onList: {
      type: 'eventHandler',
      displayName: 'On List Complete',
      description: 'Function to call when file listing completes',
      argTypes: [
        {
          name: 'files',
          type: 'object'
        }
      ]
    },
    onError: {
      type: 'eventHandler',
      displayName: 'On Error',
      description: 'Function to call when an error occurs',
      argTypes: [
        {
          name: 'error',
          type: 'object'
        }
      ]
    }
  },
  refActions: {
    listFiles: {
      displayName: 'List Files',
      description: 'List files in the specified bucket path',
      argTypes: [
        {
          name: 'path',
          type: 'string',
          displayName: 'Path'
        }
      ]
    }
  },
  importPath: './components/FileList'
});
