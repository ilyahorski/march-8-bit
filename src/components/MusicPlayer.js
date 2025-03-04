'use client';

import { useState, useEffect, useRef } from 'react';
import { useAudio } from '../context/AudioContext';

export default function MusicPlayer() {
  const {
    isPlaying,
    togglePlay,
    playNextTrack,
    playPrevTrack,
    currentTrack,
    duration,
    currentTime,
    seekTo,
    formatTime,
    musicEnabled,
    toggleMusic,
    soundEffectsEnabled,
    toggleSoundEffects,
    showPlayer,
    togglePlayer,
    getTrackName
  } = useAudio();

  const [isDragging, setIsDragging] = useState(false);
  const progressRef = useRef(null);

  // Handle click on progress bar
  const handleProgressClick = (e) => {
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      seekTo(pos * duration);
    }
  };

  // Handle drag start
  const handleDragStart = () => {
    setIsDragging(true);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Handle drag move
  const handleDragMove = (e) => {
    if (isDragging && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      seekTo(pos * duration);
    }
  };

  // Add global event listeners for drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging]);

  return (
    <>
      {/* Music Player Toggle Button (always visible) */}
      <button
        onClick={togglePlayer}
        className="absolute top-3 right-3 flex z-50 bg-cyan-300/30 text-[#0a0a0a] justify-center items-center w-8 h-8 border-2 border-cyan-400/70 p-2 font-mono uppercase cursor-pointer transition-all duration-100 text-center hover:bg-[#9370db] hover:-translate-y-0.5 active:translate-y-0.5"
        aria-label="Toggle Music Player"
      >
        {showPlayer ? '▼' : '♫'}
      </button>

      {/* Music Player */}
      {showPlayer && (
        <div className="absolute top-16 right-4 z-50 w-[300px] bg-[#0a0a0a] border-2 border-emerald-700 p-3">
          <div className="mb-3">
            <h3 className="text-[#ff69b4] text-center text-sm mb-2 truncate">
              {getTrackName(currentTrack)}
            </h3>
            
            {/* Progress Bar */}
            <div 
              ref={progressRef}
              className="h-4 bg-[#333] relative cursor-pointer mb-2"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-[#00ff7f]"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></div>
              <div 
                className="absolute top-0 h-full w-2 bg-[#ffd700] border-2 border-[#0a0a0a] cursor-grab"
                style={{ left: `calc(${(currentTime / duration) * 100}% - 4px)` }}
                onMouseDown={handleDragStart}
              ></div>
            </div>
            
            {/* Time Display */}
            <div className="flex justify-between text-xs">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex justify-between items-center">
            <button 
              onClick={playPrevTrack}
              className="bg-cyan-700 text-[#0a0a0a] border-2 border-cyan-400 p-1 flex justify-center items-center w-8 h-8 font-mono uppercase cursor-pointer transition-all duration-100 text-center hover:bg-[#9370db] hover:-translate-y-0.5 active:translate-y-0.5"
              aria-label="Previous Track"
            >
              ◀◀
            </button>
            
            <button 
              onClick={togglePlay}
              className="bg-cyan-700 text-[#0a0a0a] border-2 border-cyan-400 p-1 flex justify-center items-center w-8 h-8 font-mono uppercase cursor-pointer transition-all duration-100 text-center hover:bg-[#9370db] hover:-translate-y-0.5 active:translate-y-0.5"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? '❚❚' : '▶'}
            </button>
            
            <button 
              onClick={playNextTrack}
              className="bg-cyan-700 text-[#0a0a0a] border-2 border-cyan-400 p-1 flex justify-center items-center w-8 h-8 font-mono uppercase cursor-pointer transition-all duration-100 text-center hover:bg-[#9370db] hover:-translate-y-0.5 active:translate-y-0.5"
              aria-label="Next Track"
            >
              ▶▶
            </button>
          </div>
          
          {/* Settings */}
          <div className="mt-3 flex justify-between">
            <button 
              onClick={toggleMusic}
              className={`text-xs p-1 border-2 ${musicEnabled ? 'border-[#00ff7f] text-[#00ff7f]' : 'border-[#ff69b4] text-[#ff69b4]'}`}
              aria-label={musicEnabled ? "Disable Music" : "Enable Music"}
            >
              {musicEnabled ? 'Music: ON' : 'Music: OFF'}
            </button>
            
            <button 
              onClick={toggleSoundEffects}
              className={`text-xs p-1 border-2 ${soundEffectsEnabled ? 'border-[#00ff7f] text-[#00ff7f]' : 'border-[#ff69b4] text-[#ff69b4]'}`}
              aria-label={soundEffectsEnabled ? "Disable Sound Effects" : "Enable Sound Effects"}
            >
              {soundEffectsEnabled ? 'SFX: ON' : 'SFX: OFF'}
            </button>
          </div>
          
          {/* Track Number */}
          <div className="mt-2 text-center text-xs text-[#9370db]">
            Track {currentTrack + 1}/{12}
          </div>
        </div>
      )}
    </>
  );
}
