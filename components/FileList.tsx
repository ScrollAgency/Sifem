'use client';

import { forwardRef, useCallback, useImperativeHandle, ForwardRefRenderFunction } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

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
  const listFiles = useCallback(async (options?: { path?: string }) => {
    try {
      const path = options?.path || bucketPath;
      console.log(`Listing files in lesions bucket at path: ${path}`);

      const { data, error } = await supabase
        .storage
        .from('lesions')
        .list(path);

      if (error) {
        throw error;
      }

      const files = data || [];
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

  // Component doesn't render anything
  return null;
};

const FileList = forwardRef(FileListComponent);

export default FileList; 