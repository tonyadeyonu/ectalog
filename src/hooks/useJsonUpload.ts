import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useStore } from '@/store';
import { Product, CategoryProducts } from '@/types';

export const useJsonUpload = () => {
  const { setProducts, setProductsFromCategoryStructure, setError, setLoading } = useStore();
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const processJsonFile = async (file: File): Promise<void> => {
    setIsUploading(true);
    setLoading(true);
    
    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);
      
      // Check if the JSON has a category structure (top-level keys are categories)
      const isCategoryStructured = !Array.isArray(jsonData) && 
        typeof jsonData === 'object' &&
        Object.values(jsonData).some(value => Array.isArray(value));
      
      if (isCategoryStructured) {
        // Handle category structured data
        processStructuredJson(jsonData as CategoryProducts);
      } else if (Array.isArray(jsonData)) {
        // Handle flat array of products
        processFlatJson(jsonData as any[]);
      } else {
        throw new Error('Invalid JSON format. Expected either an array of products or a category-structured object.');
      }
      
    } catch (error) {
      console.error('Error processing JSON file:', error);
      setError(error instanceof Error ? error.message : 'Error processing JSON file');
    } finally {
      setIsUploading(false);
      setLoading(false);
    }
  };

  const processFlatJson = (jsonArray: any[]): void => {
    try {
      // Transform the data into Product objects
      const products: Product[] = jsonArray.map(item => {
        // Map JSON keys to Product interface
        // For simple flat JSON, we assume keys match our Product interface
        return {
          id: item.id || uuidv4(), // Generate UUID if not present
          name: item.name || item.product_name || item.title || '',
          description: item.description || '',
          category: item.category || 'Uncategorized',
          supplier: item.supplier || item.vendor || 'Unknown',
          price: typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : item.price,
          unit: item.unit || item.pack_size || '',
          available: item.available !== undefined ? item.available : true,
          imageUrl: item.image_url || item.imageUrl || item.image || '',
          technicalDetails: item.technical_details || item.technicalDetails || '',
          applications: Array.isArray(item.applications) ? item.applications : 
                       (item.applications ? [item.applications] : []),
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || new Date().toISOString(),
        };
      });

      setProducts(products);
    } catch (error) {
      console.error('Error processing flat JSON:', error);
      setError(error instanceof Error ? error.message : 'Error processing flat JSON');
    }
  };

  const processStructuredJson = (categoryData: CategoryProducts): void => {
    try {
      // Process the category-structured JSON directly
      // Our store has a special method for this format
      setProductsFromCategoryStructure(categoryData);
    } catch (error) {
      console.error('Error processing structured JSON:', error);
      setError(error instanceof Error ? error.message : 'Error processing structured JSON');
    }
  };

  return { handleJsonUpload: processJsonFile, isUploading };
};