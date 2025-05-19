import React from 'react';
import { useResumeProcessContext } from '../../../Contexts/ResumeProcessContext';
import { useAuth } from '../../../Contexts/AuthContext';

/**
 * ResumeData Component
 * 
 * Displays previously uploaded resume information with warm, job-friendly styling
 * Uses the warm & welcoming color palette for a consistent design language
 */
const ResumeData = () => {
    const { 
        hasResumeData, 
        resumeAnalyzeData, 
        isLoadingResumeData,
        fetchUserResumeData,
        handleFindJobs
    } = useResumeProcessContext();

    const { currentUser } = useAuth();

    // Fetch resume data when component mounts if user is logged in
    React.useEffect(() => {
        if (currentUser && !hasResumeData) {
            fetchUserResumeData();
        }
    }, [currentUser]);

    // If no resume data or still loading, don't render anything
    if (!hasResumeData || isLoadingResumeData) {
        return null;
    }
    
    // Get skills if available (limit to 5)
    const skills = resumeAnalyzeData?.skills?.technical_skills || [];
    const displaySkills = skills.slice(0, 5);
    
    // Get education (just first one)
    const education = resumeAnalyzeData?.education?.[0] || null;
    const educationText = education ? 
        `${education.degree_earned || ''} ${education.institution_name || ''}`.trim() : 
        '';

    return (
        <div className="bg-white border border-[#F7F3E9] rounded-xl p-4 mb-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-medium text-[#3E3E3E]">Previously Uploaded Resume</h3>
                
                {/* Optional document icon */}
                <svg className="w-5 h-5 text-[#F46036]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </div>
            
            {/* Skills section */}
            {displaySkills.length > 0 && (
                <div className="mb-3">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {displaySkills.map((skill, index) => (
                            <span key={index} className="bg-[#F7F3E9] text-[#3E3E3E] text-xs px-2 py-0.5 rounded border border-[#F7F3E9]/70">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Education - just one line if available */}
            {educationText && (
                <p className="text-sm text-[#3E3E3E]/80 mb-3">{educationText}</p>
            )}
            
            {/* Find Jobs button */}
            <div className='flex justify-center'>
                <button onClick={handleFindJobs} className="w-full bg-[#FF6B6B] hover:bg-[#F46036] text-white text-sm py-2 px-4 rounded transition-colors">Find Jobs Using This Resume</button>
            </div>
            
            {/* Optional helpful text */}
            <p className="text-xs text-[#3E3E3E]/60 mt-2 text-center">This will help us find job opportunities that match your skills</p>
        </div>
    );
};

export default ResumeData;