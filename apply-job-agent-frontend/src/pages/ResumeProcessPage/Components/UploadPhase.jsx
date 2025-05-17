import React, { useState, useEffect } from 'react';

const UploadPhase = ({ handleUploadSubmit, handleFileChange, fileName, selectedFile }) => {
  const [fileError, setFileError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // Animation effect on component mount
  useEffect(() => {
    setAnimateIn(true);
  }, []);
  
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
    
    // Show success animation
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 2000);
  };
  
  // Enhanced submit with validation
  const validateAndSubmit = (e) => {
    if (fileError) {
      e.preventDefault();
      return;
    }
   
    handleUploadSubmit(e);
  };

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      // Create a synthetic event object
      const syntheticEvent = {
        target: {
          files: [file]
        }
      };
      validateAndHandleFileChange(syntheticEvent);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-500 transform ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      <div className="bg-[#F7F3E9] p-4 relative overflow-hidden border-b border-[#F46036]/20">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-[#F46036] rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-[#FF6B6B] rounded-full opacity-10 translate-x-1/4 translate-y-1/4"></div>
          <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-[#F46036] rounded-full opacity-5 animate-pulse"></div>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="relative z-10 flex items-center">
            <div className="mr-4">
              <div className="w-12 h-12 rounded-full bg-white bg-opacity-80 flex items-center justify-center shadow-lg backdrop-blur-sm transform transition-transform duration-300 hover:scale-110">
                <svg className="w-6 h-6 text-[#F46036]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#3E3E3E] tracking-tight">Resume Upload</h2>
              <p className="text-[#F46036] mt-1">Start your journey to finding the perfect job</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 bg-white">
        {/* Instructions and upload area */}
        <div className="mb-6">
          <p className="text-[#3E3E3E]/70 text-sm mb-6">
            Start by uploading your resume as a PDF file. Our AI will analyze your skills and experience to find matching jobs.
          </p>
          
          {/* Upload area with drag and drop */}
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${
              isDragging ? 'border-[#F46036] bg-[#F7F3E9] scale-[1.01] shadow-md' : 
              fileName ? 'border-[#F46036]/60 bg-[#F7F3E9]/30' : 
              'border-[#F46036]/30 hover:border-[#F46036]/60 bg-[#F7F3E9]/10 hover:bg-[#F7F3E9]/20'
            } ${fileError ? 'border-red-500 bg-red-50/30' : ''}`}
          >
            <input 
              type="file" 
              id="resume" 
              accept=".pdf" 
              onChange={validateAndHandleFileChange} 
              className="hidden"
            />
            
            {!fileName ? (
              <div className="flex flex-col items-center justify-center text-center py-8">
                <div className="w-20 h-20 mb-4 bg-[#F7F3E9] rounded-xl flex items-center justify-center transform transition-transform duration-300 group hover:scale-110 hover:bg-[#F7F3E9] shadow-md">
                  <svg className="w-8 h-8 text-[#F46036] group-hover:text-[#FF6B6B] transition-colors duration-300" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24" 
                       xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="font-medium text-lg text-[#3E3E3E]">Drag & Drop Your Resume</h3>
                <p className="text-[#3E3E3E]/70 mt-2 max-w-lg mx-auto text-sm">
                  Drag and drop your PDF resume, or click the button below to browse your files
                </p>
                <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => document.getElementById('resume').click()}
                    className="px-5 py-2.5 bg-[#F46036] hover:bg-[#FF6B6B] text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    Browse Files
                  </button>
                  <span className="text-xs text-[#3E3E3E]/60 flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-[#F46036]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    PDF files only (Max size: 10MB)
                  </span>
                </div>
              </div>
            ) : (
              <div className="relative p-2">
                {/* Success animation overlay */}
                {uploadSuccess && (
                  <div className="absolute inset-0 bg-green-50/80 rounded-lg flex items-center justify-center z-10 animate-fade-out">
                    <div className="bg-white rounded-full p-3 shadow-lg">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-2">
                  <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-[#F7F3E9] border border-[#F46036]/20 flex items-center justify-center shadow-sm">
                    <svg className="w-8 h-8 text-[#F46036]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div>
                        <h4 className="text-[#3E3E3E] font-medium truncate max-w-xs">
                          {fileName}
                        </h4>
                        <p className="text-[#3E3E3E]/60 text-xs mt-1">
                          PDF file selected and ready for analysis
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            document.getElementById('resume').click();
                          }} 
                          className="text-xs bg-white border border-[#F46036]/20 text-[#F46036] px-3 py-1.5 rounded-md hover:bg-[#F7F3E9]/50 transition-colors transform hover:-translate-y-0.5 hover:shadow-sm duration-300 flex items-center"
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Replace
                        </button>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full h-1 bg-[#F7F3E9] rounded-full mt-3 overflow-hidden">
                      <div className="bg-[#F46036] h-1 rounded-full w-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {fileError && (
            <div className="mt-3 flex items-center text-red-500 text-sm animate-fadeIn">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {fileError}
            </div>
          )}
        </div>

        {/* Submit button - only show when file is selected */}
        {selectedFile && !fileError && (
          <div className="mb-4">
            <button 
              type="button" 
              onClick={validateAndSubmit}
              className="w-full sm:w-auto py-3 px-6 bg-[#F46036] hover:bg-[#FF6B6B] text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Resume Analysis
            </button>
          </div>
        )}

        {/* Feature cards */}
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#F7F3E9]/30 rounded-xl p-4 hover:shadow-md transition-shadow duration-300 border border-[#F7F3E9] group hover:border-[#F46036]/20">
              <div className="w-10 h-10 rounded-lg bg-[#F46036]/10 flex items-center justify-center text-[#F46036] mb-3 group-hover:bg-[#F46036]/20 transition-colors duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-medium text-[#3E3E3E] mb-1">Fast Analysis</h3>
              <p className="text-xs text-[#3E3E3E]/70">
                Our AI analyzes your resume in seconds, extracting skills, experience, and qualifications
              </p>
            </div>
            
            <div className="bg-[#F7F3E9]/30 rounded-xl p-4 hover:shadow-md transition-shadow duration-300 border border-[#F7F3E9] group hover:border-[#F46036]/20">
              <div className="w-10 h-10 rounded-lg bg-[#F46036]/10 flex items-center justify-center text-[#F46036] mb-3 group-hover:bg-[#F46036]/20 transition-colors duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-medium text-[#3E3E3E] mb-1">100% Secure</h3>
              <p className="text-xs text-[#3E3E3E]/70">
                Your data is encrypted and never shared with third parties
              </p>
            </div>
            
            <div className="bg-[#F7F3E9]/30 rounded-xl p-4 hover:shadow-md transition-shadow duration-300 border border-[#F7F3E9] group hover:border-[#F46036]/20">
              <div className="w-10 h-10 rounded-lg bg-[#F46036]/10 flex items-center justify-center text-[#F46036] mb-3 group-hover:bg-[#F46036]/20 transition-colors duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-medium text-[#3E3E3E] mb-1">Smart Matching</h3>
              <p className="text-xs text-[#3E3E3E]/70">
                Advanced algorithms match your profile with thousands of job listings
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPhase;