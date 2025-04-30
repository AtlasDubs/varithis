import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCharacter } from '@/context/CharacterContext';
import { useGame } from '@/context/GameContext';
import { Character } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, User } from 'lucide-react';
import { getFactionColor } from '@/lib/utils';
import { portraitImages } from '@/lib/gameData';

export default function CharacterList() {
  const { user, characters, fetchCharacters, isLoading, selectCharacter, activeCharacter } = useCharacter();
  const { loadGame } = useGame();

  useEffect(() => {
    if (user) {
      fetchCharacters(user.id);
    }
  }, [user, fetchCharacters]);

  if (!user) {
    return (
      <Card className="mb-8">
        <CardContent className="pt-6 text-center">
          <p className="text-dark/80 dark:text-light-DEFAULT/80">
            Please log in to view your characters
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleSelectCharacter = async (character: Character) => {
    selectCharacter(character.id!);
    await loadGame(character.id!);
  };

  return (
    <div className="mb-8">
      <h2 className="font-cinzel text-xl md:text-2xl text-primary mb-4">Your Characters</h2>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="h-48 bg-gray-200 dark:bg-dark-lighter">
                  <Skeleton className="h-full w-full" />
                </div>
                <div className="p-4">
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : characters.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <User className="mx-auto h-12 w-12 text-primary/40 mb-2" />
            <p className="text-dark/80 dark:text-light-DEFAULT/80">
              You haven't created any characters yet
            </p>
          </CardContent>
          <CardFooter className="justify-center pb-6">
            <Button 
              className="bg-primary hover:bg-primary-dark text-dark-darker font-bold"
              onClick={() => window.location.href = '/character'}
            >
              Create Your First Character
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.map((character, index) => (
            <motion.div
              key={character.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className={`overflow-hidden hover:shadow-md transition-shadow ${
                activeCharacter?.id === character.id ? 'ring-2 ring-primary' : ''
              }`}>
                <CardContent className="p-0">
                  <div className="h-48 relative">
                    {portraitImages[character.portraitType as keyof typeof portraitImages] ? (
                      <img 
                        src={portraitImages[character.portraitType as keyof typeof portraitImages]} 
                        alt={character.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // If portrait image fails to load, use a default image
                          e.currentTarget.src = portraitImages['diplomat'];
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-primary/20 to-dark">
                        <span className="text-light-DEFAULT">Character Portrait</span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-dark to-transparent">
                      <h3 className="font-cinzel text-lg font-semibold text-light-DEFAULT">
                        {character.name}
                      </h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">{character.background}</span>
                      <span className={`text-sm ${getFactionColor(character.faction)}`}>
                        {character.faction !== 'neutral' ? character.faction : 'Unaligned'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-dark/70 dark:text-light-DEFAULT/70">
                      <div>STR: {character.attributes.strength}</div>
                      <div>DEX: {character.attributes.dexterity}</div>
                      <div>INT: {character.attributes.intelligence}</div>
                      <div>CHA: {character.attributes.charisma}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-primary/10 p-3">
                  <Button 
                    className="w-full bg-primary hover:bg-primary-dark text-dark-darker font-bold"
                    onClick={() => handleSelectCharacter(character)}
                  >
                    <Play className="mr-2 h-4 w-4" /> Play Character
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
