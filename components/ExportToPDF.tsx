import React, { useState, useCallback, forwardRef, useImperativeHandle, ForwardRefRenderFunction } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

interface ExportOptions {
  elementIds: string[];
  fileName?: string;
  format?: 'pdf' | 'png';
  orientation?: 'portrait' | 'landscape';
  autoResize?: boolean;
}

interface ExportToPDFProps {
  elementIds: string[];
  fileName?: string;
  format?: 'pdf' | 'png';
  orientation?: 'portrait' | 'landscape';
  autoResize?: boolean;
  onExport?: () => void;
  className?: string;
}

export interface ExportToPDFRef {
  export: (options?: Partial<ExportOptions>) => void;
}

// Helper functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const isMobileDevice = () => 
  window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);



// Optimize SVG elements for better html2canvas rendering
const optimizeSVGsForCapture = (element: HTMLElement): (() => void) => {
  const svgs = element.querySelectorAll('svg');
  const originalStyles = new Map();
  
  console.log(`Optimizing ${svgs.length} SVG(s) for export`);
  
  Array.from(svgs).forEach((svg, index) => {
    const svgElement = svg as unknown as HTMLElement;
    
    // Store original values for restoration
    const original = {
      width: svg.getAttribute('width'),
      height: svg.getAttribute('height'),
      style: svg.getAttribute('style'),
      viewBox: svg.getAttribute('viewBox'),
      position: svgElement.style.position,
      left: svgElement.style.left,
      top: svgElement.style.top,
      transform: svgElement.style.transform,
      transformOrigin: svgElement.style.transformOrigin,
      zIndex: svgElement.style.zIndex,
    };
    originalStyles.set(svg, original);
    
    console.log(`SVG ${index + 1}: Analyzing transforms`);
    
    // Extract transform values directly from SVG
    const svgTransform = svgElement.style.transform;
    let translateX = 0;
    let translateY = 0;
    
    if (svgTransform && svgTransform !== 'none') {
      console.log(`SVG ${index + 1}: Transform detected: ${svgTransform}`);
      
      // Parse translate3d
      const translate3dMatch = svgTransform.match(/translate3d\(([^,]+),\s*([^,]+),\s*([^)]+)\)/);
      if (translate3dMatch) {
        translateX = parseFloat(translate3dMatch[1]) || 0;
        translateY = parseFloat(translate3dMatch[2]) || 0;
      }
      
      // Parse separate translateX/translateY
      const translateXMatch = svgTransform.match(/translateX\(([^)]+)\)/);
      if (translateXMatch) {
        translateX += parseFloat(translateXMatch[1]) || 0;
      }
      
      const translateYMatch = svgTransform.match(/translateY\(([^)]+)\)/);
      if (translateYMatch) {
        translateY += parseFloat(translateYMatch[1]) || 0;
      }
      
      // Parse simple translate
      const translateMatch = svgTransform.match(/translate\(([^,)]+)(?:,\s*([^)]+))?\)/);
      if (translateMatch) {
        translateX += parseFloat(translateMatch[1]) || 0;
        translateY += parseFloat(translateMatch[2] || '0') || 0;
      }
    }
    
    console.log(`SVG ${index + 1}: Final position calculated X=${translateX}, Y=${translateY}`);
    
    // Set missing dimensions based on viewBox if needed
    const viewBox = svg.getAttribute('viewBox');
    if (viewBox && (!svg.getAttribute('width') || !svg.getAttribute('height'))) {
      const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number);
      
      if (!svg.getAttribute('width')) {
        svg.setAttribute('width', String(vbWidth));
      }
      
      if (!svg.getAttribute('height')) {
        svg.setAttribute('height', String(vbHeight));
      }
    }
    
        // Apply positioning fixes for transforms
    if (translateX !== 0 || translateY !== 0) {
      console.log(`SVG ${index + 1}: Applying position optimization`);
      
      // Remove all transforms
      svgElement.style.transform = 'none';
      svgElement.style.transformOrigin = 'initial';
      
      // Apply padding to parent container to avoid truncation
      const parentElement = svg.parentElement;
      if (parentElement) {
        // Store original parent styles for restoration
        const originalParentStyle = {
          paddingLeft: parentElement.style.paddingLeft,
          width: parentElement.style.width,
          boxSizing: parentElement.style.boxSizing
        };
        svgElement.setAttribute('data-parent-original-style', JSON.stringify(originalParentStyle));
        
        // Apply padding to parent instead of margin to SVG
        parentElement.style.paddingLeft = `${translateX}px`;
        parentElement.style.boxSizing = 'border-box';
        
        // Ensure SVG stays within bounds
        svgElement.style.maxWidth = `calc(100% - ${translateX}px)`;
        svgElement.style.position = 'static';
        
        console.log(`SVG ${index + 1}: Applied parent padding: ${translateX}px`);
      } else {
        // Fallback if no parent element
        svgElement.style.marginLeft = `${translateX}px`;
        svgElement.style.marginTop = `${translateY}px`;
        svgElement.style.maxWidth = `calc(100% - ${translateX}px)`;
        svgElement.style.position = 'static';
      }
      
      // Store values for debugging
      svgElement.setAttribute('data-original-translate-x', String(translateX));
      svgElement.setAttribute('data-original-translate-y', String(translateY));
    }
    
    // Improve rendering quality
    svgElement.style.imageRendering = 'auto';
    svgElement.style.shapeRendering = 'auto';
    
    // Force visibility
    svgElement.style.visibility = 'visible';
    svgElement.style.opacity = '1';
    svgElement.style.display = 'block';
    
    // Ensure SVG stays in document flow
    if (svgElement.style.position !== 'absolute') {
      svgElement.style.position = 'relative';
    }
    
    console.log(`SVG ${index + 1}: Optimization complete`);
  });
  
  // Return cleanup function to restore original state
  return () => {
    console.log('Restoring original SVG state');
    Array.from(svgs).forEach((svg, index) => {
      const original = originalStyles.get(svg);
      if (original) {
        // Restore attributes
        if (original.width) {
          svg.setAttribute('width', original.width);
        } else {
          svg.removeAttribute('width');
        }
        if (original.height) {
          svg.setAttribute('height', original.height);
        } else {
          svg.removeAttribute('height');
        }
        if (original.style) {
          svg.setAttribute('style', original.style);
        } else {
          svg.removeAttribute('style');
        }
        if (original.viewBox) {
          svg.setAttribute('viewBox', original.viewBox);
        } else {
          svg.removeAttribute('viewBox');
        }
        
        const svgElementRestore = svg as unknown as HTMLElement;
        
        // Restore CSS styles
        svgElementRestore.style.position = original.position || '';
        svgElementRestore.style.left = original.left || '';
        svgElementRestore.style.top = original.top || '';
        svgElementRestore.style.transform = original.transform || '';
        svgElementRestore.style.transformOrigin = original.transformOrigin || '';
        svgElementRestore.style.zIndex = original.zIndex || '';
        
        // Restore parent styles if modified
        const parentStyleData = svg.getAttribute('data-parent-original-style');
        if (parentStyleData && svg.parentElement) {
          try {
            const originalParentStyle = JSON.parse(parentStyleData);
            const parent = svg.parentElement;
            parent.style.paddingLeft = originalParentStyle.paddingLeft || '';
            parent.style.width = originalParentStyle.width || '';
            parent.style.boxSizing = originalParentStyle.boxSizing || '';
          } catch (e) {
            console.warn(`Error restoring parent styles:`, e);
          }
        }
        
        // Restore width if adjusted
        if (svg.getAttribute('data-width-adjusted') === 'true') {
          const originalWidth = svg.getAttribute('data-original-width');
          if (originalWidth) {
            svg.setAttribute('width', originalWidth);
          }
        }
        
        // Clean up added styles
        svgElementRestore.style.removeProperty('image-rendering');
        svgElementRestore.style.removeProperty('shape-rendering');
        svgElementRestore.style.removeProperty('visibility');
        svgElementRestore.style.removeProperty('opacity');
        svgElementRestore.style.removeProperty('display');
        svgElementRestore.style.removeProperty('margin-left');
        svgElementRestore.style.removeProperty('margin-top');
        svgElementRestore.style.removeProperty('max-width');
        svgElementRestore.style.removeProperty('overflow');
        
        // Clean up data attributes
        svg.removeAttribute('data-original-translate-x');
        svg.removeAttribute('data-original-translate-y');
        svg.removeAttribute('data-parent-original-style');
        svg.removeAttribute('data-width-adjusted');
        svg.removeAttribute('data-original-width');
        
        console.log(`SVG ${index + 1}: Restored`);
      }
    });
  };
};

