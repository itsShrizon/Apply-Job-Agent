import React, { useState } from 'react';
import { useModal } from '../../../Contexts/ModalContext';
import cvtemplate from '../../../assets/cvT.png';
import SmartCVPreview from './SmartCVPreview';
import { useCustomResume } from '../../../Contexts/CustomResumeContext';
import { activeTheme as theme } from '../../../Themes/theme';

const CVTemplateSelection = ({ job_description, position_title, company_name }) => {
  const { closeModal, openModal } = useModal();
  const { 
    selectedTemplate, 
    setSelectedTemplate, 
    generateCV, 
    generateCoverLetter,
    generateCombinedDocument,
    isGenerating,
    isGeneratingCoverLetter,
    isGeneratingCombined,
    error,
    clearGeneratedCV,
    clearGeneratedCoverLetter,
    clearCombinedDocument,
    downloadCoverLetter
  } = useCustomResume();
  
  // Local state for error handling
  const [localError, setLocalError] = useState(null);
  // State for tracking selected document type
  const [documentType, setDocumentType] = useState('resume'); // 'resume', 'cover', or 'combined'
  // State for cover letter inputs
  const [coverLetterData, setCoverLetterData] = useState({
    company_name: '',
    position_title: '',
    job_description: '',
    hiring_manager: ''
  });

  const handleTemplateSelect = () => {
    setSelectedTemplate(1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCoverLetterData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Use props to pre-populate form fields
  React.useEffect(() => {
    setCoverLetterData(prev => ({
      ...prev,
      job_description: job_description || prev.job_description,
      position_title: position_title || prev.position_title,
      company_name: company_name || prev.company_name
    }));
  }, [job_description, position_title, company_name]);

  const handleNext = async () => {
    // Clear any previous errors
    setLocalError(null);
    
    try {
      let result;
      
      // Clear any previously generated documents
      clearGeneratedCV();
      clearGeneratedCoverLetter();
      clearCombinedDocument();
      
      if (documentType === 'resume') {
        // Generate only CV
        result = await generateCV(job_description);
      } 
      else if (documentType === 'cover') {
        // Generate only cover letter
        result = await generateCoverLetter(coverLetterData);
        // Download the cover letter
        if (result && result.cover_letter_id) {
          result = await downloadCoverLetter(result.cover_letter_id);
        }
      } 
      else if (documentType === 'combined') {
        // First, generate CV
        // const cvResult = await generateCV(job_description);
        
        // Then, generate cover letter
        const coverLetterResult = await generateCoverLetter(coverLetterData);
        
        // Finally, generate combined document
        if (coverLetterResult && coverLetterResult.cover_letter_id) {
          result = await generateCombinedDocument({
            cover_letter_id: coverLetterResult.cover_letter_id,
            job_description
          });
        }
      }
      
      // Open the preview modal if document generation was successful
      if (result && result.pdfUrl) {
        openModal(<SmartCVPreview documentType={documentType} />);
      }
    } catch (error) {
      console.error('Failed to generate document:', error);
      setLocalError(error.message || 'Failed to generate document. Please try again.');
    }
  };

  // Determine if form is ready to submit
  const isCoverLetterFormValid = () => {
    if (documentType === 'cover' || documentType === 'combined') {
      return coverLetterData.company_name && 
             coverLetterData.position_title && 
             coverLetterData.job_description;
    }
    return true;
  };

  // Check if any generation process is in progress
  const isProcessing = isGenerating || isGeneratingCoverLetter || isGeneratingCombined;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md mx-auto">
      {/* Header */}
      <div style={{ backgroundColor: theme.primary, borderBottomColor: theme.accent }} className="px-4 py-3 border-b">
        <h3 style={{ color: theme.text }} className="font-semibold text-center">Document Generation</h3>
      </div>
      
      {/* Document Type Selection */}
      <div className="p-4 border-b">
        <label className="block text-sm font-medium text-gray-700 mb-2">What would you like to generate?</label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="documentType"
              value="resume"
              checked={documentType === 'resume'}
              onChange={() => setDocumentType('resume')}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-sm text-gray-700">Resume Only</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="radio"
              name="documentType"
              value="cover"
              checked={documentType === 'cover'}
              onChange={() => setDocumentType('cover')}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-sm text-gray-700">Cover Letter Only</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="radio"
              name="documentType"
              value="combined"
              checked={documentType === 'combined'}
              onChange={() => setDocumentType('combined')}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-sm text-gray-700">Both</span>
          </label>
        </div>
      </div>
      
      {/* Resume Template (show only for resume or combined) */}
      {(documentType === 'resume' || documentType === 'combined') && (
        <div className="p-4 border-b">
          <label className="block text-sm font-medium text-gray-700 mb-2">Resume Template</label>
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
        </div>
      )}
      
      {/* Cover Letter Form (show only for cover letter or combined) */}
      {(documentType === 'cover' || documentType === 'combined') && (
        <div className="p-4 border-b">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Cover Letter Information</h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Company Name *</label>
              <input
                type="text"
                name="company_name"
                value={coverLetterData.company_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Enter company name"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Job Title *</label>
              <input
                type="text"
                name="position_title"
                value={coverLetterData.position_title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Enter job title"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Hiring Manager (Optional)</label>
              <input
                type="text"
                name="hiring_manager"
                value={coverLetterData.hiring_manager}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Enter hiring manager's name if known"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Job Description *</label>
              <textarea
                name="job_description"
                value={coverLetterData.job_description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                rows="4"
                placeholder="Paste job description here"
                required
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {(localError || error) && (
        <div className="px-4 py-2 bg-red-50 text-red-700 text-sm">
          {localError || error}
        </div>
      )}
      
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
          disabled={isProcessing || !isCoverLetterFormValid()}
          style={{ 
            backgroundColor: isProcessing || !isCoverLetterFormValid() ? theme.disabledBg : theme.cta,
            color: isProcessing || !isCoverLetterFormValid() ? theme.disabledText : '#FFFFFF'
          }}
          className={`px-5 py-2 rounded transition text-sm font-medium ${
            isProcessing || !isCoverLetterFormValid() ? 'cursor-not-allowed' : 'hover:opacity-90'
          }`}
        >
          {isProcessing ? (
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