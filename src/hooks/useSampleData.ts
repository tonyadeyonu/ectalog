import { useEffect } from 'react';
import { useStore } from '@/store';
import { Product } from '@/types';

// Hook to load sample data for testing without Supabase
export const useSampleData = () => {
  const { setProducts, setLoading, setError } = useStore();

  useEffect(() => {
    const fetchSampleData = async () => {
      try {
        setLoading(true);
        
        // Fetch sample data from the JSON file
        const response = await fetch('/sample-products.json');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Set products in the store
        setProducts(data as Product[]);
      } catch (error) {
        console.error('Error loading sample data:', error);
        setError('Failed to load sample data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSampleData();
  }, [setProducts, setLoading, setError]);

  return useStore((state) => ({
    products: state.products,
    isLoading: state.isLoading,
    error: state.error,
  }));
};