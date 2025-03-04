'use client';

import { useSelections, categories } from '../context/SelectionContext';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import PixelArt from './PixelArt';
import Modal from './Modal';
import { useAudio } from '../context/AudioContext';

export default function CategorySelection({ category }) {
  const { updateSelection, nextCategory, selections } = useSelections();
  const { playSoundEffect } = useAudio();
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [modalOption, setModalOption] = useState(null);

  // Reset selected option when category changes
  useEffect(() => {
    setSelectedOption(selections[category]);
    setModalOption(null);
  }, [category, selections]);

  // Handle option selection
  const handleSelect = (option) => {
    playSoundEffect('choose');
    setSelectedOption(option);
    updateSelection(category, option);
  };

  // Handle continue button click
  const handleContinue = () => {
    if (selectedOption) {
      playSoundEffect('select');
      setIsAnimating(true);
      
      // Add a delay for animation
      setTimeout(() => {
        nextCategory();
        setIsAnimating(false);
      }, 500);
    }
  };

  // Open description modal
  const openDescriptionModal = (e, option) => {
    e.stopPropagation(); // Prevent option selection when clicking the info button
    playSoundEffect('info');
    setModalOption(option);
  };

  // Close description modal
  const closeDescriptionModal = () => {
    setModalOption(null);
  };

  // Get pixel art type based on category
  const getPixelArtType = () => {
    switch(category) {
      case 'world': return 'world';
      case 'character': return 'character';
      case 'gift': return 'gift';
      case 'ability': return 'ability';
      case 'companion': return 'companion';
      default: return 'world';
    }
  };

  // If category doesn't exist, show error
  if (!categories[category]) {
    return <div className="text-center">Категория не найдена</div>;
  }

  const currentCategory = categories[category];

  return (
    <div className={`transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
      
      <h1 className="text-[#ff69b4] text-center mb-6 text-2xl leading-normal">
        Выбери: <span className="text-[#00ff7f]">{currentCategory.name}</span>
      </h1>
      
      <div className="w-full mb-8 flex-1 flex flex-col">
        <div className="w-full h-[65%] max-h-[65vh] overflow-y-auto scrollbar-thin">
          <div className="w-full grid grid-cols-1 gap-4 py-4 px-4">
            {currentCategory.options.map((option) => (
              <div 
                key={option.id}
                className={`w-full transition-all duration-200 p-3 px-4 cursor-pointer hover:border-[#ff69b4] hover:scale-[1.02] ${selectedOption?.id === option.id ? 'border-[#00ff7f] bg-[#00ff7f]/20' : 'bg-black/70 border-4 border-[#ffd700]'}`}
                onClick={() => handleSelect(option)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-2 sm:mr-4 flex-shrink-0">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 relative">
                        <Image 
                          src={`/images/${category}/${option.id}.jpeg`}
                          alt={option.name}
                          width={32}
                          height={32}
                          className="pixelated"
                        />
                      </div>
                    </div>
                    <h3 className="font-bold text-sm sm:text-base">{option.name}</h3>
                  </div>
                  
                  {option.description && (
                    <button 
                      className="bg-[#ff69b4] text-[#0a0a0a] border-2 border-[#ffd700] font-mono uppercase cursor-pointer transition-all duration-100 text-center w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center p-0 ml-2 text-xs sm:text-base hover:bg-[#9370db] hover:-translate-y-0.5 active:translate-y-0.5"
                      onClick={(e) => openDescriptionModal(e, option)}
                      aria-label="Показать описание"
                    >
                      i
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <button 
          onClick={handleContinue} 
          className={`bg-[#ff69b4] text-[#0a0a0a] border-4 border-[#ffd700] py-2 px-4 font-mono uppercase cursor-pointer transition-all duration-100 text-center mx-auto hover:bg-[#9370db] hover:-translate-y-0.5 active:translate-y-0.5 ${!selectedOption ? 'opacity-30 cursor-not-allowed' : ''}`}
          disabled={!selectedOption}
        >
          Продолжить
        </button>
      </div>

      {/* Description Modal */}
      <Modal
        isOpen={modalOption !== null}
        onClose={closeDescriptionModal}
        title={modalOption?.name || ''}
        pixelArtType={getPixelArtType()}
        category={category}
        option={modalOption}
      >
        <div>
          <p className="mb-6">{modalOption?.description}</p>
          
          {modalOption && (
            <div className="flex justify-center mt-4">
              <div className="relative">
                <Image 
                  src={`/images/${category}/${modalOption.id}.jpeg`}
                  alt={modalOption.name}
                  width={400}
                  height={400}
                  className="pixelated"
                />
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
