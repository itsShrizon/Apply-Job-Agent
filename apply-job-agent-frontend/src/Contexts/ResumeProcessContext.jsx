// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import { useProcessContext } from './ProcessIndicator';

// import { useModal } from '../Contexts/ModalContext';
// import Login from '../pages/AuthComponents/Login';
// import { useAuth } from './AuthContext';

// // Create the context
// const ResumeProcessContext = createContext();

// const BACKEND_URL=import.meta.env.VITE_BACKEND_URL
// // Custom hook to use the context
// export const useResumeProcessContext = () => {
//   return useContext(ResumeProcessContext);
// };

// // Provider component
// export const ResumeProcessProvider = ({ children }) => {
//   // Get process context for tracking phases and rendering the indicator
//   const { 
//     currentPhase, 
//     goToUploadPhase,
//     goToAnalyzePhase,
//     goToFindJobsPhase
//   } = useProcessContext();

//   // State for handling file upload
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [fileName, setFileName] = useState('');
  
//   // State for handling analysis phase
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [analysis, setAnalysis] = useState(null);
//   const [resumeAnalyzeData, setResumeAnalyzeData] = useState(null);
  
//   // State for job results
//   const [jobs, setJobs] = useState([]);
//   const [isLoadingJobs, setIsLoadingJobs] = useState(false);

  
//   const { openModal, isLoggedIn } = useModal();
//   const { currentUser } = useAuth();

//   // Effect to handle user logout - redirect to upload phase if user logs out
//   useEffect(() => {
//     if (!currentUser && (currentPhase === 'analyze' || currentPhase === 'findJobs')) {
//       resetProcess();
//     }
//   }, [currentUser, currentPhase]);
  
//   // Handle file selection
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file && file.type === 'application/pdf') {
//       setSelectedFile(file);
//       setFileName(file.name);
//     } else {
//       alert('Please select a PDF file');
//       setSelectedFile(null);
//       setFileName('');
//     }
//   };

//   // Handle resume upload and move to analysis phase
//   const handleUploadSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedFile) {
//       alert('Please select a PDF file to upload');
//       return;
//     }

//     if (!currentUser) {
//       openModal(<Login />);
//       return;
//     }
    
//     // Move to analyze phase
//     goToAnalyzePhase();
    
//     // Set analyzing state
//     setIsAnalyzing(true);
    
//     try {
//       // Create form data to send file
//       const formData = new FormData();
//       formData.append('file', selectedFile);
      
//       // Log what's being uploaded for debugging
//       console.log('Uploading file:', selectedFile.name, selectedFile.type, selectedFile.size);
      
//       // Send file to backend using axios
//       const response = await axios.post(`${BACKEND_URL}/resume/upload`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Authorization': `Bearer ${currentUser.access_token}`
//         }
//       });
      
//       // Response data is already parsed by axios
//       const data = response.data;
      
//       // Update analysis with response data
//       console.log('Resume analysis data:', data);


//       const skills = data.skills?.technical_skills || [];
//       const experience = data.professional_summary || 'No professional summary available';
//       let educationInfo = 'No education information available';

//       if (data.education && data.education.length > 0) {
//         const firstEducation = data.education[0];
//         const degree = firstEducation.degree_earned || '';
//         const institution = firstEducation.institution_name || '';
//         const year = firstEducation.graduation_year ? `, ${firstEducation.graduation_year}` : '';
        
//         if (degree && institution) {
//           educationInfo = `${degree} - ${institution}${year}`;
//         } else if (degree) {
//           educationInfo = degree + year;
//         } else if (institution) {
//           educationInfo = institution + year;
//         }
//       }
      
//       // Update state with properly formatted data
//       setResumeAnalyzeData(data);
//       setAnalysis({
//         skills: skills,
//         experience: experience,
//         education: educationInfo
//       });
//     } catch (error) {
//       console.error('Error uploading resume:', error);
      
//       // More detailed error handling
//       if (error.response) {
//         // The request was made and the server responded with a status code
//         // that falls out of the range of 2xx
//         const errorMessage = error.response.data.message || 'Server error: ' + error.response.status;
//         console.error('Server error details:', error.response.data);
//         alert(`Error: ${errorMessage}`);
//       } else if (error.request) {
//         // The request was made but no response was received
//         alert('No response from server. Please check your connection and try again.');
//       } else {
//         // Something happened in setting up the request
//         alert('Error uploading resume: ' + error.message);
//       }
      
//       goToUploadPhase();
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };



