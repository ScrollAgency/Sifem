'use client';

import { useRef, useEffect, useState } from 'react';
import FileList, { FileListRef } from '../plasmic-library/jean/FileList/FileList';

interface FileObject {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, unknown>;
}

interface TestState {
  files?: FileObject[];
  error?: string;
}

export default function TestFileList() {
  const fileListRef = useRef<FileListRef>(null);
  const [result, setResult] = useState<TestState>({});

  useEffect(() => {
    // Test the file listing on component mount
    const testListing = async () => {
      try {
        console.log('Testing path: image_map/image_POV_face');
        const files = await fileListRef.current?.listFiles({
          path: 'image_map/image_POV_face'
        });
        console.log('Files found:', files);
        setResult({ files: files || [] });
      } catch (error) {
        console.error('Error listing files:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        setResult({ error: errorMessage });
      }
    };

    testListing();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Testing FileList Component</h1>
      <p>Testing path: <strong>image_map/image_POV_face</strong></p>
      
      {result.error ? (
        <div style={{ color: 'red', marginTop: '20px' }}>
          <h3>Error:</h3>
          <pre>{result.error}</pre>
        </div>
      ) : result.files ? (
        <div style={{ marginTop: '20px' }}>
          <h3>Files found:</h3>
          <pre>{JSON.stringify(result.files, null, 2)}</pre>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      <FileList
        ref={fileListRef}
        bucketPath="image_map/image_POV_face"
        onList={(files) => console.log('Files from onList:', files)}
        onError={(error) => console.error('Error from onError:', error)}
      />
    </div>
  );
} 