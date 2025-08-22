'use client';

import { forwardRef, useCallback, useImperativeHandle, ForwardRefRenderFunction } from 'react';
import { useData } from '@/contexts/DataContext';

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
}

export interface FileListRef {
  listFiles: (options?: { path?: string }) => Promise<FileObject[]>;
}

const FileListComponent: ForwardRefRenderFunction<FileListRef, FileListProps> = (
  { bucketPath = '', onList, onError },
  ref
) => {

  const { lesions, loading } = useData();

  const listFiles = useCallback(async (options?: { path?: string }) => {
    try {
      // Ici, on ignore path/bucketPath, on retourne toutes les lesions
      if (loading) throw new Error('Data is still loading');
      const files = lesions || [];
      onList?.(files as FileObject[]);
      return files as FileObject[];
    } catch (error) {
      const err = error instanceof Error ? error : new Error('An error occurred while fetching files');
      onError?.(err);
      throw err;
    }
  }, [lesions, loading, onList, onError]);

  // Expose the listFiles function via ref
  useImperativeHandle(ref, () => ({
    listFiles
  }));

  // Component doesn't render anything
  return null;
};

const FileList = forwardRef(FileListComponent);

export default FileList; 
