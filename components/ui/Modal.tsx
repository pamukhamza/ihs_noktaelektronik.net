import React from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative transition-transform transform-gpu">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition duration-200 text-2xl"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-6 text-center">Request a Quote</h2>
        <div className="space-y-4">
          {children}
        </div>
     
      </div>
    </div>
  );
};

export default Modal;