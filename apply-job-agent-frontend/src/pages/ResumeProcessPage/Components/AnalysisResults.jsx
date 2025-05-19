import React, { useState, useEffect } from 'react';
import CVTemplateSelection from './CVTemplateSelection'; // Assuming you have a CVTemplateSelection component

const AnalysisResults = ({ analysis, handleFindJobs, handleGoBack }) => {
  const [animateIn, setAnimateIn] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  
  // Handle empty or missing skills array
  const displaySkills = Array.isArray(analysis?.skills) && analysis.skills.length > 0
    ? analysis.skills
    : [];
  
  // Handle empty or undefined experience
  const displayExperience = analysis?.experience || 'No professional summary available';
  
  // Handle various education formatting cases
  const formattedEducation = (() => {
    if (!analysis?.education) return 'Education details not available';
    if (analysis.education.includes('undefined')) return 'Education details not provided';
    return analysis.education;
  })();
  
  // Animation effect on component mount
  useEffect(() => {
    setAnimateIn(true);
    
    // Sequentially highlight each section
    const timer1 = setTimeout(() => setActiveSection('skills'), 300);
    const timer2 = setTimeout(() => setActiveSection('summary'), 800);
    const timer3 = setTimeout(() => setActiveSection('education'), 1300);
    const timer4 = setTimeout(() => setActiveSection(null), 2000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);
  
  return (
    <div className="space-y-4">
      <div className={`bg-[#F7F3E9] p-3 rounded-lg border border-[#F46036]/20 flex items-center transition-all duration-500 transform ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <div className="h-8 w-8 rounded-full bg-[#F46036] flex items-center justify-center text-white shadow-md">
          <svg
            className="w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-semibold text-[#3E3E3E]">
            Analysis Complete
          </h3>
          <p className="text-xs text-[#3E3E3E]/70">
            We've highlighted your unique talents and experience
          </p>
        </div>
      </div>

      <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-500 transform ${animateIn ? 'translate-y-0 opacity-100 delay-100' : 'translate-y-4 opacity-0'}`}>
        <div className={`p-4 border-b border-[#F7F3E9] transition-all duration-300 ${activeSection === 'skills' ? 'bg-[#F7F3E9]' : ''}`}>
          <h3 className="text-sm font-semibold text-[#3E3E3E] flex items-center">
            <span className="h-6 w-6 rounded-full bg-[#F7F3E9] flex items-center justify-center mr-2 text-[#F46036] shadow-sm">
              <svg
                className="w-3 h-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </span>
            Professional Skills
          </h3>
          {displaySkills.length > 0 ? (
            <div className="flex flex-wrap gap-1 mt-2">
              {displaySkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-[#F7F3E9] text-[#3E3E3E] rounded-full text-xs border border-[#F46036]/20 shadow-sm transition-all duration-300 hover:bg-[#F46036]/10 hover:shadow"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-xs text-[#3E3E3E]/70 italic">No skills listed in resume</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#F7F3E9]">
          <div className={`p-4 transition-all duration-300 ${activeSection === 'summary' ? 'bg-[#F7F3E9]' : ''}`}>
            <div className="flex items-center">
              <span className="h-6 w-6 rounded-full bg-[#F7F3E9] flex items-center justify-center mr-2 text-[#F46036] shadow-sm">
                <svg
                  className="w-3 h-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </span>
              <h3 className="text-sm font-semibold text-[#3E3E3E]">Professional Story</h3>
            </div>
            <p className="mt-2 pl-8 text-xs text-[#3E3E3E]/80 leading-relaxed">
              {displayExperience}
            </p>
          </div>

          <div className={`p-4 transition-all duration-300 ${activeSection === 'education' ? 'bg-[#F7F3E9]' : ''}`}>
            <div className="flex items-center">
              <span className="h-6 w-6 rounded-full bg-[#F7F3E9] flex items-center justify-center mr-2 text-[#F46036] shadow-sm">
                <svg
                  className="w-3 h-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                  />
                </svg>
              </span>
              <h3 className="text-sm font-semibold text-[#3E3E3E]">Education</h3>
            </div>
            <p className="mt-2 pl-8 text-xs text-[#3E3E3E]/80 leading-relaxed">{formattedEducation}</p>
          </div>
        </div>
      </div>

      <div className={`flex justify-between flex-col sm:flex-row gap-2 transition-all duration-500 transform ${animateIn ? 'translate-y-0 opacity-100 delay-200' : 'translate-y-4 opacity-0'}`}>
        <button
          onClick={handleGoBack}
          className="sm:w-1/5 py-2 px-3 bg-white border border-[#F46036]/20 text-[#3E3E3E] font-medium text-xs rounded-lg hover:bg-[#F7F3E9] transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md mb-2 sm:mb-0"
        >
          <div className="flex items-center justify-center">
            <svg
              className="w-3 h-3 mr-1"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back</span>
          </div>
        </button>

        <button
          onClick={handleFindJobs}
          className="md:w-3/12 sm:w-4/5 py-2 px-3 bg-[#FF6B6B] text-white font-medium text-xs rounded-lg hover:bg-[#F46036] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-center">
            <span>Find Opportunities</span>
            <svg
              className="w-3 h-3 ml-1"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AnalysisResults;