import React, { createContext, useContext, useState } from 'react';

/**
 * Process Indicator Context
 * 
 * This context manages the state of the job search process and provides:
 * - Current phase tracking ('upload', 'analyze', 'findJobs')
 * - Methods to update the current phase
 * - Process indicator UI component
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

  // Phase configuration
  const phases = [
    { id: 'upload', title: 'Upload Resume', icon: '📄' },
    { id: 'analyze', title: 'Analyze Resume', icon: '🔍' },
    { id: 'findJobs', title: 'Find Jobs', icon: '💼' },
  ];

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
    <div className="w-full max-w-3xl mx-auto py-4 px-2 md:px-4">
      {/* Mobile View (extra small devices) */}
      <div className="block sm:hidden">
        <div className="flex items-center justify-between mb-3">
          {phases.map((phase, index) => {
            const status = getPhaseStatus(phase.id);
            
            // Dynamic classes based on status for the circles
            const circleClasses = `
              flex items-center justify-center w-8 h-8 rounded-full text-xs
              ${status === 'completed' ? 'bg-green-500 text-white' : 
                status === 'current' ? 'bg-blue-500 text-white' : 
                'bg-gray-200 text-gray-500'}
              transition-all duration-300 shadow
            `;
            
            // Line connector
            const lineClasses = `
              h-1 flex-grow mx-1
              ${index < phases.findIndex(p => p.id === currentPhase) ? 'bg-green-500' : 'bg-gray-200'}
            `;
  
            return (
              <React.Fragment key={phase.id}>
                <div className="flex flex-col items-center">
                  <div className={circleClasses}>
                    {status === 'completed' ? '✓' : phase.icon}
                  </div>
                  <div className="mt-1 text-xs font-medium text-center truncate w-16">
                    {phase.title.split(' ')[0]}
                  </div>
                </div>
                
                {index < phases.length - 1 && (
                  <div className={lineClasses}></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      
      {/* Small devices */}
      <div className="hidden sm:block md:hidden">
        <div className="flex items-center justify-between">
          {phases.map((phase, index) => {
            const status = getPhaseStatus(phase.id);
            
            // Dynamic classes based on status
            const circleClasses = `
              flex items-center justify-center w-9 h-9 rounded-full 
              ${status === 'completed' ? 'bg-green-500 text-white' : 
                status === 'current' ? 'bg-blue-500 text-white' : 
                'bg-gray-200 text-gray-500'}
              transition-all duration-300 shadow
            `;
            
            const titleClasses = `
              mt-2 font-medium text-center text-sm
              ${status === 'completed' ? 'text-green-500' : 
                status === 'current' ? 'text-blue-500' : 
                'text-gray-500'}
            `;
            
            // Line connector (not for the last item)
            const lineClasses = `
              h-1 flex-grow mx-2
              ${index < phases.findIndex(p => p.id === currentPhase) ? 'bg-green-500' : 'bg-gray-200'}
            `;
  
            return (
              <React.Fragment key={phase.id}>
                <div className="flex flex-col items-center">
                  <div className={circleClasses}>
                    {status === 'completed' ? '✓' : phase.icon}
                  </div>
                  <div className={titleClasses}>{phase.title}</div>
                </div>
                
                {index < phases.length - 1 && (
                  <div className={lineClasses}></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      
      {/* Medium and larger devices */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {phases.map((phase, index) => {
            const status = getPhaseStatus(phase.id);
            
            // Dynamic classes based on status
            const circleClasses = `
              flex items-center justify-center w-12 h-12 rounded-full 
              ${status === 'completed' ? 'bg-green-500 text-white' : 
                status === 'current' ? 'bg-blue-500 text-white' : 
                'bg-gray-200 text-gray-500'}
              transition-all duration-300 shadow-md
            `;
            
            const titleClasses = `
              mt-2 font-medium text-center
              ${status === 'completed' ? 'text-green-500' : 
                status === 'current' ? 'text-blue-500' : 
                'text-gray-500'}
            `;
            
            // Line connector (not for the last item)
            const lineClasses = `
              h-1.5 flex-grow mx-3
              ${index < phases.findIndex(p => p.id === currentPhase) ? 'bg-green-500' : 'bg-gray-200'}
              transition-all duration-300
            `;
  
            return (
              <React.Fragment key={phase.id}>
                <div className="flex flex-col items-center">
                  <div className={circleClasses}>
                    {status === 'completed' ? '✓' : phase.icon}
                  </div>
                  <div className={titleClasses}>{phase.title}</div>
                </div>
                
                {index < phases.length - 1 && (
                  <div className={lineClasses}></div>
                )}
              </React.Fragment>
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
 */
export const useProcessContext = () => {
  const context = useContext(ProcessContext);
  
  if (context === undefined) {
    throw new Error('useProcessContext must be used within a ProcessProvider');
  }
  
  return context;
};

// Example usage:
/*
import { ProcessProvider, useProcessContext } from './ProcessIndicator';

// In your app's main component:
const App = () => (
  <ProcessProvider>
    <YourRoutes />
  </ProcessProvider>
);

// In any component where you need to show the indicator or access the current phase:
const YourComponent = () => {
  const { 
    currentPhase, 
    ProcessIndicatorUI, 
    goToNextPhase,
    goToAnalyzePhase 
  } = useProcessContext();

  return (
    <div>
      <ProcessIndicatorUI />
      
      {currentPhase === 'upload' && (
        <UploadForm onSuccess={goToNextPhase} />
      )}
      
      {currentPhase === 'analyze' && (
        <AnalyzeComponent onComplete={goToNextPhase} />
      )}
      
      {currentPhase === 'findJobs' && (
        <JobResults />
      )}
      
      <button onClick={goToNextPhase}>Next Step</button>
    </div>
  );
};
*/