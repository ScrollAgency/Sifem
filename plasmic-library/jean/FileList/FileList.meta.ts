const FileListMeta = {
  name: "FileList",
  section: "2- Jean",
  displayName: "File list",
  description: "Liste les lésions via le contexte",
  importPath: "@plasmic-library/jean/FileList/FileList",
  thumbnailUrl: "https://plasmic-api.agence-scroll.com/forgot-password.png",

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
  };

  export default FileListMeta;
