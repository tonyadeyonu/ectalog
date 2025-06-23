import React from 'react';
import Navbar from './Navbar';
import Link from 'next/link';
import { useSupplierTheme } from '@/hooks/useSupplierTheme';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
  supplierId?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, supplierId }) => {
  const { 
    supplierName, 
    getCssVariables, 
    contactEmail, 
    contactPhone,
    website, 
    primaryColor,
    secondaryColor,
    isDefaultTheme 
  } = useSupplierTheme(supplierId);
  
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  
  // Create custom footer styles based on supplier theme
  const footerStyle = {
    borderTopColor: primaryColor,
    borderTopWidth: '3px',
  };
  
  // Text style with supplier's primary color
  const footerLinkStyle = {
    color: primaryColor,
  };
  
  return (
    <div 
      className="min-h-screen flex flex-col bg-gray-50"
      style={getCssVariables()}
    >
      <Navbar supplierId={supplierId} />
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      <footer 
        className="bg-gray-100 border-t py-4"
        style={footerStyle}
      >
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          {/* Default theme footer (Home page) */}
          {isDefaultTheme ? (
            <>
              <div className="mb-3 font-medium text-base">&copy; {currentYear} {supplierName}</div>
              <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                <div>
                  <a 
                    href="mailto:hshahzad0277@gmail.com"
                    className="text-blue-600 hover:underline"
                    style={footerLinkStyle}
                  >
                    Contact Us
                  </a>
                </div>
                <div>
                  <Link 
                    href="/brake"
                    className="text-blue-600 hover:underline"
                    style={footerLinkStyle}
                  >
                    Brakes Catalog
                  </Link>
                </div>
                <div>
                  <Link 
                    href="/webstaurant"
                    className="text-blue-600 hover:underline"
                    style={footerLinkStyle}
                  >
                    Webstaurant Catalog
                  </Link>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                Powered by eCatalog Project - A catalog solution for suppliers
              </div>
            </>
          ) : (
            <>
              {/* Supplier-specific footer */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                {/* Company info */}
                <div>
                  <h3 className="text-base font-semibold mb-2" style={{color: primaryColor}}>
                    {supplierName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    &copy; {currentYear} {supplierName}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    All product information and specifications are subject to change.
                  </p>
                </div>
                
                {/* Contact */}
                <div>
                  <h3 className="text-base font-semibold mb-2" style={{color: primaryColor}}>
                    Contact Information
                  </h3>
                  {contactEmail && (
                    <p className="text-sm text-gray-500 mb-1">
                      <a 
                        href={`mailto:${contactEmail}`}
                        className="hover:underline"
                        style={footerLinkStyle}
                      >
                        {contactEmail}
                      </a>
                    </p>
                  )}
                  {contactPhone && (
                    <p className="text-sm text-gray-500 mb-1">
                      {contactPhone}
                    </p>
                  )}
                  {website && (
                    <p className="text-sm text-gray-500 mb-1">
                      <a 
                        href={website}
                        className="hover:underline"
                        style={footerLinkStyle}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Our Website
                      </a>
                    </p>
                  )}
                </div>
                
                {/* Links */}
                <div>
                  <h3 className="text-base font-semibold mb-2" style={{color: primaryColor}}>
                    Quick Links
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">
                    <Link 
                      href="/"
                      className="hover:underline"
                      style={footerLinkStyle}
                    >
                      Back to Directory
                    </Link>
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    <Link 
                      href={pathname}
                      className="hover:underline"
                      style={footerLinkStyle}
                    >
                      Refresh Catalog
                    </Link>
                  </p>
                </div>
              </div>
              
              <div className="mt-6 pt-3 text-xs text-gray-500 border-t border-gray-200">
                Powered by eCatalog Project - A catalog solution for suppliers
              </div>
            </>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Layout;