import React, { useState, useCallback, forwardRef, useImperativeHandle, ForwardRefRenderFunction } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ExportOptions {
  elementIds: string[];
  fileName?: string;
  format?: 'pdf' | 'png';
  orientation?: 'portrait' | 'landscape';
}

// Helper function to wait a specified amount of time
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to convert an image to a data URL
const imageToDataURL = async (imgElement: HTMLImageElement): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    try {
      // If image is already a data URL, return it
      if (imgElement.src.startsWith('data:')) {
        console.log('Image is already a data URL');
        resolve(imgElement.src);
        return;
      }

      // Create a canvas to draw the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Function to handle successful image load
      const onImageLoad = () => {
        try {
          // Set canvas dimensions to match the image
          canvas.width = imgElement.naturalWidth || imgElement.width;
          canvas.height = imgElement.naturalHeight || imgElement.height;
          
          if (!canvas.width || !canvas.height) {
            console.warn(`Cannot convert image with invalid dimensions: ${canvas.width}x${canvas.height}`);
            // Return a transparent pixel as fallback
            resolve('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
            return;
          }
          
          // Draw image to canvas
          if (ctx) {
            ctx.drawImage(imgElement, 0, 0);
            // Convert to data URL
            const dataURL = canvas.toDataURL('image/png');
            console.log(`Converted image to data URL (${dataURL.length} bytes)`);
            resolve(dataURL);
          } else {
            throw new Error('Could not get canvas context');
          }
        } catch (err) {
          console.error('Error in onImageLoad:', err);
          reject(err);
        }
      };

      // Handle already loaded images
      if (imgElement.complete && imgElement.naturalWidth > 0) {
        onImageLoad();
      } else {
        // Handle loading/error for images not yet loaded
        imgElement.onload = onImageLoad;
        imgElement.onerror = () => {
          console.warn(`Failed to load image for conversion: ${imgElement.src}`);
          // Return a transparent pixel as fallback
          resolve('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
        };
      }
    } catch (err) {
      console.error('Error in imageToDataURL:', err);
      reject(err);
    }
  });
};

// Helper function to ensure all images in an element are loaded and converted to data URLs
const preloadImages = async (element: HTMLElement): Promise<void> => {
  const images = element.querySelectorAll('img');
  console.log(`Found ${images.length} images to preload`);
  
  if (images.length === 0) return;
  
  // First pass: Make all images eager loading
  Array.from(images).forEach(img => {
    if (img.loading === 'lazy') {
      img.loading = 'eager';
      console.log(`Changed image loading to eager: ${img.src}`);
    }
    
    // Remove srcset to ensure the browser uses src only
    if (img.srcset) {
      img.removeAttribute('srcset');
    }
  });
  
  // Wait for initial DOM update
  await delay(50);
  
  // Second pass: Convert all images to data URLs
  const imagePromises = Array.from(images).map(async (img, index) => {
    try {
      // Try to convert it to a data URL
      const dataUrl = await imageToDataURL(img);
      
      // Update the image src to use the data URL
      img.src = dataUrl;
      
      // Wait a moment for the browser to process
      await delay(25);
      
      return true;
    } catch (err) {
      console.error(`Failed to process image ${index}:`, err);
      return false;
    }
  });
  
  // Wait for all images to be processed
  await Promise.all(imagePromises);
  console.log('All images processed');
  
  // Add a small delay to ensure everything is rendered
  await delay(150);
};

// Helper function to scroll an element into view and wait for it to render
const scrollAndWaitForRender = async (element: HTMLElement) => {
  // Scroll the element into view with smooth behavior
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  });
  
  // Wait for scroll and rendering to complete
  await delay(150);
  
  // Return a no-op cleanup function
  return () => {
    // No cleanup needed since we removed the highlight effect
  };
};

// Removing the unused captureScreenshot function

