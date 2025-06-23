import React, { useRef, useState } from 'react';
import { useCsvUpload } from '@/hooks/useCsvUpload';
import { useJsonUpload } from '@/hooks/useJsonUpload';

const FileUpload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handleCsvUpload } = useCsvUpload();
  const { handleJsonUpload } = useJsonUpload();
  const [fileName, setFileName] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    setIsUploading(true);
    setUploadError(null);
    
    try {
      if (file.name.toLowerCase().endsWith('.csv')) {
        await handleCsvUpload(file);
      } else if (file.name.toLowerCase().endsWith('.json')) {
        await handleJsonUpload(file);
      } else {
        setUploadError('Unsupported file format. Please upload a CSV or JSON file.');
      }
    } catch (error: any) {
      console.error('Error uploading file:', error);
      setUploadError(`Error uploading file: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv,.json"
          className="hidden"
        />
        <button
          onClick={handleButtonClick}
          disabled={isUploading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition-colors flex items-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
        </button>
        
        {fileName && (
          <span className="text-sm text-gray-600">
            {fileName}
          </span>
        )}
      </div>
      
      {uploadError && (
        <div className="mt-2 text-red-600 text-sm">
          {uploadError}
        </div>
      )}
      
      <div className="mt-2 text-xs text-gray-500">
        Upload a CSV or JSON file with product data:
        <ul className="list-disc ml-4 mt-1">
          <li>CSV: Include columns for name, description, category, supplier, price, unit, and available.</li>
          <li>JSON: Either an array of products or a structure where the top-level keys are categories.</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;