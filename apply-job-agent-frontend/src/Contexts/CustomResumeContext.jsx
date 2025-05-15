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
  
  // Loading state for CV generation
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Error state
  const [error, setError] = useState(null);

  const { currentUser } = useAuth();

  // Clean up blob URLs when component unmounts or when generatedCV changes
  useEffect(() => {
    return () => {
      if (generatedCV && generatedCV.pdfUrl) {
        URL.revokeObjectURL(generatedCV.pdfUrl);
      }
    };
  }, [generatedCV]);

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
      
      // Updated to handle JSON response with hex-encoded PDF
      const response = await axios({
        method: 'GET',
        url: `${BACKEND_URL}/resume/build-custom-resume?job_description=${jobD}`,
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        responseType: 'json', // Changed from 'blob' to 'json'
      });
      
      // Convert hex string to array buffer
      const hexString = response.data.pdf;
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
      const data = await response.data;
      console.log(data)
      setGeneratedCV(data);
      return data;
    } catch (err) {
      console.error('Error generating CV:', err);
      setError(err.message || 'Failed to generate CV');
      throw err;
    } finally {
      setIsGenerating(false);
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
  
  // Function to clear generated CV
  const clearGeneratedCV = useCallback(() => {
    if (generatedCV && generatedCV.pdfUrl) {
      URL.revokeObjectURL(generatedCV.pdfUrl);
    }
    setGeneratedCV(null);
  }, [generatedCV]);
  
  // Function to handle cleanup
  const cleanup = useCallback(() => {
    if (generatedCV && generatedCV.pdfUrl) {
      URL.revokeObjectURL(generatedCV.pdfUrl);
    }
    setGeneratedCV(null);
    setError(null);
  }, [generatedCV]);
  
  // Value object that will be passed to consumers
  const value = {
    selectedTemplate,
    setSelectedTemplate,
    generatedCV,
    setGeneratedCV,
    isGenerating,
    error,
    generateCV,
    downloadGeneratedCV,
    clearGeneratedCV,
    cleanup
  };
  
  return (
    <CustomResumeContext.Provider value={value}>
      {children}
    </CustomResumeContext.Provider>
  );
};

export default CustomResumeContext;