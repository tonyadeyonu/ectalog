import React from 'react';
import Image from 'next/image';
import { useStore } from '@/store';
import { Product } from '@/types';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose }) => {
  const { updateProduct } = useStore();
  const [imageError, setImageError] = React.useState(false);

  const handleInquiryClick = () => {
    const subject = encodeURIComponent(`Inquiry about ${product.name}`);
    
    const body = encodeURIComponent(`
I'm interested in learning more about the following product:

Product: ${product.name}
Category: ${product.category}
Supplier: ${product.supplier}

Please provide more information about availability, pricing, and any technical specifications.

Thank you,
`);
    
    window.open(`mailto:sales@example.com?subject=${subject}&body=${body}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{product.name}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4 h-80">
              {product.imageUrl && !imageError ? (
                <div className="relative w-full h-full">
                  <Image 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="object-contain rounded-md"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    onError={() => setImageError(true)}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2">No image available</p>
                </div>
              )}
            </div>
            
            {/* Product Details */}
            <div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Details</h3>
                  <dl className="mt-2 space-y-2">
                    <div className="grid grid-cols-3 gap-4">
                      <dt className="text-sm font-medium text-gray-500">Category</dt>
                      <dd className="text-sm text-gray-900 col-span-2">{product.category}</dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <dt className="text-sm font-medium text-gray-500">Supplier</dt>
                      <dd className="text-sm text-gray-900 col-span-2">{product.supplier}</dd>
                    </div>
                    {product.price !== undefined && (
                      <div className="grid grid-cols-3 gap-4">
                        <dt className="text-sm font-medium text-gray-500">Price</dt>
                        <dd className="text-sm text-gray-900 col-span-2">
                          ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price} {product.unit && `/ ${product.unit}`}
                        </dd>
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-4">
                      <dt className="text-sm font-medium text-gray-500">Availability</dt>
                      <dd className="text-sm text-gray-900 col-span-2 flex items-center">
                        {product.available ? (
                          <>
                            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                            <span>Out of Stock</span>
                          </>
                        )}
                      </dd>
                    </div>
                    
                    {product.item_number && (
                      <div className="grid grid-cols-3 gap-4">
                        <dt className="text-sm font-medium text-gray-500">Item Number</dt>
                        <dd className="text-sm text-gray-900 col-span-2">{product.item_number}</dd>
                      </div>
                    )}
                    
                    {product.badges && product.badges.length > 0 && (
                      <div className="grid grid-cols-3 gap-4">
                        <dt className="text-sm font-medium text-gray-500">Badges</dt>
                        <dd className="text-sm text-gray-900 col-span-2 flex flex-wrap gap-2">
                          {product.badges.map((badge, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {badge}
                            </span>
                          ))}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Description</h3>
                  <p className="mt-2 text-sm text-gray-600">{product.description}</p>
                </div>
                
                {product.technicalDetails && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Technical Details</h3>
                    <p className="mt-2 text-sm text-gray-600">{product.technicalDetails}</p>
                  </div>
                )}
                
                {product.applications && product.applications.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Applications</h3>
                    <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                      {product.applications.map((app, index) => (
                        <li key={index}>{app}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleInquiryClick}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition-colors"
                >
                  Send Inquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;