import { create } from 'zustand';
import { Product, StoreState, CategoryProducts } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Create the store with Zustand
export const useStore = create<StoreState>((set) => ({
  // Data states
  originalProducts: [],
  products: [],
  selectedProduct: null,
  
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
  
  setProductsFromCategoryStructure: (categoryData: CategoryProducts) => {
    // Convert category-structured data to flat array
    const products: Product[] = [];
    
    Object.entries(categoryData).forEach(([category, categoryProducts]) => {
      categoryProducts.forEach(product => {
        // Ensure each product has the category set correctly
        // and generate ID if not present
        // Process properties to ensure they match our expected format
        products.push({
          id: product.id || uuidv4(),
          name: product.name || '',
          description: product.description || '',
          category: category,
          supplier: product.supplier || (product as any).vendor || 'Unknown',
          price: typeof product.price === 'string' ? parseFloat((product.price as string).replace(/[^0-9.]/g, '')) : product.price,
          unit: product.unit || (product as any).pack_size || '',
          available: product.available !== undefined ? product.available : true,
          imageUrl: (product as any).image_url || product.imageUrl || (product as any).image || '',
          technicalDetails: (product as any).technical_details || product.technicalDetails || '',
          applications: Array.isArray(product.applications) ? product.applications : 
                     (product.applications ? [product.applications] : []),
          badges: product.badges || [],
          createdAt: product.createdAt || new Date().toISOString(),
          updatedAt: product.updatedAt || new Date().toISOString(),
        });
      });
    });
    
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
      selectedProduct: null,
    }));
  },
  
  updateProduct: (updatedProduct: Product) => {
    set((state) => ({
      products: state.products.map(product => 
        product.id === updatedProduct.id ? updatedProduct : product
      ),
      // If the updated product is the selected one, update it in the state
      selectedProduct: state.selectedProduct?.id === updatedProduct.id ? 
        updatedProduct : state.selectedProduct,
    }));
  },
  
  setSelectedProduct: (product: Product | null) => {
    set({ selectedProduct: product });
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