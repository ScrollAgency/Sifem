'use client';

import { forwardRef, useCallback, useImperativeHandle, ForwardRefRenderFunction } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with fallback values for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MDUzMDg2ODEsImV4cCI6MTkyMDg4NDY4MX0.placeholder';

const supabase = createClient(supabaseUrl, supabaseKey);

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
      // Check if we have valid Supabase configuration
      if (supabaseUrl === 'https://placeholder.supabase.co') {
        throw new Error('Supabase configuration not found. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
      }

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
FileList.displayName = 'FileList';

export default FileList; 