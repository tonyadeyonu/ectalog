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
  imageUrl?: string;
  technicalDetails?: string;
  applications?: string[];
  badges?: string[];
  item_number?: string;
  url?: string;
  // Add any additional fields as needed
}

// CSV upload related types
export interface CSVRow {
  [key: string]: string | number | boolean | null;
}

// New JSON structure types
export interface CategoryProducts {
  [category: string]: Product[];
}

// Store state type
export interface StoreState {
  // Original data from Supabase
  originalProducts: Product[];
  // Current edited data
  products: Product[];
  // Selected product for detailed view
  selectedProduct: Product | null;
  // Loading states
  isLoading: boolean;
  error: string | null;
  // Actions
  setProducts: (products: Product[]) => void;
  setProductsFromCategoryStructure: (categoryData: CategoryProducts) => void;
  resetToOriginal: () => void;
  updateProduct: (updatedProduct: Product) => void;
  setSelectedProduct: (product: Product | null) => void;
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