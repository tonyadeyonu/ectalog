import React from 'react';
import { useSupplierTheme } from '@/hooks/useSupplierTheme';
import Image from 'next/image';

const Navbar: React.FC = () => {
  const { supplierName, logoUrl, primaryColor, secondaryColor } = useSupplierTheme();
  
  // Create a dynamic gradient style based on theme colors
  const navStyle = {
    background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
  };
  
  return (
    <nav className="text-white shadow-md" style={navStyle}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {logoUrl ? (
            <div className="h-10 w-10 relative">
              <Image 
                src={logoUrl} 
                alt={supplierName}
                fill
                className="object-contain" 
                sizes="40px"
              />
            </div>
          ) : (
            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-xl font-bold" style={{color: primaryColor}}>
              {supplierName.charAt(0)}
            </div>
          )}
          <div>
            <span className="font-bold text-xl">{supplierName}</span>
            <div className="text-gray-100 text-sm">Product Catalog</div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;