//   // Handle job search
//   const handleFindJobs = async () => {
//     if (!currentUser) {
//       openModal(<Login />);
//       return;
//     }
    
//     // First move to jobs phase and show loading state
//     goToFindJobsPhase();
//     setIsLoadingJobs(true);
//     setJobs([]); // Clear any previous jobs
    
//     try {
//       const token = currentUser.access_token; // Assuming you have a token in your user object
//       // Send analysis data to get job matches using axios
//       const response = await axios.post(`${BACKEND_URL}/jobs/get-jobs`, { 
//         resume_information: resumeAnalyzeData 
//       },
//       {
//         //Adding token to the request
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       // Response data is already parsed by axios
//       const data = response.data;
//       console.log('Job search results:', data);
      
//       // Handle different possible response formats based on the actual data structure
//       if (data) {
//         if (Array.isArray(data)) {
//           // If data is already an array, use it directly
//           setJobs(data);
//         } else if (data.jobs && Array.isArray(data.jobs)) {
//           // If data has a jobs property that is an array
//           setJobs(data.jobs);
//         } else {
//           // If data is an object with numeric keys (like your example)
//           const jobsArray = Object.keys(data)
//             .filter(key => !isNaN(parseInt(key))) // Only include numeric keys
//             .map(key => data[key]);
          
//           if (jobsArray.length > 0) {
//             setJobs(jobsArray);
//           } else {
//             console.warn('Unexpected job data format:', data);
//             setJobs([]);
//           }
//         }
//       } else {
//         setJobs([]);
//       }
//     } catch (error) {
//       console.error('Error finding jobs:', error);
      
//       // More detailed error handling
//       if (error.response) {
//         // The request was made and the server responded with an error status
//         const errorMessage = error.response.data.message || 'Server error: ' + error.response.status;
//         console.error('Server error details:', error.response.data);
//         alert(`Error: ${errorMessage}`);
//       } else if (error.request) {
//         // The request was made but no response was received
//         alert('No response from server. Please check your connection and try again.');
//       } else {
//         // Something happened in setting up the request
//         alert('Error finding jobs: ' + error.message);
//       }
      
//       // Set jobs to empty array to prevent errors
//       setJobs([]);
//       goToAnalyzePhase();
//     } finally {
//       // Always set loading to false when done, regardless of success or failure
//       setIsLoadingJobs(false);
//     }
//   };


  
//   // Go back to previous phase
//   const handleGoBack = () => {
//     if (currentPhase === 'analyze') {
//       // If in analyze phase, go back to upload
//       setIsAnalyzing(false);
//       setAnalysis(null);
//       setSelectedFile(null);
//       setFileName('');
//       goToUploadPhase();
//     } else if (currentPhase === 'findJobs') {
//       // If in findJobs phase, go back to analyze
//       goToAnalyzePhase();
//     }
//   };

//   // Reset all state
//   const resetProcess = () => {
//     setSelectedFile(null);
//     setFileName('');
//     setIsAnalyzing(false);
//     setAnalysis(null);
//     setResumeAnalyzeData(null);
//     setJobs([]);
//     setIsLoadingJobs(false);
//     goToUploadPhase();
//   };

//   // Create the context value object
//   const contextValue = {
//     // State values
//     currentPhase,
//     selectedFile,
//     fileName,
//     isAnalyzing,
//     analysis,
//     resumeAnalyzeData,
//     jobs,
//     isLoadingJobs,
    
//     // Functions
//     handleFileChange,
//     handleUploadSubmit,
//     handleFindJobs,
//     handleGoBack,
//     resetProcess,
//   };

//   return (
//     <ResumeProcessContext.Provider value={contextValue}>
//       {children}
//     </ResumeProcessContext.Provider>
//   );
// };


import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useProcessContext } from './ProcessIndicator';

import { useModal } from '../Contexts/ModalContext';
import Login from '../pages/AuthComponents/Login';
import { useAuth } from './AuthContext';

// Create the context
const ResumeProcessContext = createContext();

const BACKEND_URL=import.meta.env.VITE_BACKEND_URL
// Custom hook to use the context
export const useResumeProcessContext = () => {
  return useContext(ResumeProcessContext);
};

