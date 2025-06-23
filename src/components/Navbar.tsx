import React from 'react';
import { useStore } from '@/store';

const Navbar: React.FC = () => {
  const resetToOriginal = useStore((state) => state.resetToOriginal);
  
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-xl">eCatalog</span>
          <span className="text-blue-200 text-sm">Ingredient Supplier Showcase</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={resetToOriginal}
            className="px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded-md text-sm transition-colors"
          >
            Reset to Gold Copy
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;