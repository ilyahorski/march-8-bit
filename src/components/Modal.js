'use client';

import { useEffect, useRef } from 'react';
import PixelArt from './PixelArt';
import { useAudio } from '../context/AudioContext';

export default function Modal({ isOpen, onClose, title, children, pixelArtType = 'world' }) {
  const modalRef = useRef(null);
  const { playSoundEffect } = useAudio();
  
  // Handle close with sound
  const handleClose = () => {
    playSoundEffect('close');
    onClose();
  };

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    }

    // Add event listener when modal is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    // Clean up event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close modal when ESC key is pressed
  useEffect(() => {
    function handleEscKey(event) {
      if (event.key === 'Escape') {
        handleClose();
      }
    }

    // Add event listener when modal is open
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    // Clean up event listener
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div 
        ref={modalRef}
        className="relative border-4 border-[#ffd700] shadow-[0_0_0_4px_#ff69b4,0_0_0_8px_#ffd700] p-4 max-w-md w-full max-h-[80vh] overflow-y-auto bg-[#0a0a0a] animate-modal-fade-in"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="mr-2">
              <PixelArt type={pixelArtType} />
            </div>
            <h3 className="text-[#ff69b4] font-bold">{title}</h3>
          </div>
          <button 
            onClick={handleClose}
            className="bg-[#ff69b4] text-[#0a0a0a] border-2 border-[#ffd700] font-mono uppercase cursor-pointer transition-all duration-100 text-center w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center p-0 ml-2 text-xs sm:text-base hover:bg-[#9370db] hover:-translate-y-0.5 active:translate-y-0.5"
            aria-label="Закрыть"
          >
            X
          </button>
        </div>
        
        <div className="leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
