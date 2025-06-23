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