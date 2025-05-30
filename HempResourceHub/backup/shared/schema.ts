import { pgTable, text, serial, integer, boolean, jsonb, timestamp, varchar, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// User table for potential future authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Hemp plant types table
export const plantTypes = pgTable("plant_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  plantingDensity: text("planting_density"),
  characteristics: text("characteristics"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPlantTypeSchema = createInsertSchema(plantTypes).pick({
  name: true,
  description: true,
  imageUrl: true,
  plantingDensity: true,
  characteristics: true,
});

// Plant parts table
export const plantParts = pgTable("plant_parts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  plantTypeId: integer("plant_type_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPlantPartSchema = createInsertSchema(plantParts).pick({
  name: true,
  description: true,
  imageUrl: true,
  plantTypeId: true,
});

// Industries table
export const industries = pgTable("industries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  iconName: text("icon_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertIndustrySchema = createInsertSchema(industries).pick({
  name: true,
  description: true,
  iconName: true,
});

// Sub-industries/categories table
export const subIndustries = pgTable("sub_industries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  industryId: integer("industry_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSubIndustrySchema = createInsertSchema(subIndustries).pick({
  name: true,
  description: true,
  industryId: true,
});

// Hemp products/uses table
export const hempProducts = pgTable("hemp_products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  plantPartId: integer("plant_part_id").notNull(),
  industryId: integer("industry_id").notNull(),
  subIndustryId: integer("sub_industry_id"),
  properties: jsonb("properties"),
  facts: jsonb("facts"),
  sustainabilityImpact: text("sustainability_impact"),
  affiliateLinks: jsonb("affiliate_links"),
  relatedProductIds: jsonb("related_product_ids"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertHempProductSchema = createInsertSchema(hempProducts).pick({
  name: true,
  description: true,
  imageUrl: true,
  plantPartId: true,
  industryId: true,
  subIndustryId: true,
  properties: true,
  facts: true,
  sustainabilityImpact: true,
  affiliateLinks: true,
  relatedProductIds: true,
});

// Types
export type PlantType = typeof plantTypes.$inferSelect;
export type InsertPlantType = z.infer<typeof insertPlantTypeSchema>;

export type PlantPart = typeof plantParts.$inferSelect;
export type InsertPlantPart = z.infer<typeof insertPlantPartSchema>;

export type Industry = typeof industries.$inferSelect;
export type InsertIndustry = z.infer<typeof insertIndustrySchema>;

export type SubIndustry = typeof subIndustries.$inferSelect;
export type InsertSubIndustry = z.infer<typeof insertSubIndustrySchema>;

export type HempProduct = typeof hempProducts.$inferSelect;
export type InsertHempProduct = z.infer<typeof insertHempProductSchema>;

// Research papers table
export const researchPapers = pgTable("research_papers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  authors: text("authors").notNull(),
  abstract: text("abstract").notNull(),
  publicationDate: date("publication_date"),
  journal: text("journal"),
  doi: text("doi"),  // Digital Object Identifier
  url: text("url"),
  pdfUrl: text("pdf_url"),
  imageUrl: text("image_url"),
  plantTypeId: integer("plant_type_id").references(() => plantTypes.id),
  plantPartId: integer("plant_part_id").references(() => plantParts.id),
  industryId: integer("industry_id").references(() => industries.id),
  keywords: text("keywords").array(),
  citations: integer("citations"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const researchPaperRelations = relations(researchPapers, ({ one }) => ({
  plantType: one(plantTypes, {
    fields: [researchPapers.plantTypeId],
    references: [plantTypes.id],
  }),
  plantPart: one(plantParts, {
    fields: [researchPapers.plantPartId],
    references: [plantParts.id],
  }),
  industry: one(industries, {
    fields: [researchPapers.industryId],
    references: [industries.id],
  }),
}));

export const insertResearchPaperSchema = createInsertSchema(researchPapers).pick({
  title: true,
  authors: true,
  abstract: true,
  publicationDate: true,
  journal: true,
  doi: true,
  url: true,
  pdfUrl: true,
  imageUrl: true,
  plantTypeId: true,
  plantPartId: true,
  industryId: true,
  keywords: true,
  citations: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type ResearchPaper = typeof researchPapers.$inferSelect;
export type InsertResearchPaper = z.infer<typeof insertResearchPaperSchema>;
