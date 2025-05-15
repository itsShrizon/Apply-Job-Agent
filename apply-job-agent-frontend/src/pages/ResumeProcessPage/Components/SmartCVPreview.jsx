// import React, { useEffect } from 'react';
// import { useModal } from '../../../Contexts/ModalContext'; // Update with correct path
// import { useCustomResume } from '../../../Contexts/CustomResumeContext'; // Update with correct path

// const SmartCVPreview = () => {
//   const { closeModal } = useModal();
//   const { 
//     generatedCV, 
//     isGenerating, 
//     error,
//     downloadGeneratedCV,
//     clearGeneratedCV 
//   } = useCustomResume();

//   // Clean up when component unmounts
//   useEffect(() => {
//     return () => {
//       // Optional: Clear generated CV when closing the modal
//       // clearGeneratedCV();
//     };
//   }, []);

//   return (
//     <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full mx-auto">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-4">
//         <div className="flex justify-between items-center">
//           <h3 className="text-white font-semibold text-lg">Custom Resume Preview</h3>
//           {/* <button 
//             onClick={closeModal}
//             className="text-white hover:text-gray-200 focus:outline-none"
//           >
//             <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button> */}
//         </div>
//       </div>
      
//       {/* CV Preview Content */}
//       <div className="p-6">
//         <div className="bg-gray-100 rounded-lg border border-gray-200 p-2 mb-4">
//           {/* Loading State */}
//           {isGenerating && (
//             <div className="bg-gray-200 w-full h-96 flex items-center justify-center rounded">
//               <div className="text-center">
//                 <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-500 border-solid mx-auto"></div>
//                 <p className="text-gray-500 mt-4">Generating your custom resume...</p>
//                 <p className="text-xs text-gray-400 mt-1">This may take a moment</p>
//               </div>
//             </div>
//           )}
          
//           {/* Error State */}
//           {error && !isGenerating && (
//             <div className="bg-gray-200 w-full h-96 flex items-center justify-center rounded">
//               <div className="text-center">
//                 <svg 
//                   className="w-16 h-16 mx-auto text-red-500" 
//                   xmlns="http://www.w3.org/2000/svg" 
//                   fill="none" 
//                   viewBox="0 0 24 24" 
//                   stroke="currentColor"
//                 >
//                   <path 
//                     strokeLinecap="round" 
//                     strokeLinejoin="round" 
//                     strokeWidth={1} 
//                     d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
//                   />
//                 </svg>
//                 <p className="text-red-500 font-medium mt-2">Error generating custom resume</p>
//                 <p className="text-xs text-gray-500 mt-1">{error}</p>
//                 <button className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded transition">
//                   Try Again
//                 </button>
//               </div>
//             </div>
//           )}
          
//           {/* CV Preview When Available */}
//           {!isGenerating && !error && generatedCV && (
//             <div className="bg-white w-full h-96 overflow-auto rounded border border-gray-300">
//               {generatedCV.pdfUrl ? (
//                 <iframe 
//                   src={generatedCV.pdfUrl} 
//                   className="w-full h-full"
//                   title="CV Preview"
//                   frameBorder="0"
//                 ></iframe>
//               ) : (
//                 <div className="p-4">
//                   <p className="text-gray-500">Custom resume preview not available</p>
//                 </div>
//               )}
//             </div>
//           )}
          
//           {/* Empty State - No CV Generated Yet and Not Loading */}
//           {!isGenerating && !error && !generatedCV && (
//             <div className="bg-gray-200 w-full h-96 flex items-center justify-center rounded">
//               <div className="text-center">
//                 <svg 
//                   className="w-16 h-16 mx-auto text-gray-400" 
//                   xmlns="http://www.w3.org/2000/svg" 
//                   fill="none" 
//                   viewBox="0 0 24 24" 
//                   stroke="currentColor"
//                 >
//                   <path 
//                     strokeLinecap="round" 
//                     strokeLinejoin="round" 
//                     strokeWidth={1} 
//                     d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
//                   />
//                 </svg>
//                 <p className="text-gray-500 mt-2">CV Preview</p>
//                 <p className="text-xs text-gray-400 mt-1">(Your custom resume will appear here)</p>
//               </div>
//             </div>
//           )}
//         </div>
        
//         {/* Description */}
//         <div className="space-y-3">
//           <h4 className="text-gray-800 font-medium">
//             {isGenerating ? 'Preparing Your Custom Resume...' : 'Your Custom Resume is Ready!'}
//           </h4>
//           <p className="text-sm text-gray-600">
//             {isGenerating 
//               ? "We're generating a professional resume based on your resume and selected template. Please wait a moment." 
//               : "We've generated a professional resume based on your resume analysis. This custom resume highlights your key skills, experience, and qualifications in a format that stands out to employers."}
//           </p>
          
//           {/* Features list - only show when not loading */}
//           {!isGenerating && (
//             <div className="grid grid-cols-2 gap-2">
//               <div className="flex items-start space-x-2">
//                 <svg className="w-4 h-4 text-emerald-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                 </svg>
//                 <span className="text-xs text-gray-600">ATS-Friendly Format</span>
//               </div>
//               <div className="flex items-start space-x-2">
//                 <svg className="w-4 h-4 text-emerald-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                 </svg>
//                 <span className="text-xs text-gray-600">Professional Design</span>
//               </div>
//               <div className="flex items-start space-x-2">
//                 <svg className="w-4 h-4 text-emerald-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                 </svg>
//                 <span className="text-xs text-gray-600">Optimized Content</span>
//               </div>
//               <div className="flex items-start space-x-2">
//                 <svg className="w-4 h-4 text-emerald-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                 </svg>
//                 <span className="text-xs text-gray-600">Industry-Standard Format</span>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
      