// Convert image to data URL with fallback
const convertImageToDataURL = async (imgElement: HTMLImageElement): Promise<string> => {
  const FALLBACK_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  
  // Skip if already a data URL
  if (imgElement.src.startsWith('data:')) {
    return imgElement.src;
  }

  // Get absolute URL once
  const absoluteUrl = imgElement.src.startsWith('http') 
    ? imgElement.src 
    : new URL(imgElement.src, window.location.href).href;

  try {
    // Try to fetch the image
    const response = await fetch(`${absoluteUrl}?cacheBust=${Date.now()}`, {
      mode: 'cors',
      cache: 'no-cache',
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (fetchError) {
    console.warn('Direct fetch failed, trying canvas method:', fetchError);
    
    // Fallback: Use canvas method
    try {
      return new Promise<string>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const computedStyle = window.getComputedStyle(imgElement);
            const displayWidth = parseFloat(computedStyle.width) || img.naturalWidth || 100;
            const displayHeight = parseFloat(computedStyle.height) || img.naturalHeight || 100;
            
            canvas.width = displayWidth;
            canvas.height = displayHeight;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');
            
            // Fill with white background
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw image
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            const dataURL = canvas.toDataURL('image/png');
            resolve(dataURL);
          } catch (err) {
            console.warn('Canvas conversion failed:', err);
            resolve(FALLBACK_IMAGE);
          }
        };
        
        img.onerror = () => {
          console.warn(`Failed to load image: ${img.src}`);
          resolve(FALLBACK_IMAGE);
        };
        
        img.src = absoluteUrl;
      });
    } catch (canvasError) {
      console.error('Canvas method failed:', canvasError);
      return FALLBACK_IMAGE;
    }
  }
};

