const ExportToPDFMeta = {
  name: "ExportToPDF",
  section: "2- Jean",
  displayName: "Export to Pdf",
  description: "Liste les lésions via le contexte",
  importPath: "@plasmic-library/jean/ExportToPDF/ExportToPDF",
  thumbnailUrl: "https://plasmic-api.agence-scroll.com/forgot-password.png",

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
  }
};

export default ExportToPDFMeta;
