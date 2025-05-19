import React, { useState, useEffect } from 'react';
import { useProcessContext } from '../../Contexts/ProcessIndicator.jsx';
import { useResumeProcessContext } from '../../Contexts/ResumeProcessContext.jsx';
import { useAuth } from '../../Contexts/AuthContext.jsx';

// Import components
import UploadPhase from './Components/UploadPhase';
import AnalysisPhase from './Components/AnalysisPhase';
import JobsPhase from './Components/JobsPhase';
import ResumeData from './Components/ResumeData.jsx';
import Footer from './Components/Footer.jsx'
import ThreeDStepIndicator from './Components/ThreeDStepIndicator';


const ResumeJobFlow = () => {
  // Animation state
  const [animateIn, setAnimateIn] = useState(false);
  
  // Get process context for the indicator UI
  const { currentPhase } = useProcessContext();
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

  // Animation effect on component mount
  useEffect(() => {
    setAnimateIn(true);
    
    // Add subtle background animation
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      document.documentElement.style.setProperty('--mouse-x', x);
      document.documentElement.style.setProperty('--mouse-y', y);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Steps configuration
  const steps = [
    { 
      id: 'upload', 
      label: 'Upload Resume', 
      description: 'Upload your resume to begin',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      id: 'analyze', 
      label: 'Resume Analysis', 
      description: 'AI-powered skill extraction',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z" />
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      id: 'findJobs', 
      label: 'Job Matching', 
      description: 'Find suitable job openings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
          <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
        </svg>
      ) 
    },
  ];

  // Determine current step index
  const currentStepIndex = steps.findIndex(step => step.id === currentPhase);

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
    <div className={`transition-all duration-700 transform ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} relative`}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#F46036]/10 to-transparent rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#F46036]/5 to-transparent rounded-full blur-3xl -z-10"></div>
      
      {/* Hero section with enhanced typography */}
      <div className="mb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#F46036]/5 to-transparent rounded-full blur-xl -z-10 transform -translate-x-10"></div>
        <h1 className="text-4xl font-extrabold text-[#3E3E3E] tracking-tight relative">
          AI Resume <span className="text-[#F46036] relative">
            Assistant
            <div className="absolute bottom-0 left-0 w-full h-1 bg-[#F46036] opacity-30"></div>
          </span>
        </h1>
        <p className="text-[#3E3E3E]/80 mt-3 max-w-xl text-lg leading-relaxed">
          Let our advanced AI analyze your resume and find the perfect job opportunities 
          that match your skills and experience.
        </p>
      </div>
      
      {/* Process indicator - Now using our 3D rotating component */}
      <ThreeDStepIndicator steps={steps} currentStepIndex={currentStepIndex} />
      
      {/* Main content area with two-column layout on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content with enhanced card design */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#F7F3E9] relative backdrop-blur-sm">
            {/* Decorative accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#F46036] to-[#F46036]/30"></div>
            {renderPhaseContent()}
          </div>
        </div>
        
        {/* Sidebar content with enhanced design */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            {/* Resume achive card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#F7F3E9] transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-6 bg-[#F7F3E9] border-b border-[#F46036]/20 flex items-center">
                <div className="w-9 h-9 rounded-full bg-[#F46036]/10 flex items-center justify-center text-[#F46036] mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[#3E3E3E]">Resume Archive</h3>
                  <p className="text-sm text-[#3E3E3E]/70 mt-0.5">View summary and statistics</p>
                </div>
              </div>
              <div className="p-5 relative overflow-hidden">
                {/* Subtle decorative element */}
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#F46036]/5 rounded-full blur-2xl -z-0"></div>
                <ResumeData />
              </div>
            </div>
            
            {/* Why use our service section with enhanced design */}
            <div className="rounded-2xl overflow-hidden relative group">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#F7F3E9] to-[#F7F3E9]/80 z-0"></div>
              
              {/* Content */}
              <div className="relative z-10 p-6">
                <div className="flex items-center mb-5">
                  <div className="w-10 h-10 rounded-full bg-[#F46036]/20 flex items-center justify-center text-[#F46036] mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg text-[#3E3E3E]">Why Use GiveJob</h3>
                </div>
                
                <ul className="space-y-4">
                  <li className="flex transition-all duration-300 transform hover:-translate-x-1">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#F46036]/20 flex items-center justify-center text-[#F46036] shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-sm text-[#3E3E3E]">100% Secure</h4>
                      <p className="text-xs text-[#3E3E3E]/70 leading-relaxed">Your data is protected and never shared with third parties</p>
                    </div>
                  </li>
                  <li className="flex transition-all duration-300 transform hover:-translate-x-1">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#F46036]/20 flex items-center justify-center text-[#F46036] shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-sm text-[#3E3E3E]">AI-Powered Matching</h4>
                      <p className="text-xs text-[#3E3E3E]/70 leading-relaxed">Advanced algorithms for precise job recommendations</p>
                    </div>
                  </li>
                  <li className="flex transition-all duration-300 transform hover:-translate-x-1">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#F46036]/20 flex items-center justify-center text-[#F46036] shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-sm text-[#3E3E3E]">Actionable Insights</h4>
                      <p className="text-xs text-[#3E3E3E]/70 leading-relaxed">Resume improvement tips and market statistics</p>
                    </div>
                  </li>
                  <li className="flex transition-all duration-300 transform hover:-translate-x-1">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#F46036]/20 flex items-center justify-center text-[#F46036] shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-sm text-[#3E3E3E]">Career Acceleration</h4>
                      <p className="text-xs text-[#3E3E3E]/70 leading-relaxed">Fast-track your job search with tailored matches</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer with enhanced design */}
      <Footer/>
    </div>
  );
};

export default ResumeJobFlow;