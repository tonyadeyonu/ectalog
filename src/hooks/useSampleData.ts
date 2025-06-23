import { useEffect, useState } from 'react';
import { useStore } from '@/store';
import { Product, CategoryProducts } from '@/types';

// Hook to load sample data for testing without Supabase
export const useSampleData = (useCategorized = false) => {
  const { setProducts, setProductsFromCategoryStructure, setLoading, setError } = useStore();
  const [dataSource, setDataSource] = useState<'flat' | 'categorized'>(useCategorized ? 'categorized' : 'flat');

  useEffect(() => {
    const fetchSampleData = async () => {
      try {
        setLoading(true);
        
        // Fetch sample data from the appropriate JSON file
        const dataUrl = dataSource === 'categorized' 
          ? '/sample-products-categorized.json'
          : '/sample-products.json';
          
        const response = await fetch(dataUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Set products in the store based on data format
        if (dataSource === 'categorized') {
          setProductsFromCategoryStructure(data as CategoryProducts);
        } else {
          setProducts(data as Product[]);
        }
      } catch (error) {
        console.error('Error loading sample data:', error);
        setError('Failed to load sample data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSampleData();
  }, [setProducts, setProductsFromCategoryStructure, setLoading, setError, dataSource]);

  // Function to toggle between data sources
  const toggleDataSource = () => {
    setDataSource(prev => prev === 'flat' ? 'categorized' : 'flat');
  };

  return {
    ...useStore((state) => ({
      products: state.products,
      isLoading: state.isLoading,
      error: state.error,
    })),
    dataSource,
    toggleDataSource,
  };
};