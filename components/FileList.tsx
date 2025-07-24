'use client';

import { forwardRef, useCallback, useImperativeHandle, ForwardRefRenderFunction } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Capacitor } from '@capacitor/core';

// ⚠️ CONFIGURATION REQUISE:
// 
// Pour que ce composant fonctionne, vous devez configurer ces variables d'environnement:
// 
// 1. Dans .env.local (pour développement local):
//    NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
//    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
// 
// 2. Dans l'interface Ionic/Capacitor (pour builds natifs):
//    Variables -> Ajouter les mêmes clés et valeurs
//
// 3. Les valeurs placeholder ci-dessous ne fonctionneront PAS en production
//

// Get environment variables with better native support
const getEnvVar = (key: string, fallback: string): string => {
  // Try different ways to get environment variables in native
  
  // 1. Check Capacitor/Ionic environment variables (injected at build time)
  if (typeof window !== 'undefined' && (window as any).__NEXT_ENV) {
    const value = (window as any).__NEXT_ENV[key];
    if (value && value !== 'undefined') {
      console.log(`✅ Found ${key} in __NEXT_ENV`);
      return value;
    }
  }
  
  // 2. Check process.env (works in web and sometimes in native)
  if (typeof process !== 'undefined' && process.env) {
    const value = process.env[key];
    if (value && value !== 'undefined') {
      console.log(`✅ Found ${key} in process.env`);
      return value;
    }
  }
  
  // 3. Check global environment (sometimes injected by Ionic)
  if (typeof window !== 'undefined' && (window as any).process?.env) {
    const value = (window as any).process.env[key];
    if (value && value !== 'undefined') {
      console.log(`✅ Found ${key} in window.process.env`);
      return value;
    }
  }
  
  // 4. Check if it's directly available on window (fallback)
  if (typeof window !== 'undefined' && (window as any)[key]) {
    const value = (window as any)[key];
    console.log(`✅ Found ${key} on window object`);
    return value;
  }
  
  // Fallback for native environments - these should be replaced with real values
  console.error(`❌ Environment variable ${key} not found anywhere! Using fallback.`);
  console.log('🔍 Available sources checked:', {
    '__NEXT_ENV': typeof window !== 'undefined' ? Object.keys((window as any).__NEXT_ENV || {}) : 'N/A',
    'process.env': typeof process !== 'undefined' ? 'Available' : 'N/A',
    'window.process.env': typeof window !== 'undefined' && (window as any).process?.env ? 'Available' : 'N/A'
  });
  
  return fallback;
};

// Initialize Supabase client with robust environment variable handling
const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL', 'https://placeholder.supabase.co');
const supabaseKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'your-supabase-anon-key-here');

// Debug: Show config status (without exposing sensitive data)
console.log('🔑 SUPABASE CONFIG STATUS:');
console.log('Has URL:', !!supabaseUrl && supabaseUrl !== 'https://placeholder.supabase.co');
console.log('Has API Key:', !!supabaseKey && !supabaseKey.includes('your-supabase-anon-key-here'));
console.log('Config valid:', !!supabaseUrl && !!supabaseKey && !supabaseUrl.includes('placeholder') && !supabaseKey.includes('your-supabase-anon-key-here'));

// Detect if running on native platform
const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
};

// Create Supabase client with platform-specific configuration
const createSupabaseClient = () => {
  const isNative = isNativePlatform();
  const platform = isNative ? Capacitor.getPlatform() : 'web';
  
  console.log(`Creating Supabase client for ${platform} platform`);
  console.log(`Environment: ${typeof process !== 'undefined' ? process.env.NODE_ENV : 'unknown'}`);
  console.log(`Has real Supabase URL: ${!supabaseUrl.includes('placeholder')}`);
  console.log(`Has real API key: ${!supabaseKey.includes('your-supabase-anon-key-here')}`);
  
  // Enhanced configuration for native platforms
  const supabaseConfig = isNative ? {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    },
    global: {
      headers: {
        'X-Client-Info': `capacitor-${platform}`,
        'User-Agent': `${platform}-app/1.2`
      }
    }
  } : {};
  
  return createClient(supabaseUrl, supabaseKey, supabaseConfig);
};

const supabase = createSupabaseClient();

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
  testConnection: () => Promise<boolean>;
  diagnose: () => Promise<{
    platform: string;
    hasValidConfig: boolean;
    networkStatus: string;
    issues: string[];
    suggestions: string[];
  }>;
}

