import { useEffect } from 'react';
import { useStore } from '@/store';
import { CategoryProducts } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Hook to load supplier data from the fixed supplier-data directory
export const useSupplierData = () => {
  const { setProductsFromCategoryStructure, setLoading, setError } = useStore();

  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        setLoading(true);
        
        // Fetch data from the supplier products file
        const response = await fetch('/supplier-data/products.json');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Set products in the store
        setProductsFromCategoryStructure(data as CategoryProducts);
      } catch (error) {
        console.error('Error loading supplier data:', error);
        setError('Failed to load supplier data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierData();
  }, [setProductsFromCategoryStructure, setLoading, setError]);

  return useStore(state => ({
    products: state.products,
    isLoading: state.isLoading,
    error: state.error,
  }));
};