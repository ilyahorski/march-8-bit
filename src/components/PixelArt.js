'use client';

import Image from 'next/image';

// Component to render category icons
export default function PixelArt({ type = 'flower' }) {
  // Map type to the corresponding icon file
  const getIconPath = () => {
    switch(type) {
      case 'world':
        return '/images/icons/world.jpeg';
      case 'character':
        return '/images/icons/character.jpeg';
      case 'gift':
        return '/images/icons/gift.jpeg';
      case 'ability':
        return '/images/icons/ability.jpeg';
      case 'companion':
        return '/images/icons/companion.jpeg';
      default:
        return '/pixel-flower.svg';
    }
  };
  
  return (
    <div className="w-full h-full flex items-center justify-center pixelated">
      <Image 
        src={getIconPath()}
        alt={`Icon for ${type}`}
        width={32}
        height={32}
        className="pixelated w-full h-full object-contain"
      />
    </div>
  );
}
