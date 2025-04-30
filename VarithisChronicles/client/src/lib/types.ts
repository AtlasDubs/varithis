// Character types
export interface CharacterAttributes {
  strength: number;
  dexterity: number;
  intelligence: number;
  charisma: number;
}

export interface Character {
  id?: number;
  userId: number;
  name: string;
  background: string;
  faction: string;
  gender: string;
  age: string;
  portraitType: string;
  attributes: CharacterAttributes;
  health: number;
  magic: number;
  gold: number;
  inventory: string[];
}

export interface CharacterBackground {
  id: string;
  name: string;
  description: string;
}

// Game progress types
export interface GameProgress {
  id?: number;
  characterId: number;
  currentLocation: string;
  questsCompleted: string[];
  choicesMade: Record<string, string>;
  factionRelations: Record<string, number>;
}

// World and story content types
export interface Faction {
  id: string;
  name: string;
  description: string;
  focus: string;
  influence: string;
  iconColor: string;
  image: string;
  symbolImage: string;
}

export interface Location {
  id: string;
  name: string;
  region: string;
  description: string[];
  image: string;
}

export interface DialogueChoice {
  id: string;
  text: string;
  description: string;
  requirements: null | {
    intelligence?: number;
    strength?: number;
    dexterity?: number;
    charisma?: number;
    previousContact?: string;
  };
  consequences: {
    faction: Record<string, number>;
    item?: string;
    gold?: number;
    quest?: string;
  };
}

export interface Dialogue {
  npcName: string;
  npcImage: string;
  text: string;
}

export interface GameScene {
  location: Location;
  title: string;
  description: string[];
  dialogue: Dialogue;
  choices: DialogueChoice[];
}

// Lore types
export interface LoreRegion {
  id: string;
  name: string;
  description: string;
  territory: string;
  location: string;
  image: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

// User types
export interface User {
  id: number;
  username: string;
}
