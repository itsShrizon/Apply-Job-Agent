import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Process Indicator Context
 * 
 * This context manages the state of the job search process with a warm, job-friendly design:
 * - Current phase tracking ('upload', 'analyze', 'findJobs')
 * - Methods to update the current phase
 * - Process indicator UI component with responsive design
 * - Warm & welcoming color palette for job platforms
 */

// Create the context
const ProcessContext = createContext();

/**
 * Process Provider Component
 * 
 * Provides the process state and methods to child components.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} - The provider component
 */
export const ProcessProvider = ({ children }) => {
  // Track the current phase
  const [currentPhase, setCurrentPhase] = useState('upload');
  // Animation state for phase changes
  const [animatePhaseChange, setAnimatePhaseChange] = useState(false);

  // Phase configuration with modern SVG icons
  const phases = [
    { 
      id: 'upload', 
      title: 'Upload Resume',
      description: 'Submit your resume file',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      completedIcon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    { 
      id: 'analyze', 
      title: 'Analyze Resume',
      description: 'AI processes your qualifications',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      completedIcon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    { 
      id: 'findJobs', 
      title: 'Find Jobs',
      description: 'Discover matching opportunities',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      completedIcon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
  ];

  // Animation effect when phase changes
  useEffect(() => {
    setAnimatePhaseChange(true);
    const timer = setTimeout(() => {
      setAnimatePhaseChange(false);
    }, 700); // Animation duration
    
    return () => clearTimeout(timer);
  }, [currentPhase]);

  // Methods to update the phase
  const goToUploadPhase = () => setCurrentPhase('upload');
  const goToAnalyzePhase = () => setCurrentPhase('analyze');
  const goToFindJobsPhase = () => setCurrentPhase('findJobs');
  const goToNextPhase = () => {
    const currentIndex = phases.findIndex(phase => phase.id === currentPhase);
    if (currentIndex < phases.length - 1) {
      setCurrentPhase(phases[currentIndex + 1].id);
    }
  };

  // Determine status for a phase
  const getPhaseStatus = (phaseId) => {
    const phaseIndex = phases.findIndex(phase => phase.id === phaseId);
    const currentIndex = phases.findIndex(phase => phase.id === currentPhase);
    
    if (phaseIndex < currentIndex) return 'completed';
    if (phaseIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  // Get the indicator HTML based on the current state
  const ProcessIndicatorUI = () => (
    <div className="w-full max-w-3xl mx-auto py-6 px-2 md:px-4">
      {/* Mobile View (extra small devices) */}
      <div className="block sm:hidden">
        <div className="relative flex items-center justify-between mb-3">
          {/* Background progress line - full width */}
          <div className="absolute left-0 top-4 h-0.5 w-full bg-[#F7F3E9] rounded-full"></div>
          
          {/* Completed progress line - dynamic width with animation */}
          <div 
            className={`absolute left-0 top-4 h-0.5 bg-[#F46036] rounded-full transition-all duration-700 ease-out ${animatePhaseChange ? 'animate-pulse' : ''}`}
            style={{ 
              width: `${
                (phases.findIndex(p => p.id === currentPhase) / (phases.length - 1)) * 100
              }%` 
            }}
          ></div>
          
          {phases.map((phase) => {
            const status = getPhaseStatus(phase.id);
            
            // Dynamic classes based on status for the circles
            const circleClasses = `
              flex items-center justify-center w-8 h-8 rounded-full text-xs z-10
              ${status === 'completed' ? 'bg-[#F46036] text-white shadow-md' : 
                status === 'current' ? 'bg-white border-2 border-[#F46036] text-[#F46036] shadow-md ring-4 ring-[#F7F3E9]/70' : 
                'bg-white border border-[#F7F3E9] text-[#3E3E3E]/50'}
              transition-all duration-500 ${status === 'current' && animatePhaseChange ? 'scale-110' : 'scale-100'}
            `;

            return (
              <div key={phase.id} className="flex flex-col items-center relative">
                <div className={circleClasses}>
                  {status === 'completed' ? phase.completedIcon : phase.icon}
                </div>
                <div className={`mt-1 text-xs font-medium text-center truncate w-16 transition-colors duration-300 ${status === 'completed' || status === 'current' ? 'text-[#3E3E3E]' : 'text-[#3E3E3E]/50'}`}>
                  {phase.title.split(' ')[0]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Small to medium devices */}
      <div className="hidden sm:block lg:hidden">
        <div className="relative flex items-center justify-between">
          {/* Background progress line - full width */}
          <div className="absolute left-0 top-5 h-0.5 w-full bg-[#F7F3E9] rounded-full"></div>
          
          {/* Completed progress line - dynamic width with animation */}
          <div 
            className={`absolute left-0 top-5 h-0.5 bg-[#F46036] rounded-full transition-all duration-700 ease-out ${animatePhaseChange ? 'animate-pulse' : ''}`}
            style={{ 
              width: `${
                (phases.findIndex(p => p.id === currentPhase) / (phases.length - 1)) * 100
              }%` 
            }}
          ></div>

          {phases.map((phase) => {
            const status = getPhaseStatus(phase.id);
            
            // Dynamic classes based on status
            const circleClasses = `
              flex items-center justify-center w-10 h-10 rounded-full z-10 shadow-md
              ${status === 'completed' ? 'bg-[#F46036] text-white' : 
                status === 'current' ? 'bg-white border-2 border-[#F46036] text-[#F46036] ring-4 ring-[#F7F3E9]/70' : 
                'bg-white border border-[#F7F3E9] text-[#3E3E3E]/50'}
              transition-all duration-500 ${status === 'current' && animatePhaseChange ? 'scale-110' : 'scale-100'}
            `;
            
            const titleClasses = `
              mt-2 font-medium text-center text-sm transition-colors duration-300
              ${status === 'completed' ? 'text-[#3E3E3E]' : 
                status === 'current' ? 'text-[#3E3E3E]' : 
                'text-[#3E3E3E]/50'}
            `;
  
            return (
              <div key={phase.id} className="flex flex-col items-center relative">
                <div className={circleClasses}>
                  {status === 'completed' ? phase.completedIcon : phase.icon}
                </div>
                <div className={titleClasses}>{phase.title}</div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Large devices and up */}
      <div className="hidden lg:block">
        <div className="relative flex items-center justify-between">
          {/* Background progress line - full width */}
          <div className="absolute left-0 top-6 h-1 w-full bg-[#F7F3E9] rounded-full"></div>
          
          {/* Completed progress line - dynamic width with animation */}
          <div 
            className={`absolute left-0 top-6 h-1 bg-[#F46036] rounded-full transition-all duration-700 ease-out ${animatePhaseChange ? 'animate-pulse' : ''}`}
            style={{ 
              width: `${
                (phases.findIndex(p => p.id === currentPhase) / (phases.length - 1)) * 100
              }%` 
            }}
          ></div>
          
          {phases.map((phase) => {
            const status = getPhaseStatus(phase.id);
            
            // Dynamic classes based on status
            const circleClasses = `
              flex items-center justify-center w-12 h-12 rounded-full z-10
              ${status === 'completed' ? 'bg-[#F46036] text-white' : 
                status === 'current' ? 'bg-white border-2 border-[#F46036] text-[#F46036] ring-4 ring-[#F7F3E9]/70' : 
                'bg-white border border-[#F7F3E9] text-[#3E3E3E]/50'}
              transition-all duration-500 shadow-md ${status === 'current' && animatePhaseChange ? 'scale-110' : 'scale-100'}
            `;
            
            const titleClasses = `
              mt-2 font-medium text-sm transition-colors duration-300
              ${status === 'completed' ? 'text-[#3E3E3E]' : 
                status === 'current' ? 'text-[#3E3E3E]' : 
                'text-[#3E3E3E]/50'}
            `;
            
            const descriptionClasses = `
              text-xs mt-1 max-w-xs text-center transition-colors duration-300
              ${status === 'completed' ? 'text-[#3E3E3E]/80' : 
                status === 'current' ? 'text-[#3E3E3E]/80' : 
                'text-[#3E3E3E]/40'}
            `;
  
            return (
              <div key={phase.id} className="flex flex-col items-center px-6 relative">
                <div className={circleClasses}>
                  {status === 'completed' ? phase.completedIcon : phase.icon}
                </div>
                <div className={titleClasses}>{phase.title}</div>
                <div className={descriptionClasses}>{phase.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Value object to be provided by the context
  const contextValue = {
    currentPhase,
    phases,
    goToUploadPhase,
    goToAnalyzePhase,
    goToFindJobsPhase,
    goToNextPhase,
    ProcessIndicatorUI
  };

  return (
    <ProcessContext.Provider value={contextValue}>
      {children}
    </ProcessContext.Provider>
  );
};

/**
 * Custom hook to use the process context
 * 
 * @returns {Object} The process context value
 * @throws {Error} If used outside of a ProcessProvider
 */
export const useProcessContext = () => {
  const context = useContext(ProcessContext);
  
  if (context === undefined) {
    throw new Error('useProcessContext must be used within a ProcessProvider');
  }
  
  return context;
};