// import React, { useState } from 'react';
// import { useModal } from '../../../Contexts/ModalContext';
// import cvtemplate from '../../../assets/cvT.png'
// import SmartCVPreview from './SmartCVPreview';
// import { useCustomResume } from '../../../Contexts/CustomResumeContext';

// const CVTemplateSelection = ({job_description}) => {
//   const { closeModal, openModal } = useModal();
// //   const [selectedTemplate, setSelectedTemplate] = useState(0);
//   const [imageLoaded, setImageLoaded] = useState(false);
//   const [imageError, setImageError] = useState(false);
//   console.log("job:",job_description)
//   const { 
//     selectedTemplate, 
//     setSelectedTemplate, 
//     generateCV, 
//     isGenerating 
//   } = useCustomResume()
//   // Template data - for now just one template, but structured to add more later
//   const templates = [
//     {
//       id: 1,
//       name: "Professional Modern",
//       description: "Clean layout with modern typography, optimized for ATS systems and professional roles.",
//       imageSrc:cvtemplate, // Path to your image
//       features: [
//         "ATS-friendly format ensures your resume passes automated screening",
//         "Balanced white space for improved readability",
//         "Strategic skill placement to highlight your core competencies",
//         "Optimized section ordering based on industry standards"
//       ]
//     }
//     // More templates can be added here in the future
//   ];

//   const handleTemplateSelect = (templateId) => {
//     setSelectedTemplate(templateId);
//   };

//   console.log(selectedTemplate)
//   const handleNext = async () => {
//     if (!selectedTemplate) {
//       // Show an error or notification that template selection is required
//       return;
//     }
    
//     // Open the modal first so user sees the loading state
//     openModal(<SmartCVPreview />);
    
//     try {
//       // This will trigger the loading state in the preview component
//       await generateCV(job_description);
      
//       // Modal is already open with SmartCVPreview, which will 
//       // show the generated CV once it's ready
//     } catch (error) {
//       // Error handling is managed in the context and displayed in the preview
//       console.error('Failed to generate resume:', error);
//     }
//   };

//   // CSS Mockup component to use as fallback
//   const TemplateMockup = () => (
//     <div className="w-full h-full p-2">
//       <div className="bg-white h-full flex flex-col border border-gray-100 overflow-hidden">
//         {/* Header section */}
//         <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-2 border-b border-indigo-100">
//           <div className="h-4 bg-indigo-600 rounded w-2/3 mb-1"></div>
//           <div className="h-3 bg-indigo-400 rounded w-1/2"></div>
//         </div>
        
//         {/* Contact info */}
//         <div className="flex justify-center py-1 border-b border-gray-200">
//           <div className="h-2 bg-gray-300 rounded w-4/5"></div>
//         </div>
        
//         {/* Content sections */}
//         <div className="p-2 space-y-2 flex-grow">
//           {/* Experience section */}
//           <div>
//             <div className="h-3 bg-indigo-500 rounded w-1/3 mb-1"></div>
//             <div className="space-y-1 mb-2">
//               <div className="h-2 bg-gray-200 rounded w-full"></div>
//               <div className="h-2 bg-gray-200 rounded w-5/6"></div>
//               <div className="h-2 bg-gray-200 rounded w-4/5"></div>
//             </div>
//             <div className="space-y-1">
//               <div className="h-2 bg-gray-200 rounded w-full"></div>
//               <div className="h-2 bg-gray-200 rounded w-3/4"></div>
//             </div>
//           </div>
          
//           {/* Skills section */}
//           <div>
//             <div className="h-3 bg-indigo-500 rounded w-1/4 mb-1"></div>
//             <div className="flex flex-wrap gap-1">
//               <div className="h-3 w-12 bg-indigo-100 rounded-full"></div>
//               <div className="h-3 w-16 bg-indigo-100 rounded-full"></div>
//               <div className="h-3 w-10 bg-indigo-100 rounded-full"></div>
//               <div className="h-3 w-14 bg-indigo-100 rounded-full"></div>
//               <div className="h-3 w-12 bg-indigo-100 rounded-full"></div>
//             </div>
//           </div>
          
//           {/* Education section */}
//           <div>
//             <div className="h-3 bg-indigo-500 rounded w-1/3 mb-1"></div>
//             <div className="space-y-1">
//               <div className="h-2 bg-gray-200 rounded w-5/6"></div>
//               <div className="h-2 bg-gray-200 rounded w-2/3"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full mx-auto">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
//         <div className="flex justify-between items-center">
//           <h3 className="text-white font-semibold text-lg">Choose Your Custom Resume Template</h3>
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
      
