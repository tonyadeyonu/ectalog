'use client';

import { useEffect } from 'react';
import Layout from '@/components/Layout';
import FileUpload from '@/components/FileUpload';
import Filters from '@/components/Filters';
import ProductTable from '@/components/ProductTable';
// Import the Supabase hook for production
// import { useSupabaseData } from '@/hooks/useSupabaseData';
// Import the sample data hook for development/testing
import { useSampleData } from '@/hooks/useSampleData';
import { useStore } from '@/store';

export default function Home() {
  // Start with categorized data by default
  const { isLoading, error, dataSource, toggleDataSource } = useSampleData(true);
  const products = useStore(state => state.products);
  const resetToOriginal = useStore(state => state.resetToOriginal);

  return (
    <Layout>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap gap-4">
            <FileUpload />
            
            <div className="flex space-x-4">
              <button
                onClick={resetToOriginal}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md shadow-sm transition-colors"
              >
                Reset Data
              </button>
              
              <button
                onClick={toggleDataSource}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition-colors"
              >
                {dataSource === 'categorized' 
                  ? 'Switch to Flat Data' 
                  : 'Switch to Categorized Data'}
              </button>
            </div>
          </div>
          
          <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-200">
            <h3 className="font-medium text-blue-800">Current Data Format</h3>
            <p className="text-sm text-blue-700">
              {dataSource === 'categorized' 
                ? 'Using categorized data structure where products are organized by category.' 
                : 'Using flat data structure with all products in a single list.'}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              You can upload either CSV files or JSON files. JSON files can be flat arrays or category-structured objects.
            </p>
          </div>
          
          {products.length > 0 && (
            <>
              <Filters />
              <ProductTable />
            </>
          )}
          
          {products.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
              <p className="mt-1 text-sm text-gray-500">
                Upload a CSV or JSON file, or wait for data to load from Supabase.
              </p>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}