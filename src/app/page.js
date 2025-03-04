'use client';

import { useSelections } from '../context/SelectionContext';
import IntroScreen from '../components/IntroScreen';
import CategorySelection from '../components/CategorySelection';
import ResultScreen from '../components/ResultScreen';
import MusicPlayer from "../components/MusicPlayer";
import Container from '../components/Container';

export default function Home() {
  const { currentCategory } = useSelections();

  // Render different screens based on the current category
  const renderScreen = () => {
    if (currentCategory === 'intro') {
      return <IntroScreen />;
    } else if (currentCategory === 'result') {
      return <ResultScreen />;
    } else {
      return <CategorySelection category={currentCategory} />;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full relative">
      <Container>
        <MusicPlayer />
        {renderScreen()}
      </Container>
    </div>
  );
}
