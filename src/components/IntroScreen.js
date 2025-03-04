'use client';

import { useSelections } from '../context/SelectionContext';
import { useEffect, useState } from 'react';
import PixelArt from './PixelArt';
import { useAudio } from '../context/AudioContext';

export default function IntroScreen() {
  const { nextCategory } = useSelections();
  const { playSoundEffect } = useAudio();
  const [typingComplete, setTypingComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTypingComplete(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <h1 className="text-[#ff69b4] shadow-[2px_2px_0_#0a0a0a] text-center mb-4 sm:mb-6 text-xl sm:text-2xl leading-normal">
        <span className="text-[#00ff7f]">8</span>-Bit{' '}
        <span className="text-[#ff69b4]">March</span>
      </h1>
      
      <div className="mb-6 flex-1 flex flex-col justify-center items-center">
        <div className="h-[70%] w-[95%] max-h-[75vh] overflow-y-auto scrollbar-thin flex-1">
          <div className="flex w-full justify-center">
            <p className="animate-typing mb-4 text-sm sm:text-base">
              Готовы узнать свою судьбу!?
            </p>
          </div>
          
          <div className={`leading-relaxed ${typingComplete ? '' : 'opacity-0'} transition-opacity duration-500`}>
            <div className="flex w-full justify-center text-center">
              <p className="mb-3 sm:mb-4 text-sm sm:text-base">
                В честь 8 марта для тебя была создана игра-предсказание. Тебе предстоит сделать 5 сложных решений, каждое из которых поможет узнать твою судьбу:
              </p>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4 mb-4 sm:mb-6">
              {[
                { type: "world", label: "Мир" },
                { type: "character", label: "Персонаж" },
                { type: "gift", label: "Дар" },
                { type: "ability", label: "Способность" },
                { type: "companion", label: "Компаньон" },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="scale-75 sm:scale-100">
                      <PixelArt type={item.type} />
                    </div>
                  </div>
                  <p className="text-[#00ff7f] text-xs sm:text-base">{item.label}</p>
                </div>
              ))}
            </div>
            
            <div className="flex w-full justify-center text-center">
              <p className="mb-4 sm:mb-6 text-sm sm:text-base">
                И пусть желаемое исполнится!
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {typingComplete && (
        <div className="text-center">
          <button 
            onClick={() => {
              playSoundEffect('start');
              nextCategory();
            }} 
            className="bg-[#ff69b4] text-[#0a0a0a] border-4 border-[#ffd700] py-2 px-3 sm:px-5 font-mono uppercase cursor-pointer transition-all duration-100 text-center text-sm sm:text-base mx-auto hover:bg-[#9370db] hover:-translate-y-0.5 active:translate-y-0.5"
          >
            Начать приключение
          </button>
          <p className="mt-3 text-xs sm:text-sm animate-blink">Нажми, чтобы продолжить...</p>
        </div>
      )}
    </>
  );
}
