import React, { useEffect, useState } from 'react';

const AnalysisLoading = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    "Scanning document structure",
    "Extracting key skills and experience",
    "Analyzing career history",
    "Identifying qualifications",
    "Matching with job opportunities"
  ];
  
  useEffect(() => {
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 100);
    
    // Update steps
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          return steps.length - 1;
        }
        return prev + 1;
      });
    }, 2000);
    
    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, [steps.length]);

  return (
    <div className="py-8 flex flex-col items-center">
      <div className="relative">
        {/* Document svg with flashing scan line */}
        <div className="w-24 h-32 border border-[#F7F3E9] rounded-md relative bg-white flex items-center justify-center shadow-md overflow-hidden">
          <div className="absolute w-full h-0.5 bg-gradient-to-r from-[#FF6B6B] via-[#FF6B6B] to-[#FF6B6B] top-1/2 transform -translate-y-1/2 animate-pulse"></div>
          <div className="w-16 h-24 border border-[#F7F3E9] rounded bg-[#F7F3E9]/20 z-10 flex flex-col items-center justify-center p-1">
            <div className="w-full h-0.5 bg-[#F7F3E9] mb-1"></div>
            <div className="w-full h-0.5 bg-[#F7F3E9] mb-1"></div>
            <div className="w-full h-0.5 bg-[#F7F3E9] mb-1"></div>
            <div className="w-3/4 h-0.5 bg-[#F7F3E9]"></div>
          </div>
          
          {/* Scanning animation */}
          <div 
            className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F7F3E9]/20 to-transparent" 
            style={{ 
              animation: 'scanning 2s linear infinite',
              top: '-100%',
              height: '200%'
            }}
          ></div>
        </div>
        
        {/* Animated dots around the document */}
        <div className="absolute top-0 right-0 w-2 h-2 bg-[#F7F3E9] rounded-full animate-ping" style={{ animationDelay: '0.1s', animationDuration: '1.5s' }}></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#FF6B6B] rounded-full animate-ping" style={{ animationDelay: '0.7s', animationDuration: '1.8s' }}></div>
        <div className="absolute top-0 left-0 w-2 h-2 bg-[#FF6B6B] rounded-full animate-ping" style={{ animationDelay: '0.2s', animationDuration: '1.9s' }}></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#F7F3E9] rounded-full animate-ping" style={{ animationDelay: '0.8s', animationDuration: '1.6s' }}></div>
        
        {/* Circular progress indicator */}
        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
          <svg className="w-6 h-6" viewBox="0 0 36 36">
            <path
              className="stroke-[#F7F3E9]"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              strokeWidth="3"
              strokeDasharray="100, 100"
            />
            <path
              className="stroke-[#FF6B6B]"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              strokeWidth="3"
              strokeDasharray={`${progress}, 100`}
            />
          </svg>
        </div>
      </div>
      
      <div className="mt-6 text-center max-w-md">
        <h3 className="text-lg font-semibold text-[#3E3E3E] mb-1">Analyzing Your Resume</h3>
        <p className="text-[#3E3E3E]/80 text-sm">
          Our AI is extracting your skills, experience, and qualifications to match you with the perfect job opportunities
        </p>
        
        {/* Progress bar */}
        <div className="mt-4 w-full bg-[#FF6B6B]/20 rounded-full h-1.5 overflow-hidden">
          <div 
            className="h-full bg-[#FF6B6B] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="mt-4 space-y-1.5">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-4 h-4 rounded-full ${index <= currentStep ? 'bg-[#FF6B6B]/20' : 'bg-[#F7F3E9]/50'} flex items-center justify-center mr-2 transition-colors duration-300`}>
                <div className={`w-2 h-2 rounded-full ${index < currentStep ? 'bg-[#FF6B6B]' : index === currentStep ? 'bg-[#FF6B6B] animate-pulse' : 'bg-[#F7F3E9]'}`}></div>
              </div>
              <span className={`text-xs ${index <= currentStep ? 'text-[#3E3E3E]' : 'text-[#3E3E3E]/50'} transition-colors duration-300`}>{step}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Add global keyframe animation for scanning effect */}
      <style jsx>{`
        @keyframes scanning {
          0% { transform: translateY(0%); }
          100% { transform: translateY(50%); }
        }
      `}</style>
    </div>
  );
};

export default AnalysisLoading;