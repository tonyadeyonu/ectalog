import { useEffect } from 'react';
import { useStore } from '@/store';
import { CategoryProducts, Supplier } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Hook to load supplier data based on supplierId
export const useSupplierData = (supplierId?: string) => {
  const { setProductsFromCategoryStructure, setLoading, setError } = useStore();

  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        setLoading(true);
        
        // First, fetch the suppliers list to get the correct file path
        const suppliersResponse = await fetch('/supplier-data/suppliers.json');
        
        if (!suppliersResponse.ok) {
          throw new Error(`HTTP error! Status: ${suppliersResponse.status}`);
        }
        
        const suppliers = await suppliersResponse.json() as Supplier[];
        
        // Find the right supplier by ID or use the default (first one) if no ID is provided
        const supplier = supplierId 
          ? suppliers.find(s => s.id === supplierId) 
          : suppliers[0];
        
        if (!supplier) {
          throw new Error(`Supplier not found: ${supplierId}`);
        }
        
        // Fetch data from the correct supplier products file
        const response = await fetch(`/supplier-data/${supplier.products_file}`);
        
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
  }, [supplierId, setProductsFromCategoryStructure, setLoading, setError]);

  return useStore(state => ({
    products: state.products,
    isLoading: state.isLoading,
    error: state.error,
  }));
};