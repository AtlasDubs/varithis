import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Character, CharacterAttributes, User } from '@/lib/types';

interface CharacterContextType {
  isLoading: boolean;
  characters: Character[];
  activeCharacter: Character | null;
  user: User | null;
  fetchCharacters: (userId: number) => Promise<void>;
  createCharacter: (character: Omit<Character, 'id'>) => Promise<Character | null>;
  selectCharacter: (characterId: number) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export function CharacterProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [activeCharacter, setActiveCharacter] = useState<Character | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Fetch all characters for a user
  const fetchCharacters = useCallback(async (userId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/characters/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch characters');
      }
      const data = await response.json();
      setCharacters(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load characters. Please try again.",
        variant: "destructive"
      });
      console.error("Error fetching characters:", error);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Create a new character
  const createCharacter = useCallback(async (characterData: Omit<Character, 'id'>): Promise<Character | null> => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/characters', characterData);
      const newCharacter = await response.json();
      
      // Add the new character to our list
      setCharacters(prev => [...prev, newCharacter]);
      
      toast({
        title: "Character Created",
        description: `${newCharacter.name} has been created successfully.`,
      });
      
      return newCharacter;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create character. Please try again.",
        variant: "destructive"
      });
      console.error("Error creating character:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Select a character as active
  const selectCharacter = useCallback((characterId: number) => {
    const character = characters.find(c => c.id === characterId);
    if (character) {
      setActiveCharacter(character);
      toast({
        title: "Character Selected",
        description: `${character.name} is now your active character.`,
      });
    }
  }, [characters, toast]);

  // Logout - clear user and character data
  const logout = useCallback(() => {
    setUser(null);
    setCharacters([]);
    setActiveCharacter(null);
    localStorage.removeItem('tempCharacter');
  }, []);

  // Check for a temporary character in localStorage on mount
  useEffect(() => {
    const tempCharJson = localStorage.getItem('tempCharacter');
    if (tempCharJson && !activeCharacter) {
      try {
        const tempChar = JSON.parse(tempCharJson);
        setActiveCharacter(tempChar);
        
        // For demo purposes, also add to characters array
        setCharacters([tempChar]);
      } catch (error) {
        console.error("Failed to parse temporary character:", error);
      }
    }
  }, []);

  const value = {
    isLoading,
    characters,
    activeCharacter,
    user,
    fetchCharacters,
    createCharacter,
    selectCharacter,
    setUser,
    logout
  };

  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>;
}

export function useCharacter() {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
}
