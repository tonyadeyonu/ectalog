// Define the base ingredient product type
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  supplier: string;
  price?: number;
  unit?: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
  // Add any additional fields as needed
}

// CSV upload related types
export interface CSVRow {
  [key: string]: string | number | boolean | null;
}

// Store state type
export interface StoreState {
  // Original data from Supabase
  originalProducts: Product[];
  // Current edited data
  products: Product[];
  // Loading states
  isLoading: boolean;
  error: string | null;
  // Actions
  setProducts: (products: Product[]) => void;
  resetToOriginal: () => void;
  updateProduct: (updatedProduct: Product) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  // Filter state
  filters: {
    category: string | null;
    supplier: string | null;
    searchTerm: string;
  };
  setFilter: (key: string, value: string | null) => void;
  setSearchTerm: (term: string) => void;
  clearFilters: () => void;
}