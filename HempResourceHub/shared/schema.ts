import { pgTable, text, serial, integer, boolean, jsonb, timestamp, varchar, date, bigserial, primaryKey, decimal } from "drizzle-orm/pg-core"; // Added decimal
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

// Hemp plant archetypes table (aligned with SQL schema)
export const hempPlantArchetypes = pgTable("hemp_plant_archetypes", { 
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"), 
  imageUrl: text("image_url"),      
  cultivationFocusNotes: text("cultivation_focus_notes"), 
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()), 
});

export const insertPlantTypeSchema = createInsertSchema(hempPlantArchetypes).pick({
  name: true,
  description: true,
  imageUrl: true,
  cultivationFocusNotes: true, 
});

// Plant parts table
export const plantParts = pgTable("plant_parts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  plantTypeId: integer("plant_type_id").notNull().references(() => hempPlantArchetypes.id), 
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()), 
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
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()), 
});

export const insertIndustrySchema = createInsertSchema(industries).pick({
  name: true,
  description: true,
  iconName: true,
});

// Industry Sub-Categories table (aligned with SQL schema)
export const industrySubCategories = pgTable("industry_sub_categories", { 
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  industryId: integer("industry_id").notNull().references(() => industries.id), 
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()), 
});

export const insertIndustrySubCategorySchema = createInsertSchema(industrySubCategories).pick({ 
  name: true,
  description: true,
  industryId: true,
});

// Uses/Products table (aligned with SQL schema)
export const usesProducts = pgTable("uses_products", { 
  id: bigserial("id", { mode: "number" }).primaryKey(), 
  name: text("name").notNull(),
  description: text("description").notNull(),
  plantPartId: integer("plant_part_id").notNull().references(() => plantParts.id), 
  industrySubCategoryId: integer("industry_sub_category_id").references(() => industrySubCategories.id), 
  benefitsAdvantages: text("benefits_advantages").array(),
  commercializationStage: text("commercialization_stage"),
  manufacturingProcessesSummary: text("manufacturing_processes_summary"),
  sustainabilityAspects: text("sustainability_aspects").array(),
  historicalContextFacts: text("historical_context_facts").array(),
  technicalSpecifications: jsonb("technical_specifications"),
  miscellaneousInfo: jsonb("miscellaneous_info"),
  keywords: text("keywords").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const insertUsesProductsSchema = createInsertSchema(usesProducts).pick({ 
  name: true,
  description: true,
  plantPartId: true,
  industrySubCategoryId: true,
  benefitsAdvantages: true,
  commercializationStage: true,
  manufacturingProcessesSummary: true,
  sustainabilityAspects: true,
  historicalContextFacts: true,
  technicalSpecifications: true,
  miscellaneousInfo: true,
  keywords: true,
});

// Product Images table
export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  useProductId: bigserial("use_product_id", { mode: "number" }).notNull().references(() => usesProducts.id, { onDelete: 'cascade' }),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  altText: text("alt_text"),
  isPrimary: boolean("is_primary").default(false),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductImageSchema = createInsertSchema(productImages).pick({
  useProductId: true,
  imageUrl: true,
  caption: true,
  altText: true,
  isPrimary: true,
  order: true,
});

// Affiliate Links table
export const affiliateLinks = pgTable("affiliate_links", {
  id: serial("id").primaryKey(),
  useProductId: bigserial("use_product_id", { mode: "number" }).notNull().references(() => usesProducts.id, { onDelete: 'cascade' }),
  vendorName: text("vendor_name").notNull(),
  productUrl: text("product_url").notNull(),
  logoUrl: text("logo_url"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const insertAffiliateLinkSchema = createInsertSchema(affiliateLinks).pick({
  useProductId: true,
  vendorName: true,
  productUrl: true,
  logoUrl: true,
  description: true,
});

// Research Institutions table (aligned with SQL schema)
export const researchInstitutions = pgTable("research_institutions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location"),
  website: text("website"),
  focusAreas: text("focus_areas").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const insertResearchInstitutionSchema = createInsertSchema(researchInstitutions).pick({
  name: true,
  location: true,
  website: true,
  focusAreas: true,
});

// Research Entries table (aligned with SQL schema)
export const researchEntries = pgTable("research_entries", { 
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  entryType: text("entry_type").notNull(), 
  authorsOrAssignees: text("authors_or_assignees").array(), 
  publicationOrFilingDate: date("publication_or_filing_date"), 
  abstractSummary: text("abstract_summary").notNull(), 
  journalOrOffice: text("journal_or_office"), 
  doiOrPatentNumber: text("doi_or_patent_number"), 
  fullTextUrl: text("full_text_url"), 
  pdfUrl: text("pdf_url"),
  imageUrl: text("image_url"),
  plantTypeId: integer("plant_type_id").references(() => hempPlantArchetypes.id), 
  plantPartId: integer("plant_part_id").references(() => plantParts.id),
  industryId: integer("industry_id").references(() => industries.id),
  researchInstitutionId: integer("research_institution_id").references(() => researchInstitutions.id), 
  keywords: text("keywords").array(), 
  citations: integer("citations"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()), 
});

export const insertResearchEntrySchema = createInsertSchema(researchEntries).pick({ 
  title: true,
  entryType: true, 
  authorsOrAssignees: true, 
  publicationOrFilingDate: true, 
  abstractSummary: true, 
  journalOrOffice: true, 
  doiOrPatentNumber: true, 
  fullTextUrl: true, 
  pdfUrl: true,
  imageUrl: true,
  plantTypeId: true,
  plantPartId: true,
  industryId: true,
  researchInstitutionId: true, 
  keywords: true,
  citations: true,
});

// Companies table (aligned with SQL schema)
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  website: text("website"),
  location: text("location"),
  primaryActivity: text("primary_activity"),
  specialization: text("specialization"),
  description: text("description"),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const insertCompanySchema = createInsertSchema(companies).pick({
  name: true,
  website: true,
  location: true,
  primaryActivity: true,
  specialization: true,
  description: true,
  logoUrl: true,
});

// Junction table for UsesProducts and Companies
export const productCompanies = pgTable("product_companies", {
  useProductId: bigserial("use_product_id", { mode: "number" }).notNull().references(() => usesProducts.id, { onDelete: 'cascade' }),
  companyId: integer("company_id").notNull().references(() => companies.id, { onDelete: 'cascade' }),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.useProductId, table.companyId] }),
  };
});

// Junction table for UsesProducts and ResearchEntries
export const productResearchEntries = pgTable("product_research_entries", {
  useProductId: bigserial("use_product_id", { mode: "number" }).notNull().references(() => usesProducts.id, { onDelete: 'cascade' }),
  researchEntryId: integer("research_entry_id").notNull().references(() => researchEntries.id, { onDelete: 'cascade' }),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.useProductId, table.researchEntryId] }),
  };
});

