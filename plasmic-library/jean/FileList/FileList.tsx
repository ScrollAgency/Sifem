'use client';

import { forwardRef, useCallback, useImperativeHandle, ForwardRefRenderFunction } from 'react';
import { useData } from '@/contexts/DataContext';
import { useEffect, useState } from 'react';

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
      const path = optionsArg?.path || bucketPath;
      // Appel API Next.js pour lister les fichiers locaux
      const res = await fetch(`/api/list-images?dir=${encodeURIComponent(path)}`);
      if (!res.ok) throw new Error('API error');
      const files = await res.json();
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
