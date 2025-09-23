import React, { useState, useCallback, forwardRef, useImperativeHandle, ForwardRefRenderFunction } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

interface ExportOptions {
  elementIds: string[];
  fileName?: string;
  format?: 'pdf' | 'png';
  orientation?: 'portrait' | 'landscape';
  autoResize?: boolean;
  maximizeWidth?: boolean;
}

interface ExportToPDFProps {
  elementIds: string[];
  fileName?: string;
  format?: 'pdf' | 'png';
  orientation?: 'portrait' | 'landscape';
  autoResize?: boolean;
  maximizeWidth?: boolean;
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

// Detect if running on native mobile platform
const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
};

// Get platform-specific directory for file storage
const getPlatformDirectory = async (): Promise<Directory> => {
  const platform = Capacitor.getPlatform();
  
  if (platform === 'ios') {
    return Directory.Documents;
  } else if (platform === 'android') {
    // Sur Android, utiliser Cache ou Data au lieu d'ExternalStorage
    // Ces répertoires ne nécessitent pas de permissions spéciales
    return Directory.Cache;
  } else {
    // Fallback pour autres plateformes
    return Directory.Data;
  }
};

// Native file save/share helper
const saveFileNative = async (blob: Blob, fileName: string, fileType: 'pdf' | 'png') => {
  console.log('Sauvegarde native du fichier:', fileName);
  
  try {
    let base64Data: string;
    
    // Convert blob to base64
    base64Data = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Remove data URL prefix if present
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      };
      reader.readAsDataURL(blob);
    });

    let directory = await getPlatformDirectory();
    let result;
    const fullFileName = `${fileName}.${fileType}`;
    
    // Essayer d'abord avec le répertoire principal
    try {
      result = await Filesystem.writeFile({
        path: fullFileName,
        data: base64Data,
        directory: directory
      });
      
      console.log('Fichier sauvegardé avec succès:', result.uri);
    } catch (firstError) {
      console.warn('Échec avec le premier répertoire, essai avec Data:', firstError);
      
      // Si ça échoue, essayer avec Directory.Data
      directory = Directory.Data;
      try {
        result = await Filesystem.writeFile({
          path: fullFileName,
          data: base64Data,
          directory: directory
        });
        
        console.log('Fichier sauvegardé avec succès (Data):', result.uri);
      } catch (secondError) {
        console.warn('Échec avec Directory.Data, essai avec Documents:', secondError);
        
        // Dernier essai avec Directory.Documents
        directory = Directory.Documents;
        result = await Filesystem.writeFile({
          path: fullFileName,
          data: base64Data,
          directory: directory
        });
        
        console.log('Fichier sauvegardé avec succès (Documents):', result.uri);
      }
    }

    // Share the file
    await Share.share({
      title: 'Exporter le fichier',
      text: `Partager ${fullFileName}`,
      url: result.uri,
      dialogTitle: 'Partager le fichier exporté'
    });

    console.log('Fichier partagé avec succès');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde native:', error);
    
    // Fallback: try to share the data directly
    try {
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
      
      await Share.share({
        title: 'Exporter le fichier',
        text: `Partager ${fileName}.${fileType}`,
        url: dataUrl,
        dialogTitle: 'Partager le fichier exporté'
      });
      
      console.log('Fichier partagé directement via URL de données');
    } catch (shareError) {
      console.error('Erreur lors du partage de fallback:', shareError);
      throw new Error(`Impossible de sauvegarder le fichier: ${error}`);
    }
  }
};

// Save file using web download method
const saveFileWeb = (
  data: Blob, 
  fileName: string,
  fileType: string
): void => {
  const url = URL.createObjectURL(data);
  const link = document.createElement('a');
  link.download = `${fileName}.${fileType}`;
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
  data: Blob, 
  fileName: string, 
  fileType: 'pdf' | 'png'
): Promise<void> => {
  if (isNativePlatform()) {
    await saveFileNative(data, fileName, fileType);
  } else {
    saveFileWeb(data, fileName, fileType);
  }
};

// Dynamic resolution detection for normalized export
const getTargetResolution = () => {
  if (isMobileDevice()) {
    return {
      width: 1920,
      height: 1080
    };
  }
  
  const screenWidth = window.screen.width || window.innerWidth || 1920;
  const screenHeight = window.screen.height || window.innerHeight || 1080;
  const maxWidth = Math.min(screenWidth, 3840);
  const maxHeight = Math.min(screenHeight, 3840);
  
  return {
    width: maxWidth,
    height: maxHeight
  };
};

const NORMALIZED_CAPTURE_SCALE = 1;

