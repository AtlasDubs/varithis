import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { useCharacter } from '@/context/CharacterContext';
import { DialogueChoice } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Coins, Heart, Sparkles, Shield, Scroll } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DialogueChoicesProps {
  choices: DialogueChoice[];
  loading: boolean;
}

export default function DialogueChoices({ choices, loading }: DialogueChoicesProps) {
  const { makeChoice } = useGame();
  const { activeCharacter } = useCharacter();
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  // Check if a choice is available based on requirements
  const isChoiceAvailable = (choice: DialogueChoice): boolean => {
    if (!choice.requirements) return true;
    if (!activeCharacter) return false;
    
    // Check attribute requirements
    if (choice.requirements.intelligence && activeCharacter.attributes.intelligence < choice.requirements.intelligence) {
      return false;
    }
    if (choice.requirements.strength && activeCharacter.attributes.strength < choice.requirements.strength) {
      return false;
    }
    if (choice.requirements.dexterity && activeCharacter.attributes.dexterity < choice.requirements.dexterity) {
      return false;
    }
    if (choice.requirements.charisma && activeCharacter.attributes.charisma < choice.requirements.charisma) {
      return false;
    }
    
    // TODO: Check previous contact requirement
    
    return true;
  };

  const handleChoice = async (choiceId: string) => {
    setSelectedChoice(choiceId);
    await makeChoice(choiceId);
  };

  if (!choices || choices.length === 0) {
    return null;
  }

  // Effect to reset selected choice when choices change
  useEffect(() => {
    setSelectedChoice(null);
  }, [choices]);

  return (
    <div className="space-y-3 mb-8">
      <h4 className="font-cinzel text-primary text-center mb-4">How will you respond?</h4>
      
      <TooltipProvider>
        <div className="max-w-4xl mx-auto">
          <AnimatePresence>
            {choices.map((choice, index) => {
              const isAvailable = isChoiceAvailable(choice);
              const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
              const isSelected = selectedChoice === choice.id;
              
              // Determine requirement display
              const hasIntelligenceReq = choice.requirements?.intelligence;
              const hasStrengthReq = choice.requirements?.strength;
              const hasDexterityReq = choice.requirements?.dexterity;
              const hasCharismaReq = choice.requirements?.charisma;
              const hasQuestReq = choice.requirements?.previousContact;
              
              // Determine rewards display
              const goldReward = choice.consequences?.gold;
              const itemReward = choice.consequences?.item;
              const questReward = choice.consequences?.quest;
              
              return (
                <motion.div
                  key={choice.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                  className={isSelected ? 'relative z-10' : ''}
                >
                  <Button
                    variant="outline"
                    className={`dialogue-choice w-full text-left py-6 px-4 rounded-lg 
                      ${isSelected ? 'ring-2 ring-primary border-primary scale-[1.02]' : ''}
                      ${
                        isAvailable 
                          ? 'bg-gray-50 hover:bg-gray-100 dark:bg-dark dark:hover:bg-dark-lighter' 
                          : 'bg-gray-100 dark:bg-dark-lighter opacity-70 cursor-not-allowed'
                      } border border-primary/30 transition-all duration-200 theme-transition h-auto`}
                    onClick={() => isAvailable && !isSelected && !loading && handleChoice(choice.id)}
                    disabled={!isAvailable || loading || (selectedChoice !== null && !isSelected)}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center border border-primary/50 mr-3 flex-shrink-0">
                        <span className="text-primary text-sm font-bold">{letters[index]}</span>
                      </div>
                      <div className="flex-grow">
                        <p className="text-dark dark:text-light-DEFAULT font-medium">{choice.text}</p>
                        <p className="text-dark/60 dark:text-light-DEFAULT/60 text-sm mt-1">
                          {choice.description}
                        </p>
                        
                        {/* Requirements and consequences section */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {/* Requirements */}
                          {hasIntelligenceReq && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge className={`${isAvailable ? 'bg-secondary/20 text-secondary' : 'bg-accent-red/20 text-accent-red'} border`}>
                                  <Sparkles className="w-3.5 h-3.5 mr-1" /> Int {choice.requirements?.intelligence}+
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Requires Intelligence {choice.requirements?.intelligence} or higher</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          
                          {hasStrengthReq && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge className={`${isAvailable ? 'bg-accent-red/20 text-accent-red' : 'bg-accent-red/20 text-accent-red'} border`}>
                                  <Shield className="w-3.5 h-3.5 mr-1" /> Str {choice.requirements?.strength}+
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Requires Strength {choice.requirements?.strength} or higher</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          
                          {hasDexterityReq && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge className={`${isAvailable ? 'bg-accent-green/20 text-accent-green' : 'bg-accent-red/20 text-accent-red'} border`}>
                                  Dex {choice.requirements?.dexterity}+
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Requires Dexterity {choice.requirements?.dexterity} or higher</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          
                          {hasCharismaReq && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge className={`${isAvailable ? 'bg-primary/20 text-primary' : 'bg-accent-red/20 text-accent-red'} border`}>
                                  Cha {choice.requirements?.charisma}+
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Requires Charisma {choice.requirements?.charisma} or higher</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          
                          {hasQuestReq && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge className={`${isAvailable ? 'bg-accent-blue/20 text-accent-blue' : 'bg-accent-red/20 text-accent-red'} border`}>
                                  <Scroll className="w-3.5 h-3.5 mr-1" /> Quest Required
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Requires completion of previous quest: {choice.requirements?.previousContact}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          
                          {/* Faction consequences */}
                          {choice.consequences?.faction && Object.entries(choice.consequences.faction).map(([faction, value]) => (
                            <Tooltip key={faction}>
                              <TooltipTrigger asChild>
                                <Badge className={`${value > 0 ? 'bg-accent-green/20 text-accent-green' : 'bg-accent-red/20 text-accent-red'} border`}>
                                  {faction.charAt(0).toUpperCase() + faction.slice(1)} {value > 0 ? '+' : ''}{value}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{value > 0 ? 'Increases' : 'Decreases'} reputation with {faction}</p>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                          
                          {/* Rewards */}
                          {goldReward && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge className="bg-primary/20 text-primary border">
                                  <Coins className="w-3.5 h-3.5 mr-1" /> {goldReward > 0 ? '+' : ''}{goldReward} Gold
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{goldReward > 0 ? 'Gain' : 'Lose'} {Math.abs(goldReward)} gold</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          
                          {itemReward && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge className="bg-secondary/20 text-secondary border">
                                  Item: {itemReward}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Gain item: {itemReward}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          
                          {questReward && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge className="bg-accent-blue/20 text-accent-blue border">
                                  <Scroll className="w-3.5 h-3.5 mr-1" /> Quest: {questReward}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Completes quest: {questReward}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                      
                      {/* Loading indicator for selected choice */}
                      {isSelected && loading && (
                        <div className="ml-2 w-5 h-5 rounded-full border-2 border-t-transparent border-primary animate-spin"></div>
                      )}
                    </div>
                  </Button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </TooltipProvider>
    </div>
  );
}
