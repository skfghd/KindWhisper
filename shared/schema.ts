import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const dailyUsage = pgTable("daily_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull().unique(), // YYYY-MM-DD format
  usersCount: integer("users_count").notNull().default(0),
  maxUsers: integer("max_users").notNull().default(125),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const translations = pgTable("translations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  koreanText: text("korean_text").notNull(),
  englishText: text("english_text").notNull(), // Now stores gentle Korean reexpression
  emotionalFocus: text("emotional_focus"),
  usedAI: boolean("used_ai").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTranslationSchema = createInsertSchema(translations).pick({
  koreanText: true,
  englishText: true,
  emotionalFocus: true,
  usedAI: true,
});

export const translateRequestSchema = z.object({
  koreanText: z.string().min(1).max(500),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type DailyUsage = typeof dailyUsage.$inferSelect;
export type Translation = typeof translations.$inferSelect;
export type InsertTranslation = z.infer<typeof insertTranslationSchema>;
export type TranslateRequest = z.infer<typeof translateRequestSchema>;
