import React, { useState, useEffect } from 'react';
import { useCustomResume } from '../../../Contexts/CustomResumeContext';

const SmartCVPreview = ({ documentType = 'resume' }) => {
  const { 
    generatedCV, 
    generatedCoverLetter, 
    combinedDocument,
    downloadGeneratedCV,
    downloadCoverLetter,
    downloadCombinedDocument
  } = useCustomResume();
  
  const [pdfUrl, setPdfUrl] = useState(null);
  const [fileName, setFileName] = useState('document.pdf');
  
  // Determine which document to display based on the document type
  useEffect(() => {
    if (documentType === 'resume' && generatedCV?.pdfUrl) {
      setPdfUrl(generatedCV.pdfUrl);
      setFileName(generatedCV.fileName || 'resume.pdf');
    } 
    else if (documentType === 'cover' && generatedCoverLetter?.pdfUrl) {
      setPdfUrl(generatedCoverLetter.pdfUrl);
      setFileName(generatedCoverLetter.fileName || 'cover_letter.pdf');
    } 
    else if (documentType === 'combined' && combinedDocument?.pdfUrl) {
      setPdfUrl(combinedDocument.pdfUrl);
      setFileName(combinedDocument.fileName || 'resume_and_cover_letter.pdf');
    }
  }, [documentType, generatedCV, generatedCoverLetter, combinedDocument]);
  
  // Handle download based on document type
  const handleDownload = () => {
    if (documentType === 'resume') {
      downloadGeneratedCV();
    } 
    else if (documentType === 'cover' && generatedCoverLetter?.id) {
      // If we have a cover letter ID and pdfUrl is not already set
      if (!generatedCoverLetter.pdfUrl) {
        downloadCoverLetter(generatedCoverLetter.id);
      } else {
        // Use the existing pdfUrl to download
        const link = document.createElement('a');
        link.href = generatedCoverLetter.pdfUrl;
        link.setAttribute('download', generatedCoverLetter.fileName || 'cover_letter.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } 
    else if (documentType === 'combined') {
      downloadCombinedDocument();
    }
  };
  
  // Get document title based on type
  const getDocumentTitle = () => {
    switch(documentType) {
      case 'resume':
        return 'Resume Preview';
      case 'cover':
        return 'Cover Letter Preview';
      case 'combined':
        return 'Resume & Cover Letter Preview';
      default:
        return 'Document Preview';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl mx-auto flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-gray-50">
        <h3 className="font-semibold text-center text-gray-800">{getDocumentTitle()}</h3>
      </div>
      
      {/* PDF Viewer */}
      <div className="flex-grow overflow-hidden">
        {pdfUrl ? (
          <iframe
            src={`${pdfUrl}#toolbar=0`}
            title="PDF Viewer"
            className="w-full h-full border-0"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <p className="text-gray-500">Loading document preview...</p>
          </div>
        )}
      </div>
      
      {/* Footer with download button */}
      <div className="px-4 py-3 border-t bg-gray-50 flex justify-end">
        <button
          onClick={handleDownload}
          disabled={!pdfUrl}
          className={`px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium ${
            !pdfUrl ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          Download {fileName}
        </button>
      </div>
    </div>
  );
};

export default SmartCVPreview;