import React from 'react';
import { useResumeProcessContext } from '../../../Contexts/ResumeProcessContext';
import { useAuth } from '../../../Contexts/AuthContext';

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

    // Extract key information from resume data
    const name = resumeAnalyzeData?.personal_information?.name || 'Your Resume';
    
    // Get skills if available (limit to 5)
    const skills = resumeAnalyzeData?.skills?.technical_skills || [];
    const displaySkills = skills.slice(0, 5);
    
    // Get education (just first one)
    const education = resumeAnalyzeData?.education?.[0] || null;
    const educationText = education ? 
        `${education.degree_earned || ''} ${education.institution_name || ''}`.trim() : 
        '';

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-medium text-gray-800">Previously Uploaded Resume</h3>
            </div>
            
            {/* Skills section */}
            {displaySkills.length > 0 && (
                <div className="mb-3">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {displaySkills.map((skill, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Education - just one line if available */}
            {educationText && (
                <p className="text-sm text-gray-600 mb-3">{educationText}</p>
            )}
            
            {/* Find Jobs button */}
            <button 
                onClick={handleFindJobs}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2 px-4 rounded transition-colors"
            >
                Find Jobs Using This Resume
            </button>
        </div>
    );
};

export default ResumeData;