'use client';

import React, { useRef, useState } from 'react';
import FileList, { FileListRef } from './FileList';

interface DiagnosticResult {
  platform: string;
  hasValidConfig: boolean;
  networkStatus: string;
  issues: string[];
  suggestions: string[];
}

const TestSupabaseNative: React.FC = () => {
  const fileListRef = useRef<FileListRef>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [diagnostic, setDiagnostic] = useState<DiagnosticResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectionTest, setConnectionTest] = useState<boolean | null>(null);

  const runDiagnostic = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await fileListRef.current?.diagnose();
      setDiagnostic(result || null);
      
      console.log('🔍 Diagnostic complet:', result);
    } catch (err) {
      setError(`Erreur diagnostic: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const isConnected = await fileListRef.current?.testConnection();
      setConnectionTest(isConnected || false);
      
      console.log('🔗 Test de connexion:', isConnected ? 'Succès' : 'Échec');
    } catch (err) {
      setError(`Erreur test connexion: ${err}`);
      setConnectionTest(false);
    } finally {
      setIsLoading(false);
    }
  };

  const listFiles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setFiles([]);
      
      const fileList = await fileListRef.current?.listFiles({ path: '' });
      setFiles(fileList || []);
      
      console.log('📁 Fichiers récupérés:', fileList);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('❌ Erreur listFiles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const debugEnvironment = () => {
    console.log('🔍 === DIAGNOSTIC VARIABLES D\'ENVIRONNEMENT ===');
    
    // Check all possible sources
    const sources = {
      '__NEXT_ENV (window)': typeof window !== 'undefined' ? (window as any).__NEXT_ENV : null,
      'process.env': typeof process !== 'undefined' ? process.env : null,
      'window.process.env': typeof window !== 'undefined' ? (window as any).process?.env : null,
      'Capacitor platform': typeof window !== 'undefined' && (window as any).Capacitor ? (window as any).Capacitor.getPlatform() : null
    };
    
    console.log('📋 Sources disponibles:', sources);
    
    // Check specific variables
    const variables = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];
    variables.forEach(varName => {
      console.log(`🔍 Recherche de ${varName}:`);
      
      if (typeof window !== 'undefined' && (window as any).__NEXT_ENV) {
        const nextEnvValue = (window as any).__NEXT_ENV[varName];
        console.log(`  - __NEXT_ENV.${varName}:`, nextEnvValue ? '✅ Trouvé' : '❌ Non trouvé');
      }
      
      if (typeof process !== 'undefined' && process.env) {
        const processEnvValue = process.env[varName];
        console.log(`  - process.env.${varName}:`, processEnvValue ? '✅ Trouvé' : '❌ Non trouvé');
      }
      
      if (typeof window !== 'undefined' && (window as any).process?.env) {
        const windowProcessValue = (window as any).process.env[varName];
        console.log(`  - window.process.env.${varName}:`, windowProcessValue ? '✅ Trouvé' : '❌ Non trouvé');
      }
    });
    
    console.log('🎯 Ouvrez la console pour voir le diagnostic complet');
    alert('🔍 Diagnostic des variables affiché dans la console ! Ouvrez les DevTools.');
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h2 style={{ color: '#333' }}>🧪 Test Supabase Native</h2>
      
      <FileList
        ref={fileListRef}
        bucketPath=""
        onList={(files) => setFiles(files)}
        onError={(err) => setError(err.message)}
      />
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={runDiagnostic}
          disabled={isLoading}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 15px',
            margin: '5px',
            border: 'none',
            borderRadius: '5px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? '⏳ En cours...' : '🔍 Diagnostic'}
        </button>
        
        <button 
          onClick={testConnection}
          disabled={isLoading}
          style={{
            backgroundColor: '#2196F3',
            color: 'white',
            padding: '10px 15px',
            margin: '5px',
            border: 'none',
            borderRadius: '5px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? '⏳ En cours...' : '🔗 Test Connexion'}
        </button>
        
                 <button 
           onClick={listFiles}
           disabled={isLoading}
           style={{
             backgroundColor: '#FF9800',
             color: 'white',
             padding: '10px 15px',
             margin: '5px',
             border: 'none',
             borderRadius: '5px',
             cursor: isLoading ? 'not-allowed' : 'pointer'
           }}
         >
           {isLoading ? '⏳ En cours...' : '📁 Lister Fichiers'}
         </button>
         
         <button 
           onClick={debugEnvironment}
           style={{
             backgroundColor: '#9C27B0',
             color: 'white',
             padding: '10px 15px',
             margin: '5px',
             border: 'none',
             borderRadius: '5px',
             cursor: 'pointer'
           }}
         >
           🔍 Debug Variables
         </button>
      </div>

      {/* Diagnostic Results */}
      {diagnostic && (
        <div style={{
          backgroundColor: '#f0f0f0',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '15px'
        }}>
          <h3>🔍 Résultats du Diagnostic</h3>
          <p><strong>Plateforme:</strong> {diagnostic.platform}</p>
          <p><strong>Configuration:</strong> {diagnostic.hasValidConfig ? '✅ Valide' : '❌ Invalide'}</p>
          <p><strong>Réseau:</strong> {diagnostic.networkStatus}</p>
          
          {diagnostic.issues.length > 0 && (
            <div>
              <h4 style={{ color: '#d32f2f' }}>⚠️ Problèmes détectés:</h4>
              {diagnostic.issues.map((issue, index) => (
                <p key={index} style={{ color: '#d32f2f', margin: '5px 0' }}>{issue}</p>
              ))}
            </div>
          )}
          
          {diagnostic.suggestions.length > 0 && (
            <div>
              <h4 style={{ color: '#1976d2' }}>💡 Suggestions:</h4>
              {diagnostic.suggestions.map((suggestion, index) => (
                <p key={index} style={{ color: '#1976d2', margin: '5px 0' }}>{suggestion}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Connection Test Result */}
      {connectionTest !== null && (
        <div style={{
          backgroundColor: connectionTest ? '#e8f5e8' : '#ffebee',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '15px'
        }}>
          <h3>🔗 Test de Connexion</h3>
          <p style={{ color: connectionTest ? '#2e7d32' : '#d32f2f' }}>
            {connectionTest ? '✅ Connexion Supabase réussie' : '❌ Connexion Supabase échouée'}
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#d32f2f',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '15px'
        }}>
          <h3>❌ Erreur</h3>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>{error}</pre>
        </div>
      )}

      {/* Files Display */}
      {files.length > 0 && (
        <div style={{
          backgroundColor: '#e8f5e8',
          padding: '15px',
          borderRadius: '5px'
        }}>
          <h3>📁 Fichiers trouvés ({files.length})</h3>
          {files.map((file, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              padding: '8px',
              margin: '5px 0',
              borderRadius: '3px',
              fontSize: '14px'
            }}>
              <strong>{file.name}</strong>
              <br />
              <small style={{ color: '#666' }}>
                Modifié: {new Date(file.updated_at).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      )}

      {/* Instructions */}
      <div style={{
        backgroundColor: '#fff3e0',
        padding: '15px',
        borderRadius: '5px',
        marginTop: '20px'
      }}>
        <h3>📋 Instructions</h3>
        <ol>
          <li><strong>Diagnostic</strong> : Vérifie la configuration et l&apos;environnement</li>
          <li><strong>Test Connexion</strong> : Teste la connectivité Supabase</li>
          <li><strong>Lister Fichiers</strong> : Essaie de récupérer les fichiers du bucket</li>
        </ol>
        <p style={{ fontSize: '14px', color: '#666' }}>
          💡 Vérifiez les logs de la console pour plus de détails
        </p>
      </div>
    </div>
  );
};

export default TestSupabaseNative; 