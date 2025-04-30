import { useEffect } from 'react';
import { useCharacter } from '@/context/CharacterContext';
import { useGame } from '@/context/GameContext';
import DialogueChoices from './DialogueChoices';
import GameControls from './GameControls';
import { Card } from '@/components/ui/card';
import { 
  Heart, 
  Sparkles, 
  Coins,
  MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function GameInterface() {
  const { activeCharacter } = useCharacter();
  const { currentScene, gameProgress, isLoading } = useGame();

  if (!activeCharacter) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Card className="p-6 max-w-lg text-center">
          <h3 className="font-cinzel text-xl text-primary mb-4">No Active Character</h3>
          <p className="text-dark/80 dark:text-light-DEFAULT/80 mb-4">
            Please create or select a character to begin your adventure in Varithis.
          </p>
        </Card>
      </div>
    );
  }

  if (!currentScene) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Card className="p-6 max-w-lg text-center">
          <h3 className="font-cinzel text-xl text-primary mb-4">Loading Adventure...</h3>
          <div className="animate-pulse h-4 bg-primary/20 rounded w-3/4 mx-auto mb-3"></div>
          <div className="animate-pulse h-4 bg-primary/20 rounded w-1/2 mx-auto"></div>
        </Card>
      </div>
    );
  }

  return (
    <section className="mb-16">
      <h2 className="font-cinzel text-2xl md:text-3xl text-primary text-center mb-10">Your Adventure Awaits</h2>

      <div className="bg-white dark:bg-dark-lighter rounded-lg border border-primary/20 overflow-hidden theme-transition shadow-md">
        {/* Game header with location and status */}
        <div className="bg-gray-50 dark:bg-dark border-b border-primary/20 p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h3 className="font-cinzel text-xl text-primary">{currentScene.location.name}</h3>
              <p className="text-dark/70 dark:text-light-DEFAULT/70 text-sm flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-secondary" /> {currentScene.location.region}
              </p>
            </div>
            <div className="flex mt-3 md:mt-0 space-x-4">
              {/* Character status indicators */}
              <div className="flex items-center text-dark/70 dark:text-light-DEFAULT/70 text-sm" title="Health">
                <Heart className="h-4 w-4 mr-1 text-accent-red" />
                <span>{activeCharacter.health}</span>/100
              </div>
              <div className="flex items-center text-dark/70 dark:text-light-DEFAULT/70 text-sm" title="Magic Power">
                <Sparkles className="h-4 w-4 mr-1 text-secondary" />
                <span>{activeCharacter.magic}</span>/100
              </div>
              <div className="flex items-center text-dark/70 dark:text-light-DEFAULT/70 text-sm" title="Gold">
                <Coins className="h-4 w-4 mr-1 text-primary" />
                <span>{activeCharacter.gold}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main game content area */}
        <div className="p-4 md:p-6 lg:p-8">
          {/* Scene description with image */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="w-full md:w-1/3">
              <div className="rounded-lg overflow-hidden h-full border border-primary/30">
                <img 
                  src={currentScene.location.image}
                  alt={currentScene.location.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <h4 className="font-cinzel text-lg text-dark dark:text-light-DEFAULT mb-3">{currentScene.title}</h4>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {currentScene.description.map((paragraph, index) => (
                  <motion.p 
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </div>
          </div>

          {/* Character dialogue */}
          {currentScene.dialogue.text && (
            <div className="mb-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 flex-shrink-0">
                  <img 
                    src={currentScene.dialogue.npcImage} 
                    alt={currentScene.dialogue.npcName} 
                    className="w-12 h-12 rounded-full border-2 border-accent-blue object-cover"
                  />
                </div>
                <motion.div 
                  className="bg-gray-100 dark:bg-dark p-4 rounded-lg relative flex-grow"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="absolute left-[-8px] top-3 w-0 h-0 border-t-[8px] border-t-transparent border-r-[8px] border-r-gray-100 dark:border-r-dark border-b-[8px] border-b-transparent"></div>
                  <p className="text-dark dark:text-light-DEFAULT mb-1 font-cinzel">{currentScene.dialogue.npcName}</p>
                  <p className="text-dark/90 dark:text-light-DEFAULT/90">
                    "{currentScene.dialogue.text}"
                  </p>
                </motion.div>
              </div>
            </div>
          )}

          {/* Decision choices */}
          <DialogueChoices choices={currentScene.choices} loading={isLoading} />

          {/* Game controls */}
          <GameControls />
        </div>
      </div>
    </section>
  );
}
