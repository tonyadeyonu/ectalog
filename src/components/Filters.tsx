import React, { useMemo } from 'react';
import { useStore } from '@/store';
import { useSupplierTheme } from '@/hooks/useSupplierTheme';

const Filters: React.FC = () => {
  const { products, filters, setFilter, setSearchTerm, clearFilters } = useStore();
  const { primaryColor } = useSupplierTheme();
  
  // Extract unique categories from products
  const categories = useMemo(() => {
    const uniqueCategories = new Set(products.map(product => product.category));
    return Array.from(uniqueCategories).filter(Boolean).sort();
  }, [products]);
  
  // Create dynamic styles using supplier theme
  const buttonStyle = {
    backgroundColor: primaryColor,
    color: 'white',
  };
  
  const focusRingStyle = {
    '--ring-color': `${primaryColor}80`, // Add transparency for the ring
  } as React.CSSProperties;
  
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
        {/* Search Field */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={filters.searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
            style={focusRingStyle}
          />
        </div>
        
        {/* Category Filter */}
        <div className="w-full md:w-auto">
          <select
            value={filters.category || ''}
            onChange={(e) => setFilter('category', e.target.value === '' ? null : e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white"
            style={focusRingStyle}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        {/* Clear Filters Button */}
        <button
          onClick={clearFilters}
          className="px-4 py-2 hover:opacity-90 rounded-md transition-colors"
          style={buttonStyle}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default Filters;