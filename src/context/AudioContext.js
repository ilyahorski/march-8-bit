'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';

// Создание контекста
const AudioContext = createContext();

export function AudioProvider({ children }) {
  // Звуковые эффекты
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(true);
  
  // Фоновая музыка
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  // Refs
  const audioRef = useRef(null);
  const soundEffectsRef = useRef({
    choose: null,
    close: null,
    info: null,
    select: null,
    start: null
  });
  
  // Список музыкальных треков
  const musicTracks = [
    '/music/01-your-turn.mp3',
    '/music/02-chosen-one.mp3',
    '/music/03-against-fate.mp3',
    '/music/04-forgotten-hero.mp3',
    '/music/05-another-adventure.mp3',
    '/music/06-ghost-world.mp3',
    '/music/07-lost-in-abyss.mp3',
    '/music/08-phantasy-star.mp3',
    '/music/09-magic-dust.mp3',
    '/music/10-waiting-time.mp3',
    '/music/11-new-millennium.mp3',
    '/music/12-just-one-try.mp3'
  ];

  // Инициализация аудиоэлементов при первом рендере
  useEffect(() => {
    // Загрузка звуковых эффектов (выполняется один раз)
    soundEffectsRef.current.choose = new Audio('/music/click/choose.wav');
    soundEffectsRef.current.close = new Audio('/music/click/close.wav');
    soundEffectsRef.current.info = new Audio('/music/click/info.wav');
    soundEffectsRef.current.select = new Audio('/music/click/select.wav');
    soundEffectsRef.current.start = new Audio('/music/click/start.wav');
    
    // Установка громкости для звуковых эффектов
    Object.values(soundEffectsRef.current).forEach(sound => {
      if (sound) sound.volume = 0.7;
    });
    
    // Создание первоначального аудиоэлемента
    const audio = new Audio(musicTracks[currentTrack]);
    audio.volume = 0.5;
    audio.loop = false;
    audioRef.current = audio;
    
    // Добавление слушателей событий
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
    
    const handleEnded = () => {
      setCurrentTrack(prevTrack => {
        const nextTrack = (prevTrack + 1) % musicTracks.length;
        console.log(`Трек завершён, переключение на трек: ${nextTrack}`);
        
        // Останавливаем текущее воспроизведение
        audio.pause();
        // Обновляем источник
        audio.src = musicTracks[nextTrack];
        audio.load();
        
        // Ждём, пока аудио будет готово к воспроизведению
        audio.addEventListener('canplay', () => {
          if (musicEnabled) {
            // Запуск с низкой громкостью для эффекта fade-in
            audio.volume = 0.1;
            audio.play()
              .then(() => {
                setIsPlaying(true);
                const fadeInInterval = setInterval(() => {
                  if (audio.volume < 0.5) {
                    audio.volume += 0.05;
                  } else {
                    audio.volume = 0.5;
                    clearInterval(fadeInInterval);
                  }
                }, 50);
              })
              .catch(err => console.error('Ошибка при воспроизведении следующего трека:', err));
          }
        }, { once: true });
        
        return nextTrack;
      });
    };

    audio.addEventListener('ended', handleEnded);
    
    // Не автозапускаем при загрузке, чтобы избежать ограничений браузера
    setIsPlaying(false);
    
    // Очистка при размонтировании компонента
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current.removeEventListener('loadedmetadata', () => {});
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.pause();
      }
    };
  }, []);

  // Обновление прогресса проигрывания
  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Воспроизведение звукового эффекта
  const playSoundEffect = (effect) => {
    if (soundEffectsEnabled && soundEffectsRef.current[effect]) {
      // Клонирование аудио для одновременного воспроизведения нескольких эффектов
      const sound = soundEffectsRef.current[effect].cloneNode();
      sound.volume = 0.7;
      sound.play().catch(err => console.error('Ошибка воспроизведения звукового эффекта:', err));
    }
  };

  // Воспроизведение фоновой музыки
  const playMusic = () => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.error('Ошибка воспроизведения музыки:', err);
          setIsPlaying(false);
        });
    }
  };

  // Остановка фоновой музыки
  const pauseMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Переключение воспроизведения (Play/Pause)
  const togglePlay = () => {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  };

  // Переход к следующему треку с эффектом затухания и появления
  const playNextTrack = () => {
    if (audioRef.current) {
      fadeOutAndPlay(() => {
        const nextTrack = (currentTrack + 1) % musicTracks.length;
        changeTrack(nextTrack);
      });
    }
  };
  
  // Функция затухания текущего трека с последующим выполнением callback
  const fadeOutAndPlay = (callback) => {
    if (!audioRef.current) return;
    
    const fadeOutInterval = 50; // мс
    const fadeOutStep = 0.05;
    const originalVolume = audioRef.current.volume;
    
    const fadeOut = setInterval(() => {
      if (audioRef.current.volume > fadeOutStep) {
        audioRef.current.volume -= fadeOutStep;
      } else {
        clearInterval(fadeOut);
        audioRef.current.volume = 0;
        
        if (callback) callback();
        
        // Эффект плавного появления нового трека
        setTimeout(() => {
          const fadeIn = setInterval(() => {
            if (audioRef.current.volume < originalVolume - fadeOutStep) {
              audioRef.current.volume += fadeOutStep;
            } else {
              audioRef.current.volume = originalVolume;
              clearInterval(fadeIn);
            }
          }, fadeOutInterval);
        }, 300);
      }
    }, fadeOutInterval);
  };

  // Переход к предыдущему треку с эффектом затухания
  const playPrevTrack = () => {
    if (audioRef.current) {
      fadeOutAndPlay(() => {
        const prevTrack = (currentTrack - 1 + musicTracks.length) % musicTracks.length;
        changeTrack(prevTrack);
      });
    }
  };

  // Смена трека
  const changeTrack = (trackIndex) => {
    if (audioRef.current) {
      audioRef.current.pause();
      setCurrentTrack(trackIndex);
      audioRef.current.src = musicTracks[trackIndex];
      setCurrentTime(0);
      
      if (isPlaying) {
        audioRef.current.play()
          .then(() => {
            audioRef.current.volume = 0.1;
            const fadeInInterval = setInterval(() => {
              if (audioRef.current.volume < 0.5) {
                audioRef.current.volume += 0.05;
              } else {
                audioRef.current.volume = 0.5;
                clearInterval(fadeInInterval);
              }
            }, 50);
          })
          .catch(err => console.error('Ошибка воспроизведения музыки:', err));
      }
    }
  };

  // Перемотка на указанное время
  const seekTo = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Переключение видимости плеера
  const togglePlayer = () => {
    setShowPlayer(prev => !prev);
  };

  // Переключение звуковых эффектов
  const toggleSoundEffects = () => {
    setSoundEffectsEnabled(prev => !prev);
  };

  // Переключение фоновой музыки
  const toggleMusic = () => {
    const newState = !musicEnabled;
    setMusicEnabled(newState);
    
    if (newState) {
      playMusic();
    } else {
      pauseMusic();
    }
  };

  // Форматирование времени (секунды в формат MM:SS)
  const formatTime = (time) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Получение имени трека из пути
  const getTrackName = (index) => {
    const path = musicTracks[index];
    const filename = path.split('/').pop();
    return filename.replace(/^\d+-/, '').replace('.mp3', '').replace(/-/g, ' ');
  };

  return (
    <AudioContext.Provider value={{
      // Звуковые эффекты
      playSoundEffect,
      soundEffectsEnabled,
      toggleSoundEffects,
      
      // Фоновая музыка
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
      
      // Плеер
      showPlayer,
      togglePlayer,
      getTrackName
    }}>
      {children}
    </AudioContext.Provider>
  );
}

// Пользовательский хук для доступа к контексту
export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
