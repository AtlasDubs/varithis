import { pgTable, text, serial, integer, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User account table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Character table for storing player characters
export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  background: text("background").notNull(),
  faction: text("faction").notNull(),
  gender: text("gender").notNull(),
  age: text("age").notNull(),
  portraitType: text("portrait_type").notNull(),
  attributes: jsonb("attributes").notNull().$type<{
    strength: number;
    dexterity: number;
    intelligence: number;
    charisma: number;
  }>(),
  health: integer("health").notNull().default(100),
  magic: integer("magic").notNull().default(100),
  gold: integer("gold").notNull().default(50),
  inventory: jsonb("inventory").notNull().$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Game progress tracking table
export const gameProgress = pgTable("game_progress", {
  id: serial("id").primaryKey(),
  characterId: integer("character_id").references(() => characters.id).notNull(),
  currentLocation: text("current_location").notNull(),
  questsCompleted: jsonb("quests_completed").notNull().$type<string[]>().default([]),
  choicesMade: jsonb("choices_made").notNull().$type<Record<string, string>>().default({}),
  factionRelations: jsonb("faction_relations").notNull().$type<Record<string, number>>().default({}),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });

export const insertCharacterSchema = createInsertSchema(characters).omit({ id: true, createdAt: true });

export const insertGameProgressSchema = createInsertSchema(gameProgress).omit({ id: true, updatedAt: true });

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type Character = typeof characters.$inferSelect;

export type InsertGameProgress = z.infer<typeof insertGameProgressSchema>;
export type GameProgress = typeof gameProgress.$inferSelect;
