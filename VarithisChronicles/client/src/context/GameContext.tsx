import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  GameProgress, 
  GameScene, 
  Character, 
  DialogueChoice,
  Location
} from '@/lib/types';
import { startingChoices, locations } from '@/lib/gameData';

interface GameContextType {
  isLoading: boolean;
  currentScene: GameScene | null;
  gameProgress: GameProgress | null;
  makeChoice: (choiceId: string) => Promise<void>;
  loadGame: (characterId: number) => Promise<void>;
  saveGame: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [gameProgress, setGameProgress] = useState<GameProgress | null>(null);
  const [currentScene, setCurrentScene] = useState<GameScene | null>(null);
  const [activeCharacter, setActiveCharacter] = useState<Character | null>(null);
  const { toast } = useToast();
  
  // Generate the current scene based on game progress
  const generateScene = useCallback((progress: GameProgress) => {
    // Find the current location
    const locationId = progress.currentLocation;
    const location = locations.find(loc => loc.id === locationId) || locations[0];

    // For now, we'll use a fixed starting scene
    // In a full game, this would be generated based on progress, quests, etc.
    const scene: GameScene = {
      location,
      title: "A Fateful Encounter",
      description: location.description,
      dialogue: {
        npcName: "Mysterious Agent",
        npcImage: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG1lZGlldmFsJTIwY2hhcmFjdGVyc3xlbnwwfHwwfHx8MA%3D%3D",
        text: "I've been waiting for someone of your... particular talents. The Network has taken interest in your activities. We have a proposition that could benefit us both, assuming you're open to opportunities that don't strictly follow Imperial law."
      },
      choices: startingChoices
    };

    setCurrentScene(scene);
  }, []);
  
  // Determine next scene based on choice and game state
  const determineNextScene = useCallback((currentLocationId: string, choiceId: string, progress: GameProgress): string => {
    // This function would contain game logic to determine the next scene
    // For demo purposes, we'll use simple transitions between locations
    
    // Map of choices to next locations
    const locationTransitions: Record<string, Record<string, string>> = {
      "frostholm": {
        "accept_mission": "stoneridge",
        "decline_mission": "frostholm",
        "ask_more_info": "frostholm"
      },
      "stoneridge": {
        "investigate_ruins": "elderwood",
        "speak_locals": "stoneridge",
        "return_frostholm": "frostholm"
      },
      "elderwood": {
        "follow_trail": "ravenhold",
        "assist_locals": "elderwood",
        "return_stoneridge": "stoneridge"
      },
      "ravenhold": {
        "confront_enemy": "ravenhold",
        "gather_allies": "ravenhold",
        "return_elderwood": "elderwood"
      }
    };
    
    // Get the transition for this location and choice
    const transitions = locationTransitions[currentLocationId];
    if (!transitions) return currentLocationId;
    
    const nextLocation = transitions[choiceId];
    return nextLocation || currentLocationId;
  }, []);