// Preload and convert all images in an element
const preloadImages = async (element: HTMLElement): Promise<void> => {
  const images = element.querySelectorAll('img');
  console.log(`Found ${images.length} images to preload`);
  
  if (images.length === 0) return;
  
  // Convert all images to data URLs in parallel
  const imagePromises = Array.from(images).map(async (img) => {
    try {
      // Set loading to eager
      if (img.loading === 'lazy') {
        img.loading = 'eager';
      }
      
      // Remove srcset to ensure the browser uses src only
      if (img.srcset) {
        img.removeAttribute('srcset');
      }
      
      // Set crossOrigin attribute
      if (!img.hasAttribute('crossorigin')) {
        img.crossOrigin = 'anonymous';
      }
      
      // Convert to data URL
      const dataUrl = await convertImageToDataURL(img);
      img.src = dataUrl;
      
      return true;
    } catch (err) {
      console.error(`Failed to process image:`, err);
      return false;
    }
  });
  
  await Promise.all(imagePromises);
  
  // Wait for images to stabilize with longer delay
  await delay(400);
  
  // Force additional reflows to ensure images are rendered
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  element.offsetHeight;
  await delay(100);
  
  console.log('All images processed and stabilized');
};

// Wait for element to render without scrolling
const waitForElementRender = async (element: HTMLElement) => {
  // Force reflow to ensure element is properly rendered
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  element.offsetHeight;
  await delay(150);
  
  return () => {}; // No cleanup needed
};

// Process images for PDF generation
const processImagesForPDF = async (element: HTMLElement): Promise<{[key: string]: string}> => {
  const images = element.querySelectorAll('img');
  const imageMap: {[key: string]: string} = {};
  
  console.log(`Pre-processing ${images.length} images for PDF generation`);
  
  await Promise.all(Array.from(images).map(async (img, index) => {
    try {
      const imgId = img.id || `img-${index}-${Date.now()}`;
      
      // Force image to load if needed
      if (!img.complete || img.naturalWidth === 0) {
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
          
          if (img.loading === 'lazy') {
            img.loading = 'eager';
            const currentSrc = img.src;
            img.src = '';
            img.src = currentSrc;
          }
        });
      }
      
      const dataUrl = await convertImageToDataURL(img);
      imageMap[imgId] = dataUrl;
      img.setAttribute('data-pdf-id', imgId);
    } catch (err) {
      console.error(`Error processing image ${index}:`, err);
    }
  }));
  
  console.log(`Processed ${Object.keys(imageMap).length} images successfully`);
  return imageMap;
};

// Detect if running on native mobile platform
const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
};