//       {/* Footer with action buttons */}
//       <div className="bg-gray-50 px-6 py-4 flex justify-between">
//         <button 
//           onClick={closeModal}
//           className="px-4 py-2 bg-white text-gray-600 border border-gray-300 rounded text-sm hover:bg-gray-50 transition"
//         >
//           Close
//         </button>
        
//         <div className="flex space-x-2">
//           {/* Only enable buttons when CV is generated and not loading */}
//           <button 
//             onClick={downloadGeneratedCV}
//             disabled={isGenerating || !generatedCV}
//             className={`px-4 py-2 border rounded text-sm transition ${
//               isGenerating || !generatedCV 
//                 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
//                 : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'
//             }`}
//           >
//             <div className="flex items-center">
//               <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//               </svg>
//               <span>Download</span>
//             </div>
//           </button>
          
//           {/* <button 
//             disabled={isGenerating || !generatedCV}
//             className={`px-4 py-2 rounded text-sm shadow-sm ${
//               isGenerating || !generatedCV
//                 ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                 : 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600'
//             }`}
//           >
//             <div className="flex items-center">
//               <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
//               </svg>
//               <span>Edit CV</span>
//             </div>
//           </button> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SmartCVPreview;


import React, { useEffect } from 'react';
import { useModal } from '../../../Contexts/ModalContext';
import { useCustomResume } from '../../../Contexts/CustomResumeContext';

const SmartCVPreview = () => {
  const { closeModal } = useModal();
  const { 
    generatedCV, 
    isGenerating, 
    error,
    downloadGeneratedCV,
    clearGeneratedCV 
  } = useCustomResume();

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      // Optional: Clear generated CV when closing the modal
      // clearGeneratedCV();
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex justify-between items-center">
          <h3 className="text-white font-semibold text-base sm:text-lg">Custom Resume Preview</h3>
        </div>
      </div>
      
      {/* CV Preview Content */}
      <div className="p-3 sm:p-5">
        <div className="bg-gray-100 rounded-lg border border-gray-200 p-2 mb-3">
          {/* Loading State */}
          {isGenerating && (
            <div className="bg-gray-50 w-full h-64 sm:h-80 flex items-center justify-center rounded">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-indigo-500 border-solid mx-auto"></div>
                <p className="text-gray-500 mt-3 text-sm sm:text-base">Generating your custom resume...</p>
                <p className="text-xs text-gray-400 mt-1">This may take a moment</p>
              </div>
            </div>
          )}
          
          {/* Error State */}
          {error && !isGenerating && (
            <div className="bg-gray-50 w-full h-64 sm:h-80 flex items-center justify-center rounded">
              <div className="text-center px-4">
                <svg 
                  className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-red-500" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                  />
                </svg>
                <p className="text-red-500 font-medium mt-2 text-sm sm:text-base">Error generating custom resume</p>
                <p className="text-xs text-gray-500 mt-1">{error}</p>
                <button className="mt-3 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded transition">
                  Try Again
                </button>
              </div>
            </div>
          )}
          
          {/* CV Preview When Available */}
          {!isGenerating && !error && generatedCV && (
            <div className="bg-white w-full h-64 sm:h-80 overflow-auto rounded border border-gray-300">
              {generatedCV.pdfUrl ? (
                <iframe 
                  src={generatedCV.pdfUrl} 
                  className="w-full h-full"
                  title="CV Preview"
                  frameBorder="0"
                ></iframe>
              ) : (
                <div className="p-4 flex items-center justify-center h-full">
                  <p className="text-gray-500 text-sm sm:text-base">Custom resume preview not available</p>
                </div>
              )}
            </div>
          )}
          
          {/* Empty State - No CV Generated Yet and Not Loading */}
          {!isGenerating && !error && !generatedCV && (
            <div className="bg-gray-50 w-full h-64 sm:h-80 flex items-center justify-center rounded">
              <div className="text-center">
                <svg 
                  className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
                <p className="text-gray-500 mt-2 text-sm sm:text-base">CV Preview</p>
                <p className="text-xs text-gray-400 mt-1">(Your custom resume will appear here)</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Description - Show only on larger screens */}
        <div className="space-y-2 hidden sm:block">
          <h4 className="text-gray-800 font-medium text-base">
            {isGenerating ? 'Preparing Your Custom Resume...' : 'Your Custom Resume is Ready!'}
          </h4>
          <p className="text-sm text-gray-600">
            {isGenerating 
              ? "We're generating a professional resume based on your information and selected template." 
              : "We've created a professional resume that highlights your key skills and qualifications."}
          </p>
          
          {/* Features list - only show when not loading on larger screens */}
          {!isGenerating && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="flex items-start space-x-1.5">
                <svg className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs text-gray-600">ATS-Friendly Format</span>
              </div>
              <div className="flex items-start space-x-1.5">
                <svg className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs text-gray-600">Professional Design</span>
              </div>
              <div className="flex items-start space-x-1.5">
                <svg className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs text-gray-600">Optimized Content</span>
              </div>
              <div className="flex items-start space-x-1.5">
                <svg className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs text-gray-600">Industry-Standard Format</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer with action buttons */}
      <div className="bg-gray-50 px-3 py-3 sm:px-6 sm:py-4 flex justify-between">
        <button 
          onClick={closeModal}
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white text-gray-600 border border-gray-300 rounded text-xs sm:text-sm hover:bg-gray-50 transition"
        >
          Close
        </button>
        
        <button 
          onClick={downloadGeneratedCV}
          disabled={isGenerating || !generatedCV}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded text-xs sm:text-sm font-medium ${
            isGenerating || !generatedCV 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90'
          }`}
        >
          <div className="flex items-center">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SmartCVPreview;