import { useState, useEffect } from 'react';
import { Supplier } from '@/types';

interface SupplierTheme {
  supplierName: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  logoUrl: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  isLoading: boolean;
  error: string | null;
  isDefaultTheme?: boolean;
}

// Default theme for the eCatalog Project
const defaultTheme: SupplierTheme = {
  supplierName: 'eCatalog Project',
  primaryColor: '#4f46e5', // Indigo
  secondaryColor: '#0891b2', // Cyan
  tertiaryColor: '#f59e0b', // Amber
  logoUrl: '',
  contactEmail: 'hshahzad0277@gmail.com',
  contactPhone: '',
  website: '',
  isLoading: false,
  error: null,
  isDefaultTheme: true
};

export const useSupplierTheme = (supplierId?: string) => {
  const [theme, setTheme] = useState<SupplierTheme>({
    ...defaultTheme,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const fetchTheme = async () => {
      // If we're on the home page (no supplierId), use the default theme
      if (!supplierId) {
        setTheme({
          ...defaultTheme,
          isLoading: false
        });
        return;
      }
      
      try {
        // First, fetch the suppliers list to get the correct config file
        const suppliersResponse = await fetch('/supplier-data/suppliers.json');
        
        if (!suppliersResponse.ok) {
          throw new Error(`HTTP error! Status: ${suppliersResponse.status}`);
        }
        
        const suppliers = await suppliersResponse.json() as Supplier[];
        
        // Find the right supplier by ID
        const supplier = suppliers.find(s => s.id === supplierId);
        
        if (!supplier) {
          throw new Error(`Supplier not found: ${supplierId}`);
        }
        
        // Fetch data from the correct supplier config file
        const response = await fetch(`/supplier-data/${supplier.config_file}`);
        
        if (!response.ok) {
          throw new Error(`Error loading supplier config: ${response.status}`);
        }
        
        const data = await response.json();
        
        setTheme({
          supplierName: data.supplier_name || supplier.name,
          primaryColor: data.primary_color || '#1e40af',
          secondaryColor: data.secondary_color || '#047857',
          tertiaryColor: data.tertiary_color || '#d97706',
          logoUrl: data.logo_url || '',
          contactEmail: data.contact_email || '',
          contactPhone: data.contact_phone || '',
          website: data.website || '',
          isLoading: false,
          error: null,
          isDefaultTheme: false
        });
      } catch (error) {
        console.error('Error loading supplier theme:', error);
        setTheme({
          ...defaultTheme,
          isLoading: false,
          error: 'Failed to load supplier theme'
        });
      }
    };

    fetchTheme();
  }, [supplierId]);

  // Function to generate CSS variables for the theme
  const getCssVariables = () => {
    return {
      '--primary-color': theme.primaryColor,
      '--secondary-color': theme.secondaryColor,
      '--tertiary-color': theme.tertiaryColor,
      // Add more theme variables for components to use
      '--link-color': theme.primaryColor,
      '--button-color': theme.secondaryColor,
      '--heading-color': theme.isDefaultTheme ? '#111827' : theme.primaryColor,
      '--accent-color': theme.tertiaryColor,
    } as React.CSSProperties;
  };

  return {
    ...theme,
    getCssVariables
  };
};