// Save file natively with download priority
const saveFileNative = async (
  data: string | Blob, 
  fileName: string, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mimeType: string
): Promise<void> => {
  console.log('🔄 Tentative de téléchargement natif:', fileName);
  
  let base64Data: string;
  
  // Convert data to base64
  if (data instanceof Blob) {
    base64Data = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      };
      reader.readAsDataURL(data);
    });
  } else {
    base64Data = data.includes(',') ? data.split(',')[1] : data;
  }

  const platform = Capacitor.getPlatform();
  
  // STRATÉGIE 1: Demander les permissions et tenter les dossiers publics
  if (platform === 'android') {
    console.log('📱 Android détecté - Vérification des permissions...');
    
    try {
      // Demander les permissions de manière explicite
      console.log('🔐 Demande des permissions de stockage...');
      const permissions = await Filesystem.requestPermissions();
      console.log('📋 Statut des permissions:', permissions);
      
             if (permissions.publicStorage === 'granted') {
         console.log('✅ Permissions accordées mais Android moderne bloque l\'accès direct');
         console.log('🔄 Passage immédiat à la stratégie de partage (plus fiable)');
       } else {
         console.warn('⚠️ Permissions refusées ou non disponibles:', permissions.publicStorage);
       }
    } catch (permissionError) {
      console.warn('❌ Erreur lors de la demande de permissions:', permissionError);
    }
     } else if (platform === 'ios') {
     // Stratégie unifiée iOS : Essayer Documents puis fallback vers partage
     console.log('🍎 iOS détecté - Tentative sauvegarde Documents...');
     
     try {
       const result = await Filesystem.writeFile({
         path: fileName,
         data: base64Data,
         directory: Directory.Documents,
         encoding: Encoding.UTF8
       });
       
       console.log(`✅ SUCCÈS! Fichier sauvegardé iOS Documents:`, result.uri);
       console.log('📁 Fichier accessible via app "Fichiers" > "Sur mon iPhone" > dPEI Pocket');
       return;
       
     } catch (error) {
       console.warn('❌ Échec sauvegarde iOS Documents:', error);
       console.log('🔄 Fallback iOS: Utilisation du partage natif...');
     }
   }
  
           // STRATÉGIE 2: Sauvegarde + Partage via URI (Android/iOS moderne)
    console.log(`💡 Stratégie optimale ${platform}: Sauvegarde dans cache puis partage via URI...`);
    console.log('📌 Approche moderne privilégiée pour la sécurité et compatibilité');
  
  try {
    // Sauvegarder d'abord dans le cache de l'app
    const cacheResult = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Cache,
      encoding: Encoding.UTF8
    });
    
    console.log('✅ Fichier sauvegardé dans cache temporaire:', cacheResult.uri);
    
                   // Maintenant partager via l'URI local (pas data URL)
      const shareMessage = platform === 'ios' 
        ? `✨ Export réussi ! Choisir où sauvegarder:\n\n"${fileName}"\n\n📁 Enregistrer dans Fichiers → Documents\n☁️ iCloud/Drive → Cloud\n📧 Mail → Joindre\n📱 Messages → Partager`
        : `✨ Export réussi ! Choisir où sauvegarder:\n\n"${fileName}"\n\n📁 Enregistrer dans fichiers → Downloads\n☁️ Drive/OneDrive → Cloud\n📱 WhatsApp → Partager`;
        
      await Share.share({
        title: '📥 Exporter le fichier',
        text: shareMessage,
        url: cacheResult.uri,  // Utiliser l'URI local au lieu de data URL
        dialogTitle: `📥 Télécharger ${fileName}`
      });
     
           console.log(`🎉 Dialogue de téléchargement ${platform} ouvert`);
      console.log('💡 L\'utilisateur peut maintenant choisir la destination:');
      
      if (platform === 'ios') {
        console.log('   • 📁 "Enregistrer dans Fichiers" → Documents iOS');
        console.log('   • ☁️ "iCloud Drive" → Cloud Apple');
        console.log('   • 📧 "Mail" → Joindre à un email');
        console.log('   • 📱 "Messages" → Partager via iMessage');
        console.log('   • etc...');
      } else {
        console.log('   • 📁 "Enregistrer dans les fichiers" → Downloads');  
        console.log('   • ☁️ "Drive" → Google Drive');
        console.log('   • 📧 "Gmail" → Joindre à un email');
        console.log('   • 📱 "WhatsApp" → Partager via messagerie');
        console.log('   • etc...');
      }
    return; // Succès, sortir
    
  } catch (cacheError) {
    console.error('❌ ÉCHEC TOTAL de toutes les stratégies:', cacheError);
    throw new Error(`Impossible de télécharger le fichier. Toutes les méthodes ont échoué. Erreur: ${cacheError instanceof Error ? cacheError.message : 'Erreur inconnue'}`);
  }
};

// Save file using web download method
const saveFileWeb = (
  data: Blob, 
  fileName: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _mimeType?: string
): void => {
  const url = URL.createObjectURL(data);
  const link = document.createElement('a');
  link.download = fileName;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
};