// Optimize SVG elements for better html2canvas rendering
const optimizeSVGsForCapture = (element: HTMLElement): (() => void) => {
  const svgs = element.querySelectorAll('svg');
  const originalStyles = new Map();
  
  Array.from(svgs).forEach((svg) => {
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
    

    
    // Extract transform values directly from SVG
    const svgTransform = svgElement.style.transform;
    let translateX = 0;
    let translateY = 0;
    
    if (svgTransform && svgTransform !== 'none') {
      
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
  });
  
  // Return cleanup function to restore original state
  return () => {
    Array.from(svgs).forEach((svg) => {
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
  
  return imageMap;
};

// Enhanced PDF generator
const generateEnhancedPDF = async (
  elements: HTMLElement[], 
  orientation: 'portrait' | 'landscape', 
  fileName: string, 
  save: boolean, 
  autoResize: boolean = true,
  maximizeWidth: boolean = true
 ) => {
  const pxToMm = 25.4 / 96;

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
  const margin = 8;

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

  let currentY = margin;
  
  // Process each element
  for (let i = 0; i < elements.length; i++) {
    const elementData = elementDimensions[i];
    const element = elementData.element;
    
    // Pre-process images
    await processImagesForPDF(element);
    
    // Convert to millimeters and calculate optimal scaling
    let elementWidth = elementData.width * pxToMm;
    let elementHeight = elementData.height * pxToMm;
    
        // Calculate scaling to maximize space usage
    let scale = 1;
    const widthScale = maxWidth / elementWidth;
    const heightScale = maxHeight / elementHeight;
    
    if (maximizeWidth) {
      if (elementWidth <= maxWidth && elementHeight <= maxHeight) {
        scale = widthScale;
        if (elementHeight * scale > maxHeight) {
          scale = heightScale;
        }
        scale = Math.min(scale, 2.0);
      } else {
        scale = Math.min(widthScale, heightScale);
      }
    } else {
      if (elementWidth <= maxWidth && elementHeight <= maxHeight) {
        scale = Math.min(widthScale, heightScale);
        scale = Math.min(scale, 1.5);
      } else {
        scale = Math.min(widthScale, heightScale);
      }
    }
    
    elementWidth *= scale;
    elementHeight *= scale;
    
    // Check if new page is needed
    if (currentY + elementHeight > pageHeight - margin) {
      pdf.addPage();
      currentY = margin;
    }
    
    const x = margin + (maxWidth - elementWidth) / 2;
    const y = currentY;
    
    // Try to capture the element
    let success = false;
    
          try {
        // Final flex stabilization before capture
        const computedStyle = window.getComputedStyle(element);
        const parentStyle = element.parentElement ? window.getComputedStyle(element.parentElement) : null;
        const isFlexElement = parentStyle?.display?.includes('flex') || computedStyle.display?.includes('flex');
        
        if (isFlexElement) {
          for (let i = 0; i < 5; i++) {
            if (element.parentElement) {
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              element.parentElement.offsetHeight;
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            element.offsetHeight;
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            element.scrollHeight;
            await delay(50);
          }
        }
      
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
      const targetRes = getTargetResolution(); // Résolution mobile optimisée
      const captureOptions = {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        scale: NORMALIZED_CAPTURE_SCALE, // Scale normalisé pour cohérence desktop/mobile
        foreignObjectRendering: false,
        imageTimeout: 15000,
        removeContainer: true,
        windowWidth: targetRes.width, // Force desktop window width
        windowHeight: targetRes.height, // Force desktop window height
        width: elementData.width, // Use actual element width
        height: elementData.height, // Use actual element height
      };
      
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
    // Save the PDF with proper native/web handling
    const blob = pdf.output('blob');
    await saveFileNative(blob, fileName, 'pdf');
  }
  
  return pdf;
};

// Temporarily switch to desktop layout for mobile devices
const temporarilySetDesktopLayout = () => {
  if (!isMobileDevice()) {
    return () => {};
  }
  
  // Store original values
  const originalValues = {
    viewportMeta: document.querySelector('meta[name="viewport"]') as HTMLMetaElement,
    bodyMinWidth: document.body.style.minWidth,
    bodyWidth: document.body.style.width,
    bodyMaxWidth: document.body.style.maxWidth,
    htmlMinWidth: document.documentElement.style.minWidth,
    htmlWidth: document.documentElement.style.width,
    htmlMaxWidth: document.documentElement.style.maxWidth,
    bodyOverflow: document.body.style.overflow,
    htmlOverflow: document.documentElement.style.overflow,
    bodyTransform: document.body.style.transform,
    bodyTransformOrigin: document.body.style.transformOrigin,
    bodyZoom: (document.body.style as unknown as { zoom?: string }).zoom,
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
  
  const targetRes = getTargetResolution();
  const targetWidth = targetRes.width;
  const targetScale = 1.0;
  viewportMeta.content = `width=${targetWidth}, initial-scale=${targetScale}, maximum-scale=${targetScale}, minimum-scale=${targetScale}, user-scalable=no, viewport-fit=cover`;
  
  const desktopStyleSheet = document.createElement('style');
  desktopStyleSheet.setAttribute('data-export-desktop-override', 'true');
  desktopStyleSheet.innerHTML = `
    html, body {
      width: ${targetWidth}px !important;
      min-width: ${targetWidth}px !important;
      max-width: ${targetWidth}px !important;
      transform: none !important;
      zoom: 1 !important;
      -webkit-text-size-adjust: none !important;
      -ms-text-size-adjust: none !important;
      text-size-adjust: none !important;
      font-size-adjust: none !important;
    }
    
    * {
      -webkit-text-size-adjust: 100% !important;
      -ms-text-size-adjust: 100% !important;
      text-size-adjust: 100% !important;
      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
      text-rendering: optimizeLegibility !important;
      transition: none !important;
      animation: none !important;
      transform: none !important;
      zoom: 1 !important;
    }
    
    /* Force desktop-like scaling for all elements */
    div, section, article, main, nav, header, footer, aside {
      box-sizing: border-box !important;
      transform: none !important;
    }
    
    /* Ensure images maintain proper scaling */
    img {
      max-width: none !important;
      height: auto !important;
      transform: none !important;
    }
    
    /* Remove mobile-specific optimizations */
    @media screen and (max-width: 768px) {
      * {
        font-size: inherit !important;
        line-height: inherit !important;
        margin: inherit !important;
        padding: inherit !important;
      }
    }
  `;
  document.head.appendChild(desktopStyleSheet);
  originalValues.injectedStyleSheet = desktopStyleSheet;
  
  document.body.style.minWidth = `${targetWidth}px`;
  document.body.style.width = `${targetWidth}px`;
  document.body.style.maxWidth = `${targetWidth}px`;
  document.documentElement.style.minWidth = `${targetWidth}px`;
  document.documentElement.style.width = `${targetWidth}px`;
  document.documentElement.style.maxWidth = `${targetWidth}px`;
  
  // Remove any transforms that might affect scaling
  document.body.style.transform = 'none';
  document.body.style.transformOrigin = 'top left';
  (document.body.style as unknown as { zoom?: string }).zoom = '1';
  
  // Prevent scroll during capture
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
  
  // Force immediate reflows multiples fois
  for (let i = 0; i < 5; i++) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    document.body.offsetHeight;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    document.documentElement.offsetHeight;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    document.body.scrollWidth;
  }
  
  return () => {
    
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
    document.body.style.maxWidth = originalValues.bodyMaxWidth;
    document.documentElement.style.minWidth = originalValues.htmlMinWidth;
    document.documentElement.style.width = originalValues.htmlWidth;
    document.documentElement.style.maxWidth = originalValues.htmlMaxWidth;
    
    document.body.style.overflow = originalValues.bodyOverflow;
    document.documentElement.style.overflow = originalValues.htmlOverflow;
    document.body.style.transform = originalValues.bodyTransform;
    document.body.style.transformOrigin = originalValues.bodyTransformOrigin;
    (document.body.style as unknown as { zoom?: string }).zoom = originalValues.bodyZoom;
    
    // Force reflows
    for (let i = 0; i < 3; i++) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      document.body.offsetHeight;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      document.documentElement.offsetHeight;
    }
    
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
    autoResize = true,
    maximizeWidth = true
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
            delay(200) // Font loading timeout augmenté
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
      const pdfDoc = await generateEnhancedPDF(elements, orientation, fileName, false, autoResize, maximizeWidth);
      
      if (format === 'png') {
        
        try {
          // Create a canvas for PNG export
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            throw new Error('Could not get canvas context');
          }
          
          // Calculate dimensions with normalized scaling
          let totalHeight = 0;
          const margins = 20;
          // Utiliser une résolution normalisée pour PNG
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
          
          // Render each element with normalized capture settings
          for (const info of elementsInfo) {
            try {
              await delay(150); // Délai augmenté avant capture
              
              const targetRes = getTargetResolution(); // Résolution mobile optimisée
              const tempCanvas = await html2canvas(info.element, {
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
                scale: NORMALIZED_CAPTURE_SCALE, // Scale normalisé pour cohérence desktop/mobile
                foreignObjectRendering: false,
                imageTimeout: 15000,
                removeContainer: true,
                windowWidth: targetRes.width, // Force desktop width
                windowHeight: targetRes.height, // Force desktop height
              });
              
              await delay(100); // Délai après capture
              
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
              console.error('Error capturing element for PNG:', err);
            }
          }
          
          // Save PNG with native/web compatibility
          const blob = await new Promise<Blob>((resolve) => 
            canvas.toBlob(b => resolve(b!), 'image/png')
          );
          
          await saveFile(blob, fileName, 'png');

        } catch (pngError) {
          console.error('Error generating PNG:', pngError);
          alert('PNG generation failed. Saving as PDF instead.');
          
          // Fallback to PDF with native/web compatibility
          const blob = pdfDoc.output('blob');
          await saveFile(blob, fileName, 'pdf');
        }
      } else {
        // Save PDF with native/web compatibility
        const blob = pdfDoc.output('blob');
        await saveFile(blob, fileName, 'pdf');
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
    maximizeWidth = true,
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
      maximizeWidth,
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