import React, { useState } from 'react';
import { FaLock, FaLockOpen, FaChevronDown, FaMapMarkerAlt, FaBriefcase, FaBuilding, FaCalendarAlt, FaStar, FaChevronUp } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { useModal } from '../../../Contexts/ModalContext'; // Update with correct path
import CVTemplateSelection from './CVTemplateSelection'; // Assuming you have a CVTemplateSelection component

// Function to process job description text
const formatJobDescription = (description) => {
  if (!description) return '';
  
  // Replace markdown-style formatting with HTML
  let formattedText = description
    // Handle bold text (either ** or __ format)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    
    // Handle italic text (either * or _ format)
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    
    // Handle bullet points (lines starting with *)
    .replace(/^\s*\*\s+(.+)$/gm, '<li>$1</li>')
    
    // Handle dashed lists (lines starting with -)
    .replace(/^\s*-\s+(.+)$/gm, '<li>$1</li>')
    
    // Convert consecutive list items into proper lists
    .replace(/(<li>.+<\/li>\s*)+/g, '<ul>$&</ul>')
    
    // Fix nested lists issue
    .replace(/<\/ul>\s*<ul>/g, '')
    
    // Handle headers (lines starting with #)
    .replace(/^#{1}\s+(.+)$/gm, '<h1>$1</h1>')
    .replace(/^#{2}\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/^#{3}\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^#{4}\s+(.+)$/gm, '<h4>$1</h4>')
    
    // Convert newlines to <br> tags for paragraph breaks
    .replace(/\n{2,}/g, '<br/><br/>')
    
    // Handle special case for responsibilities, requirements, etc. sections
    .replace(/\*\*([A-Z\s]+:)\*\*/g, '<h4>$1</h4>');
  
  return formattedText;
};

// Add this to your index.css or App.css file
// Or use a <style> tag in your parent component
/*
.job-description-content h1, .job-description-content h2, .job-description-content h3, .job-description-content h4 {
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.job-description-content h1 { font-size: 1.25rem; }
.job-description-content h2 { font-size: 1.125rem; }
.job-description-content h3 { font-size: 1rem; }
.job-description-content h4 { font-size: 0.875rem; }

.job-description-content ul { 
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

.job-description-content li {
  margin-bottom: 0.25rem;
}

.job-description-content strong {
  font-weight: 600;
}

.job-description-content em {
  font-style: italic;
}

@keyframes slideDown {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slideDown {
  animation: slideDown 0.3s ease-out forwards;
}
*/

const JobsPhase = ({ 
  jobs = [], 
  handleGoBack, 
  isLoading = false,
  isPremium = false
}) => {
  // Ensure jobs is always an array, even if it's undefined or null
  const jobsArray = Array.isArray(jobs) ? jobs : [];
  
  // State for showing payment modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // State for tracking the selected job
  const [selectedJob, setSelectedJob] = useState(null);
  
  // State for tracking expanded job in mobile view
  const [expandedJobIndex, setExpandedJobIndex] = useState(null);
  
  const { openModal } = useModal(); // Assuming you have a modal context to handle modals
  
  // Function to toggle payment modal
  const togglePaymentModal = () => {
    setShowPaymentModal(!showPaymentModal);
  };
  
  // Determine visible jobs based on premium status
  const visibleJobs = isPremium ? jobsArray : jobsArray.slice(0, 5);
  const hiddenJobsCount = jobsArray.length - visibleJobs.length;

  // Handle job selection
  const handleJobSelect = (job, index) => {
    setSelectedJob(job);
    
    // For mobile view, toggle expanded state for this job
    if (window.innerWidth < 768) {
      setExpandedJobIndex(expandedJobIndex === index ? null : index);
    }
  };
  
  // CSS classes for mobile job details animation
  const getMobileDetailClasses = (index) => {
    const isExpanded = expandedJobIndex === index;
    return `bg-white border-l-2 border-indigo-500 rounded-b-lg p-4 shadow-md 
           ${isExpanded ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0 invisible'} 
           transition-all duration-300 ease-in-out overflow-hidden`;
  };
  
  // Render job detail section for mobile
  const renderMobileJobDetail = (job, index) => {
    return (
      <div className={getMobileDetailClasses(index)}>
        <div className="mb-3 pb-3 border-b border-gray-100">
          <div className="flex items-center mt-1">
            <FaBuilding className="text-indigo-500 w-3 h-3 mr-1" />
            <span className="text-sm text-gray-700 font-medium">{job?.company || 'Unknown Company'}</span>
          </div>
          
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="flex items-center text-gray-600 text-xs">
              <FaMapMarkerAlt className="w-3 h-3 mr-1 text-indigo-500" />
              {job?.location || 'Remote'}
            </div>
            {job?.posted && (
              <div className="flex items-center text-gray-600 text-xs">
                <FaCalendarAlt className="w-3 h-3 mr-1 text-indigo-500" />
                Posted: {job.posted}
              </div>
            )}
            {job?.salary && (
              <div className="flex items-center text-gray-600 text-xs">
                <svg className="w-3 h-3 mr-1 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {job.salary}
              </div>
            )}
          </div>
          
          <div className="mt-3 flex space-x-2">
            <a 
              href={job?.url || '#'} 
              target="_blank"
              rel="noopener noreferrer" 
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-sm flex-1 flex justify-center"
            >
              Apply Now
            </a>
            <button
              onClick={() => openModal(<CVTemplateSelection job_description={job?.description} />)}
              className="py-2 px-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-xs rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-sm flex items-center justify-center flex-1"
            >
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
              <span>Generate CV</span>
            </button>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Job Description</h3>
          <div className="text-xs text-gray-700 space-y-2 job-description-content max-h-64 overflow-y-auto">
            {job?.description ? (
              <div 
                className="prose prose-sm max-w-none" 
                dangerouslySetInnerHTML={{ __html: formatJobDescription(job.description) }} 
              />
            ) : (
              <div className="italic text-gray-500">
                <p>No detailed description available for this position.</p>
                <p className="mt-2">Please click the "Apply Now" button to view the full job details on the company website.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-4 relative">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-white">Top Matching Jobs</h2>
            <p className="text-indigo-100 mt-1 text-xs">
              {isLoading 
                ? "Searching for matching jobs..." 
                : `We found ${jobsArray.length} opportunities that match your skills`}
            </p>
          </div>
          <button
            onClick={handleGoBack}
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-xs transition flex items-center"
          >
            <svg className="w-3 h-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>
        
        {/* Show loading UI */}
        {isLoading && (
          <div className="p-12 flex flex-col items-center justify-center">
            <div className="relative w-24 h-24">
              {/* Outer ring */}
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-indigo-100 opacity-30"></div>
              
              {/* Middle spinning ring */}
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-indigo-600 border-r-transparent border-b-indigo-300 border-l-transparent animate-spin" style={{ animationDuration: '1.5s' }}></div>
              
              {/* Inner pulsing circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full animate-pulse"></div>
              
              {/* Center icon */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            <p className="mt-6 text-sm text-gray-700 font-medium">Finding your perfect job matches</p>
            <p className="mt-1 text-xs text-gray-500">Analyzing skills and opportunities...</p>
          </div>
        )}
        
        {/* Only show no jobs found if not loading and jobsArray is empty */}
        {!isLoading && jobsArray.length === 0 && (
          <div className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-gray-700 font-medium text-sm">No matching jobs found</h3>
            <p className="text-gray-500 text-xs mt-2">Try adjusting your resume to include more relevant skills and experience</p>
          </div>
        )}
        
        {/* Mobile layout - Accordion style */}
        {!isLoading && visibleJobs.length > 0 && (
          <div className="md:hidden">
            {visibleJobs.map((job, index) => (
              <div key={index} className="border-b border-gray-200 last:border-b-0">
                <div 
                  className={`p-4 transition-colors cursor-pointer ${expandedJobIndex === index ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
                  onClick={() => handleJobSelect(job, index)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1 pr-2">
                      <h3 className="text-sm font-semibold text-gray-800 truncate">{job?.title || 'Untitled Position'}</h3>
                      <p className="text-xs text-gray-700 truncate">{job?.company || 'Unknown Company'}</p>
                      
                      <div className="mt-2 flex items-center text-gray-600 text-xs">
                        <FaMapMarkerAlt className="w-3 h-3 mr-1 text-indigo-500" />
                        <span className="truncate max-w-[150px]">{job?.location || 'Remote'}</span>
                      </div>
                    </div>
                    <div className={`transition-transform duration-300 ${expandedJobIndex === index ? 'rotate-180' : ''}`}>
                      <FaChevronDown className="text-indigo-500" />
                    </div>
                  </div>
                </div>
                
                {/* Expandable section with job details */}
                {renderMobileJobDetail(job, index)}
              </div>
            ))}
            
            {/* View More Jobs section - only show if there are hidden jobs */}
            {!isPremium && hiddenJobsCount > 0 && (
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <button 
                  onClick={togglePaymentModal}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition"
                >
                  <FaLock className="text-indigo-500" />
                  <span className="text-sm font-medium text-gray-700">View More Jobs</span>
                  <FaChevronDown className="text-gray-400" />
                </button>
              </div>
            )}
            
            {/* Premium user showing all jobs notice */}
            {isPremium && jobsArray.length > 5 && (
              <div className="p-4 bg-indigo-50 border-t border-indigo-100 flex items-center justify-center">
                <FaLockOpen className="text-indigo-600 mr-2" />
                <span className="text-xs font-medium text-indigo-700">Premium access: Viewing all available jobs</span>
              </div>
            )}
          </div>
        )}
        
        {/* Desktop layout - Two column */}
        {!isLoading && visibleJobs.length > 0 && (
          <div className="hidden md:grid md:grid-cols-5">
            {/* Left column - Job list */}
            <div className="md:col-span-2 border-r border-gray-200 max-h-[600px] overflow-y-auto">
              {visibleJobs.map((job, index) => (
                <div 
                  key={index} 
                  className={`p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 cursor-pointer 
                            ${selectedJob === job ? 'bg-indigo-50 border-l-4 border-l-indigo-500 pl-3' : ''}`}
                  onClick={() => handleJobSelect(job, index)}
                >
                  <h3 className="text-sm font-semibold text-gray-800 truncate">{job?.title || 'Untitled Position'}</h3>
                  <p className="text-xs text-gray-700 truncate">{job?.company || 'Unknown Company'}</p>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center text-gray-600 text-xs">
                      <FaMapMarkerAlt className="w-3 h-3 mr-1 text-indigo-500" />
                      <span className="truncate max-w-[120px]">{job?.location || 'Remote'}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-xs">
                      <FaBriefcase className="w-3 h-3 mr-1 text-indigo-500" />
                      {job?.site || 'Job Board'}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* View More Jobs section - only show if there are hidden jobs */}
              {!isPremium && hiddenJobsCount > 0 && (
                <div className="p-6 bg-gray-50 border-t border-gray-100">
                  <button 
                    onClick={togglePaymentModal}
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition"
                  >
                    <FaLock className="text-indigo-500" />
                    <span className="text-sm font-medium text-gray-700">View More Jobs</span>
                    <FaChevronDown className="text-gray-400" />
                  </button>
                </div>
              )}
              
              {/* Premium user showing all jobs notice */}
              {isPremium && jobsArray.length > 5 && (
                <div className="p-4 bg-indigo-50 border-t border-indigo-100 flex items-center justify-center">
                  <FaLockOpen className="text-indigo-600 mr-2" />
                  <span className="text-xs font-medium text-indigo-700">Premium access: Viewing all available jobs</span>
                </div>
              )}
            </div>
            
            {/* Right column - Job details */}
            <div className="md:col-span-3 max-h-[600px] overflow-y-auto">
              {selectedJob ? (
                <div className="p-6">
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800">{selectedJob?.title || 'Untitled Position'}</h2>
                    <div className="flex items-center mt-1">
                      <FaBuilding className="text-indigo-500 w-3 h-3 mr-1" />
                      <span className="text-sm text-gray-700 font-medium">{selectedJob?.company || 'Unknown Company'}</span>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="flex items-center text-gray-600 text-xs">
                        <FaMapMarkerAlt className="w-3 h-3 mr-1 text-indigo-500" />
                        {selectedJob?.location || 'Remote'}
                      </div>
                      <div className="flex items-center text-gray-600 text-xs">
                        <FaBriefcase className="w-3 h-3 mr-1 text-indigo-500" />
                        {selectedJob?.site || 'Job Board'}
                      </div>
                      {selectedJob?.posted && (
                        <div className="flex items-center text-gray-600 text-xs">
                          <FaCalendarAlt className="w-3 h-3 mr-1 text-indigo-500" />
                          Posted: {selectedJob.posted}
                        </div>
                      )}
                      {selectedJob?.salary && (
                        <div className="flex items-center text-gray-600 text-xs">
                          <svg className="w-3 h-3 mr-1 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {selectedJob.salary}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <a 
                        href={selectedJob?.url || '#'} 
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-sm flex-1 flex justify-center"
                      >
                        Apply Now
                      </a>
                      <button
                        onClick={() => openModal(<CVTemplateSelection job_description={selectedJob?.description} />)}
                        className="w-2/5 py-2 px-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-xs rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-sm flex items-center justify-center"
                      >
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
                        <span>Generate Custom Resume</span>
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Job Description</h3>
                    <div className="text-xs text-gray-700 space-y-2 job-description-content">
                      {selectedJob?.description ? (
                        // Use our custom formatter for job descriptions that contain markdown
                        <div 
                          className="prose prose-sm max-w-none" 
                          dangerouslySetInnerHTML={{ __html: formatJobDescription(selectedJob.description) }} 
                        />
                      ) : (
                        <div className="italic text-gray-500">
                          <p>No detailed description available for this position.</p>
                          <p className="mt-2">Please click the "Apply Now" button to view the full job details on the company website.</p>
                        </div>
                      )}
                    </div>
                    
                    {selectedJob?.requirements && (
                      <div className="mt-4">
                        <h3 className="text-sm font-semibold text-gray-800 mb-2">Requirements</h3>
                        <ul className="list-disc pl-5 text-xs text-gray-700 space-y-1">
                          {Array.isArray(selectedJob.requirements) ? (
                            selectedJob.requirements.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))
                          ) : (
                            // Use our formatter for requirements too if it's a string
                            <div dangerouslySetInnerHTML={{ 
                              __html: Array.isArray(selectedJob.requirements) 
                                ? selectedJob.requirements.join('<br/>') 
                                : formatJobDescription(selectedJob.requirements) 
                            }} />
                          )}
                        </ul>
                      </div>
                    )}
                    
                    {selectedJob?.benefits && (
                      <div className="mt-4">
                        <h3 className="text-sm font-semibold text-gray-800 mb-2">Benefits</h3>
                        <ul className="list-disc pl-5 text-xs text-gray-700 space-y-1">
                          {Array.isArray(selectedJob.benefits) ? (
                            selectedJob.benefits.map((benefit, index) => (
                              <li key={index}>{benefit}</li>
                            ))
                          ) : (
                            // Use our formatter for benefits too if it's a string
                            <div dangerouslySetInnerHTML={{ 
                              __html: Array.isArray(selectedJob.benefits) 
                                ? selectedJob.benefits.join('<br/>') 
                                : formatJobDescription(selectedJob.benefits) 
                            }} />
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-gray-700 font-medium text-sm">Select a job to view details</h3>
                  <p className="text-gray-500 text-xs mt-2">Click on any job in the list to view more information</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 animate-fadeIn">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Upgrade to Premium</h3>
                <p className="text-sm text-gray-600 mt-1">Unlock all job listings and premium features</p>
              </div>
              <button 
                onClick={togglePaymentModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="bg-indigo-50 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-indigo-600 rounded-full mr-3">
                  <FaLockOpen className="text-white w-4 h-4" />
                </div>
                <span className="font-medium text-indigo-800">Premium Benefits</span>
              </div>
              <ul className="pl-10 text-sm text-indigo-900 space-y-2 list-disc">
                <li>Access to all {jobsArray.length} job listings</li>
                <li>Detailed company insights</li>
                <li>Advanced resume tailoring</li>
                <li>Priority customer support</li>
              </ul>
            </div>
            
            <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-sm">
              Continue to Payment
            </button>
            
            <p className="text-xs text-center text-gray-500 mt-4">
              Unlock premium features to maximize your job search potential
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsPhase;