import React from 'react';
import AnalysisLoading from './AnalysisLoading';
import AnalysisResults from './AnalysisResults';

const AnalysisPhase = ({ isAnalyzing, analysis, handleFindJobs, handleGoBack }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white">Resume Analysis</h2>
          <p className="text-indigo-100 mt-1 text-sm">Extracting your professional profile</p>
        </div>
        {!isAnalyzing && (
          <button
            onClick={handleGoBack}
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm transition flex items-center"
          >
            <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        )}
      </div>
      
      <div className="p-4">
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