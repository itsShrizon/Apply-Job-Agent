import React from 'react';

const AnalysisLoading = () => {
  return (
    <div className="py-8 flex flex-col items-center">
      <div className="relative">
        {/* Document svg with flashing scan line */}
        <div className="w-24 h-32 border border-indigo-200 rounded-md relative bg-white flex items-center justify-center">
          <div className="absolute w-full h-0.5 bg-indigo-400 top-1/2 transform -translate-y-1/2 opacity-50 animate-pulse"></div>
          <div className="w-16 h-24 border border-gray-200 rounded bg-gray-50"></div>
        </div>
        
        {/* Animated dots around the document - fewer and smaller */}
        <div className="absolute top-0 right-0 w-2 h-2 bg-indigo-400 rounded-full animate-ping" style={{ animationDelay: '0.1s', animationDuration: '1.5s' }}></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.7s', animationDuration: '1.8s' }}></div>
        <div className="absolute top-0 left-0 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.2s', animationDuration: '1.9s' }}></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-indigo-400 rounded-full animate-ping" style={{ animationDelay: '0.8s', animationDuration: '1.6s' }}></div>
      </div>
      
      <div className="mt-6 text-center max-w-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Analyzing Your Resume</h3>
        <p className="text-gray-600 text-sm">
          Our AI is extracting your skills, experience, and qualifications to match you with the perfect job opportunities
        </p>
        
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
            </div>
            <span className="text-xs text-gray-600">Scanning document structure</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
            </div>
            <span className="text-xs text-gray-600">Extracting key skills and experience</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
            </div>
            <span className="text-xs text-gray-600">Matching with job opportunities</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisLoading;