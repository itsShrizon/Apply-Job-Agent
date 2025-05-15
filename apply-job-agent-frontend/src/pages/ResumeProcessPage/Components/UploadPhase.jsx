import React, { useState } from 'react';
import ResumeData from './ResumeData';
 // Assuming this is the correct path for the Login component

const UploadPhase = ({ handleUploadSubmit, handleFileChange, fileName, selectedFile }) => {
  const [fileError, setFileError] = useState('');
   // Assuming openModal is a function to show the login modal
   // Placeholder for login state, replace with actual logic
  // Enhanced file change handler with validation
  const validateAndHandleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError(''); // Reset error
    
    // Check if file exists
    if (!file) {
      return;
    }
    
    // Check file type
    if (file.type !== 'application/pdf') {
      setFileError('Please select a valid PDF file');
      return;
    }
    
    // Check file size (10MB = 10 * 1024 * 1024 bytes)
    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size exceeds 10MB limit');
      return;
    }
    
    // If validation passes, call the original handler
    handleFileChange(e);
  };
  
  // Enhanced submit with validation
  const validateAndSubmit = (e) => {
    if (fileError) {
      e.preventDefault();
      return;
    }
   
    handleUploadSubmit(e);
  };

  return (
    <>
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
        <h2 className="text-2xl font-semibold text-white">Resume Scanner</h2>
        <p className="text-indigo-100 mt-1 text-sm">Upload your CV and let AI find your perfect career match</p>
      </div>
      
      <form onSubmit={validateAndSubmit} className="p-4">
        <label 
          htmlFor="resume" 
          className={`block border border-dashed rounded-lg p-6 transition-all cursor-pointer ${
            fileName ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 bg-gray-50'
          } ${fileError ? 'border-red-400 bg-red-50' : ''}`}
        >
          <input 
            type="file" 
            id="resume" 
            accept=".pdf" 
            onChange={validateAndHandleFileChange} 
            className="hidden"
          />
          
          {!fileName ? (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <span className="text-indigo-600 font-medium text-sm hover:text-indigo-800 transition-colors block">
                  Upload Resume
                </span>
                <p className="text-gray-500 text-xs mt-1">Drag & drop your PDF resume or click anywhere in this box</p>
                <div className="text-xs text-gray-400 mt-1">
                  PDF files only (Max size: 10MB)
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-grow">
                <span className="text-indigo-600 font-medium text-sm block">{fileName}</span>
                <p className="text-gray-500 text-xs mt-1">PDF file selected</p>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById('resume').click();
                  }} 
                  className="text-xs text-indigo-600 hover:text-indigo-800 mt-1 underline"
                >
                  Replace file
                </button>
              </div>
            </div>
          )}
        </label>
        
        {fileError && (
          <div className="mt-2 text-red-500 text-sm">{fileError}</div>
        )}
        
        <div className="mt-4">
          <button 
            type="submit" 
            disabled={!selectedFile || fileError}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium text-sm transition-all ${
              selectedFile && !fileError
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-sm' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}  
          >
            
            {selectedFile ? 'Analyze My Resume' : 'Upload a Resume to Begin'}
          </button>
        </div>
      </form>

{/* =============test====================== */}

    </div>
    
    <div className="mt-4">
      <ResumeData />  {/* Assuming this is the correct path for the ResumeData component */}
    </div>
    
    </>
  );
};

export default UploadPhase;