//       <div className="p-6">
//         {/* Introduction */}
//         <div className="mb-6">
//           <h4 className="text-gray-800 font-medium text-lg mb-2">Select a Professional Template</h4>
//           <p className="text-sm text-gray-600">
//             Choose from our professionally designed resume templates to showcase your qualifications effectively. 
//             This template is crafted to highlight your skills and experience in a clear, recruiter-friendly format. 
//             Select this template to create a polished resume that stands out to employers.
//           </p>
//         </div>
        
//         {/* Template selection area */}
//         <div className="grid grid-cols-1 gap-6">
//           {templates.map((template) => (
//             <div 
//               key={template.id}
//               className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
//                 selectedTemplate === template.id ? 'border-indigo-500 shadow-md' : 'border-gray-200 hover:border-indigo-300'
//               }`}
//               onClick={() => handleTemplateSelect(template.id)}
//             >
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {/* Template preview image - left side */}
//                 <div className="bg-gray-100 p-3">
//                   <div className="bg-white shadow rounded overflow-hidden h-full flex items-center justify-center">
//                     {/* Try to load the actual image, with fallback to CSS mockup */}
//                     {!imageError ? (
//                       <img 
//                         src={template.imageSrc} 
//                         alt={`${template.name} Template Preview`}
//                         className={`w-full h-auto object-contain ${imageLoaded ? 'block' : 'hidden'}`}
//                         onLoad={() => setImageLoaded(true)}
//                         onError={() => setImageError(true)}
//                       />
//                     ) : null}
                    
//                     {/* Show CSS mockup if image fails to load or while loading */}
//                     {(!imageLoaded || imageError) && <TemplateMockup />}
//                   </div>
//                 </div>
                
//                 {/* Template details - right side */}
//                 <div className="p-4 md:col-span-2">
//                   <div className="flex items-center justify-between mb-2">
//                     <h5 className="font-medium text-gray-800">{template.name}</h5>
//                     {selectedTemplate === template.id && (
//                       <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
//                         Selected
//                       </span>
//                     )}
//                   </div>
//                   <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  
//                   <h6 className="text-xs font-medium text-gray-700 mb-1">Why this template works for you:</h6>
//                   <ul className="text-xs text-gray-600 space-y-1">
//                     {template.features.map((feature, index) => (
//                       <li key={index} className="flex items-start space-x-2">
//                         <svg className="w-3.5 h-3.5 text-indigo-500 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                         </svg>
//                         <span>{feature}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
      
//       {/* Footer with action buttons */}
//       <div className="bg-gray-50 px-6 py-4 flex justify-between">
//         <button 
//           onClick={closeModal}
//           className="px-4 py-2 bg-white text-gray-600 border border-gray-300 rounded text-sm hover:bg-gray-50 transition"
//         >
//           Cancel
//         </button>
        
//         <button 
//           onClick={handleNext}
//           disabled={!selectedTemplate || isGenerating}
//           className={`px-6 py-2.5 rounded-lg transition text-sm font-medium ${
//             !selectedTemplate || isGenerating
//               ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//               : 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 shadow-sm'
//           }`}
//         >
//           {isGenerating ? (
//             <div className="flex items-center">
//               <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               Processing...
//             </div>
//           ) : (
//             'Generate Resume'
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CVTemplateSelection;

import React from 'react';
import { useModal } from '../../../Contexts/ModalContext';
import cvtemplate from '../../../assets/cvT.png';
import SmartCVPreview from './SmartCVPreview';
import { useCustomResume } from '../../../Contexts/CustomResumeContext';

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
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-xs mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3">
        <h3 className="text-white font-semibold text-center">Resume Template</h3>
      </div>
      
      {/* Just the template image */}
      <div 
        className={`cursor-pointer ${selectedTemplate === 1 ? 'ring-2 ring-indigo-500' : ''}`}
        onClick={handleTemplateSelect}
      >
        <img 
          src={cvtemplate} 
          alt="Resume Template" 
          className="w-full h-auto"
        />
      </div>
      
      {/* Footer with action buttons */}
      <div className="bg-gray-50 px-4 py-3 flex justify-between">
        <button 
          onClick={closeModal}
          className="px-4 py-2 bg-white text-gray-600 border border-gray-300 rounded text-sm hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        
        <button 
          onClick={handleNext}
          disabled={isGenerating}
          className={`px-5 py-2 rounded transition text-sm font-medium ${
            isGenerating
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90'
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