// Provider component
export const ResumeProcessProvider = ({ children }) => {
  // Get process context for tracking phases and rendering the indicator
  const { 
    currentPhase, 
    goToUploadPhase,
    goToAnalyzePhase,
    goToFindJobsPhase
  } = useProcessContext();

  // State for handling file upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  
  // State for handling analysis phase
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [resumeAnalyzeData, setResumeAnalyzeData] = useState(null);
  
  // State for job results
  const [jobs, setJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);

  // New state for tracking if user has resume data
  const [hasResumeData, setHasResumeData] = useState(false);
  const [isLoadingResumeData, setIsLoadingResumeData] = useState(false);
  
  const { openModal } = useModal();
  const { currentUser } = useAuth();

  // Effect to handle user logout - redirect to upload phase if user logs out
  useEffect(() => {
    if (!currentUser && (currentPhase === 'analyze' || currentPhase === 'findJobs')) {
      resetProcess();
    }
  }, [currentUser, currentPhase]);
  
  // New effect to fetch resume data when user logs in
  useEffect(() => {
    if (currentUser) {
      fetchUserResumeData();
    } else {
      setHasResumeData(false);
      setResumeAnalyzeData(null);
    }
  }, [currentUser]);

  // Function to fetch user's resume data
  const fetchUserResumeData = async () => {
    if (!currentUser) return;
    
    setIsLoadingResumeData(true);
    
    try {
      const response = await axios.get(`${BACKEND_URL}/resume/get-resume-data`, {
        headers: {
          'Authorization': `Bearer ${currentUser.access_token}`
        }
      });
      
      const data = response.data;
      console.log('User resume data:', data);
      
      if (data && Object.keys(data).length > 0) {
        setHasResumeData(true);
        setResumeAnalyzeData(data);
        
        // Format the data for display similar to what we do after upload
        const skills = data.skills?.technical_skills || [];
        const experience = data.professional_summary || 'No professional summary available';
        let educationInfo = 'No education information available';

        if (data.education && data.education.length > 0) {
          const firstEducation = data.education[0];
          const degree = firstEducation.degree_earned || '';
          const institution = firstEducation.institution_name || '';
          const year = firstEducation.graduation_year ? `, ${firstEducation.graduation_year}` : '';
          
          if (degree && institution) {
            educationInfo = `${degree} - ${institution}${year}`;
          } else if (degree) {
            educationInfo = degree + year;
          } else if (institution) {
            educationInfo = institution + year;
          }
        }
        
        setAnalysis({
          skills: skills,
          experience: experience,
          education: educationInfo
        });
        
        // If we're on the upload phase and user has resume data, move to analyze phase
        // if (currentPhase === 'upload') {
        //   goToAnalyzePhase();
        // }
      } else {
        setHasResumeData(false);
      }
    } catch (error) {
      console.error('Error fetching user resume data:', error);
      setHasResumeData(false);
    } finally {
      setIsLoadingResumeData(false);
    }
  };
  
  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setFileName(file.name);
    } else {
      alert('Please select a PDF file');
      setSelectedFile(null);
      setFileName('');
    }
  };

  // Handle resume upload and move to analysis phase
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a PDF file to upload');
      return;
    }

    if (!currentUser) {
      openModal(<Login />);
      return;
    }
    
    // Move to analyze phase
    goToAnalyzePhase();
    
    // Set analyzing state
    setIsAnalyzing(true);
    
    try {
      // Create form data to send file
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // Log what's being uploaded for debugging
      console.log('Uploading file:', selectedFile.name, selectedFile.type, selectedFile.size);
      
      // Send file to backend using axios
      const response = await axios.post(`${BACKEND_URL}/resume/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${currentUser.access_token}`
        }
      });
      
      // Response data is already parsed by axios
      const data = response.data;
      
      // Update analysis with response data
      console.log('Resume analysis data:', data);

      const skills = data.skills?.technical_skills || [];
      const experience = data.professional_summary || 'No professional summary available';
      let educationInfo = 'No education information available';

      if (data.education && data.education.length > 0) {
        const firstEducation = data.education[0];
        const degree = firstEducation.degree_earned || '';
        const institution = firstEducation.institution_name || '';
        const year = firstEducation.graduation_year ? `, ${firstEducation.graduation_year}` : '';
        
        if (degree && institution) {
          educationInfo = `${degree} - ${institution}${year}`;
        } else if (degree) {
          educationInfo = degree + year;
        } else if (institution) {
          educationInfo = institution + year;
        }
      }
      
      // Update state with properly formatted data
      setResumeAnalyzeData(data);
      setAnalysis({
        skills: skills,
        experience: experience,
        education: educationInfo
      });
      
      // Set hasResumeData to true since user now has resume data
      setHasResumeData(true);
    } catch (error) {
      console.error('Error uploading resume:', error);
      
      // More detailed error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage = error.response.data.message || 'Server error: ' + error.response.status;
        console.error('Server error details:', error.response.data);
        alert(`Error: ${errorMessage}`);
      } else if (error.request) {
        // The request was made but no response was received
        alert('No response from server. Please check your connection and try again.');
      } else {
        // Something happened in setting up the request
        alert('Error uploading resume: ' + error.message);
      }
      
      goToUploadPhase();
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle job search
  const handleFindJobs = async () => {
    if (!currentUser) {
      openModal(<Login />);
      return;
    }
    
    // First move to jobs phase and show loading state
    goToFindJobsPhase();
    setIsLoadingJobs(true);
    setJobs([]); // Clear any previous jobs
    
    try {
      const token = currentUser.access_token; // Assuming you have a token in your user object
      // Send analysis data to get job matches using axios
      const response = await axios.post(`${BACKEND_URL}/jobs/get-jobs`, { 
        resume_information: resumeAnalyzeData 
      },
      {
        //Adding token to the request
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Response data is already parsed by axios
      const data = response.data;
      console.log('Job search results:', data);
      
      // Handle different possible response formats based on the actual data structure
      if (data) {
        if (Array.isArray(data)) {
          // If data is already an array, use it directly
          setJobs(data);
        } else if (data.jobs && Array.isArray(data.jobs)) {
          // If data has a jobs property that is an array
          setJobs(data.jobs);
        } else {
          // If data is an object with numeric keys (like your example)
          const jobsArray = Object.keys(data)
            .filter(key => !isNaN(parseInt(key))) // Only include numeric keys
            .map(key => data[key]);
          
          if (jobsArray.length > 0) {
            setJobs(jobsArray);
          } else {
            console.warn('Unexpected job data format:', data);
            setJobs([]);
          }
        }
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error('Error finding jobs:', error);
      
      // More detailed error handling
      if (error.response) {
        // The request was made and the server responded with an error status
        const errorMessage = error.response.data.message || 'Server error: ' + error.response.status;
        console.error('Server error details:', error.response.data);
        alert(`Error: ${errorMessage}`);
      } else if (error.request) {
        // The request was made but no response was received
        alert('No response from server. Please check your connection and try again.');
      } else {
        // Something happened in setting up the request
        alert('Error finding jobs: ' + error.message);
      }
      
      // Set jobs to empty array to prevent errors
      setJobs([]);
      goToAnalyzePhase();
    } finally {
      // Always set loading to false when done, regardless of success or failure
      setIsLoadingJobs(false);
    }
  };
  
  // Go back to previous phase
  const handleGoBack = () => {
    if (currentPhase === 'analyze') {
      // If in analyze phase, go back to upload
      setIsAnalyzing(false);
      setAnalysis(null);
      setSelectedFile(null);
      setFileName('');
      goToUploadPhase();
    } else if (currentPhase === 'findJobs') {
      // If in findJobs phase, go back to analyze
      goToAnalyzePhase();
    }
  };

  // Reset all state
  const resetProcess = () => {
    setSelectedFile(null);
    setFileName('');
    setIsAnalyzing(false);
    setAnalysis(null);
    setResumeAnalyzeData(null);
    setJobs([]);
    setIsLoadingJobs(false);
    setHasResumeData(false);
    goToUploadPhase();
  };

  // Create the context value object
  const contextValue = {
    // State values
    currentPhase,
    selectedFile,
    fileName,
    isAnalyzing,
    analysis,
    resumeAnalyzeData,
    jobs,
    isLoadingJobs,
    hasResumeData,
    isLoadingResumeData,
    
    // Functions
    handleFileChange,
    handleUploadSubmit,
    handleFindJobs,
    handleGoBack,
    resetProcess,
    fetchUserResumeData
  };

  return (
    <ResumeProcessContext.Provider value={contextValue}>
      {children}
    </ResumeProcessContext.Provider>
  );
};