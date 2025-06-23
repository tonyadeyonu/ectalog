import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/store';
import { Product } from '@/types';

// Hook to load data from Supabase
export const useSupabaseData = () => {
  const { setProducts, setLoading, setError } = useStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch products from Supabase
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('updatedAt', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        // Set products in the store
        setProducts(data as Product[]);
      } catch (error) {
        console.error('Error loading products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [setProducts, setLoading, setError]);

  return useStore((state) => ({
    products: state.products,
    isLoading: state.isLoading,
    error: state.error,
  }));
};