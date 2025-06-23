import { create } from 'zustand';
import { Product, StoreState } from '@/types';

// Create the store with Zustand
export const useStore = create<StoreState>((set) => ({
  // Data states
  originalProducts: [],
  products: [],
  
  // UI states
  isLoading: false,
  error: null,
  
  // Filter states
  filters: {
    category: null,
    supplier: null,
    searchTerm: '',
  },
  
  // Actions
  setProducts: (products: Product[]) => {
    set({ 
      originalProducts: products,
      products,
      isLoading: false,
    });
  },
  
  resetToOriginal: () => {
    set((state) => ({ 
      products: [...state.originalProducts],
      filters: {
        category: null,
        supplier: null,
        searchTerm: '',
      },
    }));
  },
  
  updateProduct: (updatedProduct: Product) => {
    set((state) => ({
      products: state.products.map(product => 
        product.id === updatedProduct.id ? updatedProduct : product
      ),
    }));
  },
  
  setError: (error: string | null) => set({ error }),
  
  setLoading: (isLoading: boolean) => set({ isLoading }),
  
  setFilter: (key: string, value: string | null) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    }));
  },
  
  setSearchTerm: (searchTerm: string) => {
    set((state) => ({
      filters: {
        ...state.filters,
        searchTerm,
      },
    }));
  },
  
  clearFilters: () => {
    set((state) => ({
      filters: {
        category: null,
        supplier: null,
        searchTerm: '',
      },
    }));
  },
}));