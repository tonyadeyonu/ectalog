import React, { useRef, useMemo, useState, useEffect } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnDef
} from '@tanstack/react-table';
import { useStore } from '@/store';
import { Product } from '@/types';
import { usePdfExport } from '@/hooks/usePdfExport';
import { useSupplierTheme } from '@/hooks/useSupplierTheme';
import ProductDetail from './ProductDetail';

const ProductTable: React.FC = () => {
  const { products, filters, updateProduct, setSelectedProduct } = useStore();
  const tableRef = useRef<HTMLDivElement>(null);
  const { exportToPdf } = usePdfExport();
  const { tertiaryColor } = useSupplierTheme();
  const [data, setData] = useState<Product[]>([]);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  // Filter products based on search term and selected filters
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = filters.searchTerm
        ? Object.values(product).some(
            value => 
              value && 
              value.toString().toLowerCase().includes(filters.searchTerm.toLowerCase())
          )
        : true;
        
      const matchesCategory = filters.category
        ? product.category === filters.category
        : true;
        
      const matchesSupplier = filters.supplier
        ? product.supplier === filters.supplier
        : true;
        
      return matchesSearch && matchesCategory && matchesSupplier;
    });
  }, [products, filters]);

  useEffect(() => {
    setData(filteredProducts);
  }, [filteredProducts]);

  // Removed edit functionality as users should not be able to edit rows

  const handleExportClick = async () => {
    try {
      const filename = await exportToPdf(filteredProducts, tableRef);
      console.log(`PDF exported successfully as ${filename}`);
    } catch (error) {
      console.error('Failed to export PDF:', error);
    }
  };

  const handleRowClick = (product: Product) => {
    setDetailProduct(product);
  };

  const handleDetailClose = () => {
    setDetailProduct(null);
  };

  const handleViewDetailsClick = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setDetailProduct(product);
  };

  // Create a column helper
  const columnHelper = createColumnHelper<Product>();

  // Define columns
  const columns = useMemo<ColumnDef<Product>[]>(() => [
    columnHelper.accessor('name', {
      header: 'Product Name',
      cell: info => {
        const value = info.getValue();
        const hasImage = !!info.row.original.imageUrl;
        
        return (
          <div className="p-1 flex items-center">
            {hasImage && (
              <span className="mr-2 text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
            )}
            {value}
          </div>
        );
      },
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: info => {
        const value = info.getValue();
        
        return (
          <div 
            className="p-1 truncate max-w-xs" 
            title={value}
          >
            {value}
          </div>
        );
      },
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      cell: info => {
        const value = info.getValue();
        
        return (
          <div className="p-1">
            {value}
          </div>
        );
      },
    }),
    columnHelper.accessor('supplier', {
      header: 'Supplier',
      cell: info => {
        const value = info.getValue();
        
        return (
          <div className="p-1">
            {value}
          </div>
        );
      },
    }),
    columnHelper.accessor('price', {
      header: 'Price',
      cell: info => {
        const value = info.getValue();
        const displayValue = value !== undefined && typeof value === 'number' ? `$${value.toFixed(2)}` : (value || '');
        
        return (
          <div className="p-1">
            {displayValue}
          </div>
        );
      },
    }),
    columnHelper.accessor('unit', {
      header: 'Unit',
      cell: info => {
        const value = info.getValue();
        
        return (
          <div className="p-1">
            {value}
          </div>
        );
      },
    }),
    columnHelper.accessor('available', {
      header: 'Available',
      cell: info => {
        const value = info.getValue();
        
        return (
          <div className="flex justify-center">
            {value ? (
              <span className="inline-flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span>Yes</span>
              </span>
            ) : (
              <span className="inline-flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                <span>No</span>
              </span>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor('id', {
      header: 'Actions',
      cell: info => {
        const product = info.row.original;
        
        return (
          <div className="flex justify-center space-x-2" onClick={e => e.stopPropagation()}>
            <button
              onClick={(e) => handleViewDetailsClick(product, e)}
              className="p-1 text-blue-600 hover:text-blue-800"
              title="View Details"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        );
      },
    }),
  ], []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">
          Products ({filteredProducts.length})
        </h2>
        
        <button
          onClick={handleExportClick}
          className="px-4 py-2 hover:opacity-90 text-white rounded-md shadow-sm transition-colors flex items-center space-x-2"
          style={{ backgroundColor: tertiaryColor }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
          </svg>
          <span>Export PDF</span>
        </button>
      </div>
      
      <div ref={tableRef} className="flex-1 border border-gray-300 rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th 
                      key={header.id}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map(row => (
                <tr 
                  key={row.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(row.original)}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                    filteredProducts.length
                  )}
                </span>{' '}
                of <span className="font-medium">{filteredProducts.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-gray-500 mt-2">
        Click on a row or the view button to see detailed product information.
      </div>

      {detailProduct && (
        <ProductDetail 
          product={detailProduct} 
          onClose={handleDetailClose} 
        />
      )}
    </div>
  );
};

export default ProductTable;