// Universal file save function that detects platform
const saveFile = async (
  data: string | Blob, 
  fileName: string, 
  mimeType: string
): Promise<void> => {
  if (isNativePlatform()) {
    await saveFileNative(data, fileName, mimeType);
  } else {
    if (data instanceof Blob) {
      saveFileWeb(data, fileName, mimeType);
    } else {
      // Convert base64 string to blob for web download
      const byteCharacters = atob(data.includes(',') ? data.split(',')[1] : data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      saveFileWeb(blob, fileName, mimeType);
    }
  }
};

// Enhanced PDF generator
const generateEnhancedPDF = async (
  elements: HTMLElement[], 
  orientation: 'portrait' | 'landscape', 
  fileName: string, 
  save: boolean, 
  autoResize: boolean = true
): Promise<jsPDF> => {
  console.log('Starting enhanced PDF generation');
  
  const pxToMm = 25.4 / 96; // Convert pixels to millimeters

  // Analyze elements to determine optimal page setup
  const elementDimensions = elements.map(element => {
    const rect = element.getBoundingClientRect();
    return {
      element,
      width: rect.width,
      height: rect.height,
      aspectRatio: rect.width / rect.height
    };
  });

  // Determine page format
  const maxElementWidth = Math.max(...elementDimensions.map(d => d.width));
  const maxElementWidthMm = maxElementWidth * pxToMm;

  let pageFormat: string | [number, number] = 'a4';
  let finalOrientation = orientation;
  const a4Portrait = { width: 210, height: 297 };
  const a4Landscape = { width: 297, height: 210 };
  const margin = 15;

  if (autoResize && maxElementWidthMm > a4Portrait.width - (2 * margin)) {
    if (maxElementWidthMm <= a4Landscape.width - (2 * margin)) {
      finalOrientation = 'landscape';
    } else if (maxElementWidthMm <= 420 - (2 * margin)) {
      pageFormat = 'a3';
      finalOrientation = maxElementWidthMm > 297 - (2 * margin) ? 'landscape' : 'portrait';
    } else {
      const customWidth = Math.max(maxElementWidthMm + (2 * margin), 210);
      const customHeight = 297;
      pageFormat = [customWidth, customHeight];
      finalOrientation = 'portrait';
    }
  }
  
  // Create PDF document
  const pdf = new jsPDF({
    orientation: finalOrientation,
    unit: 'mm',
    format: pageFormat,
    compress: true,
    precision: 3,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const maxWidth = pageWidth - (2 * margin);
  const maxHeight = pageHeight - (2 * margin);
  
  console.log(`Using page size: ${pageWidth.toFixed(1)}x${pageHeight.toFixed(1)}mm`);

  let currentY = margin;
  
  // Process each element
  for (let i = 0; i < elements.length; i++) {
    const elementData = elementDimensions[i];
    const element = elementData.element;
    
    console.log(`Processing element ${i+1}/${elements.length} (${element.id || 'unknown'})`);
    
    // Pre-process images
    await processImagesForPDF(element);
    
         // Convert to millimeters and calculate scaling
     let elementWidth = elementData.width * pxToMm;
     let elementHeight = elementData.height * pxToMm;
     
     let scale = 1;
     if (elementWidth > maxWidth || elementHeight > maxHeight) {
       scale = Math.min(maxWidth / elementWidth, maxHeight / elementHeight);
     }
     
     elementWidth *= scale;
     elementHeight *= scale;
    
    // Check if new page is needed
    if (currentY + elementHeight > pageHeight - margin) {
      pdf.addPage();
      currentY = margin;
      console.log('Added new page for element');
    }
    
    const x = (pageWidth - elementWidth) / 2;
    const y = currentY;
    
    // Try to capture the element
    let success = false;
    
    try {
      console.log('Capturing element with html2canvas');
      
      // Ensure text visibility
      const originalStyles = new Map();
      const textElements = element.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, li, td');
      
      Array.from(textElements).forEach(el => {
        const htmlEl = el as HTMLElement;
        originalStyles.set(el, {
          color: htmlEl.style.color,
          visibility: htmlEl.style.visibility,
          opacity: htmlEl.style.opacity,
        });
        
        const computedStyle = window.getComputedStyle(htmlEl);
        const color = computedStyle.color.toLowerCase();
        
        if (color === 'transparent' || color === 'rgba(0, 0, 0, 0)' || 
            (color.includes('rgba') && color.endsWith(', 0)'))) {
          htmlEl.style.color = '#000';
        }
        
        htmlEl.style.visibility = 'visible';
        htmlEl.style.opacity = '1';
      });
      
      // Set background if needed
      const originalBg = element.style.backgroundColor;
      if (!originalBg || originalBg === 'transparent') {
        element.style.backgroundColor = '#ffffff';
      }
      
      // Wait for stabilization with longer delay
      await delay(200);
      
      // Force multiple reflows to ensure complete rendering
      for (let i = 0; i < 3; i++) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        element.offsetHeight;
        await delay(50);
      }
      
      // Additional delay for images and final stabilization
      await delay(300);
      
      // Optimize SVGs for better capture
      const cleanupSVGs = optimizeSVGsForCapture(element);
      await delay(50); // Small delay for SVG optimization to take effect
      
      // Capture with html2canvas
      const captureOptions = {
        useCORS: true,
        allowTaint: true,
        background: '#ffffff',
        logging: false,
        foreignObjectRendering: false,
        imageTimeout: 15000,
        removeContainer: true,
      } as any;
      
      const canvas = await html2canvas(element, captureOptions);
      
      // Wait for canvas to be fully processed
      await delay(150);
      
             const imgData = canvas.toDataURL('image/jpeg', 0.98);
       
       // Use same dimensions on mobile and desktop
       const finalImageWidth = elementWidth;
       const finalImageHeight = elementHeight;
       const finalX = x;
       const finalY = y;
       
       // Add to PDF
       pdf.addImage(
         imgData,
         'JPEG',
         Math.round(finalX * 100) / 100,
         Math.round(finalY * 100) / 100,
         Math.round(finalImageWidth * 100) / 100,
         Math.round(finalImageHeight * 100) / 100
       );
      
      // Restore original styles
      Array.from(textElements).forEach(el => {
        const original = originalStyles.get(el);
        if (original) {
          const htmlEl = el as HTMLElement;
          htmlEl.style.color = original.color;
          htmlEl.style.visibility = original.visibility;
          htmlEl.style.opacity = original.opacity;
        }
      });
      element.style.backgroundColor = originalBg;
      
      // Restore SVG original attributes
      cleanupSVGs();
      
      console.log('Element captured successfully');
      success = true;
    } catch (error) {
      console.error('Failed to capture element:', error);
      success = false;
    }
    
    // If capture failed, add error message
    if (!success) {
      const errorMessage = "Failed to capture content properly. Please try again or use a different format.";
      pdf.setFontSize(16);
      pdf.setTextColor(255, 0, 0);
      pdf.text(errorMessage, x + elementWidth/2, y + elementHeight/2, { align: 'center' });
    }
    
    currentY += elementHeight + 5;
  }
  
  if (save) {
    // Save the PDF using universal save method
    const blob = pdf.output('blob');
    await saveFile(blob, `${fileName}.pdf`, 'application/pdf');
  }
  
  return pdf;
};

// Temporarily switch to desktop layout for mobile devices
const temporarilySetDesktopLayout = () => {
  if (!isMobileDevice()) {
    console.log('Desktop detected - skipping layout changes');
    return () => {}; // No-op cleanup for desktop
  }
  
  console.log('Temporarily switching to desktop layout for export');
  
  // Store original values
  const originalValues = {
    viewportMeta: document.querySelector('meta[name="viewport"]') as HTMLMetaElement,
    bodyMinWidth: document.body.style.minWidth,
    bodyWidth: document.body.style.width,
    htmlMinWidth: document.documentElement.style.minWidth,
    htmlWidth: document.documentElement.style.width,
    bodyOverflow: document.body.style.overflow,
    htmlOverflow: document.documentElement.style.overflow,
    injectedStyleSheet: null as HTMLStyleElement | null
  };
  
  const originalViewportContent = originalValues.viewportMeta?.content || '';
  
  // Create or modify viewport meta tag
  let viewportMeta = originalValues.viewportMeta;
  if (!viewportMeta) {
    viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    document.head.appendChild(viewportMeta);
  }
  
  // Set fixed desktop viewport with higher resolution
  const targetWidth = 1920;
  viewportMeta.content = `width=${targetWidth}, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no`;
  
  // Inject desktop styles
  const desktopStyleSheet = document.createElement('style');
  desktopStyleSheet.setAttribute('data-export-desktop-override', 'true');
  desktopStyleSheet.innerHTML = `
    * {
      -webkit-text-size-adjust: 100% !important;
      -ms-text-size-adjust: 100% !important;
      text-size-adjust: 100% !important;
      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
      text-rendering: optimizeLegibility !important;
      transition: none !important;
      animation: none !important;
    }
  `;
  document.head.appendChild(desktopStyleSheet);
  originalValues.injectedStyleSheet = desktopStyleSheet;
  
  // Force dimensions
  document.body.style.minWidth = `${targetWidth}px`;
  document.body.style.width = `${targetWidth}px`;
  document.documentElement.style.minWidth = `${targetWidth}px`;
  document.documentElement.style.width = `${targetWidth}px`;
  
  // Prevent scroll during capture
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
  
  // Force reflows
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  document.body.offsetHeight;
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  document.documentElement.offsetHeight;
  
  // Return cleanup function
  return () => {
    console.log('Restoring mobile layout');
    
    // Remove injected stylesheet
    if (originalValues.injectedStyleSheet && originalValues.injectedStyleSheet.parentNode) {
      originalValues.injectedStyleSheet.parentNode.removeChild(originalValues.injectedStyleSheet);
    }
    
    // Restore viewport meta tag
    if (originalValues.viewportMeta) {
      originalValues.viewportMeta.content = originalViewportContent;
    } else if (viewportMeta && viewportMeta.parentNode) {
      viewportMeta.parentNode.removeChild(viewportMeta);
    }
    
    // Restore styles
    document.body.style.minWidth = originalValues.bodyMinWidth;
    document.body.style.width = originalValues.bodyWidth;
    document.documentElement.style.minWidth = originalValues.htmlMinWidth;
    document.documentElement.style.width = originalValues.htmlWidth;
    document.body.style.overflow = originalValues.bodyOverflow;
    document.documentElement.style.overflow = originalValues.htmlOverflow;
    
    // Force reflows
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    document.body.offsetHeight;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    document.documentElement.offsetHeight;
    
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      document.body.scrollTop;
    }, 50);
  };
};

