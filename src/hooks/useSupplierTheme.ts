import { useState, useEffect } from 'react';

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
}

export const useSupplierTheme = () => {
  const [theme, setTheme] = useState<SupplierTheme>({
    supplierName: 'Supplier Catalog',
    primaryColor: '#1e40af',
    secondaryColor: '#047857',
    tertiaryColor: '#d97706',
    logoUrl: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await fetch('/supplier-data/config.json');
        
        if (!response.ok) {
          throw new Error(`Error loading supplier config: ${response.status}`);
        }
        
        const data = await response.json();
        
        setTheme({
          supplierName: data.supplier_name || 'Supplier Catalog',
          primaryColor: data.primary_color || '#1e40af',
          secondaryColor: data.secondary_color || '#047857',
          tertiaryColor: data.tertiary_color || '#d97706',
          logoUrl: data.logo_url || '',
          contactEmail: data.contact_email || '',
          contactPhone: data.contact_phone || '',
          website: data.website || '',
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error('Error loading supplier theme:', error);
        setTheme(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load supplier theme'
        }));
      }
    };

    fetchTheme();
  }, []);

  // Function to generate CSS variables for the theme
  const getCssVariables = () => {
    return {
      '--primary-color': theme.primaryColor,
      '--secondary-color': theme.secondaryColor,
      '--tertiary-color': theme.tertiaryColor,
    } as React.CSSProperties;
  };

  return {
    ...theme,
    getCssVariables
  };
};