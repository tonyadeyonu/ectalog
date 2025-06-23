import { useCallback } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Product } from '@/types';

export const usePdfExport = () => {
  const exportToPdf = useCallback(async (products: Product[], tableRef: React.RefObject<HTMLDivElement>) => {
    if (!tableRef.current) {
      console.error('Table reference is not available');
      return;
    }
    
    try {
      // Get the date for the filename
      const date = new Date().toISOString().split('T')[0];
      const filename = `product-catalog-${date}.pdf`;
      
      // Create a new PDF document
      const doc = new jsPDF('p', 'mm', 'a4');
      
      // Add title
      doc.setFontSize(18);
      doc.text('Product Catalog', 105, 15, { align: 'center' });
      doc.setFontSize(12);
      doc.text(`Exported on ${new Date().toLocaleDateString()}`, 105, 22, { align: 'center' });
      
      // Capture the table as an image
      const canvas = await html2canvas(tableRef.current, {
        scale: 2, // Higher scale for better quality
        logging: false,
        useCORS: true,
      });
      
      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate optimal dimensions to fit on the page
      const imgProps = doc.getImageProperties(imgData);
      const pageWidth = doc.internal.pageSize.getWidth() - 20; // Margins
      const pageHeight = doc.internal.pageSize.getHeight() - 40; // Margins and title space
      
      const ratio = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height);
      const width = imgProps.width * ratio;
      const height = imgProps.height * ratio;
      
      // Add the image to the PDF
      doc.addImage(imgData, 'PNG', 10, 30, width, height);
      
      // Add detailed product pages for products with images
      const productsWithImages = products.filter(p => p.imageUrl);
      
      if (productsWithImages.length > 0) {
        // Add a header for the detailed section
        doc.addPage();
        doc.setFontSize(16);
        doc.text('Detailed Product Information', 105, 15, { align: 'center' });
        
        let currentY = 30;
        const marginX = 20;
        const pageWidth = doc.internal.pageSize.getWidth() - 2 * marginX;
        const imageMaxHeight = 60; // mm
        
        for (const product of productsWithImages) {
          // Check if we need a new page
          if (currentY > doc.internal.pageSize.getHeight() - 40) {
            doc.addPage();
            currentY = 30;
          }
          
          // Add product title
          doc.setFontSize(14);
          doc.setTextColor(0, 0, 0);
          doc.text(product.name, marginX, currentY);
          currentY += 10;
          
          // Add product image if available
          if (product.imageUrl) {
            try {
              // Create a temporary image element to load the image
              const img = new Image();
              img.crossOrigin = 'Anonymous';
              
              // Wait for the image to load
              await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = (err) => {
                  console.warn(`Failed to load image: ${product.imageUrl}`, err);
                  resolve(null); // Resolve with null instead of rejecting to continue processing
                };
                img.src = product.imageUrl || '';
                
                // Add timeout to prevent hanging on image load
                setTimeout(() => {
                  resolve(null);
                }, 3000);
              });
              
              // Create a canvas to draw the image
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
              if (ctx && img.width > 0 && img.height > 0) {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                // Convert canvas to data URL
                const imgData = canvas.toDataURL('image/jpeg');
                
                // Add the image to the PDF
                const imgProps = doc.getImageProperties(imgData);
                const imgRatio = imgProps.width / imgProps.height;
                
                let imgWidth = pageWidth / 2;
                let imgHeight = imgWidth / imgRatio;
                
                // Adjust height if needed
                if (imgHeight > imageMaxHeight) {
                  imgHeight = imageMaxHeight;
                  imgWidth = imgHeight * imgRatio;
                }
                
                doc.addImage(imgData, 'JPEG', marginX, currentY, imgWidth, imgHeight);
                currentY += imgHeight + 5;
              }
            } catch (error) {
              console.error('Error adding image to PDF:', error);
              // Continue without the image
            }
          }
          
          // Add product description and details
          doc.setFontSize(10);
          doc.setTextColor(60, 60, 60);
          
          // Basic info
          doc.text(`Category: ${product.category}`, marginX, currentY);
          currentY += 5;
          doc.text(`Supplier: ${product.supplier}`, marginX, currentY);
          currentY += 5;
          doc.text(`Price: $${typeof product.price === 'number' ? product.price.toFixed(2) : (product.price || 'N/A')} per ${product.unit || 'unit'}`, marginX, currentY);
          currentY += 5;
          doc.text(`Available: ${product.available ? 'Yes' : 'No'}`, marginX, currentY);
          currentY += 8;
          
          // Description with text wrapping
          const descriptionLines = doc.splitTextToSize(product.description, pageWidth);
          doc.text(descriptionLines, marginX, currentY);
          currentY += (descriptionLines.length * 5) + 5;
          
          // Technical details if available
          if (product.technicalDetails) {
            doc.setFontSize(12);
            doc.text('Technical Details:', marginX, currentY);
            currentY += 5;
            doc.setFontSize(10);
            const techLines = doc.splitTextToSize(product.technicalDetails, pageWidth);
            doc.text(techLines, marginX, currentY);
            currentY += (techLines.length * 5) + 5;
          }
          
          // Applications if available
          if (product.applications && product.applications.length > 0) {
            doc.setFontSize(12);
            doc.text('Applications:', marginX, currentY);
            currentY += 5;
            doc.setFontSize(10);
            
            for (const app of product.applications) {
              doc.text(`• ${app}`, marginX + 5, currentY);
              currentY += 5;
            }
          }
          
          // Add some space before the next product
          currentY += 15;
        }
      }
      
      // Save the PDF
      doc.save(filename);
      
      return filename;
    } catch (error) {
      console.error('Error exporting PDF:', error);
      throw new Error('Failed to export PDF. Please try again.');
    }
  }, []);

  return { exportToPdf };
};