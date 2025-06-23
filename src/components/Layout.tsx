import React from 'react';
import Navbar from './Navbar';
import { useSupplierTheme } from '@/hooks/useSupplierTheme';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { supplierName, getCssVariables, contactEmail, website } = useSupplierTheme();
  
  return (
    <div 
      className="min-h-screen flex flex-col bg-gray-50"
      style={getCssVariables()}
    >
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="bg-gray-100 border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <div>&copy; {new Date().getFullYear()} {supplierName}</div>
            {contactEmail && (
              <div>
                <a 
                  href={`mailto:${contactEmail}`}
                  className="text-blue-600 hover:underline"
                >
                  Contact Us
                </a>
              </div>
            )}
            {website && (
              <div>
                <a 
                  href={website}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Our Website
                </a>
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;