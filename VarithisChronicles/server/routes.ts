import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertCharacterSchema, 
  insertGameProgressSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const newUser = await storage.createUser(userData);
      res.status(201).json({ id: newUser.id, username: newUser.username });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating user" });
    }
  });

  app.post("/api/users/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // In a real app, you would use proper auth with session/JWT
      res.status(200).json({ id: user.id, username: user.username });
    } catch (error) {
      res.status(500).json({ message: "Error during login" });
    }
  });

  // Character routes
  app.get("/api/characters/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const characters = await storage.getCharactersByUserId(userId);
      res.status(200).json(characters);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving characters" });
    }
  });

  app.post("/api/characters", async (req, res) => {
    try {
      const characterData = insertCharacterSchema.parse(req.body);
      const newCharacter = await storage.createCharacter(characterData);
      
      // Create initial game progress for the character
      await storage.createGameProgress({
        characterId: newCharacter.id,
        currentLocation: "The Crossroads of Caldor",
        questsCompleted: [],
        choicesMade: {},
        factionRelations: {
          "arcane": 0,
          "dominion": 0,
          "sylvan": 0,
          "shadow": 0,
        }
      });
      
      res.status(201).json(newCharacter);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid character data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating character" });
    }
  });

  app.patch("/api/characters/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const characterData = req.body;
      
      const updatedCharacter = await storage.updateCharacter(id, characterData);
      if (!updatedCharacter) {
        return res.status(404).json({ message: "Character not found" });
      }
      
      res.status(200).json(updatedCharacter);
    } catch (error) {
      res.status(500).json({ message: "Error updating character" });
    }
  });

  // Game progress routes
  app.get("/api/progress/:characterId", async (req, res) => {
    try {
      const characterId = parseInt(req.params.characterId);
      const progress = await storage.getGameProgress(characterId);
      
      if (!progress) {
        return res.status(404).json({ message: "Game progress not found" });
      }
      
      res.status(200).json(progress);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving game progress" });
    }
  });

  app.patch("/api/progress/:characterId", async (req, res) => {
    try {
      const characterId = parseInt(req.params.characterId);
      const progressData = req.body;
      
      // If progress doesn't exist yet, create it
      let progress = await storage.getGameProgress(characterId);
      
      if (!progress) {
        const newProgressData = insertGameProgressSchema.parse({
          characterId,
          currentLocation: progressData.currentLocation || "The Crossroads of Caldor",
          questsCompleted: progressData.questsCompleted || [],
          choicesMade: progressData.choicesMade || {},
          factionRelations: progressData.factionRelations || {
            "arcane": 0,
            "dominion": 0,
            "sylvan": 0,
            "shadow": 0,
          }
        });
        progress = await storage.createGameProgress(newProgressData);
      } else {
        progress = await storage.updateGameProgress(characterId, progressData);
      }
      
      res.status(200).json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid progress data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating game progress" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
