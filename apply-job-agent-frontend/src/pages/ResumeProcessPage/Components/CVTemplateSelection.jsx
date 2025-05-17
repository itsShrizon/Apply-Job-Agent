import React from 'react';
import { useModal } from '../../../Contexts/ModalContext';
import cvtemplate from '../../../assets/cvT.png';
import SmartCVPreview from './SmartCVPreview';
import { useCustomResume } from '../../../Contexts/CustomResumeContext';
import { activeTheme as theme } from '../../../Themes/theme';

const CVTemplateSelection = ({ job_description }) => {
  const { closeModal, openModal } = useModal();
  const { 
    selectedTemplate, 
    setSelectedTemplate, 
    generateCV, 
    isGenerating 
  } = useCustomResume();

  const handleTemplateSelect = () => {
    setSelectedTemplate(1);
  };

  const handleNext = async () => {
    openModal(<SmartCVPreview />);
    
    try {
      await generateCV(job_description);
    } catch (error) {
      console.error('Failed to generate resume:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md mx-auto">
      {/* Header */}
      <div style={{ backgroundColor: theme.primary, borderBottomColor: theme.accent }} className="px-4 py-3 border-b">
        <h3 style={{ color: theme.text }} className="font-semibold text-center">Resume Template</h3>
      </div>
      
      {/* Just the template image */}
      <div 
        className={`cursor-pointer ${selectedTemplate === 1 ? 'ring-2' : ''}`}
        style={{ ringColor: selectedTemplate === 1 ? theme.accent : 'transparent' }}
        onClick={handleTemplateSelect}
      >
        <img 
          src={cvtemplate} 
          alt="Resume Template" 
          className="w-full h-auto"
        />
      </div>
      
      {/* Footer with action buttons */}
      <div style={{ backgroundColor: theme.primary }} className="px-4 py-3 flex justify-between">
        <button 
          onClick={closeModal}
          style={{ color: theme.text, borderColor: theme.accent }}
          className="px-4 py-2 bg-white border rounded text-sm hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        
        <button 
          onClick={handleNext}
          disabled={isGenerating}
          style={{ 
            backgroundColor: isGenerating ? theme.disabledBg : theme.cta,
            color: isGenerating ? theme.disabledText : '#FFFFFF'
          }}
          className={`px-5 py-2 rounded transition text-sm font-medium ${
            isGenerating ? 'cursor-not-allowed' : 'hover:opacity-90'
          }`}
        >
          {isGenerating ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          ) : (
            'Generate'
          )}
        </button>
      </div>
    </div>
  );
};

export default CVTemplateSelection;