// Vérifier la stabilité du layout après changement mobile->desktop
const waitForLayoutStabilization = async (elementIds: string[], maxAttempts: number = 10): Promise<boolean> => {
  console.log('Vérification de la stabilité du layout...');
  
  let previousWidths: number[] = [];
  let stableCount = 0;
  const requiredStableChecks = 3; // Nombre de vérifications stables consécutives requises
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const currentWidths: number[] = [];
    let allElementsFound = true;
    
    // Mesurer la largeur de tous les éléments
    for (const id of elementIds) {
      const element = document.getElementById(id);
      if (!element) {
        console.warn(`Élément "${id}" non trouvé lors de la vérification de stabilité`);
        allElementsFound = false;
        break;
      }
      
      const rect = element.getBoundingClientRect();
      currentWidths.push(rect.width);
    }
    
    if (!allElementsFound) {
      await delay(200);
      continue;
    }
    
    // Comparer avec les largeurs précédentes
    if (previousWidths.length > 0) {
      const isStable = currentWidths.every((width, index) => 
        Math.abs(width - previousWidths[index]) < 1 // Tolérance de 1px
      );
      
      if (isStable) {
        stableCount++;
        console.log(`Layout stable (${stableCount}/${requiredStableChecks}):`, currentWidths.map(w => Math.round(w)));
        
        if (stableCount >= requiredStableChecks) {
          console.log('Layout stabilisé avec succès');
          return true;
        }
      } else {
        stableCount = 0;
        console.log(`Layout instable (tentative ${attempt + 1}):`, {
          précédent: previousWidths.map(w => Math.round(w)),
          actuel: currentWidths.map(w => Math.round(w))
        });
      }
    }
    
    previousWidths = [...currentWidths];
    
    // Attendre avant la prochaine vérification
    await delay(300);
    
    // Forcer des reflows pour aider à la stabilisation
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    document.body.offsetHeight;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    document.documentElement.offsetHeight;
  }
  
  console.warn('Timeout: le layout ne s\'est pas stabilisé dans le temps imparti');
  return false;
};

