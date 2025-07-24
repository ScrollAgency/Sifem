import React from 'react';
import { useExportToPDF } from './ExportToPDF';

const ExportExample: React.FC = () => {
  const { exportElements, isExporting } = useExportToPDF();

  const handleExportPDF = async () => {
    try {
      await exportElements({
        elementIds: ['test-content'],
        fileName: 'test-export',
        format: 'pdf',
        orientation: 'portrait',
        autoResize: true
      });
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Erreur lors de l\'export: ' + error);
    }
  };

  const handleExportPNG = async () => {
    try {
      await exportElements({
        elementIds: ['test-content'],
        fileName: 'test-export',
        format: 'png',
        orientation: 'portrait',
        autoResize: true
      });
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Erreur lors de l\'export: ' + error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Export Mobile Natif</h1>
      
      <div id="test-content" style={{
        border: '2px solid #333',
        padding: '20px',
        margin: '20px 0',
        borderRadius: '10px',
        backgroundColor: '#f5f5f5'
      }}>
        <h2>Contenu à exporter</h2>
        <p>Ceci est un test de l'export PDF/PNG pour mobile natif avec Capacitor.</p>
        <ul>
          <li>Support natif Android et iOS</li>
          <li>Partage automatique des fichiers</li>
          <li>Sauvegarde dans le stockage du device</li>
        </ul>
        
        <svg width="200" height="100" style={{ margin: '10px 0' }}>
          <rect x="10" y="10" width="180" height="80" fill="#e0e0e0" stroke="#333" strokeWidth="2"/>
          <text x="100" y="55" textAnchor="middle" fill="#333">Test SVG</text>
        </svg>
        
        <img 
          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iIzRmODFiZCIgLz4KICA8dGV4dCB4PSI1MCIgeT0iNTUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE0Ij5JTUc8L3RleHQ+Cjwvc3ZnPg=="
          alt="Test Image"
          style={{ margin: '10px', border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          onClick={handleExportPDF}
          disabled={isExporting}
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isExporting ? 'not-allowed' : 'pointer',
            opacity: isExporting ? 0.6 : 1
          }}
        >
          {isExporting ? 'Export en cours...' : 'Exporter en PDF'}
        </button>
        
        <button 
          onClick={handleExportPNG}
          disabled={isExporting}
          style={{
            padding: '12px 24px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isExporting ? 'not-allowed' : 'pointer',
            opacity: isExporting ? 0.6 : 1
          }}
        >
          {isExporting ? 'Export en cours...' : 'Exporter en PNG'}
        </button>
      </div>

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Instructions de test :</strong></p>
        <ul>
          <li><strong>Sur le web :</strong> Le fichier sera téléchargé normalement</li>
          <li><strong>Sur mobile natif :</strong> Le fichier sera sauvegardé sur l'appareil et une interface de partage apparaîtra</li>
          <li>Testez les deux formats (PDF et PNG) pour vérifier que tout fonctionne</li>
        </ul>
      </div>
    </div>
  );
};

export default ExportExample; 