export const useExportToPDF = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportElements = useCallback(async ({
    elementIds,
    fileName = 'export',
    format = 'pdf',
    orientation = 'portrait'
  }: ExportOptions) => {
    // Force image download and conversion to base64 using fetch
    const fetchAndConvertImage = async (url: string): Promise<string> => {
      try {
        // Skip data URLs
        if (url.startsWith('data:')) {
          return url;
        }
        
        // For relative URLs, make them absolute
        const absoluteUrl = url.startsWith('http') ? url : new URL(url, window.location.href).href;
        
        console.log(`Fetching image: ${absoluteUrl}`);
        
        // Fetch the image with cache busting
        const response = await fetch(`${absoluteUrl}${absoluteUrl.includes('?') ? '&' : '?'}cacheBust=${Date.now()}`, {
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
        }
        
        // Get the blob
        const blob = await response.blob();
        
        // Convert blob to base64
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error(`Error fetching image: ${url}`, error);
        // Return a 1x1 transparent pixel as fallback
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
      }
    };
    
    // Process all images in an element and prepare for PDF generation
    const processImagesForPDF = async (element: HTMLElement): Promise<{[key: string]: string}> => {
      const images = element.querySelectorAll('img');
      const imageMap: {[key: string]: string} = {};
      
      console.log(`Pre-processing ${images.length} images for PDF generation`);
      
      // Process each image
      await Promise.all(Array.from(images).map(async (img, index) => {
        try {
          const imgId = img.id || `img-${index}-${Date.now()}`;
          
          // Force image to load if needed
          if (!img.complete || img.naturalWidth === 0) {
            await new Promise<void>((resolve) => {
              img.onload = () => resolve();
              img.onerror = () => resolve();
              
              // Force reload in some cases
              if (img.loading === 'lazy') {
                img.loading = 'eager';
                const currentSrc = img.src;
                img.src = '';
                setTimeout(() => { img.src = currentSrc; }, 10);
              }
            });
          }
          
          // Get actual image URL
          const imageUrl = img.currentSrc || img.src;
          
          // Fetch and convert the image
          const dataUrl = await fetchAndConvertImage(imageUrl);
          
          // Store in map
          imageMap[imgId] = dataUrl;
          
          // Add a special attribute to the image for later identification
          img.setAttribute('data-pdf-id', imgId);
        } catch (err) {
          console.error(`Error processing image ${index}:`, err);
        }
      }));
      
      console.log(`Processed ${Object.keys(imageMap).length} images successfully`);
      
      return imageMap;
    };

    setIsExporting(true);
    try {
      console.log('Starting export with element IDs:', elementIds);
      
      // First verify elements are found in the DOM
      const elements = [];
      for (const id of elementIds) {
        const element = document.getElementById(id);
        if (!element) {
          console.warn(`Element with ID "${id}" not found in the DOM`);
          alert(`Element with ID "${id}" not found. Please check your element IDs.`);
          continue;
        }
        
        // Check if element is visible
        const rect = element.getBoundingClientRect();
        console.log(`Element "${id}" found with size ${rect.width}x${rect.height}`);
        elements.push(element);
      }
      
      if (elements.length === 0) {
        throw new Error('No valid elements found to export. Please check that your element IDs exist and are visible.');
      }

      // Scroll to each element and preload images for both formats
      for (const element of elements) {
        const cleanup = await scrollAndWaitForRender(element);
        await preloadImages(element);
        cleanup();
      }

      // Enhanced PDF generator that adds images separately
      const generateEnhancedPDF = async (elements: HTMLElement[], orientation: 'portrait' | 'landscape', fileName: string, save: boolean) => {
        console.log('Starting enhanced PDF generation');
        
        // Create PDF document
        const pdf = new jsPDF({
          orientation,
          unit: 'mm',
          format: 'a4',
        });
        
        // Get page dimensions
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 10; // 10mm margin
        const maxWidth = pageWidth - (2 * margin);
        
        // Calculate positions for vertically stacked elements
        let currentY = margin;
        const pxToMm = 25.4 / 96; // Convert pixels to millimeters (assuming 96 DPI)
        
        // Process each element
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];
          
          console.log(`Processing element ${i+1}/${elements.length} (${element.id || 'unknown'})`);
          
          // First, pre-process all images in the element
          const imageMap = await processImagesForPDF(element);
          
          // Get element dimensions
          const rect = element.getBoundingClientRect();
          
          // Convert to millimeters
          let elementWidth = rect.width * pxToMm;
          let elementHeight = rect.height * pxToMm;
          
          // Calculate scaling (scale to fit width, maintain aspect ratio)
          let scale = 1;
          if (elementWidth > maxWidth) {
            scale = maxWidth / elementWidth;
            elementWidth = maxWidth;
            elementHeight *= scale;
          }
          
          // Check if this element would go beyond page boundary
          if (currentY + elementHeight > pageHeight - margin) {
            // Add a new page
            pdf.addPage();
            currentY = margin;
          }
          
          // Calculate centered x position
          const x = (pageWidth - elementWidth) / 2;
          const y = currentY;
          
          // Try the primary approach: direct element to canvas using html2canvas
          let success = false;
          
          // APPROACH 1: Use html2canvas directly on the element with prepared images
          try {
            console.log('APPROACH 1: Direct element capture with html2canvas');
            
            // Temporarily modify the element to ensure text visibility
            const originalStyles = new Map<Element, { color: string; visibility: string; opacity: string; display: string }>();
            Array.from(element.querySelectorAll('*')).forEach(el => {
              // Save original styles
              originalStyles.set(el, {
                color: (el as HTMLElement).style.color,
                visibility: (el as HTMLElement).style.visibility,
                opacity: (el as HTMLElement).style.opacity,
                display: (el as HTMLElement).style.display
              });
              
              // Ensure text elements are visible
              if (
                el.tagName === 'P' || 
                el.tagName === 'SPAN' || 
                el.tagName === 'DIV' || 
                el.tagName === 'H1' || 
                el.tagName === 'H2' || 
                el.tagName === 'H3' || 
                el.tagName === 'H4' || 
                el.tagName === 'H5' || 
                el.tagName === 'H6' ||
                el.tagName === 'LI' ||
                el.tagName === 'TD'
              ) {
                // Make text visible if it might be transparent
                const computedStyle = window.getComputedStyle(el as HTMLElement);
                const color = computedStyle.color.toLowerCase();
                if (color === 'transparent' || 
                    color === 'rgba(0, 0, 0, 0)' ||
                    (color.includes('rgba') && color.endsWith(', 0)'))) {
                  (el as HTMLElement).style.color = '#000';
                }
                
                // Make element visible
                (el as HTMLElement).style.visibility = 'visible';
                (el as HTMLElement).style.opacity = '1';
              }
            });
            
            // Add a background if needed
            const originalBg = element.style.backgroundColor;
            if (!originalBg || originalBg === 'transparent') {
              element.style.backgroundColor = '#ffffff';
            }
            
            // Capture directly
            const canvas = await html2canvas(element, {
              scale: 2,
              useCORS: true,
              allowTaint: true,
              backgroundColor: '#ffffff',
              imageTimeout: 5000,
              logging: false
            });
            
            // Convert to data URL
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            
            // Add to PDF
            pdf.addImage(
              imgData,
              'JPEG',
              x,
              y,
              elementWidth,
              elementHeight
            );
            
            // Restore original styles
            Array.from(element.querySelectorAll('*')).forEach(el => {
              const original = originalStyles.get(el);
              if (original) {
                (el as HTMLElement).style.color = original.color;
                (el as HTMLElement).style.visibility = original.visibility;
                (el as HTMLElement).style.opacity = original.opacity;
                (el as HTMLElement).style.display = original.display;
              }
            });
            element.style.backgroundColor = originalBg;
            
            console.log('APPROACH 1 succeeded');
            success = true;
          } catch (error) {
            console.error('APPROACH 1 failed:', error);
            success = false;
          }
          
          // APPROACH 2: Clone element and use html2canvas on the clone
          if (!success) {
            try {
              console.log('APPROACH 2: Clone and capture with html2canvas');
              
              // Create a clone of the element for clean capture
              const clone = element.cloneNode(true) as HTMLElement;
              const container = document.createElement('div');
              container.style.position = 'fixed';
              container.style.left = '-9999px';
              container.style.top = '0';
              container.style.width = `${rect.width}px`;
              container.style.height = `${rect.height}px`;
              container.style.overflow = 'hidden';
              container.style.background = '#fff';
              document.body.appendChild(container);
              container.appendChild(clone);
              
              // Apply styles to ensure text is visible
              const applyStylesRecursively = (el: Element) => {
                if (el.nodeType === Node.ELEMENT_NODE) {
                  const computedStyle = window.getComputedStyle(el as HTMLElement);
                  // Only apply if not hidden
                  if (computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden') {
                    (el as HTMLElement).style.display = computedStyle.display;
                    (el as HTMLElement).style.visibility = 'visible';
                    (el as HTMLElement).style.opacity = '1';
                    
                    // For text elements, ensure text color is visible
                    if (
                      el.tagName === 'P' || 
                      el.tagName === 'SPAN' || 
                      el.tagName === 'DIV' || 
                      el.tagName === 'H1' || 
                      el.tagName === 'H2' || 
                      el.tagName === 'H3' || 
                      el.tagName === 'H4' || 
                      el.tagName === 'H5' || 
                      el.tagName === 'H6' ||
                      el.tagName === 'LI' ||
                      el.tagName === 'TD'
                    ) {
                      if (computedStyle.color) {
                        const color = computedStyle.color.toLowerCase();
                        // If transparent or very light, darken it
                        if (color === 'transparent' || color === 'rgba(0, 0, 0, 0)' || 
                            (color.includes('rgba') && color.endsWith(', 0)'))) {
                          (el as HTMLElement).style.color = '#000';
                        }
                      }
                    }
                  }
                  
                  // Process children
                  for (let i = 0; i < el.children.length; i++) {
                    applyStylesRecursively(el.children[i]);
                  }
                }
              };
              
              // Apply styles to ensure visibility
              applyStylesRecursively(clone);
              
              // Replace all image src attributes with their data URLs in the clone
              const cloneImages = clone.querySelectorAll('img');
              Array.from(cloneImages).forEach(img => {
                const imgId = img.getAttribute('data-pdf-id');
                if (imgId && imageMap[imgId]) {
                  img.src = imageMap[imgId];
                  img.style.maxWidth = '100%';
                  img.style.height = 'auto';
                  img.setAttribute('crossorigin', 'anonymous');
                  img.removeAttribute('srcset');
                  img.removeAttribute('loading');
                }
              });
              
              // Wait for clone to render
              await delay(100);
              
              // Capture the complete element
              const canvas = await html2canvas(clone, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
                imageTimeout: 5000,
                onclone: (clonedDoc) => {
                  // Double check all text elements are visible in the clone
                  Array.from(clonedDoc.querySelectorAll('p, div, span, h1, h2, h3, h4, h5, h6, li, td, th'))
                    .forEach(el => {
                      (el as HTMLElement).style.visibility = 'visible';
                      (el as HTMLElement).style.display = 'block';
                      if ((el as HTMLElement).style.color === 'transparent' || 
                          (el as HTMLElement).style.color === 'rgba(0, 0, 0, 0)') {
                        (el as HTMLElement).style.color = '#000000';
                      }
                    });
                  return Promise.resolve();
                }
              });
              
              // Clean up
              if (document.body.contains(container)) {
                document.body.removeChild(container);
              }
              
              // Convert to data URL
              const imgData = canvas.toDataURL('image/jpeg', 0.95);
              
              // Add to PDF
              pdf.addImage(
                imgData,
                'JPEG',
                x,
                y,
                elementWidth,
                elementHeight
              );
              
              console.log('APPROACH 2 succeeded');
              success = true;
            } catch (error) {
              console.error('APPROACH 2 failed:', error);
              success = false;
            }
          }
          
          // APPROACH 3: Fallback to separate image + text rendering
          if (!success) {
            try {
              console.log('APPROACH 3: Fallback to separate image + text rendering');
              
              // Fallback: Add white background and add images separately
              console.log('Using fallback approach: background + individual images + text');
              
              // First generate a white background
              pdf.setFillColor(255, 255, 255);
              pdf.rect(x, y, elementWidth, elementHeight, 'F');
              
              // Add each image
              const images = element.querySelectorAll('img[data-pdf-id]');
              console.log(`Found ${images.length} tagged images in element`);
              
              // Now add each image
              Array.from(images).forEach((img) => {
                try {
                  const imgId = img.getAttribute('data-pdf-id') || '';
                  const dataUrl = imageMap[imgId];
                  
                  if (!dataUrl) {
                    console.warn(`No data URL found for image with ID ${imgId}`);
                    return;
                  }
                  
                  // Get image position relative to element
                  const imgRect = img.getBoundingClientRect();
                  const relX = imgRect.left - rect.left;
                  const relY = imgRect.top - rect.top;
                  
                  // Convert to millimeters and apply scaling
                  const imgX = x + (relX * pxToMm * scale);
                  const imgY = y + (relY * pxToMm * scale);
                  const imgWidth = imgRect.width * pxToMm * scale;
                  const imgHeight = imgRect.height * pxToMm * scale;
                  
                  // Skip images with invalid dimensions
                  if (imgWidth <= 0 || imgHeight <= 0) {
                    console.warn(`Skipping image with invalid dimensions: ${imgWidth}x${imgHeight}`);
                    return;
                  }
                  
                  // Add image to PDF
                  console.log(`Adding image at (${imgX}, ${imgY}) with size ${imgWidth}x${imgHeight}`);
                  pdf.addImage(
                    dataUrl,
                    'PNG',
                    imgX,
                    imgY,
                    imgWidth,
                    imgHeight
                  );
                } catch (err) {
                  console.error('Error adding image to PDF:', err);
                }
              });
              
              // Try to add text content
              try {
                // Find all text nodes
                const textNodes = [];
                const walker = document.createTreeWalker(
                  element,
                  NodeFilter.SHOW_TEXT,
                  {
                    acceptNode: function(node) {
                      // Skip empty text nodes or those in scripts/styles
                      if (!node.textContent || node.textContent.trim() === '') return NodeFilter.FILTER_REJECT;
                      const parent = node.parentElement;
                      if (!parent) return NodeFilter.FILTER_REJECT;
                      if (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') return NodeFilter.FILTER_REJECT;
                      
                      // Check if the text is visible
                      const style = window.getComputedStyle(parent);
                      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
                        return NodeFilter.FILTER_REJECT;
                      }
                      
                      return NodeFilter.FILTER_ACCEPT;
                    }
                  }
                );
                
                while (walker.nextNode()) {
                  const node = walker.currentNode;
                  const parent = node.parentElement;
                  
                  if (parent) {
                    const parentRect = parent.getBoundingClientRect();
                    const relX = parentRect.left - rect.left;
                    const relY = parentRect.top - rect.top;
                    
                    // Get style information
                    const style = window.getComputedStyle(parent);
                    const fontSize = parseFloat(style.fontSize);
                    const fontWeight = style.fontWeight;
                    const color = style.color;
                    
                    textNodes.push({
                      text: node.textContent || '',
                      x: relX,
                      y: relY + fontSize, // Add font size to position text baseline
                      fontSize: fontSize,
                      fontWeight: fontWeight,
                      color: color
                    });
                  }
                }
                
                // Add text to PDF
                pdf.setTextColor(0, 0, 0); // Default to black
                pdf.setFontSize(12); // Default font size
                
                textNodes.forEach(node => {
                  try {
                    // Set font size (convert px to pt, roughly 0.75 conversion)
                    const ptSize = node.fontSize * 0.75;
                    pdf.setFontSize(ptSize);
                    
                    // Set position (convert to mm)
                    const textX = x + (node.x * pxToMm * scale);
                    const textY = y + (node.y * pxToMm * scale);
                    
                    // Add text
                    pdf.text(node.text.trim(), textX, textY);
                  } catch (textErr) {
                    console.warn('Error adding text to PDF:', textErr);
                  }
                });
                
                console.log('APPROACH 3 succeeded');
                success = true;
              } catch (textErr) {
                console.error('Error processing text content:', textErr);
                success = false;
              }
            } catch (error) {
              console.error('APPROACH 3 failed:', error);
              success = false;
            }
          }
          
          // If all approaches failed, add a message
          if (!success) {
            const errorMessage = "Failed to capture content properly. Please try again or use a different format.";
            pdf.setFontSize(16);
            pdf.setTextColor(255, 0, 0);
            pdf.text(errorMessage, x + elementWidth/2, y + elementHeight/2, { align: 'center' });
          }
          
          // No border needed anymore
          // pdf.setDrawColor(220, 220, 220);
          // pdf.rect(x, y, elementWidth, elementHeight, 'S');
          
          // Update currentY for next element (add a small gap between elements)
          currentY += elementHeight + 5;
        }
        
        if (save) {
          // Save the PDF
          pdf.save(`${fileName}.pdf`);
        }
        
        return pdf;
      };

      // Generate the enhanced PDF content
      // We'll modify our function to return the PDF instance
      const pdfDoc = await generateEnhancedPDF(elements, orientation, fileName, format === 'pdf');
      
      if (format === 'png') {
        // Export as PNG using the PDF we just created
        console.log('Converting PDF to PNG');
        
        try {
          // For PNG, generate using the same approaches we use for PDF capture
          // but directly output to PNG instead of creating PDF pages
          
          // Create a single large canvas to hold all elements
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            throw new Error('Could not get canvas context');
          }
          
          // Calculate total height needed
          let totalHeight = 0;
          const margins = 20; // Margins in pixels
          const maxWidth = 1654; // ~200 DPI for A4 width in pixels
          const elementsInfo = [];
          
          // First pass: calculate sizes and positions
          for (const element of elements) {
            const rect = element.getBoundingClientRect();
            const aspectRatio = rect.height / rect.width;
            
            // Calculate width and height in pixels (maintain aspect ratio)
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
          
          // Set canvas size
          canvas.width = maxWidth;
          canvas.height = totalHeight;
          
          // Fill with white background
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Second pass: render each element to the canvas
          for (const info of elementsInfo) {
            // Create a separate canvas for each element
            const elementCanvas = document.createElement('canvas');
            elementCanvas.width = info.width;
            elementCanvas.height = info.height;
            
            // Use existing approach to capture element
            try {
              // Try APPROACH 1: Direct capture
              const tempCanvas = await html2canvas(info.element, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                imageTimeout: 5000,
                logging: false
              });
              
              // Draw the element's canvas onto our main canvas
              const elementCtx = elementCanvas.getContext('2d');
              if (elementCtx) {
                // Scale down to fit our target size
                elementCtx.drawImage(
                  tempCanvas, 
                  0, 0, tempCanvas.width, tempCanvas.height,
                  0, 0, info.width, info.height
                );
                
                // Draw onto main canvas
                ctx.drawImage(
                  elementCanvas,
                  margins, info.y,
                  info.width, info.height
                );
                
                // No border needed
              }
            } catch (err) {
              console.error('Error capturing element for PNG:', err);
            }
          }
          
          // Convert to PNG and download
          const link = document.createElement('a');
          link.download = `${fileName}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
          
          console.log('PNG export completed successfully');
        } catch (pngError) {
          console.error('Error generating PNG:', pngError);
          
          // Fallback: just save as PDF if PNG conversion fails
          alert('PNG generation failed. Saving as PDF instead.');
          pdfDoc.save(`${fileName}.pdf`);
        }
      } else {
        // Just save the PDF we already created
        pdfDoc.save(`${fileName}.pdf`);
      }
      
      console.log('Export completed successfully');
    } catch (error) {
      console.error('Export failed:', error);
      alert(error instanceof Error ? error.message : 'Failed to export elements. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }, []);

  return {
    exportElements,
    isExporting
  };
};

// For backward compatibility - invisible component that exposes the export functionality
interface ExportToPDFProps {
  elementIds: string[];
  fileName?: string;
  format?: 'pdf' | 'png';
  orientation?: 'portrait' | 'landscape';
  onExport?: () => void;
  className?: string;
  // Trigger prop for Plasmic to initiate export
  exportTrigger?: boolean;
}

export interface ExportToPDFRef {
  export: (options?: Partial<ExportOptions>) => void;
}

const ExportToPDFComponent: ForwardRefRenderFunction<ExportToPDFRef, ExportToPDFProps> = (
  {
    elementIds,
    fileName = 'export',
    format = 'pdf',
    orientation = 'portrait',
    onExport,
    className = '',
    exportTrigger = false,
  }, 
  ref
) => {
  const { exportElements, isExporting } = useExportToPDF();
  
  // Expose the export function via ref for imperative calls
  useImperativeHandle(ref, () => ({
    export: (options = {}) => exportElements({
      elementIds,
      fileName,
      format,
      orientation,
      ...options
    })
  }));

  // Trigger export when exportTrigger changes to true
  React.useEffect(() => {
    if (exportTrigger && !isExporting && elementIds.length > 0) {
      exportElements({
        elementIds,
        fileName,
        format,
        orientation
      });
    }
  }, [exportTrigger, elementIds, fileName, format, orientation, exportElements, isExporting]);

  // Call onExport if provided
  React.useEffect(() => {
    if (onExport && !isExporting) {
      onExport();
    }
  }, [isExporting, onExport]);

  // Return an invisible element instead of null for Plasmic compatibility
  return (
    <div 
      className={className}
      style={{ 
        display: 'none', 
        width: 0, 
        height: 0, 
        overflow: 'hidden'
      }}
      data-plasmic-export-component="true"
      data-export-element-ids={elementIds.join(',')}
      data-export-format={format}
      data-export-orientation={orientation}
    />
  );
};

// Define the component type including propInfo
type ExportToPDFComponent = React.ForwardRefExoticComponent<ExportToPDFProps & React.RefAttributes<ExportToPDFRef>> & {
  propInfo: Record<string, unknown>;
};

const ExportToPDF = forwardRef(ExportToPDFComponent);

// Add metadata for Plasmic
ExportToPDF.displayName = 'ExportToPDF';

// Define prop info for Plasmic - use type assertion to avoid TS errors
const propInfo: Record<string, unknown> = {
  elementIds: {
    type: 'string[]',
    description: 'IDs of elements to export',
    defaultValue: [],
    required: true
  },
  fileName: {
    type: 'string',
    description: 'Name of the exported file (without extension)',
    defaultValue: 'export'
  },
  format: {
    type: 'choice',
    options: ['pdf', 'png'],
    description: 'Format to export (PDF or PNG)',
    defaultValue: 'pdf'
  },
  orientation: {
    type: 'choice',
    options: ['portrait', 'landscape'],
    description: 'Page orientation',
    defaultValue: 'portrait'
  },
  exportTrigger: {
    type: 'boolean',
    description: 'Set to true to trigger the export',
    defaultValue: false
  },
  onExport: {
    type: 'eventHandler',
    description: 'Function called when export is complete'
  }
};

// Add metadata for Plasmic
(ExportToPDF as ExportToPDFComponent).propInfo = propInfo;

export default ExportToPDF; 