// Fonction pour vérifier que les éléments ont atteint leur taille desktop
const verifyDesktopSizing = (elementIds: string[]): boolean => {
  const minDesktopWidth = 800; // Largeur minimum attendue en mode desktop
  
  for (const id of elementIds) {
    const element = document.getElementById(id);
    if (!element) continue;
    
    const rect = element.getBoundingClientRect();
    console.log(`Élément "${id}": largeur actuelle ${Math.round(rect.width)}px`);
    
    if (rect.width < minDesktopWidth) {
      console.warn(`Élément "${id}" semble encore en mode mobile (largeur: ${Math.round(rect.width)}px)`);
      return false;
    }
  }
  
  console.log('Tous les éléments ont atteint leur taille desktop');
  return true;
};

export const useExportToPDF = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportElements = useCallback(async ({
    elementIds,
    fileName = 'export',
    format = 'pdf',
    orientation = 'portrait',
    autoResize = true
  }: ExportOptions) => {
    setIsExporting(true);
    let restoreLayout: (() => void) | null = null;
    
    try {
      console.log('Début de l\'export avec les IDs d\'éléments:', elementIds);
      
      // Scroll to top of page for consistent export experience
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
      
      // Wait for scroll to complete
      await delay(300);
      
      // Switch to desktop layout if on mobile
      restoreLayout = temporarilySetDesktopLayout();
      
      // SÉCURITÉ: Délai initial plus long pour le changement de layout
      console.log('Attente du changement de layout mobile->desktop...');
      await delay(800); // Augmenté de 500 à 800ms
      
      // SÉCURITÉ: Vérifications multiples de stabilisation
      for (let i = 0; i < 5; i++) { // Augmenté de 3 à 5 itérations
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        document.body.offsetHeight;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        document.documentElement.offsetHeight;
        await delay(150); // Augmenté de 100 à 150ms
      }
      
      const currentWidth = window.innerWidth;
      console.log(`Largeur actuelle après changement de layout: ${currentWidth}px`);
      
      // SÉCURITÉ: Attendre la stabilisation du layout
      const isStabilized = await waitForLayoutStabilization(elementIds, 15); // Augmenté de 10 à 15 tentatives
      if (!isStabilized) {
        console.warn('Le layout ne s\'est pas complètement stabilisé, mais on continue...');
      }
      
      // SÉCURITÉ: Vérifier que les éléments ont bien leur taille desktop
      const hasDesktopSizing = verifyDesktopSizing(elementIds);
      if (!hasDesktopSizing) {
        console.warn('Certains éléments semblent encore en mode mobile, délai supplémentaire...');
        await delay(1000); // Délai supplémentaire si problème détecté
        
        // Re-vérifier après le délai supplémentaire
        const recheckSizing = verifyDesktopSizing(elementIds);
        if (!recheckSizing) {
          console.error('Les éléments n\'ont pas atteint leur taille desktop optimale');
        }
      }
      
      // SÉCURITÉ: Délai de stabilisation final
      await delay(600); // Augmenté de 400 à 600ms
      
      // Wait for web fonts
      if (document.fonts && document.fonts.ready) {
        try {
          await Promise.race([
            document.fonts.ready,
            delay(200) // Augmenté de 100 à 200ms pour le timeout des fonts
          ]);
        } catch {
          // Continue if fonts fail to load
        }
      }
      
      // Find and validate elements
      const elements = [];
      for (const id of elementIds) {
        const element = document.getElementById(id);
        if (!element) {
          console.warn(`Élément avec l'ID "${id}" non trouvé dans le DOM`);
          alert(`Élément avec l'ID "${id}" non trouvé. Veuillez vérifier vos IDs d'éléments.`);
          continue;
        }
        
        const rect = element.getBoundingClientRect();
        console.log(`Élément "${id}" trouvé avec la taille desktop ${Math.round(rect.width)}x${Math.round(rect.height)}px`);
        elements.push(element);
      }
      
      if (elements.length === 0) {
        throw new Error('Aucun élément valide trouvé pour l\'export. Veuillez vérifier que vos IDs d\'éléments existent et sont visibles.');
      }

      // Process elements sequentially for consistency
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        console.log(`Traitement de l'élément ${i + 1}/${elements.length}: ${element.id}`);
        
        await delay(150); // Augmenté de 100 à 150ms
        
        const cleanup = await waitForElementRender(element);
        await preloadImages(element);
        cleanup();
        
        // SÉCURITÉ: Attente plus longue pour la stabilisation complète de l'élément
        await delay(400); // Augmenté de 300 à 400ms
        
        // Force additional reflows for this specific element
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        element.offsetHeight;
        await delay(150); // Augmenté de 100 à 150ms
        
        const rect = element.getBoundingClientRect();
        console.log(`Élément ${element.id} stabilisé: ${Math.round(rect.width)}x${Math.round(rect.height)}px`);
        
        await delay(200); // Augmenté de 150 à 200ms
        
        if (i < elements.length - 1) {
          await delay(100); // Augmenté de 50 à 100ms
        }
      }

      // SÉCURITÉ: Vérification finale avant génération
      console.log('Vérification finale avant génération du PDF...');
      await delay(300);
      
      // Vérification finale des dimensions
      elements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        console.log(`Vérification finale - Élément ${index + 1} (${element.id}): ${Math.round(rect.width)}x${Math.round(rect.height)}px`);
      });

      // Generate PDF
      const pdfDoc = await generateEnhancedPDF(elements, orientation, fileName, false, autoResize);
      
      if (format === 'png') {
        console.log('Conversion en PNG');
        
        try {
          // Create a canvas for PNG export
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            throw new Error('Impossible d\'obtenir le contexte canvas');
          }
          
          // Calculate dimensions
          let totalHeight = 0;
          const margins = 20;
          const maxWidth = 1654; // ~200 DPI for A4
          const elementsInfo = [];
          
          for (const element of elements) {
            const rect = element.getBoundingClientRect();
            const aspectRatio = rect.height / rect.width;
            const width = maxWidth - (margins * 2);
            const height = width * aspectRatio;
            
            elementsInfo.push({
              element,
              width,
              height,
              y: totalHeight + margins
            });
            
            totalHeight += height + margins * 2;
          }
          
          canvas.width = maxWidth;
          canvas.height = totalHeight;
          
          // Fill white background
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Render each element
          for (const info of elementsInfo) {
            try {
              await delay(150); // Augmenté de 100 à 150ms
              
              const tempCanvas = await html2canvas(info.element, {
                useCORS: true,
                allowTaint: true,
                background: '#ffffff',
                logging: false,
                foreignObjectRendering: false,
                imageTimeout: 15000,
                removeContainer: true,
              } as any);
              
              await delay(100); // Augmenté de 50 à 100ms
              
              // Use same dimensions on mobile and desktop
              const pngImageWidth = info.width;
              const pngImageHeight = info.height;
              const pngX = margins;
              const pngY = info.y;
               
               // Draw scaled element
               ctx.drawImage(
                 tempCanvas, 
                 0, 0, tempCanvas.width, tempCanvas.height,
                 pngX, pngY, pngImageWidth, pngImageHeight
               );
            } catch (err) {
              console.error('Erreur lors de la capture de l\'élément pour PNG:', err);
            }
          }
          
          // Download PNG
          const blob = await new Promise<Blob>((resolve) => 
            canvas.toBlob(b => resolve(b!), 'image/png')
          );
          await saveFile(blob, `${fileName}.png`, 'image/png');
          
          console.log('Export PNG terminé avec succès');
        } catch (pngError) {
          console.error('Erreur lors de la génération PNG:', pngError);
          alert('La génération PNG a échoué. Sauvegarde en PDF à la place.');
          
          // Fallback to PDF
          const blob = pdfDoc.output('blob');
          await saveFile(blob, `${fileName}.pdf`, 'application/pdf');
        }
      } else {
        // Save PDF
        const blob = pdfDoc.output('blob');
        await saveFile(blob, `${fileName}.pdf`, 'application/pdf');
      }
      
      console.log('Export terminé avec succès');
    } catch (error) {
      console.error('Échec de l\'export:', error);
      alert(error instanceof Error ? error.message : 'Échec de l\'export des éléments. Veuillez réessayer.');
    } finally {
      // Always restore layout
      if (restoreLayout) {
        console.log('Restauration du layout mobile...');
        restoreLayout();
        
        // SÉCURITÉ: Plus de temps pour la restauration du layout mobile
        await delay(600); // Augmenté de 400 à 600ms
        
        // Force reflows after restoration
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        document.body.offsetHeight;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        document.documentElement.offsetHeight;
        
        await delay(300); // Augmenté de 200 à 300ms
        
        const restoredWidth = window.innerWidth;
        console.log(`Layout restauré: ${restoredWidth}px`);
        
        await delay(300); // Augmenté de 200 à 300ms
      }
      setIsExporting(false);
    }
  }, []);

  return {
    exportElements,
    isExporting
  };
};

// Component for backward compatibility
const ExportToPDFComponent: ForwardRefRenderFunction<ExportToPDFRef, ExportToPDFProps> = (
  {
    elementIds,
    fileName = 'export',
    format = 'pdf',
    orientation = 'portrait',
    autoResize = true,
    onExport,
  }, 
  ref
) => {
  const { exportElements, isExporting } = useExportToPDF();
  
  // Expose export function via ref
  useImperativeHandle(ref, () => ({
    export: (options = {}) => exportElements({
      elementIds,
      fileName,
      format,
      orientation,
      autoResize,
      ...options
    })
  }));

  // Call onExport callback
  React.useEffect(() => {
    if (onExport && !isExporting) {
      onExport();
    }
  }, [isExporting, onExport]);

  return null;
};

const ExportToPDF = forwardRef(ExportToPDFComponent);

export default ExportToPDF; 