  // Load game progress from API or localStorage
  const loadGame = useCallback(async (characterId: number) => {
    setIsLoading(true);
    try {
      // Check if we have a character
      let character: Character;
      let progress: GameProgress;
      
      // Try to get temporary character from localStorage first
      const tempCharJson = localStorage.getItem('tempCharacter');
      if (tempCharJson) {
        try {
          character = JSON.parse(tempCharJson);
          setActiveCharacter(character);
          
          // Check if we have game progress in localStorage
          const tempProgressJson = localStorage.getItem(`gameProgress_${character.name}`);
          if (tempProgressJson) {
            progress = JSON.parse(tempProgressJson);
          } else {
            // Create new progress for temp character
            progress = {
              id: 1,
              characterId: character.id || 1,
              currentLocation: "frostholm", // Starting location
              questsCompleted: [],
              choicesMade: {},
              factionRelations: {
                "frostholm": character.faction === "frostholm" ? 30 : 10,
                "ravenhold": character.faction === "ravenhold" ? 30 : 10,
                "elderwood": character.faction === "elderwood" ? 30 : 10,
                "stoneridge": character.faction === "stoneridge" ? 30 : 10
              }
            };
            // Save new progress to localStorage
            localStorage.setItem(`gameProgress_${character.name}`, JSON.stringify(progress));
          }
          
          setGameProgress(progress);
          // Generate the scene based on progress
          generateScene(progress);
          return;
        } catch (error) {
          console.error("Error loading temp character:", error);
        }
      }
      
      // If we got here, either there's no temp character or we had an error
      // Try to load from API as fallback
      try {
        // First, get the character
        const characterRes = await fetch(`/api/characters/${characterId}`);
        if (!characterRes.ok) throw new Error('Failed to load character data');
        character = await characterRes.json();
        setActiveCharacter(character);

        // Then, get the game progress
        const progressRes = await fetch(`/api/progress/${characterId}`);
        progress = await progressRes.json();
        setGameProgress(progress);

        // Generate the current scene based on progress
        generateScene(progress);
      } catch (error) {
        console.error("API loading error:", error);
        toast({
          title: "Error Loading Game",
          description: "Failed to load your game progress. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error Loading Game",
        description: "Failed to load your game progress. Please try again.",
        variant: "destructive"
      });
      console.error("Game loading error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [toast, generateScene]);

  // Make a choice in the current scene
  const makeChoice = useCallback(async (choiceId: string) => {
    if (!gameProgress || !currentScene || !activeCharacter) return;

    setIsLoading(true);
    try {
      // Find the selected choice
      const choice = currentScene.choices.find(c => c.id === choiceId);
      if (!choice) throw new Error('Invalid choice');

      // Update faction relations based on the choice
      const updatedFactionRelations = { ...gameProgress.factionRelations };
      Object.entries(choice.consequences.faction).forEach(([faction, change]) => {
        updatedFactionRelations[faction] = (updatedFactionRelations[faction] || 0) + change;
      });

      // Update choices made in the game progress
      const updatedChoicesMade = {
        ...gameProgress.choicesMade,
        [currentScene.location.id]: choiceId
      };

      // Update inventory if choice gives an item
      let updatedInventory = [...(activeCharacter.inventory || [])];
      if (choice.consequences.item && !updatedInventory.includes(choice.consequences.item)) {
        updatedInventory.push(choice.consequences.item);
      }

      // Update gold if choice gives gold
      let updatedGold = activeCharacter.gold || 0;
      if (choice.consequences.gold) {
        updatedGold += choice.consequences.gold;
      }

      // Update quests completed if choice completes a quest
      let updatedQuestsCompleted = [...gameProgress.questsCompleted];
      if (choice.consequences.quest && !updatedQuestsCompleted.includes(choice.consequences.quest)) {
        updatedQuestsCompleted.push(choice.consequences.quest);
      }

      // Create updated progress object
      const updatedProgress: GameProgress = {
        ...gameProgress,
        factionRelations: updatedFactionRelations,
        choicesMade: updatedChoicesMade,
        questsCompleted: updatedQuestsCompleted
      };

      // Check if we're using a temporary character
      const tempCharJson = localStorage.getItem('tempCharacter');
      if (tempCharJson) {
        // Update the temp character with new inventory and gold
        const updatedCharacter = {
          ...activeCharacter,
          inventory: updatedInventory,
          gold: updatedGold
        };
        
        // Save updated character and progress to localStorage
        localStorage.setItem('tempCharacter', JSON.stringify(updatedCharacter));
        localStorage.setItem(`gameProgress_${activeCharacter.name}`, JSON.stringify(updatedProgress));
        
        // Update character state
        setActiveCharacter(updatedCharacter);
      } else {
        // Update the game progress in the API for authenticated users
        try {
          await apiRequest('PATCH', `/api/progress/${gameProgress.characterId}`, updatedProgress);
          
          // Update character gold and inventory via API
          await apiRequest('PATCH', `/api/characters/${activeCharacter.id}`, {
            inventory: updatedInventory,
            gold: updatedGold
          });
        } catch (error) {
          console.error("API update error:", error);
        }
      }

      // Update local game progress state
      setGameProgress(updatedProgress);

      toast({
        title: "Choice made",
        description: "Your decision has been recorded.",
      });

      // Advance to the next scene based on the choice
      const nextSceneId = determineNextScene(currentScene.location.id, choiceId, updatedProgress);
      if (nextSceneId && nextSceneId !== currentScene.location.id) {
        // Update location if it's different
        const updatedLocation = {
          ...updatedProgress,
          currentLocation: nextSceneId
        };
        
        // Save to localStorage for temp characters
        if (tempCharJson) {
          localStorage.setItem(`gameProgress_${activeCharacter.name}`, JSON.stringify(updatedLocation));
        } else {
          // Or API for authenticated users
          try {
            await apiRequest('PATCH', `/api/progress/${gameProgress.characterId}`, { currentLocation: nextSceneId });
          } catch (error) {
            console.error("API location update error:", error);
          }
        }
        
        // Update local state
        setGameProgress(updatedLocation);
        // Generate the new scene
        generateScene(updatedLocation);
      } else {
        // Or just refresh the current scene with updated data
        generateScene(updatedProgress);
      }
    } catch (error) {
      toast({
        title: "Error Processing Choice",
        description: "Failed to process your choice. Please try again.",
        variant: "destructive"
      });
      console.error("Error making choice:", error);
    } finally {
      setIsLoading(false);
    }
  }, [gameProgress, currentScene, activeCharacter, toast, generateScene, determineNextScene]);

  // Save game progress
  const saveGame = useCallback(async () => {
    if (!gameProgress || !activeCharacter) return;

    setIsLoading(true);
    try {
      const tempCharJson = localStorage.getItem('tempCharacter');
      
      if (tempCharJson) {
        // For temporary characters, just save to localStorage
        localStorage.setItem(`gameProgress_${activeCharacter.name}`, JSON.stringify(gameProgress));
        
        toast({
          title: "Game Saved",
          description: "Your progress has been saved locally.",
        });
      } else {
        // For authenticated users, save to API
        await apiRequest('PATCH', `/api/progress/${gameProgress.characterId}`, gameProgress);
        
        toast({
          title: "Game Saved",
          description: "Your progress has been saved successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save your game progress. Please try again.",
        variant: "destructive"
      });
      console.error("Game saving error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [gameProgress, activeCharacter, toast]);

  // Initialize with default scene if no progress loaded
  useEffect(() => {
    if (!gameProgress && currentScene === null) {
      // Check for temporary character
      const tempCharJson = localStorage.getItem('tempCharacter');
      if (tempCharJson) {
        try {
          const character = JSON.parse(tempCharJson);
          // Try to load progress automatically for temp character
          loadGame(character.id || 1);
          return;
        } catch (error) {
          console.error("Error loading temp character on init:", error);
        }
      }
      
      // Set a default empty scene until actual game is loaded
      const defaultLocation = locations[0];
      const defaultScene: GameScene = {
        location: defaultLocation,
        title: "Begin Your Journey",
        description: ["Load a character to begin your adventure in Varithis."],
        dialogue: {
          npcName: "",
          npcImage: "",
          text: ""
        },
        choices: []
      };
      setCurrentScene(defaultScene);
    }
  }, [gameProgress, currentScene, loadGame]);

  const value = {
    isLoading,
    currentScene,
    gameProgress,
    makeChoice,
    loadGame,
    saveGame
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
