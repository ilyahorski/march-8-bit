'use client';

import { useSelections, categories } from '../context/SelectionContext';
import { useEffect, useState } from 'react';
import PixelArt from './PixelArt';
import Image from 'next/image';
import { useAudio } from '../context/AudioContext';

export default function ResultScreen() {
  const { selections, prediction, generatePrediction, isLoading } = useSelections();
  const { playSoundEffect } = useAudio();
  const [showSummary, setShowSummary] = useState(true);
  const [typingComplete, setTypingComplete] = useState(false);

  useEffect(() => {
    // Generate prediction when component mounts
    if (!prediction && !isLoading) {
      generatePrediction();
    }

    // Simulate typing effect completion for the prediction
    if (prediction && !typingComplete) {
      const timer = setTimeout(() => {
        setTypingComplete(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [prediction, generatePrediction, isLoading, typingComplete]);

  // Toggle between summary and prediction
  const toggleView = () => {
    playSoundEffect('select');
    setShowSummary(!showSummary);
  };

  // Get pixel art type based on category
  const getPixelArtType = (category) => {
    switch(category) {
      case 'world': return 'world';
      case 'character': return 'character';
      case 'gift': return 'gift';
      case 'ability': return 'ability';
      case 'companion': return 'companion';
      default: return 'world';
    }
  };

  return (
    <>
      <div className="mb-6 sm:mb-8 flex-1 flex flex-col">
        <div className="h-[70%] w-full max-h-[75vh] overflow-y-auto scrollbar-thin p-2 flex-1">
          {showSummary ? (
            <div className="mb-4 sm:mb-6">
              <h2 className="text-[#9370db] mb-3 sm:mb-4 text-center sm:text-left text-xl sm:text-2xl">Твои выборы:</h2>
              
              <div className="grid gap-3 sm:gap-4">
                {Object.entries(categories).map(([key, category]) => (
                  <div key={key} className="w-full bg-black/70 border-4 border-[#ffd700] transition-all duration-200 p-3 sm:p-4 hover:border-[#ff69b4] hover:scale-[1.02]">
                    <div className="flex items-center">
                      <div className="mr-3 sm:mr-4 flex-shrink-0">
                        {selections[key] && (
                          <div className="w-6 h-6 sm:w-8 sm:h-8 relative">
                            <Image 
                              src={`/images/${key}/${selections[key].id}.jpeg`}
                              alt={selections[key].name}
                              width={32}
                              height={32}
                              className="pixelated"
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-[#ff69b4] mb-1 sm:mb-2 text-sm sm:text-base">{category.name}:</h3>
                        <p className="text-sm sm:text-base">{selections[key]?.name || 'Не выбрано'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full mb-4 sm:mb-6">
              {isLoading ? (
                <div className="text-center p-4 sm:p-8">
                  <div className="flex justify-center items-center h-[100px] mb-4">
                  <div className="w-5 h-5 bg-[#00ff7f] animate-loading"></div>
                </div>
                  <p>Создаем твое предсказание...</p>
                </div>
              ) : (
                <div className="w-full bg-black/70 border-4 border-[#ffd700] transition-all duration-200 p-3 sm:p-4 mt-6 hover:border-[#ff69b4] hover:scale-[1.02]">
                  <h2 className="text-[#9370db] mb-3 sm:mb-4 text-center text-xl sm:text-2xl">Твое предсказание:</h2>
                  <p className={`leading-relaxed p-1 text-sm sm:text-base ${typingComplete ? '' : 'animate-typing'}`}>
                    {prediction}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center">
        <button 
          onClick={toggleView} 
          className="bg-[#ff69b4] text-[#0a0a0a] border-4 border-[#ffd700] py-2 px-4 font-mono uppercase cursor-pointer transition-all duration-100 text-center mx-auto text-sm sm:text-base hover:bg-[#9370db] hover:-translate-y-0.5 active:translate-y-0.5"
          disabled={isLoading || !prediction}
        >
          {showSummary ? 'Показать предсказание' : 'Показать выборы'}
        </button>
        
        <div className="mt-4 sm:mt-6 leading-relaxed text-xs sm:text-sm">
          <p className="mt-1 sm:mt-2">Пусть весна наполнит твоё сердце волшебством и радостью!</p>
        </div>
      </div>
    </>
  );
}
