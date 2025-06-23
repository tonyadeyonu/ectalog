'use client';

import { useEffect } from 'react';
import Layout from '@/components/Layout';
import Filters from '@/components/Filters';
import ProductTable from '@/components/ProductTable';
import { useSupplierData } from '@/hooks/useSupplierData';
import { useSupplierTheme } from '@/hooks/useSupplierTheme';

export default function Home() {
  const { isLoading, error, products } = useSupplierData();
  const { supplierName } = useSupplierTheme();

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
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">{supplierName} Product Catalog</h1>
            <p className="text-gray-600">
              Browse our complete range of high-quality ingredients and products.
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products available</h3>
              <p className="mt-1 text-sm text-gray-500">
                Please check back later for our updated product catalog.
              </p>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}