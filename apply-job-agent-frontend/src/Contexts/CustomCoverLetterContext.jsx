import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const CustomCoverLetterContext = createContext();

// Custom hook to use the context
export const useCustomCoverLetter = () => {
  const context = useContext(CustomCoverLetterContext);
  if (!context) {
    throw new Error('useCustomCoverLetter must be used within a CustomCoverLetterProvider');
  }
  return context;
};

// Provider component
export const CustomCoverLetterProvider = ({ children }) => {
  // State for the selected cover letter template
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  
  // State for the generated cover letter
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState(null);
  
  // Loading state for cover letter generation
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Error state
  const [error, setError] = useState(null);
  
  // State for user's cover letters
  const [userCoverLetters, setUserCoverLetters] = useState([]);
  
  // Form data for cover letter generation
  const [coverLetterData, setCoverLetterData] = useState({
    job_description: '',
    company_name: '',
    position_title: '',
    hiring_manager_name: '',
    additional_notes: ''
  });

  const { currentUser } = useAuth();

  // Clean up blob URLs when component unmounts or when generatedCoverLetter changes
  useEffect(() => {
    return () => {
      if (generatedCoverLetter && generatedCoverLetter.pdfUrl) {
        URL.revokeObjectURL(generatedCoverLetter.pdfUrl);
      }
    };
  }, [generatedCoverLetter]);

  // Function to fetch user's cover letters
  const fetchUserCoverLetters = useCallback(async () => {
    const token = currentUser?.access_token;
    
    if (!token) {
      setError('Authentication required');
      return;
    }
    
    try {
      setError(null);
      
      const response = await axios({
        method: 'GET',
        url: `${BACKEND_URL}/cover-letter/get-cover-letter-data`,
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      setUserCoverLetters(response.data || []);
      return response.data;
    } catch (err) {
      console.error('Error fetching cover letters:', err);
      setError(err.message || 'Failed to fetch cover letters');
    }
  }, [currentUser]);

  // Function to handle form data changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setCoverLetterData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Function to generate and save cover letter
  const generateCoverLetter = async () => {
    const token = currentUser?.access_token;
    
    if (!token) {
      setError('Authentication required');
      throw new Error('Authentication required');
    }
    
    try {
      setIsGenerating(true);
      setError(null);
      
      // Build the query parameters from the form data
      const params = new URLSearchParams({
        job_description: coverLetterData.job_description,
        company_name: coverLetterData.company_name,
        position_title: coverLetterData.position_title
      });
      
      // Add optional parameters if they exist
      if (coverLetterData.hiring_manager_name) {
        params.append('hiring_manager_name', coverLetterData.hiring_manager_name);
      }
      
      if (coverLetterData.additional_notes) {
        params.append('additional_notes', coverLetterData.additional_notes);
      }
      
      // Request the cover letter 
      const response = await axios({
        method: 'GET',
        url: `${BACKEND_URL}/cover-letter/build-custom-cover-letter?${params.toString()}`,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        responseType: 'json'
      });
      
      if (!response.data || !response.data.pdf) {
        throw new Error("Cover letter PDF not found in response");
      }
      
      // Convert hex string to blob
      const hexString = response.data.pdf;
      const byteArray = new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
      const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });
      
      // Create a URL for the blob
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      setGeneratedCoverLetter({
        content: "Cover letter generated successfully",
        pdfUrl: pdfUrl,
        previewOnly: false
      });
      
      // Refresh the user's cover letter list
      await fetchUserCoverLetters();
      
      return pdfUrl;
    } catch (err) {
      console.error('Error generating cover letter:', err);
      setError(err.message || 'Failed to generate cover letter');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Function to download a specific cover letter by ID
  const downloadCoverLetter = useCallback(async (coverId = null) => {
    const id = coverId || (generatedCoverLetter && generatedCoverLetter.id);
    
    if (!id) {
      setError('No cover letter ID provided');
      return;
    }
    
    const token = currentUser?.access_token;
    
    if (!token) {
      setError('Authentication required');
      return;
    }
    
    try {
      setIsGenerating(true);
      
      // Request the PDF file
      const response = await axios({
        method: 'GET',
        url: `${BACKEND_URL}/cover-letter/download/${id}`,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        responseType: 'blob'
      });
      
      // Create blob URL from the response
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      // Create and click a download link
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', `cover_letter_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
    } catch (err) {
      console.error('Error downloading cover letter:', err);
      setError(err.message || 'Failed to download cover letter');
    } finally {
      setIsGenerating(false);
    }
  }, [generatedCoverLetter, currentUser]);
  
  // Function to clear generated cover letter
  const clearGeneratedCoverLetter = useCallback(() => {
    if (generatedCoverLetter && generatedCoverLetter.pdfUrl) {
      URL.revokeObjectURL(generatedCoverLetter.pdfUrl);
    }
    setGeneratedCoverLetter(null);
  }, [generatedCoverLetter]);
  
  // Function to reset the form
  const resetForm = useCallback(() => {
    setCoverLetterData({
      job_description: '',
      company_name: '',
      position_title: '',
      hiring_manager_name: '',
      additional_notes: ''
    });
    clearGeneratedCoverLetter();
    setError(null);
  }, [clearGeneratedCoverLetter]);
  
  // Function to handle cleanup
  const cleanup = useCallback(() => {
    if (generatedCoverLetter && generatedCoverLetter.pdfUrl) {
      URL.revokeObjectURL(generatedCoverLetter.pdfUrl);
    }
    setGeneratedCoverLetter(null);
    setError(null);
  }, [generatedCoverLetter]);
  
  // Value object that will be passed to consumers
  const value = {
    selectedTemplate,
    setSelectedTemplate,
    generatedCoverLetter,
    setGeneratedCoverLetter,
    isGenerating,
    error,
    coverLetterData,
    setCoverLetterData,
    handleInputChange,
    generateCoverLetter,
    downloadCoverLetter,
    clearGeneratedCoverLetter,
    resetForm,
    cleanup,
    userCoverLetters,
    fetchUserCoverLetters
  };
  
  return (
    <CustomCoverLetterContext.Provider value={value}>
      {children}
    </CustomCoverLetterContext.Provider>
  );
};

export default CustomCoverLetterContext;