import React from 'react';
import { useModal } from '../../../Contexts/ModalContext'; // Update with correct path
import CVTemplateSelection from './CVTemplateSelection'; // Assuming you have a CVTemplateSelection component

const AnalysisResults = ({ analysis, handleFindJobs, handleGoBack }) => {
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


  const {openModal} = useModal(); // Assuming you have a modal context to handle modals
  
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-100 flex items-center">
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center text-white">
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
          <h3 className="text-sm font-semibold text-gray-800">
            Analysis Complete
          </h3>
          <p className="text-xs text-gray-600">
            We've analyzed your resume and identified your key qualifications
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800 flex items-center">
            <span className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2 text-indigo-600">
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
                  className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-xs text-gray-500 italic">No skills listed in resume</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="p-4">
            <div className="flex items-center">
              <span className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2 text-indigo-600">
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
              <h3 className="text-sm font-semibold text-gray-800">Professional Summary</h3>
            </div>
            <p className="mt-2 pl-8 text-xs text-gray-600">
              {displayExperience}
            </p>
          </div>

          <div className="p-4">
            <div className="flex items-center">
              <span className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2 text-indigo-600">
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
              <h3 className="text-sm font-semibold text-gray-800">Education</h3>
            </div>
            <p className="mt-2 pl-8 text-xs text-gray-600">{formattedEducation}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleGoBack}
          className="w-1/5 py-2 px-3 bg-white border border-indigo-200 text-indigo-600 font-medium text-xs rounded-lg hover:bg-indigo-50 transition"
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

        {/* <button
          className="w-2/5 py-2 px-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-medium text-xs rounded-lg hover:from-teal-600 hover:to-emerald-600 transition shadow-sm"
        >
          <div 
          onClick={() => openModal(<CVTemplateSelection/>)} // Assuming you have a modal context to handle modals
          className="flex items-center justify-center">
            
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Generate Smart CV</span>
          </div>
        </button> */}

        <button
          onClick={handleFindJobs}
          className="w-4/5 py-2 px-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-xs rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-sm"
        >
          <div className="flex items-center justify-center">
            <span>Find Jobs</span>
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