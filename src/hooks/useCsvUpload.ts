import { useState } from 'react';
import Papa from 'papaparse';
import { Product, CSVRow } from '@/types';
import { useStore } from '@/store';

export const useCsvUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { setProducts, setError } = useStore();

  // Convert CSV row to Product format
  const mapCsvRowToProduct = (row: CSVRow, index: number): Product => {
    return {
      id: row.id?.toString() || `temp-${index}`,
      name: row.name?.toString() || '',
      description: row.description?.toString() || '',
      category: row.category?.toString() || '',
      supplier: row.supplier?.toString() || '',
      price: typeof row.price === 'number' ? row.price : parseFloat(row.price?.toString() || '0'),
      unit: row.unit?.toString() || '',
      available: row.available === true || row.available === 'true' || row.available === '1',
      createdAt: row.createdAt?.toString() || new Date().toISOString(),
      updatedAt: row.updatedAt?.toString() || new Date().toISOString(),
    };
  };

  const handleCsvUpload = (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          if (results.errors.length > 0) {
            setUploadError(`CSV parsing error: ${results.errors[0].message}`);
            return;
          }

          const products = results.data.map((row: CSVRow, index: number) => 
            mapCsvRowToProduct(row, index)
          );

          // Set the parsed products
          setProducts(products);
          setIsUploading(false);
        } catch (error) {
          console.error('Error processing CSV:', error);
          setUploadError('Failed to process the CSV file. Please check the format and try again.');
          setIsUploading(false);
        }
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        setUploadError('Failed to parse the CSV file. Please check the format and try again.');
        setIsUploading(false);
      }
    });
  };

  return {
    handleCsvUpload,
    isUploading,
    uploadError,
  };
};