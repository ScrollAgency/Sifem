'use client';

import { forwardRef, useCallback, useImperativeHandle, ForwardRefRenderFunction } from 'react';
import { useData } from '@/contexts/DataContext';
import { useEffect, useState } from 'react';
import pwaAssets from '../../../public/pwa-assets.json';

interface FileObject {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, unknown>;
}

interface FileListProps {
  bucketPath?: string;
  onList?: (files: FileObject[]) => void;
  onError?: (error: Error) => void;
  sourceType?: 'lesions' | 'options';
  [key: string]: any;
}

export interface FileListRef {
  listFiles: (options?: { path?: string }) => Promise<FileObject[]>;
}

const FileListComponent: ForwardRefRenderFunction<FileListRef, FileListProps> = (
  props,
  ref
) => {
  const { bucketPath = '', onList, onError, ...rest } = props;
  const { lesions, options, loading } = useData();
  const [apiFiles, setApiFiles] = useState<FileObject[] | null>(null);

  const listFiles = useCallback(async (optionsArg?: { path?: string }) => {
    try {
      let path = optionsArg?.path || bucketPath;
      // Mapping des noms courts vers les chemins complets du manifest
      const pathMap: Record<string, string> = {
        'image_POV_abdomen/': 'lesions/image_map/image_POV_abdomen/',
        'image_POV_profil/': 'lesions/image_map/image_POV_profil/',
        'image_POV_face-droite/': 'lesions/image_map/image_POV_face-droite/',
        'image_POV_face_gauche/': 'lesions/image_map/image_POV_face_gauche/',
      };
      if (pathMap[path]) {
        path = pathMap[path];
      }
      // Filtre les assets du manifest selon le dossier demandé
      const files = (pwaAssets as Array<{ url: string }>)
        .filter(asset => asset.url.startsWith(`/${path}`))
        .map(asset => {
          const name = asset.url.split('/').pop() || '';
          return {
            name,
            id: asset.url,
            updated_at: '',
            created_at: '',
            last_accessed_at: '',
            metadata: {},
          };
        });
      // Log détaillé pour debug
      console.log('[FileList] path:', path);
      console.log('[FileList] files:', files.map(f => f.name));
      setApiFiles(files);
      onList?.(files as FileObject[]);
      return files as FileObject[];
    } catch (error) {
      const err = error instanceof Error ? error : new Error('An error occurred while fetching files');
      onError?.(err);
      throw err;
    }
  }, [bucketPath, onList, onError]);

  // Expose the listFiles function via ref
  useImperativeHandle(ref, () => ({
    listFiles
  }));


  // Suppression du déclenchement automatique pour éviter la boucle infinie

  return null;
};

const FileList = forwardRef(FileListComponent);

export default FileList; 
