import React, { useMemo } from 'react';
import { useStore } from '@/store';

const Filters: React.FC = () => {
  const { products, filters, setFilter, setSearchTerm, clearFilters } = useStore();
  
  // Extract unique categories and suppliers from products
  const categories = useMemo(() => {
    const uniqueCategories = new Set(products.map(product => product.category));
    return Array.from(uniqueCategories).filter(Boolean).sort();
  }, [products]);
  
  const suppliers = useMemo(() => {
    const uniqueSuppliers = new Set(products.map(product => product.supplier));
    return Array.from(uniqueSuppliers).filter(Boolean).sort();
  }, [products]);
  
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Category Filter */}
        <div className="w-full md:w-auto">
          <select
            value={filters.category || ''}
            onChange={(e) => setFilter('category', e.target.value === '' ? null : e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        {/* Supplier Filter */}
        <div className="w-full md:w-auto">
          <select
            value={filters.supplier || ''}
            onChange={(e) => setFilter('supplier', e.target.value === '' ? null : e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All Suppliers</option>
            {suppliers.map((supplier) => (
              <option key={supplier} value={supplier}>
                {supplier}
              </option>
            ))}
          </select>
        </div>
        
        {/* Clear Filters Button */}
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default Filters;