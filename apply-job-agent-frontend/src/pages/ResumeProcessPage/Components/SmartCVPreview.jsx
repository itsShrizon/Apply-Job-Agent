import React from 'react';
import { useModal } from '../../../Contexts/ModalContext';
import { useCustomResume } from '../../../Contexts/CustomResumeContext';
import { activeTheme as theme } from '../../../Themes/theme';

const SmartCVPreview = () => {
  const { closeModal } = useModal();
  const { 
    generatedCV, 
    isGenerating, 
    error,
    downloadGeneratedCV,
  } = useCustomResume();

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-lg mx-auto">
      {/* Header */}
      <div 
        style={{ backgroundColor: theme.primary, borderBottomColor: theme.accent }}
        className="px-4 py-3 sm:px-6 sm:py-4 border-b"
      >
        <div className="flex justify-between items-center">
          <h3 style={{ color: theme.text }} className="font-semibold text-base sm:text-lg">Custom Resume Preview</h3>
        </div>
      </div>
      
      {/* CV Preview Content */}
      <div className="p-3 sm:p-5">
        <div 
          style={{ backgroundColor: theme.primaryLight, borderColor: theme.borderColor }}
          className="rounded-lg border p-2 mb-3"
        >
          {/* Loading State */}
          {isGenerating && (
            <div className="bg-white w-full h-64 sm:h-80 flex items-center justify-center rounded">
              <div className="text-center">
                <div 
                  style={{ borderTopColor: theme.accent }}
                  className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-solid mx-auto"
                ></div>
                <p style={{ color: theme.text }} className="mt-3 text-sm sm:text-base">Generating your custom resume...</p>
                <p style={{ color: theme.textTertiary }} className="text-xs mt-1">This may take a moment</p>
              </div>
            </div>
          )}
          
          {/* Error State */}
          {error && !isGenerating && (
            <div className="bg-white w-full h-64 sm:h-80 flex items-center justify-center rounded">
              <div className="text-center px-4">
                <svg 
                  style={{ color: theme.cta }}
                  className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                  />
                </svg>
                <p style={{ color: theme.cta }} className="font-medium mt-2 text-sm sm:text-base">Error generating custom resume</p>
                <p style={{ color: theme.textTertiary }} className="text-xs mt-1">{error}</p>
                <button 
                  style={{ backgroundColor: theme.primary, color: theme.text }}
                  className="mt-3 px-3 py-1.5 hover:bg-opacity-80 text-xs rounded transition"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
          
          {/* CV Preview When Available */}
          {!isGenerating && !error && generatedCV && (
            <div 
              style={{ borderColor: theme.borderColor }}
              className="bg-white w-full h-64 sm:h-80 overflow-auto rounded border"
            >
              {generatedCV.pdfUrl ? (
                <iframe 
                  src={generatedCV.pdfUrl} 
                  className="w-full h-full"
                  title="CV Preview"
                  frameBorder="0"
                ></iframe>
              ) : (
                <div className="p-4 flex items-center justify-center h-full">
                  <p style={{ color: theme.textTertiary }} className="text-sm sm:text-base">Custom resume preview not available</p>
                </div>
              )}
            </div>
          )}
          
          {/* Empty State - No CV Generated Yet and Not Loading */}
          {!isGenerating && !error && !generatedCV && (
            <div className="bg-white w-full h-64 sm:h-80 flex items-center justify-center rounded">
              <div className="text-center">
                <svg 
                  style={{ color: theme.accentMedium }}
                  className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
                <p style={{ color: theme.text }} className="mt-2 text-sm sm:text-base">CV Preview</p>
                <p style={{ color: theme.textTertiary }} className="text-xs mt-1">(Your custom resume will appear here)</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Description - Show only on larger screens */}
        <div className="space-y-2 hidden sm:block">
          <h4 style={{ color: theme.text }} className="font-medium text-base">
            {isGenerating ? 'Preparing Your Custom Resume...' : 'Your Custom Resume is Ready!'}
          </h4>
          <p style={{ color: theme.textSecondary }} className="text-sm">
            {isGenerating 
              ? "We're generating a professional resume based on your information and selected template." 
              : "We've created a professional resume that highlights your key skills and qualifications."}
          </p>
          
          {/* Features list - only show when not loading on larger screens */}
          {!isGenerating && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="flex items-start space-x-1.5">
                <svg 
                  style={{ color: theme.accent }}
                  className="w-4 h-4 mt-0.5 flex-shrink-0" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ color: theme.textSecondary }} className="text-xs">ATS-Friendly Format</span>
              </div>
              <div className="flex items-start space-x-1.5">
                <svg 
                  style={{ color: theme.accent }}
                  className="w-4 h-4 mt-0.5 flex-shrink-0" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ color: theme.textSecondary }} className="text-xs">Professional Design</span>
              </div>
              <div className="flex items-start space-x-1.5">
                <svg 
                  style={{ color: theme.accent }}
                  className="w-4 h-4 mt-0.5 flex-shrink-0" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ color: theme.textSecondary }} className="text-xs">Optimized Content</span>
              </div>
              <div className="flex items-start space-x-1.5">
                <svg 
                  style={{ color: theme.accent }}
                  className="w-4 h-4 mt-0.5 flex-shrink-0" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ color: theme.textSecondary }} className="text-xs">Industry-Standard Format</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer with action buttons */}
      <div style={{ backgroundColor: theme.primary }} className="px-3 py-3 sm:px-6 sm:py-4 flex justify-between">
        <button 
          onClick={closeModal}
          style={{ color: theme.text, borderColor: theme.accentMedium }}
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white border rounded text-xs sm:text-sm hover:bg-opacity-90 transition"
        >
          Close
        </button>
        
        <button 
          onClick={downloadGeneratedCV}
          disabled={isGenerating || !generatedCV}
          style={{ 
            backgroundColor: isGenerating || !generatedCV ? theme.disabledBg : theme.cta,
            color: isGenerating || !generatedCV ? theme.disabledText : '#FFFFFF'
          }}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded text-xs sm:text-sm font-medium ${
            isGenerating || !generatedCV ? 'cursor-not-allowed' : 'hover:opacity-90'
          }`}
        >
          <div className="flex items-center">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SmartCVPreview;