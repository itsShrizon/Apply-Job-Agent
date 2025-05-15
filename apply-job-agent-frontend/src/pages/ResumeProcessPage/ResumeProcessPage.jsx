import React from 'react';
import { useProcessContext } from '../../Contexts/ProcessIndicator.jsx';
import { useResumeProcessContext } from '../../Contexts/ResumeProcessContext.jsx';

import ResumeData from './Components/ResumeData.jsx'; // Adjust the import path as necessary

// Import components
import UploadPhase from './Components/UploadPhase';
import AnalysisPhase from './Components/AnalysisPhase';
import JobsPhase from './Components/JobsPhase';
import { useAuth } from '../../Contexts/AuthContext.jsx';

const ResumeJobFlow = () => {
  // Get process context for the indicator UI
  const { currentPhase, ProcessIndicatorUI } = useProcessContext();
  const { currentUser } = useAuth();
  
  // Get resume process context for all functionality
  const {
    selectedFile,
    fileName,
    isAnalyzing,
    analysis,
    jobs,
    handleFileChange,
    handleUploadSubmit,
    handleFindJobs,
    handleGoBack,
    isLoadingJobs
  } = useResumeProcessContext();

  // Render appropriate UI based on current phase
  const renderPhaseContent = () => {
    switch (currentPhase) {
      case 'upload':
        return (
          <UploadPhase 
            handleUploadSubmit={handleUploadSubmit} 
            handleFileChange={handleFileChange} 
            fileName={fileName} 
            selectedFile={selectedFile}
          />
        );
        
      case 'analyze':
        // Only show analysis phase if user is logged in
        return (
          currentUser ? (
            <AnalysisPhase 
              isAnalyzing={isAnalyzing}
              analysis={analysis}
              handleFindJobs={handleFindJobs}
              handleGoBack={handleGoBack}
            />
          ) : (
            <UploadPhase 
              handleUploadSubmit={handleUploadSubmit} 
              handleFileChange={handleFileChange} 
              fileName={fileName} 
              selectedFile={selectedFile}
            />
          )
        );
        
      case 'findJobs':
        // Only show jobs phase if user is logged in
        return (
          currentUser ? (
            <JobsPhase 
              jobs={jobs}
              isLoading={isLoadingJobs}
              handleGoBack={handleGoBack}
              isPremium={false} // Assuming this is a prop to be passed, adjust as necessary
            />
          ) : (
            <UploadPhase 
              handleUploadSubmit={handleUploadSubmit} 
              handleFileChange={handleFileChange} 
              fileName={fileName} 
              selectedFile={selectedFile}
            />
          )
        );
        
      default:
        return (
          <UploadPhase 
            handleUploadSubmit={handleUploadSubmit} 
            handleFileChange={handleFileChange} 
            fileName={fileName} 
            selectedFile={selectedFile}
          />
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Show the existing process indicator from context */}
      <ProcessIndicatorUI />
      
      {/* Main content */}
      <div className="mt-8">
        {renderPhaseContent()}
        <div>
          {/* <ResumeData /> */}
        </div>
      </div>
    </div>
  );
};

export default ResumeJobFlow;