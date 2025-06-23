'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Supplier } from '@/types';

export default function HomeClientPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/supplier-data/suppliers.json');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setSuppliers(data);
      } catch (error) {
        console.error('Error loading suppliers:', error);
        setError('Failed to load suppliers. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

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
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-3">eCatalog Project</h1>
            <div className="space-y-2 text-gray-600">
              <p>
                Welcome to our collection of digital product catalogs for ingredient vendors and suppliers.
              </p>
              <p>
                This platform hosts interactive eCatalogs previously created for different food and restaurant suppliers, 
                allowing you to browse, search, and export their product inventories.
              </p>
              <p className="mt-4 font-medium">
                Select a supplier below to browse their product catalog:
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map((supplier) => (
              <Link 
                href={`/${supplier.id}`} 
                key={supplier.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold mb-2">{supplier.name}</h2>
                <p className="text-gray-600 mb-4">{supplier.description}</p>
                <div className="text-blue-600 font-medium">View Catalog →</div>
              </Link>
            ))}
          </div>
          
          {suppliers.length === 0 && !isLoading && (
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">No suppliers available</h3>
              <p className="mt-1 text-sm text-gray-500">
                Please check back later for our updated supplier directory.
              </p>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}