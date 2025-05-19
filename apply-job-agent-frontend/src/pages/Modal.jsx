import React from 'react';
import { useModal } from '../Contexts/ModalContext';

const Modal = () => {
    const { isOpen, modalContent, closeModal } = useModal();

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" 
            onClick={closeModal}
        >
            <div 
                className="relative w-full max-w-4xl mx-4 bg-white rounded-xl shadow-2xl overflow-hidden animate-fade-in-up" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute top-4 right-4 z-10">
                    <button 
                        onClick={closeModal} 
                        className="text-gray-500 hover:text-gray-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-2"
                        aria-label="Close modal"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-6 w-6" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M6 18L18 6M6 6l12 12" 
                            />
                        </svg>
                    </button>
                </div>
                <div className="p-6 max-h-[90vh] overflow-hidden flex items-center justify-center my-6">
                    <div className="w-full">
                        {modalContent}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;