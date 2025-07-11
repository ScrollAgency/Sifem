import React, { useState, useCallback, forwardRef, useImperativeHandle, ForwardRefRenderFunction } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ExportOptions {
  elementIds: string[];
  fileName?: string;
  format?: 'pdf' | 'png';
  orientation?: 'portrait' | 'landscape';
  autoResize?: boolean; // If true, automatically adjusts page size/orientation for wide elements
}

// Helper function to wait a specified amount of time
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Unified delay for consistent timing across all platforms
const optimizedDelay = (desktopMs: number, mobileMs: number = desktopMs) => {
  // Use the higher value to ensure stability on all platforms
  const unifiedMs = Math.max(desktopMs, mobileMs) / 2; // Accelerated x2
  return delay(unifiedMs);
};

// Unified delay for layout-critical operations across all platforms
const layoutSafeDelay = (desktopMs: number, mobileMs: number) => {
  // Use the higher value to ensure stability on all platforms
  const unifiedMs = Math.max(desktopMs, mobileMs) / 2; // Accelerated x2
  return delay(unifiedMs);
};

// Helper function to convert an image to a data URL
const imageToDataURL = async (imgElement: HTMLImageElement): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    try {
      // If image is already a data URL
      if (imgElement.src.startsWith('data:')) {
        console.log('Image is already a data URL');
        
        // For SVG data URLs, we need to render them to PNG to ensure compatibility
        if (imgElement.src.includes('image/svg+xml')) {
          console.log('Converting SVG data URL to PNG');
          try {
            const img = new Image();
            img.onload = () => {
              try {
                // Get the actual display dimensions and object-fit style
                const computedStyle = window.getComputedStyle(imgElement);
                const displayWidth = parseFloat(computedStyle.width);
                const displayHeight = parseFloat(computedStyle.height);
                const objectFit = computedStyle.objectFit;
                
                console.log(`Image styles - Display: ${displayWidth}x${displayHeight}, Object-fit: ${objectFit}`);
                
                const canvas = document.createElement('canvas');
                // Use display dimensions if available, otherwise fall back to natural dimensions
                canvas.width = displayWidth || img.naturalWidth || img.width || 100;
                canvas.height = displayHeight || img.naturalHeight || img.height || 100;
                
                const ctx = canvas.getContext('2d');
                if (!ctx) throw new Error('Could not get canvas context');
                
                // Fill with white background
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Handle object-fit: fill by stretching the image
                if (objectFit === 'fill') {
                  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                } else {
                  // For other object-fit values, maintain aspect ratio
                  const scale = Math.min(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
                  const scaledWidth = img.naturalWidth * scale;
                  const scaledHeight = img.naturalHeight * scale;
                  const x = (canvas.width - scaledWidth) / 2;
                  const y = (canvas.height - scaledHeight) / 2;
                  ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
                }
                
                // Convert to PNG data URL
                const pngDataUrl = canvas.toDataURL('image/png');
                resolve(pngDataUrl);
              } catch (err) {
                console.warn('Failed to convert SVG to PNG:', err);
                resolve(imgElement.src); // Fallback to original SVG
              }
            };
            img.onerror = () => {
              console.warn('Failed to load SVG for conversion');
              resolve(imgElement.src); // Fallback to original SVG
            };
            img.src = imgElement.src;
          } catch (err) {
            console.warn('Error setting up SVG conversion:', err);
            resolve(imgElement.src); // Fallback to original SVG
          }
          return;
        }
        
        // For other data URLs, return as is
        resolve(imgElement.src);
        return;
      }

      // Function to handle the actual image conversion
      const convertImage = async () => {
        try {
          // Try to fetch the image directly first
          const response = await fetch(imgElement.src);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const blob = await response.blob();
          const dataUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
          resolve(dataUrl);
        } catch (fetchError) {
          console.warn('Direct fetch failed, trying canvas method:', fetchError);
          
          // Fallback to canvas method
          try {
            // Create a new image element
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            // Add query parameter to bypass cache
            const url = new URL(imgElement.src, window.location.href);
            url.searchParams.set('crossorigin', '1');
            url.searchParams.set('t', Date.now().toString());
            
            img.onload = () => {
              try {
                // Get the actual display dimensions and object-fit style
                const computedStyle = window.getComputedStyle(imgElement);
                const displayWidth = parseFloat(computedStyle.width);
                const displayHeight = parseFloat(computedStyle.height);
                const objectFit = computedStyle.objectFit;
                
                console.log(`Image styles - Display: ${displayWidth}x${displayHeight}, Object-fit: ${objectFit}, Natural: ${img.naturalWidth}x${img.naturalHeight}`);
                
                const canvas = document.createElement('canvas');
                // Use display dimensions if available, otherwise fall back to natural dimensions
                canvas.width = displayWidth || img.naturalWidth || img.width || 100;
                canvas.height = displayHeight || img.naturalHeight || img.height || 100;
                
                if (!canvas.width || !canvas.height) {
                  console.warn(`Cannot convert image with invalid dimensions: ${canvas.width}x${canvas.height}`);
                  resolve('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
                  return;
                }
                
                const ctx = canvas.getContext('2d');
                if (!ctx) throw new Error('Could not get canvas context');
                
                // Fill with white background first
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Handle object-fit: fill by stretching the image
                if (objectFit === 'fill') {
                  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                } else {
                  // For other object-fit values, maintain aspect ratio
                  const scale = Math.min(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
                  const scaledWidth = img.naturalWidth * scale;
                  const scaledHeight = img.naturalHeight * scale;
                  const x = (canvas.width - scaledWidth) / 2;
                  const y = (canvas.height - scaledHeight) / 2;
                  ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
                }
                
                // Try to get data URL
                try {
                  const dataURL = canvas.toDataURL('image/png');
                  console.log(`Converted image to data URL (${dataURL.length} bytes)`);
                  resolve(dataURL);
                } catch (canvasError) {
                  console.error('Canvas export failed:', canvasError);
                  // If canvas is tainted, try to use fetch API as final fallback
                  fetch(img.src)
                    .then(response => response.blob())
                    .then(blob => {
                      const reader = new FileReader();
                      reader.onloadend = () => resolve(reader.result as string);
                      reader.readAsDataURL(blob);
                    })
                    .catch(error => {
                      console.error('All conversion methods failed:', error);
                      resolve('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
                    });
                }
              } catch (err) {
                console.error('Error processing loaded image:', err);
                resolve('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
              }
            };
            
            img.onerror = () => {
              console.warn(`Failed to load image for conversion: ${img.src}`);
              resolve('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
            };
            
            // Start loading the image
            img.src = url.toString();
          } catch (canvasError) {
            console.error('Canvas method failed:', canvasError);
            resolve('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
          }
        }
      };

      // Start the conversion process
      if (imgElement.complete && imgElement.naturalWidth > 0) {
        convertImage();
      } else {
        imgElement.onload = () => convertImage();
        imgElement.onerror = () => {
          console.warn(`Failed to load image for conversion: ${imgElement.src}`);
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
  
  const isDesktop = window.innerWidth > 768 && !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // First pass: Make all images eager loading and set CORS attributes
  Array.from(images).forEach(img => {
    // Set loading to eager
    if (img.loading === 'lazy') {
      img.loading = 'eager';
      console.log(`Changed image loading to eager: ${img.src}`);
    }
    
    // Remove srcset to ensure the browser uses src only
    if (img.srcset) {
      img.removeAttribute('srcset');
    }
    
    // Set crossOrigin attribute if not already set
    if (!img.hasAttribute('crossorigin')) {
      img.crossOrigin = 'anonymous';
      console.log(`Set crossOrigin to anonymous: ${img.src}`);
    }
    
    // Add cache-busting parameter to force fresh request for non-data URLs (only on mobile, more critical there)
    if (!isDesktop && !img.src.startsWith('data:')) {
      try {
        const url = new URL(img.src, window.location.href);
        url.searchParams.set('crossorigin', '1');
        // Use a simpler timestamp for mobile to reduce processing
        url.searchParams.set('cb', Date.now().toString().slice(-6)); // Last 6 digits only
        img.src = url.toString();
      } catch (err) {
        console.warn(`Could not modify URL for CORS: ${img.src}`, err);
      }
    } else if (img.src.startsWith('data:')) {
      console.log('Skipping URL modification for data URL');
    }
  });
  
  // Minimal wait for DOM update
  await optimizedDelay(5, 15); // Minimal delay for JPEG stabilization
  
  // Second pass: Convert all images to data URLs in parallel
  const imagePromises = Array.from(images).map(async (img, index) => {
    try {
      // Try to convert it to a data URL
      const dataUrl = await imageToDataURL(img);
      
      // Update the image src to use the data URL
      img.src = dataUrl;
      
      // Minimal wait time for JPEG image processing
      if (!isDesktop) {
        await delay(5); // Minimal delay for JPEG stability on mobile
      }
      
      return true;
    } catch (err) {
      console.error(`Failed to process image ${index}:`, err);
      return false;
    }
  });
  
  // Wait for all images to be processed
  await Promise.all(imagePromises);
  console.log('All images processed');
  
  // Conservative delay for rendering - JPEG images need time to stabilize
  await layoutSafeDelay(40, 75); // Increased delays to ensure JPEG images are fully stable (accelerated x2)
};

// Helper function to scroll an element into view and wait for it to render
const scrollAndWaitForRender = async (element: HTMLElement) => {
  const isDesktop = window.innerWidth > 768 && !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Scroll the element into view with smooth behavior
  element.scrollIntoView({
    behavior: isDesktop ? 'auto' : 'smooth', // Instant scroll on desktop for speed
    block: 'center',
  });
  
  // Conservative wait for scroll and rendering to complete
  await optimizedDelay(20, 60); // Extended delays to ensure JPEG images are stable (accelerated x2)
  
  // Return a no-op cleanup function
  return () => {
    // No cleanup needed since we removed the highlight effect
  };
};

// Create a screenshot of an element using different methods
// This function is for future use, currently disabled
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const captureScreenshot = async (element: HTMLElement): Promise<HTMLCanvasElement> => {
  // First cleanup any leftover clones
  document.querySelectorAll('.html2canvas-clone, .dom-capture-container').forEach(el => {
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
  });
  
  // Preload all images in the element
  console.log('Preloading images before capture');
  await preloadImages(element);
  
  // Get element dimensions and position
  const rect = element.getBoundingClientRect();
  console.log(`Element dimensions: ${rect.width}x${rect.height}`);
  
  if (rect.width === 0 || rect.height === 0) {
    console.warn(`Element has zero dimensions: ${rect.width}x${rect.height}`);
  }
  
  // Create a canvas with the right dimensions
  const canvas = document.createElement('canvas');
  
  // Force dimensions - use the computed dimensions or a minimum size
  const width = Math.max(rect.width, element.offsetWidth, 100);
  const height = Math.max(rect.height, element.offsetHeight, 100);
  
  canvas.width = width * 2; // Higher resolution
  canvas.height = height * 2;
  
  // Method 1: Create a clone and render it manually
  try {
    // We'll create a container for the clone
    const container = document.createElement('div');
    container.className = 'dom-capture-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    container.style.overflow = 'hidden';
    container.style.zIndex = '-9999';
    container.style.opacity = '0';
    container.style.pointerEvents = 'none';
    
    // Create a deep clone of the element
    const clone = element.cloneNode(true) as HTMLElement;
    
    // Apply all computed styles to the clone
    const styles = window.getComputedStyle(element);
    for (let i = 0; i < styles.length; i++) {
      const prop = styles[i];
      // Properly type-cast to handle the indexing operation
      clone.style[prop as unknown as number] = styles.getPropertyValue(prop);
    }
    
    // Add to container and to body
    container.appendChild(clone);
    document.body.appendChild(container);
    
    // Skip delay - clone should render immediately
    
    // Try to render using html2canvas
    console.log('Trying to capture clone with html2canvas');
    
    // First convert all images in the clone to data URLs
    const images = clone.querySelectorAll('img');
    if (images.length > 0) {
      console.log(`Converting ${images.length} cloned images to data URLs before capture`);
      for (const img of Array.from(images)) {
        try {
          if (!img.src.startsWith('data:')) {
            // Create temporary canvas to convert image
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = img.naturalWidth || img.width || 100;
            tempCanvas.height = img.naturalHeight || img.height || 100;
            
            // Draw and convert
            if (img.complete && img.naturalWidth > 0) {
              const ctx = tempCanvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0);
                img.src = tempCanvas.toDataURL('image/png');
                console.log(`Converted cloned image from ${img.src} to data URL`);
              }
            }
          }
        } catch (err) {
          console.warn('Error converting cloned image:', err);
        }
      }
      
      // Skip delay - images should process immediately
    }
    
    const cloneCanvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: width,
      height: height,
      x: 0,
      y: 0,
      windowWidth: width + 50,
      windowHeight: height + 50,
      scrollX: 0,
      scrollY: 0,
      foreignObjectRendering: false, // Disable foreignObject to improve compatibility
      imageTimeout: 3000, // Timeout augmenté pour une meilleure compatibilité
      logging: false, // Disable verbose logging
      onclone: (clonedDoc: any) => {
        // Process images in the clone
        Array.from(clonedDoc.querySelectorAll('img')).forEach(img => {
          const image = img as HTMLImageElement;
          image.loading = 'eager';
          image.setAttribute('crossorigin', 'anonymous');
          
          // If the image has a srcset, remove it to avoid html2canvas issues
          if (image.hasAttribute('srcset')) {
            image.removeAttribute('srcset');
          }
        });
        return Promise.resolve();
      }
    } as any);
    
    // Cleanup
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    
    // Verify canvas has dimensions
    if (cloneCanvas.width > 0 && cloneCanvas.height > 0) {
      console.log(`Successfully captured canvas: ${cloneCanvas.width}x${cloneCanvas.height}`);
      return cloneCanvas;
    } else {
      console.warn('Clone canvas has zero dimensions. Falling back to direct capture.');
    }
  } catch (error) {
    console.error('Error capturing cloned element:', error);
  }
  
  // Method 2: Use direct html2canvas
  try {
    // Apply styles to optimize html2canvas capture
    const originalStyles = {
      backgroundColor: element.style.backgroundColor,
      border: element.style.border,
      margin: element.style.margin,
      overflow: element.style.overflow
    };
    
    // Make sure it has a background and is contained
    if (!originalStyles.backgroundColor || originalStyles.backgroundColor === 'transparent') {
      element.style.backgroundColor = '#ffffff';
    }
    if (!originalStyles.border) {
      element.style.border = '1px solid transparent';
    }
    element.style.margin = '0';
    element.style.overflow = 'visible';
    
    console.log('Trying direct capture with html2canvas');
    
    // Apply additional styles to make sure images are visible
    const originalStylesMap = new Map();
    const allImages = element.querySelectorAll('img');
    Array.from(allImages).forEach(img => {
      originalStylesMap.set(img, {
        visibility: img.style.visibility,
        display: img.style.display,
        opacity: img.style.opacity,
        border: img.style.border
      });
      
      // Force visibility
      img.style.visibility = 'visible';
      img.style.display = 'inline-block';
      img.style.opacity = '1';
    });
    
            // Minimal wait for styles to apply
        await optimizedDelay(5, 10); // Minimal style processing delay
        
        // Reliable capture settings for stable JPEG rendering
        const directCanvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          imageTimeout: 3000, // Timeout augmenté pour une meilleure compatibilité
          logging: false, // Disable verbose logging
      foreignObjectRendering: false, // Keep disabled for stability
      removeContainer: false, // Keep container for better stability
      ignoreElements: (el: any) => {
        // Skip some problematic elements
        return (
          el.tagName === 'IFRAME' || 
          el.tagName === 'SCRIPT' ||
          (el.tagName === 'DIV' && el.classList.contains('html2canvas-clone'))
        );
      },
      onclone: (clonedDoc: any) => {
        // Process all images in the clone
        const clonedImages = clonedDoc.querySelectorAll('img');
        
        Array.from(clonedImages).forEach(img => {
          const image = img as HTMLImageElement;
          image.loading = 'eager';
          image.setAttribute('crossorigin', 'anonymous');
          
          // Remove srcset attribute
          if (image.hasAttribute('srcset')) {
            image.removeAttribute('srcset');
          }
          
          // Force visibility in clone
          image.style.visibility = 'visible';
          image.style.display = 'inline-block';
          image.style.opacity = '1';
        });
        
        return Promise.resolve();
      }
    } as any);
    
    // Restore original styles
    Array.from(allImages).forEach(img => {
      const originalStyles = originalStylesMap.get(img);
      if (originalStyles) {
        img.style.visibility = originalStyles.visibility;
        img.style.display = originalStyles.display;
        img.style.opacity = originalStyles.opacity;
        img.style.border = originalStyles.border;
      }
    });
    
    // Restore original styles
    element.style.backgroundColor = originalStyles.backgroundColor;
    element.style.border = originalStyles.border;
    element.style.margin = originalStyles.margin;
    element.style.overflow = originalStyles.overflow;
    
    if (directCanvas.width > 0 && directCanvas.height > 0) {
      console.log(`Successfully captured direct canvas: ${directCanvas.width}x${directCanvas.height}`);
      return directCanvas;
    }
    
    console.warn('Direct canvas has zero dimensions. Falling back to manual rendering.');
  } catch (error) {
    console.error('Error with direct html2canvas capture:', error);
  }
  
  // Method 3: Manual canvas rendering as fallback
  console.log('Creating manual canvas rendering as fallback');
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Fill with background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    try {
      // Try to draw an approximation of the element
      // Get all text nodes from the element
      const extractText = (node: Node): string[] => {
        const texts: string[] = [];
        if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
          texts.push(node.textContent.trim());
        }
        for (let i = 0; i < node.childNodes.length; i++) {
          texts.push(...extractText(node.childNodes[i]));
        }
        return texts;
      };
      
      const texts = extractText(element);
      
      // Create a visual representation of the element
      ctx.strokeStyle = '#cccccc';
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
      
      ctx.font = '20px Arial';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      
      // Draw element ID
      ctx.fillText(`Element: #${element.id}`, canvas.width / 2, 40);
      
      // Draw element dimensions
      ctx.fillText(`Dimensions: ${Math.round(rect.width)}x${Math.round(rect.height)}`, canvas.width / 2, 70);
      
      // Draw some text content
      ctx.font = '16px Arial';
      const maxTextsToShow = 5;
      for (let i = 0; i < Math.min(texts.length, maxTextsToShow); i++) {
        const text = texts[i].length > 40 ? texts[i].substring(0, 40) + '...' : texts[i];
        ctx.fillText(text, canvas.width / 2, 110 + i * 25);
      }
      
      if (texts.length > maxTextsToShow) {
        ctx.fillText(`(${texts.length - maxTextsToShow} more text nodes...)`, canvas.width / 2, 110 + maxTextsToShow * 25);
      }
      
      // Draw a warning
      ctx.fillStyle = '#ff0000';
      ctx.fillText('* Fallback rendering - actual element could not be captured *', canvas.width / 2, canvas.height - 20);
    } catch (renderError) {
      console.error('Error creating fallback rendering:', renderError);
      // Even more basic fallback
      ctx.fillStyle = '#ff0000';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Failed to capture #${element.id}`, canvas.width / 2, canvas.height / 2);
    }
  }
  
  console.log(`Created fallback canvas: ${canvas.width}x${canvas.height}`);
  return canvas;
};



export const useExportToPDF = () => {
  const [isExporting, setIsExporting] = useState(false);

  // Force image download and conversion to base64 using fetch
  const fetchAndConvertImage = useCallback(async (url: string): Promise<string> => {
    try {
      // Skip data URLs
      if (url.startsWith('data:')) {
        return url;
      }
      
      // For relative URLs, make them absolute
      const absoluteUrl = url.startsWith('http') ? url : new URL(url, window.location.href).href;
      
      console.log(`Fetching image: ${absoluteUrl}`);
      
      // Try different CORS strategies
      const fetchStrategies = [
        // Strategy 1: Normal CORS request
        () => fetch(`${absoluteUrl}${absoluteUrl.includes('?') ? '&' : '?'}cacheBust=${Date.now()}`, {
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        }),
        
        // Strategy 2: No-cors mode (fallback for localhost)
        () => fetch(absoluteUrl, {
          mode: 'no-cors',
          cache: 'no-cache',
        }),
        
        // Strategy 3: Simple request without headers
        () => fetch(absoluteUrl)
      ];
      
      let response;
      for (const strategy of fetchStrategies) {
        try {
          response = await strategy();
          if (response.ok || response.type === 'opaque') break;
        } catch {
          console.warn(`Fetch strategy failed, trying next...`);
          continue;
        }
      }
      
      if (!response || (!response.ok && response.type !== 'opaque')) {
        throw new Error(`All fetch strategies failed for: ${absoluteUrl}`);
      }
      
      // Get the blob (handle opaque responses)
      const blob = await response.blob();
      
      // Convert blob to base64
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.warn(`Error fetching image: ${url}`, error);
      // Return a 1x1 transparent pixel as fallback (won't break the export)
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    }
  }, []);

  // Process all images in an element and prepare for PDF generation
  const processImagesForPDF = useCallback(async (element: HTMLElement): Promise<{[key: string]: string}> => {
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
              // Force immediate reload without delay
              const currentSrc = img.src;
              img.src = '';
              img.src = currentSrc;
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
  }, [fetchAndConvertImage]);

  // Enhanced PDF generator that adds images separately
  const generateEnhancedPDF = useCallback(async (elements: HTMLElement[], orientation: 'portrait' | 'landscape', fileName: string, save: boolean, autoResize: boolean = true) => {
    console.log('Starting enhanced PDF generation');
    
    // Force consistent DPI and measurements regardless of original device
    // Since we convert mobile to desktop layout temporarily, treat everything as desktop quality
    const devicePixelRatio = window.devicePixelRatio || 1;
    const pxToMm = 25.4 / 96; // Convert pixels to millimeters (assuming 96 DPI)
    
    // Fixed capture scale for consistent rendering across all platforms
    // Using a fixed scale prevents text deformation issues on high-DPR mobile devices
    const captureScale = 2; // Unified scale: high quality without mobile deformation
    
    console.log(`Capture settings: devicePixelRatio=${devicePixelRatio}, captureScale=${captureScale} (fixed to prevent deformation)`);
    
    // Détection mobile (à placer en haut de generateEnhancedPDF)
    const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // First, analyze all elements to determine optimal page setup
    const elementDimensions = elements.map(element => {
      const rect = element.getBoundingClientRect();
      return {
        element,
        width: rect.width,
        height: rect.height,
        aspectRatio: rect.width / rect.height
      };
    });

    // Find the widest element to determine if we need landscape or larger format
    const maxElementWidth = Math.max(...elementDimensions.map(d => d.width));
    const maxElementWidthMm = maxElementWidth * pxToMm;

    // Définition du format de page (retour à la logique standard)
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
    
    // Create PDF document with consistent high-quality settings
    const pdf = new jsPDF({
      orientation: finalOrientation,
      unit: 'mm',
      format: pageFormat,
      compress: true, // Enable compression for consistent file sizes
      precision: 3, // Higher precision for better quality
    });

    // Get actual page dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const maxWidth = pageWidth - (2 * margin);
    const maxHeight = pageHeight - (2 * margin);
    
    console.log(`Using page size: ${pageWidth.toFixed(1)}x${pageHeight.toFixed(1)}mm (max content width: ${maxWidth.toFixed(1)}mm)`);

    // Calculate positions for vertically stacked elements
    let currentY = margin;
    
    // Process each element
    for (let i = 0; i < elements.length; i++) {
      const elementData = elementDimensions[i];
      const element = elementData.element;
      
      console.log(`Processing element ${i+1}/${elements.length} (${element.id || 'unknown'})`);
      
      // First, pre-process all images in the element
      const imageMap = await processImagesForPDF(element);
      
      // Convert to millimeters
      let elementWidth = elementData.width * pxToMm;
      let elementHeight = elementData.height * pxToMm;
      
      // Calculate scaling - be more conservative with scaling
      let scale = 1;
      if (elementWidth > maxWidth || elementHeight > maxHeight) {
        scale = Math.min(maxWidth / elementWidth, maxHeight / elementHeight);
        scale *= isMobile ? 0.72 : 1; // marge de sécurité plus forte sur mobile
        elementWidth *= scale;
        elementHeight *= scale;
      }
      
      // Check if this element would go beyond page boundary
      if (currentY + elementHeight > pageHeight - margin) {
        // Add a new page
        pdf.addPage();
        currentY = margin;
        console.log('Added new page for element');
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
        const originalStyles = new Map();
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
        
        // Minimal delay before capture
        await layoutSafeDelay(20, 40); // Minimal pre-capture stabilization
        
        // Force one more reflow before capture
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        element.offsetHeight;
        
        // Reliable capture settings for stable JPEG rendering
        const canvas = await html2canvas(element, {
          scale: captureScale,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          imageTimeout: 5000, // More conservative timeout for reliable image loading
          logging: false,
          foreignObjectRendering: false, // Keep disabled for stability
          removeContainer: false, // Keep container for better stability
        } as any);
        
        // Convert to high quality JPEG (since images are already JPEG format)
        const imgData = canvas.toDataURL('image/jpeg', 0.98);
        
        // Add to PDF with precise dimensions for consistency
        pdf.addImage(
          imgData,
          'JPEG',
          Math.round(x * 100) / 100, // Round to 2 decimal places for consistency
          Math.round(y * 100) / 100,
          Math.round(elementWidth * 100) / 100,
          Math.round(elementHeight * 100) / 100
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
          container.style.width = `${elementData.width}px`;
          container.style.height = `${elementData.height}px`;
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
          
          // Minimal wait for clone to render
          await layoutSafeDelay(20, 40); // Minimal clone stabilization
          
          // Force reflow on clone
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          clone.offsetHeight;
          
          // Reliable capture settings for stable JPEG rendering
          const canvas = await html2canvas(clone, {
            scale: captureScale,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            imageTimeout: 5000, // More conservative timeout for reliable image loading
            foreignObjectRendering: false, // Keep disabled for stability
            removeContainer: false, // Keep container for better stability
            onclone: (clonedDoc: any) => {
              // Just ensure text elements are visible in the clone
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
          } as any);
          
          // Clean up
          if (document.body.contains(container)) {
            document.body.removeChild(container);
          }
          
          // Convert to high quality JPEG (since images are already JPEG format)
          const imgData = canvas.toDataURL('image/jpeg', 0.98);
          
          // Add to PDF with precise dimensions for consistency
          pdf.addImage(
            imgData,
            'JPEG',
            Math.round(x * 100) / 100, // Round to 2 decimal places for consistency
            Math.round(y * 100) / 100,
            Math.round(elementWidth * 100) / 100,
            Math.round(elementHeight * 100) / 100
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
              const elementRect = element.getBoundingClientRect();
              const relX = imgRect.left - elementRect.left;
              const relY = imgRect.top - elementRect.top;
              
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
              
              // Add image to PDF with precise dimensions for consistency
              console.log(`Adding image at (${imgX}, ${imgY}) with size ${imgWidth}x${imgHeight}`);
              pdf.addImage(
                dataUrl,
                'PNG',
                Math.round(imgX * 100) / 100, // Round to 2 decimal places for consistency
                Math.round(imgY * 100) / 100,
                Math.round(imgWidth * 100) / 100,
                Math.round(imgHeight * 100) / 100
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
                const elementRect = element.getBoundingClientRect();
                const relX = parentRect.left - elementRect.left;
                const relY = parentRect.top - elementRect.top;
                
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
      // Remplacement du pdf.save par un téléchargement Blob pour forcer le download sur mobile
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${fileName}.pdf`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    }
    
    return pdf;
  }, [processImagesForPDF]);

  // Helper function to temporarily switch to desktop layout
  const temporarilySetDesktopLayout = useCallback(() => {
    const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!isMobile) {
      console.log('Desktop detected - skipping layout changes');
      return () => {}; // No-op cleanup function for desktop
    }
    
    console.log('Temporarily switching to desktop layout for export');
    
    // Store original values
    const originalValues = {
      viewportMeta: null as HTMLMetaElement | null,
      bodyMinWidth: document.body.style.minWidth,
      bodyMaxWidth: document.body.style.maxWidth,
      bodyWidth: document.body.style.width,
      htmlMinWidth: document.documentElement.style.minWidth,
      htmlMaxWidth: document.documentElement.style.maxWidth,
      htmlWidth: document.documentElement.style.width,
      bodyOverflow: document.body.style.overflow,
      htmlOverflow: document.documentElement.style.overflow,
      bodyTransform: document.body.style.transform,
      htmlTransform: document.documentElement.style.transform,
      bodyFontSize: document.body.style.fontSize,
      htmlFontSize: document.documentElement.style.fontSize,
      injectedStyleSheet: null as HTMLStyleElement | null
    };
    
    // Find existing viewport meta tag
    originalValues.viewportMeta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
    const originalViewportContent = originalValues.viewportMeta?.content || '';
    
    // Create or modify viewport meta tag to force desktop width
    let viewportMeta = originalValues.viewportMeta;
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      document.head.appendChild(viewportMeta);
    }
    
    // Set fixed desktop viewport for consistent rendering across all devices
    const targetWidth = 1200; // Fixed width for absolute consistency
    viewportMeta.content = `width=${targetWidth}, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no`;
    
    // Comprehensive CSS injection for identical rendering across platforms
    const desktopStyleSheet = document.createElement('style');
    desktopStyleSheet.setAttribute('data-export-desktop-override', 'true');
    desktopStyleSheet.innerHTML = `
      /* Force identical text rendering across all platforms */
      * {
        -webkit-text-size-adjust: 100% !important;
        -ms-text-size-adjust: 100% !important;
        text-size-adjust: 100% !important;
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
        text-rendering: optimizeLegibility !important;
      }
      
      /* Minimal adjustments for consistent rendering */
      * {
        -webkit-text-size-adjust: 100% !important;
        -ms-text-size-adjust: 100% !important;
        text-size-adjust: 100% !important;
      }
      
      /* Disable animations during export only */
      @media (max-width: 9999px) {
        * {
          transition: none !important;
          animation: none !important;
        }
      }
    `;
    document.head.appendChild(desktopStyleSheet);
    originalValues.injectedStyleSheet = desktopStyleSheet;
    
    // Force identical dimensions on body and html for perfect consistency
    document.body.style.minWidth = `${targetWidth}px`;
    document.body.style.maxWidth = `${targetWidth}px`;
    document.body.style.width = `${targetWidth}px`;
    document.documentElement.style.minWidth = `${targetWidth}px`;
    document.documentElement.style.maxWidth = `${targetWidth}px`;
    document.documentElement.style.width = `${targetWidth}px`;
    
    // Prevent horizontal scroll during capture
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Just prevent mobile text scaling without forcing sizes
    
    // Force layout recalculation
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    document.body.offsetHeight;
    
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
      
      // Restore body and html styles
      document.body.style.minWidth = originalValues.bodyMinWidth;
      document.body.style.maxWidth = originalValues.bodyMaxWidth;
      document.body.style.width = originalValues.bodyWidth;
      document.documentElement.style.minWidth = originalValues.htmlMinWidth;
      document.documentElement.style.maxWidth = originalValues.htmlMaxWidth;
      document.documentElement.style.width = originalValues.htmlWidth;
      document.body.style.overflow = originalValues.bodyOverflow;
      document.documentElement.style.overflow = originalValues.htmlOverflow;
      document.body.style.transform = originalValues.bodyTransform;
      document.documentElement.style.transform = originalValues.htmlTransform;
      document.body.style.fontSize = originalValues.bodyFontSize;
      document.documentElement.style.fontSize = originalValues.htmlFontSize;
      
      // Force a reflow to apply the restoration
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      document.body.offsetHeight;
    };
  }, []);

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
      console.log('Starting export with element IDs:', elementIds);
      
      // Step 1: Switch to desktop layout if on mobile
      restoreLayout = temporarilySetDesktopLayout();
      
      // Minimal wait for layout changes across all platforms
      await delay(100); // Reduced layout timing
      // Force reflow to ensure layout recalculation
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      document.body.offsetHeight;
      await delay(25); // Minimal stabilization delay
      
      // Wait for web fonts if available (non-blocking) - optimized for both platforms
      if (document.fonts && document.fonts.ready) {
        try {
          await Promise.race([
            document.fonts.ready,
            optimizedDelay(25, 35) // Minimal font loading timeout
          ]);
        } catch {
          // Continue if fonts fail to load
        }
      }
      
      // First verify elements are found in the DOM
      const elements = [];
      for (const id of elementIds) {
        const element = document.getElementById(id);
        if (!element) {
          console.warn(`Element with ID "${id}" not found in the DOM`);
          alert(`Element with ID "${id}" not found. Please check your element IDs.`);
          continue;
        }
        
        // Check if element is visible (now with desktop layout)
        const rect = element.getBoundingClientRect();
        console.log(`Element "${id}" found with desktop size ${rect.width}x${rect.height}`);
        elements.push(element);
      }
      
      if (elements.length === 0) {
        throw new Error('No valid elements found to export. Please check that your element IDs exist and are visible.');
      }

      // Unified element processing for consistent results across platforms
      // Process sequentially on all platforms for maximum consistency
      for (const element of elements) {
        const cleanup = await scrollAndWaitForRender(element);
        await preloadImages(element);
        cleanup();
        
        // Skip inter-element delay - not necessary
      }

      // Generate the enhanced PDF content - don't save file yet
      // We'll modify our function to return the PDF instance
      const pdfDoc = await generateEnhancedPDF(elements, orientation, fileName, false, autoResize);
      
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
              // Reliable settings for stable JPEG export
              const tempCanvas = await html2canvas(info.element, {
                scale: 2, // Fixed scale for consistency
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                imageTimeout: 5000, // Timeout augmenté pour une meilleure compatibilité mobile
                logging: false,
                foreignObjectRendering: false, // Keep disabled for stability
                removeContainer: false, // Keep container for better stability
              } as any);
              
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
          const blob = await new Promise<Blob>((resolve) => canvas.toBlob(b => resolve(b!), 'image/png'));
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `${fileName}.png`;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }, 100);
          console.log('PNG export completed successfully');
        } catch (pngError) {
          console.error('Error generating PNG:', pngError);
          
          // Fallback: just save as PDF if PNG conversion fails
          alert('PNG generation failed. Saving as PDF instead.');
          pdfDoc.save(`${fileName}.pdf`);
        }
      } else {
        // Just save the PDF we already created
        // Remplacement du pdf.save par un téléchargement Blob pour forcer le download sur mobile
        const blob = pdfDoc.output('blob');
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${fileName}.pdf`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);
      }
      
      console.log('Export completed successfully');
    } catch (error) {
      console.error('Export failed:', error);
      alert(error instanceof Error ? error.message : 'Failed to export elements. Please try again.');
    } finally {
      // Always restore layout before finishing
      if (restoreLayout) {
        restoreLayout();
        // Optimized wait for layout restoration
        await optimizedDelay(25, 75); // Reduced mobile restoration delay (accelerated x2)
      }
      setIsExporting(false);
    }
  }, [generateEnhancedPDF, temporarilySetDesktopLayout]);

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
  autoResize?: boolean;
  onExport?: () => void;
  className?: string;
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
    autoResize = true,
    onExport,
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
      autoResize,
      ...options
    })
  }));

  // Call onExport if provided
  React.useEffect(() => {
    if (onExport && !isExporting) {
      onExport();
    }
  }, [isExporting, onExport]);

  // Return null - component doesn't render anything
  return null;
};

const ExportToPDF = forwardRef(ExportToPDFComponent);

export default ExportToPDF; 