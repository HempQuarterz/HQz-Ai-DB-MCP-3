import { 
  users, type User, type InsertUser,
  hempPlantArchetypes as plantTypes, type PlantType, type InsertPlantType,
  plantParts, type PlantPart, type InsertPlantPart,
  industries, type Industry, type InsertIndustry,
  subIndustries, type SubIndustry, type InsertSubIndustry,
  hempProducts, type HempProduct, type InsertHempProduct,
  researchPapers, type ResearchPaper, type InsertResearchPaper
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Plant type methods
  getAllPlantTypes(): Promise<PlantType[]>;
  getPlantType(id: number): Promise<PlantType | undefined>;
  createPlantType(plantType: InsertPlantType): Promise<PlantType>;

  // Plant part methods
  getAllPlantParts(): Promise<PlantPart[]>;
  getPlantPartsByType(plantTypeId: number): Promise<PlantPart[]>;
  getPlantPart(id: number): Promise<PlantPart | undefined>;
  createPlantPart(plantPart: InsertPlantPart): Promise<PlantPart>;

  // Industry methods
  getAllIndustries(): Promise<Industry[]>;
  getIndustry(id: number): Promise<Industry | undefined>;
  createIndustry(industry: InsertIndustry): Promise<Industry>;

  // Sub-industry methods
  getAllSubIndustries(): Promise<SubIndustry[]>;
  getSubIndustriesByIndustry(industryId: number): Promise<SubIndustry[]>;
  getSubIndustry(id: number): Promise<SubIndustry | undefined>;
  createSubIndustry(subIndustry: InsertSubIndustry): Promise<SubIndustry>;

  // Hemp product methods
  getAllHempProducts(): Promise<HempProduct[]>;
  getHempProduct(id: number): Promise<HempProduct | undefined>;
  getHempProductsByPart(plantPartId: number): Promise<HempProduct[]>;
  getHempProductsByIndustry(industryId: number): Promise<HempProduct[]>;
  getHempProductsBySubIndustry(subIndustryId: number): Promise<HempProduct[]>;
  getHempProductsByPartAndIndustry(plantPartId: number, industryId: number): Promise<HempProduct[]>;
  createHempProduct(hempProduct: InsertHempProduct): Promise<HempProduct>;
  searchHempProducts(query: string): Promise<HempProduct[]>;
  getPaginatedHempProducts(page: number, limit: number, plantPartId?: number, industryId?: number): Promise<{products: HempProduct[], total: number}>;
  countTotalHempProducts(): Promise<number>;
  
  // Research paper methods
  getAllResearchPapers(): Promise<ResearchPaper[]>;
  getResearchPaper(id: number): Promise<ResearchPaper | undefined>;
  getResearchPapersByPlantType(plantTypeId: number): Promise<ResearchPaper[]>;
  getResearchPapersByPlantPart(plantPartId: number): Promise<ResearchPaper[]>;
  getResearchPapersByIndustry(industryId: number): Promise<ResearchPaper[]>;
  searchResearchPapers(query: string): Promise<ResearchPaper[]>;
  createResearchPaper(researchPaper: InsertResearchPaper): Promise<ResearchPaper>;
  
  // Database initialization
  initializeData?(): Promise<void>;
}

// Import DatabaseStorage implementation
import { DatabaseStorage } from "./storage-db";
export const storage = new DatabaseStorage();