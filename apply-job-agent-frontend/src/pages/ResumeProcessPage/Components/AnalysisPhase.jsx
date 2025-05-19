import React, { useState, useEffect } from 'react';
import AnalysisLoading from './AnalysisLoading';
import AnalysisResults from './AnalysisResults';

const AnalysisPhase = ({ isAnalyzing, analysis, handleFindJobs, handleGoBack }) => {
  const [animateIn, setAnimateIn] = useState(false);
  
  // Animation effect on component mount
  useEffect(() => {
    setAnimateIn(true);
  }, []);

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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#3E3E3E] tracking-tight">Resume Analysis</h2>
                <p className="text-[#F46036] mt-1">Highlighting your unique professional story</p>
              </div>
          </div>
          {!isAnalyzing && (
            <button
              onClick={handleGoBack}
              className="justify-center bg-white border border-[#F46036]/30 hover:bg-[#F7F3E9] text-[#3E3E3E] px-3 py-1.5 rounded-lg text-sm transition-all duration-300 flex items-center transform hover:-translate-y-0.5 hover:shadow-md"
            >
              <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
          )}
        </div>
      </div>
      
      <div className="p-6 bg-white">
        {isAnalyzing ? (
          <AnalysisLoading />
        ) : (
          <AnalysisResults 
            analysis={analysis} 
            handleFindJobs={handleFindJobs}
            handleGoBack={handleGoBack}
          />
        )}
      </div>
    </div>
  );
};

export default AnalysisPhase;