// Historical Events table (aligned with SQL schema)
export const historicalEvents = pgTable("historical_events", {
  id: serial("id").primaryKey(),
  eventName: text("event_name").notNull(),
  eventDate: date("event_date"),
  description: text("description"),
  significance: text("significance"),
  relatedUsesKeywords: text("related_uses_keywords").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const insertHistoricalEventSchema = createInsertSchema(historicalEvents).pick({
  eventName: true,
  eventDate: true,
  description: true,
  significance: true,
  relatedUsesKeywords: true,
});

// Regulatory Jurisdictions table
export const regulatoryJurisdictions = pgTable("regulatory_jurisdictions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  region: text("region"),
  parentJurisdictionId: integer("parent_jurisdiction_id").references((): any => regulatoryJurisdictions.id, { onDelete: 'set null' }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const insertRegulatoryJurisdictionSchema = createInsertSchema(regulatoryJurisdictions).pick({
  name: true,
  region: true,
  parentJurisdictionId: true,
});

// Regulations table
export const regulations = pgTable("regulations", {
  id: serial("id").primaryKey(),
  jurisdictionId: integer("jurisdiction_id").notNull().references(() => regulatoryJurisdictions.id, { onDelete: 'cascade' }),
  regulationTitle: text("regulation_title").notNull(),
  summary: text("summary"),
  fullTextUrl: text("full_text_url"),
  effectiveDate: date("effective_date"),
  topic: text("topic"),
  lastUpdated: timestamp("last_updated").defaultNow().$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRegulationSchema = createInsertSchema(regulations).pick({
  jurisdictionId: true,
  regulationTitle: true,
  summary: true,
  fullTextUrl: true,
  effectiveDate: true,
  topic: true,
  lastUpdated: true,
});

// Junction table for UsesProducts and Regulations
export const productRegulations = pgTable("product_regulations", {
  useProductId: bigserial("use_product_id", { mode: "number" }).notNull().references(() => usesProducts.id, { onDelete: 'cascade' }),
  regulationId: integer("regulation_id").notNull().references(() => regulations.id, { onDelete: 'cascade' }),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.useProductId, table.regulationId] }),
  };
});

// Market Data Reports table (aligned with SQL schema)
export const marketDataReports = pgTable("market_data_reports", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  region: text("region"),
  segment: text("segment"),
  year: integer("year"),
  value: decimal("value", { precision: 18, scale: 2 }),
  cagr: decimal("cagr", { precision: 5, scale: 2 }),
  sourceUrl: text("source_url"),
  summary: text("summary"),
  publishedDate: date("published_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const insertMarketDataReportSchema = createInsertSchema(marketDataReports).pick({
  title: true,
  region: true,
  segment: true,
  year: true,
  value: true,
  cagr: true,
  sourceUrl: true,
  summary: true,
  publishedDate: true,
});


// RELATIONS
export const hempPlantArchetypesRelations = relations(hempPlantArchetypes, ({ many }) => ({
  plantParts: many(plantParts),
  researchEntries: many(researchEntries), 
}));

export const plantPartsRelations = relations(plantParts, ({ one, many }) => ({
  plantType: one(hempPlantArchetypes, {
    fields: [plantParts.plantTypeId],
    references: [hempPlantArchetypes.id],
  }),
  usesProducts: many(usesProducts),
  researchEntries: many(researchEntries), 
}));

export const industriesRelations = relations(industries, ({ many }) => ({
  industrySubCategories: many(industrySubCategories),
  researchEntries: many(researchEntries), 
}));

export const industrySubCategoriesRelations = relations(industrySubCategories, ({ one, many }) => ({
  industry: one(industries, {
    fields: [industrySubCategories.industryId],
    references: [industries.id],
  }),
  usesProducts: many(usesProducts),
}));

export const usesProductsRelations = relations(usesProducts, ({ one, many }) => ({
  plantPart: one(plantParts, {
    fields: [usesProducts.plantPartId],
    references: [plantParts.id],
  }),
  industrySubCategory: one(industrySubCategories, {
    fields: [usesProducts.industrySubCategoryId],
    references: [industrySubCategories.id],
  }),
  productCompanies: many(productCompanies), 
  productImages: many(productImages), 
  affiliateLinks: many(affiliateLinks), 
  productResearchEntries: many(productResearchEntries), 
  productRegulations: many(productRegulations), 
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({ 
  useProduct: one(usesProducts, {
    fields: [productImages.useProductId],
    references: [usesProducts.id],
  }),
}));

export const affiliateLinksRelations = relations(affiliateLinks, ({ one }) => ({ 
  useProduct: one(usesProducts, {
    fields: [affiliateLinks.useProductId],
    references: [usesProducts.id],
  }),
}));

export const researchInstitutionsRelations = relations(researchInstitutions, ({ many }) => ({
  researchEntries: many(researchEntries),
}));

export const researchEntryRelations = relations(researchEntries, ({ one, many }) => ({ 
  plantType: one(hempPlantArchetypes, { 
    fields: [researchEntries.plantTypeId], 
    references: [hempPlantArchetypes.id],
  }),
  plantPart: one(plantParts, {
    fields: [researchEntries.plantPartId], 
    references: [plantParts.id],
  }),
  industry: one(industries, {
    fields: [researchEntries.industryId], 
    references: [industries.id],
  }),
  researchInstitution: one(researchInstitutions, { 
    fields: [researchEntries.researchInstitutionId],
    references: [researchInstitutions.id],
  }),
  productResearchEntries: many(productResearchEntries), 
}));

export const companiesRelations = relations(companies, ({ many }) => ({
  productCompanies: many(productCompanies), 
}));

export const productCompaniesRelations = relations(productCompanies, ({ one }) => ({
  useProduct: one(usesProducts, {
    fields: [productCompanies.useProductId],
    references: [usesProducts.id],
  }),
  company: one(companies, {
    fields: [productCompanies.companyId],
    references: [companies.id],
  }),
}));

export const productResearchEntriesRelations = relations(productResearchEntries, ({ one }) => ({ 
  useProduct: one(usesProducts, {
    fields: [productResearchEntries.useProductId],
    references: [usesProducts.id],
  }),
  researchEntry: one(researchEntries, {
    fields: [productResearchEntries.researchEntryId],
    references: [researchEntries.id],
  }),
}));

export const regulatoryJurisdictionsRelations = relations(regulatoryJurisdictions, ({ one, many }) => ({ 
  regulations: many(regulations),
  parentJurisdiction: one(regulatoryJurisdictions, {
    fields: [regulatoryJurisdictions.parentJurisdictionId],
    references: [regulatoryJurisdictions.id],
    relationName: 'parent', 
  }),
  childJurisdictions: many(regulatoryJurisdictions, { 
    relationName: 'parent', 
  }),
}));

export const regulationsRelations = relations(regulations, ({ one, many }) => ({ 
  jurisdiction: one(regulatoryJurisdictions, {
    fields: [regulations.jurisdictionId],
    references: [regulatoryJurisdictions.id],
  }),
  productRegulations: many(productRegulations),
}));

export const productRegulationsRelations = relations(productRegulations, ({ one }) => ({ 
  useProduct: one(usesProducts, {
    fields: [productRegulations.useProductId],
    references: [usesProducts.id],
  }),
  regulation: one(regulations, {
    fields: [productRegulations.regulationId],
    references: [regulations.id],
  }),
}));

// (No specific relations defined for historicalEvents or marketDataReports yet)


// Types (Consolidated)
export type PlantType = typeof hempPlantArchetypes.$inferSelect;
export type InsertPlantType = z.infer<typeof insertPlantTypeSchema>;

export type PlantPart = typeof plantParts.$inferSelect;
export type InsertPlantPart = z.infer<typeof insertPlantPartSchema>;

export type Industry = typeof industries.$inferSelect;
export type InsertIndustry = z.infer<typeof insertIndustrySchema>;

export type IndustrySubCategory = typeof industrySubCategories.$inferSelect; 
export type InsertIndustrySubCategory = z.infer<typeof insertIndustrySubCategorySchema>; 

export type UseProduct = typeof usesProducts.$inferSelect; 
export type InsertUseProduct = z.infer<typeof insertUsesProductsSchema>; 

export type ProductImage = typeof productImages.$inferSelect;
export type InsertProductImage = z.infer<typeof insertProductImageSchema>;

export type AffiliateLink = typeof affiliateLinks.$inferSelect;
export type InsertAffiliateLink = z.infer<typeof insertAffiliateLinkSchema>;

export type ResearchInstitution = typeof researchInstitutions.$inferSelect;
export type InsertResearchInstitution = z.infer<typeof insertResearchInstitutionSchema>;

export type ResearchEntry = typeof researchEntries.$inferSelect; 
export type InsertResearchEntry = z.infer<typeof insertResearchEntrySchema>; 

export type Company = typeof companies.$inferSelect; 
export type InsertCompany = z.infer<typeof insertCompanySchema>; 

export type HistoricalEvent = typeof historicalEvents.$inferSelect;
export type InsertHistoricalEvent = z.infer<typeof insertHistoricalEventSchema>;

export type RegulatoryJurisdiction = typeof regulatoryJurisdictions.$inferSelect; 
export type InsertRegulatoryJurisdiction = z.infer<typeof insertRegulatoryJurisdictionSchema>; 

export type Regulation = typeof regulations.$inferSelect; 
export type InsertRegulation = z.infer<typeof insertRegulationSchema>; 

export type MarketDataReport = typeof marketDataReports.$inferSelect; // Added type
export type InsertMarketDataReport = z.infer<typeof insertMarketDataReportSchema>; // Added type

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
