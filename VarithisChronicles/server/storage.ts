import { 
  User,
  InsertUser,
  Character,
  InsertCharacter,
  GameProgress,
  InsertGameProgress
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Character methods
  getCharacter(id: number): Promise<Character | undefined>;
  getCharactersByUserId(userId: number): Promise<Character[]>;
  createCharacter(character: InsertCharacter): Promise<Character>;
  updateCharacter(id: number, data: Partial<Character>): Promise<Character | undefined>;
  
  // Game Progress methods
  getGameProgress(characterId: number): Promise<GameProgress | undefined>;
  createGameProgress(progress: InsertGameProgress): Promise<GameProgress>;
  updateGameProgress(characterId: number, data: Partial<GameProgress>): Promise<GameProgress | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private characters: Map<number, Character>;
  private gameProgress: Map<number, GameProgress>;
  private currentUserId: number;
  private currentCharacterId: number;
  private currentGameProgressId: number;

  constructor() {
    this.users = new Map();
    this.characters = new Map();
    this.gameProgress = new Map();
    this.currentUserId = 1;
    this.currentCharacterId = 1;
    this.currentGameProgressId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  // Character methods
  async getCharacter(id: number): Promise<Character | undefined> {
    return this.characters.get(id);
  }

  async getCharactersByUserId(userId: number): Promise<Character[]> {
    return Array.from(this.characters.values()).filter(
      (character) => character.userId === userId
    );
  }

  async createCharacter(insertCharacter: InsertCharacter): Promise<Character> {
    const id = this.currentCharacterId++;
    const now = new Date();
    const character: Character = { ...insertCharacter, id, createdAt: now };
    this.characters.set(id, character);
    return character;
  }

  async updateCharacter(id: number, data: Partial<Character>): Promise<Character | undefined> {
    const character = this.characters.get(id);
    if (!character) return undefined;
    
    const updatedCharacter = { ...character, ...data };
    this.characters.set(id, updatedCharacter);
    return updatedCharacter;
  }

  // Game Progress methods
  async getGameProgress(characterId: number): Promise<GameProgress | undefined> {
    return Array.from(this.gameProgress.values()).find(
      (progress) => progress.characterId === characterId
    );
  }

  async createGameProgress(insertProgress: InsertGameProgress): Promise<GameProgress> {
    const id = this.currentGameProgressId++;
    const now = new Date();
    const progress: GameProgress = { ...insertProgress, id, updatedAt: now };
    this.gameProgress.set(id, progress);
    return progress;
  }

  async updateGameProgress(characterId: number, data: Partial<GameProgress>): Promise<GameProgress | undefined> {
    const progress = Array.from(this.gameProgress.values()).find(
      (p) => p.characterId === characterId
    );
    
    if (!progress) return undefined;
    
    const now = new Date();
    const updatedProgress = { ...progress, ...data, updatedAt: now };
    this.gameProgress.set(progress.id, updatedProgress);
    return updatedProgress;
  }
}

export const storage = new MemStorage();
