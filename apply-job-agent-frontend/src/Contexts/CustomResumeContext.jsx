import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const CustomResumeContext = createContext();

// Custom hook to use the context
export const useCustomResume = () => {
  const context = useContext(CustomResumeContext);
  if (!context) {
    throw new Error('useCustomResume must be used within a CustomResumeProvider');
  }
  return context;
};

// Provider component
export const CustomResumeProvider = ({ children }) => {
  // State for the selected CV template
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  
  // State for the generated CV
  const [generatedCV, setGeneratedCV] = useState(null);
  
  // State for the generated cover letter
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState(null);
  
  // State for the combined resume and cover letter
  const [combinedDocument, setCombinedDocument] = useState(null);
  
  // State for resume data (from backend)
  const [resumeData, setResumeData] = useState(null);
  
  // State for cover letter history
  const [coverLetterHistory, setCoverLetterHistory] = useState([]);
  
  // Loading states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingResumeData, setIsLoadingResumeData] = useState(false);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [isGeneratingCombined, setIsGeneratingCombined] = useState(false);
  const [isLoadingCoverLetters, setIsLoadingCoverLetters] = useState(false);
  
  // Error state
  const [error, setError] = useState(null);

  const { currentUser } = useAuth();

  // Fetch resume data from backend when user is authenticated
  useEffect(() => {
    if (currentUser?.access_token) {
      fetchResumeData();
    }
  }, [currentUser]);

  // Clean up blob URLs when component unmounts or when states with URLs change
  useEffect(() => {
    return () => {
      if (generatedCV && generatedCV.pdfUrl) {
        URL.revokeObjectURL(generatedCV.pdfUrl);
      }
      if (generatedCoverLetter && generatedCoverLetter.pdfUrl) {
        URL.revokeObjectURL(generatedCoverLetter.pdfUrl);
      }
      if (combinedDocument && combinedDocument.pdfUrl) {
        URL.revokeObjectURL(combinedDocument.pdfUrl);
      }
    };
  }, [generatedCV, generatedCoverLetter, combinedDocument]);

  // Function to fetch resume data from backend
  const fetchResumeData = async () => {
    const token = currentUser?.access_token;
    
    if (!token) {
      setError('Authentication required');
      return;
    }
    
    try {
      setIsLoadingResumeData(true);
      setError(null);
      
      const response = await axios({
        method: 'GET',
        url: `${BACKEND_URL}/resume/get-resume-data`,
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      
      setResumeData(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching resume data:', err);
      setError(err.message || 'Failed to fetch resume data');
    } finally {
      setIsLoadingResumeData(false);
    }
  };

  // Function to request CV generation from backend
  const generateCV = async (job_description) => {
    const token = currentUser?.access_token;
    
    if (!token) {
      setError('Authentication required');
      throw new Error('Authentication required');
    }
    
    try {
      setIsGenerating(true);
      setError(null);
      const jobD = encodeURIComponent(job_description || '');
      
      // Request the PDF as JSON with hex-encoded data
      const response = await axios({
        method: 'GET',
        url: `${BACKEND_URL}/resume/build-custom-resume?job_description=${jobD}`,
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        responseType: 'json',
      });
      
      // Get the hex string from the response
      const hexString = response.data.pdf;
      
      if (!hexString) {
        throw new Error("PDF data not found in response");
      }
      
      // Convert hex string to array buffer
      const bytes = new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
      
      // Create blob from the bytes
      const pdfBlob = new Blob([bytes], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      const cvData = {
        pdfUrl,
        blob: pdfBlob,
        fileName: 'custom_resume.pdf',
        contentType: 'application/pdf',
        size: pdfBlob.size || 0
      };
      
      setGeneratedCV(cvData);
      return cvData;
    } catch (err) {
      console.error('Error generating CV:', err);
      setError(err.message || 'Failed to generate CV');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };
  
// Function to generate cover letter
const generateCoverLetter = async (coverLetterData) => {
  const token = currentUser?.access_token;
  
  if (!token) {
    setError('Authentication required');
    throw new Error('Authentication required');
  }
  
  try {
    setIsGeneratingCoverLetter(true);
    setError(null);
    
    const response = await axios({
      method: 'POST',
      url: `${BACKEND_URL}/resume/generate-cover-letter`,
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      data: coverLetterData
    });
    
    const coverLetterResponse = response.data;
    
    // Extract the necessary data
    const coverLetterResult = {
      id: coverLetterResponse.cover_letter_id,
      content: coverLetterResponse.content,
      createdAt: coverLetterResponse.created_at,
      // We'll handle PDF conversion separately
      fileName: 'cover_letter.pdf',
      contentType: 'application/pdf'
    };
    
    setGeneratedCoverLetter(coverLetterResult);
    
    // Now attempt to create a PDF from the LaTeX content
    try {
      // Create a temporary element to render LaTeX
      const tempElement = document.createElement('div');
      tempElement.style.display = 'none';
      document.body.appendChild(tempElement);
      
      // Import pdf-lib dynamically (you need to install this package)
      const { PDFDocument, rgb } = await import('pdf-lib');
      
      // Create a PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      
      // Extract readable content from LaTeX
      const cleanContent = coverLetterResponse.content
        .replace(/\\begin\{document\}|\\end\{document\}/g, '')
        .replace(/\\today/g, new Date().toLocaleDateString())
        .replace(/\\noindent/g, '')
        .replace(/\\\\/g, '\n')
        .replace(/\\vspace\{[^}]*\}/g, '\n')
        .trim();
      
      // Add content to PDF
      page.drawText(cleanContent, {
        x: 50,
        y: height - 50,
        size: 12,
        color: rgb(0, 0, 0),
        lineHeight: 16,
        maxWidth: width - 100
      });
      
      // Save and create a URL
      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      // Remove the temporary element
      document.body.removeChild(tempElement);
      
      // Update the cover letter data with PDF info
      const updatedCoverLetter = {
        ...coverLetterResult,
        pdfUrl,
        blob: pdfBlob,
        size: pdfBlob.size || 0
      };
      
      setGeneratedCoverLetter(updatedCoverLetter);
      return updatedCoverLetter;
    } catch (pdfError) {
      console.error('Error creating PDF from LaTeX:', pdfError);
      // Return the original data even if PDF creation fails
      return coverLetterResult;
    }
  } catch (err) {
    console.error('Error generating cover letter:', err);
    setError(err.message || 'Failed to generate cover letter');
    throw err;
  } finally {
    setIsGeneratingCoverLetter(false);
  }
};
  // Function to download generated cover letter as PDF
  const downloadCoverLetter = async (coverLetterId) => {
    const token = currentUser?.access_token;
    
    if (!token) {
      setError('Authentication required');
      throw new Error('Authentication required');
    }
    
    try {
      setIsGeneratingCoverLetter(true);
      setError(null);
      
      const response = await axios({
        method: 'GET',
        url: `${BACKEND_URL}/resume/download-cover-letter/${coverLetterId}`,
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        responseType: 'json',
      });
      
      // Get the hex string from the response
      const hexString = response.data.pdf;
      
      if (!hexString) {
        throw new Error("PDF data not found in response");
      }
      
      // Convert hex string to array buffer
      const bytes = new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
      
      // Create blob from the bytes
      const pdfBlob = new Blob([bytes], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      const pdfData = {
        pdfUrl,
        blob: pdfBlob,
        fileName: 'cover_letter.pdf',
        contentType: 'application/pdf',
        size: pdfBlob.size || 0
      };
      
      return pdfData;
    } catch (err) {
      console.error('Error downloading cover letter:', err);
      setError(err.message || 'Failed to download cover letter');
      throw err;
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };
  
  // Function to generate combined resume and cover letter
  const generateCombinedDocument = async (documentData) => {
    const token = currentUser?.access_token;
    
    if (!token) {
      setError('Authentication required');
      throw new Error('Authentication required');
    }
    
    try {
      setIsGeneratingCombined(true);
      setError(null);
      
      const response = await axios({
        method: 'POST',
        url: `${BACKEND_URL}/resume/build-resume-with-cover-letter`,
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        data: documentData,
        responseType: 'json',
      });
      
      // Get the hex string from the response
      const hexString = response.data.pdf;
      
      if (!hexString) {
        throw new Error("PDF data not found in response");
      }
      
      // Convert hex string to array buffer
      const bytes = new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
      
      // Create blob from the bytes
      const pdfBlob = new Blob([bytes], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      const combinedData = {
        pdfUrl,
        blob: pdfBlob,
        fileName: 'resume_and_cover_letter.pdf',
        contentType: 'application/pdf',
        size: pdfBlob.size || 0
      };
      
      setCombinedDocument(combinedData);
      return combinedData;
    } catch (err) {
      console.error('Error generating combined document:', err);
      setError(err.message || 'Failed to generate combined document');
      throw err;
    } finally {
      setIsGeneratingCombined(false);
    }
  };
  
  // Function to fetch cover letter history
  const fetchCoverLetterHistory = async () => {
    const token = currentUser?.access_token;
    
    if (!token) {
      setError('Authentication required');
      return;
    }
    
    try {
      setIsLoadingCoverLetters(true);
      setError(null);
      
      const response = await axios({
        method: 'GET',
        url: `${BACKEND_URL}/resume/cover-letters`,
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      
      setCoverLetterHistory(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching cover letter history:', err);
      setError(err.message || 'Failed to fetch cover letter history');
    } finally {
      setIsLoadingCoverLetters(false);
    }
  };
  
  // Function to get a specific cover letter by ID
  const getCoverLetterById = async (coverId) => {
    const token = currentUser?.access_token;
    
    if (!token) {
      setError('Authentication required');
      return;
    }
    
    try {
      setError(null);
      
      const response = await axios({
        method: 'GET',
        url: `${BACKEND_URL}/resume/cover-letter/${coverId}`,
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      
      return response.data;
    } catch (err) {
      console.error('Error fetching cover letter:', err);
      setError(err.message || 'Failed to fetch cover letter');
      throw err;
    }
  };
  
  // Function to download the generated CV
  const downloadGeneratedCV = useCallback(() => {
    if (!generatedCV || !generatedCV.pdfUrl) {
      setError('No CV available to download');
      return;
    }
    
    try {
      const link = document.createElement('a');
      link.href = generatedCV.pdfUrl;
      link.setAttribute('download', generatedCV.fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading CV:', err);
      setError('Failed to download CV');
    }
  }, [generatedCV]);
  
  // Function to download combined document
  const downloadCombinedDocument = useCallback(() => {
    if (!combinedDocument || !combinedDocument.pdfUrl) {
      setError('No combined document available to download');
      return;
    }
    
    try {
      const link = document.createElement('a');
      link.href = combinedDocument.pdfUrl;
      link.setAttribute('download', combinedDocument.fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading combined document:', err);
      setError('Failed to download combined document');
    }
  }, [combinedDocument]);
  
  // Function to clear generated CV
  const clearGeneratedCV = useCallback(() => {
    if (generatedCV && generatedCV.pdfUrl) {
      URL.revokeObjectURL(generatedCV.pdfUrl);
    }
    setGeneratedCV(null);
  }, [generatedCV]);
  
  // Function to clear generated cover letter
  const clearGeneratedCoverLetter = useCallback(() => {
    if (generatedCoverLetter && generatedCoverLetter.pdfUrl) {
      URL.revokeObjectURL(generatedCoverLetter.pdfUrl);
    }
    setGeneratedCoverLetter(null);
  }, [generatedCoverLetter]);
  
  // Function to clear combined document
  const clearCombinedDocument = useCallback(() => {
    if (combinedDocument && combinedDocument.pdfUrl) {
      URL.revokeObjectURL(combinedDocument.pdfUrl);
    }
    setCombinedDocument(null);
  }, [combinedDocument]);
  
  // Function to handle cleanup
  const cleanup = useCallback(() => {
    if (generatedCV && generatedCV.pdfUrl) {
      URL.revokeObjectURL(generatedCV.pdfUrl);
    }
    if (generatedCoverLetter && generatedCoverLetter.pdfUrl) {
      URL.revokeObjectURL(generatedCoverLetter.pdfUrl);
    }
    if (combinedDocument && combinedDocument.pdfUrl) {
      URL.revokeObjectURL(combinedDocument.pdfUrl);
    }
    setGeneratedCV(null);
    setGeneratedCoverLetter(null);
    setCombinedDocument(null);
    setError(null);
  }, [generatedCV, generatedCoverLetter, combinedDocument]);
  
  // Value object that will be passed to consumers
  const value = {
    selectedTemplate,
    setSelectedTemplate,
    generatedCV,
    setGeneratedCV,
    generatedCoverLetter,
    setGeneratedCoverLetter,
    combinedDocument,
    setCombinedDocument,
    resumeData,
    setResumeData,
    coverLetterHistory,
    isGenerating,
    isLoadingResumeData,
    isGeneratingCoverLetter,
    isGeneratingCombined,
    isLoadingCoverLetters,
    error,
    generateCV,
    generateCoverLetter,
    downloadCoverLetter,
    generateCombinedDocument,
    fetchResumeData,
    fetchCoverLetterHistory,
    getCoverLetterById,
    downloadGeneratedCV,
    downloadCombinedDocument,
    clearGeneratedCV,
    clearGeneratedCoverLetter,
    clearCombinedDocument,
    cleanup
  };
  
  return (
    <CustomResumeContext.Provider value={value}>
      {children}
    </CustomResumeContext.Provider>
  );
};

export default CustomResumeContext;