const FileListComponent: ForwardRefRenderFunction<FileListRef, FileListProps> = (
  { bucketPath = '', onList, onError },
  ref
) => {
  const testConnection = useCallback(async (): Promise<boolean> => {
    const isNative = isNativePlatform();
    const platform = isNative ? Capacitor.getPlatform() : 'web';
    
    try {
      console.log(`[${platform}] Testing Supabase connection...`);
      
      // Simple test to check if Supabase is reachable
      const { data, error } = await supabase
        .storage
        .listBuckets();
        
      if (error) {
        console.error(`[${platform}] Connection test failed:`, error);
        return false;
      }
      
      console.log(`[${platform}] Connection test successful - found ${data?.length || 0} buckets`);
      console.log(`[${platform}] Available buckets:`, data?.map(b => b.name) || []);
      
      // Test specific bucket access
      if (data && data.length > 0) {
        for (const bucket of data) {
          try {
            console.log(`[${platform}] Testing access to bucket: ${bucket.name}`);
            const { data: files, error: bucketError } = await supabase
              .storage
              .from(bucket.name)
              .list('', { limit: 1 });
              
            if (bucketError) {
              console.warn(`[${platform}] Cannot access bucket ${bucket.name}:`, bucketError.message);
            } else {
              console.log(`[${platform}] ✅ Can access bucket ${bucket.name} - ${files?.length || 0} items`);
            }
          } catch (bucketTestError) {
            console.warn(`[${platform}] Error testing bucket ${bucket.name}:`, bucketTestError);
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error(`[${platform}] Connection test error:`, error);
      return false;
    }
  }, []);

  const listFiles = useCallback(async (options?: { path?: string }) => {
    const isNative = isNativePlatform();
    const platform = isNative ? Capacitor.getPlatform() : 'web';
    
    try {
      console.log(`[${platform}] Starting file list operation`);
      
      // Check if we have valid Supabase configuration
      if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseKey.includes('your-supabase-anon-key-here')) {
        throw new Error(`❌ Configuration invalide pour ${platform}. Variables d'environnement manquantes:\n- NEXT_PUBLIC_SUPABASE_URL\n- NEXT_PUBLIC_SUPABASE_ANON_KEY`);
      }

      const path = options?.path || bucketPath;
      
      // Test different buckets if lesions fails
      const bucketsToTry = ['lesions', 'public', 'avatars', 'images'];
      let lastError: any = null;
      
      for (const bucketName of bucketsToTry) {
        try {
          console.log(`[${platform}] Trying bucket "${bucketName}" at path: "${path}"`);

          // Add timeout for native platforms
          const listOperation = supabase
            .storage
            .from(bucketName)
            .list(path);

          // Create a timeout promise for native platforms
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
              reject(new Error(`⏱️ Timeout après 15 secondes sur ${platform} - vérifiez votre connexion Internet`));
            }, 15000);
          });

          const result = isNative 
            ? await Promise.race([listOperation, timeoutPromise])
            : await listOperation;

          const { data, error } = result as any;

                     if (error) {
             console.warn(`[${platform}] Bucket "${bucketName}" error:`, error);
             console.warn(`[${platform}] Error details:`, {
               message: error.message,
               details: error.details,
               hint: error.hint,
               code: error.code,
               statusCode: error.statusCode
             });
             lastError = error;
             continue; // Try next bucket
           }

          const files = data || [];
          console.log(`[${platform}] ✅ Successfully fetched ${files.length} files from bucket "${bucketName}"`);
          
          onList?.(files as FileObject[]);
          return files as FileObject[];
          
        } catch (bucketError) {
          console.warn(`[${platform}] Failed to access bucket "${bucketName}":`, bucketError);
          lastError = bucketError;
        }
      }
      
      // If we get here, all buckets failed
      throw new Error(`🔥 Aucun bucket accessible sur ${platform}. Dernière erreur: ${lastError?.message || 'Inconnue'}`);
      
    } catch (error) {
      const err = error instanceof Error ? error : new Error('An error occurred while fetching files');
      const enhancedError = new Error(`[${platform}] ${err.message}`);
      
      console.error(`[${platform}] FileList error:`, err);
      console.error(`[${platform}] Full error details:`, {
        message: err.message,
        name: err.name,
        isNative,
        platform,
        hasValidUrl: !supabaseUrl.includes('placeholder'),
        hasValidKey: !supabaseKey.includes('your-supabase-anon-key-here'),
        networkStatus: typeof navigator !== 'undefined' ? navigator.onLine : 'unknown'
      });
      
      onError?.(enhancedError);
      throw enhancedError;
    }
  }, [bucketPath, onList, onError]);

  const diagnose = useCallback(async () => {
    const isNative = isNativePlatform();
    const platform = isNative ? Capacitor.getPlatform() : 'web';
    const issues: string[] = [];
    const suggestions: string[] = [];
    
    // Check configuration
    const hasValidUrl = !supabaseUrl.includes('placeholder');
    const hasValidKey = !supabaseKey.includes('your-supabase-anon-key-here');
    const hasValidConfig = hasValidUrl && hasValidKey;
    
    if (!hasValidUrl) {
      issues.push('❌ URL Supabase invalide');
      suggestions.push('🔧 Vérifiez la variable NEXT_PUBLIC_SUPABASE_URL dans .env.local');
    }
    
    if (!hasValidKey) {
      issues.push('❌ Clé API Supabase invalide');
      suggestions.push('🔧 Vérifiez la variable NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local');
    }
    
    // Check network
    const networkStatus = typeof navigator !== 'undefined' ? 
      (navigator.onLine ? '🟢 En ligne' : '🔴 Hors ligne') : 
      '❓ Status inconnu';
    
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      issues.push('❌ Pas de connexion Internet');
      suggestions.push('🔧 Vérifiez votre connexion WiFi/mobile');
    }
    
    // Check platform-specific issues
    if (isNative) {
      suggestions.push(`🔧 Build récent requis: npm run build && npx cap sync ${platform}`);
      suggestions.push('🔧 Vérifiez les logs dans Android Studio/Xcode');
    }
    
    // Test connection if config is valid
    if (hasValidConfig) {
      try {
        const connectionOk = await testConnection();
        if (!connectionOk) {
          issues.push('❌ Connexion Supabase échouée');
          suggestions.push('🔧 Vérifiez les permissions et la connectivité');
        }
      } catch (error) {
        issues.push(`❌ Test de connexion échoué: ${error}`);
      }
    }
    
    return {
      platform,
      hasValidConfig,
      networkStatus,
      issues,
      suggestions
    };
  }, [testConnection]);

  // Expose the listFiles function via ref
  useImperativeHandle(ref, () => ({
    listFiles,
    testConnection,
    diagnose
  }));

  // Component doesn't render anything
  return null;
};

const FileList = forwardRef(FileListComponent);
FileList.displayName = 'FileList';

export default FileList; 