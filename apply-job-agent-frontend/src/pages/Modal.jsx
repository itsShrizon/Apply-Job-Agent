import React from 'react';
import { useModal } from '../Contexts/ModalContext';

const Modal = () => {
    const { isOpen, modalContent, closeModal } = useModal();

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000069] bg-opacity-50"
            onClick={closeModal}
        >
            <div
                className="bg-white rounded-xl shadow-lg p-6 min-w-[300px] max-w-[90%] relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={closeModal}
                    className="absolute top-2 right-3 text-gray-500 hover:text-black text-lg"
                >
                    &times;
                </button>
                {modalContent}
            </div>
        </div>
    );
};

export default Modal;
