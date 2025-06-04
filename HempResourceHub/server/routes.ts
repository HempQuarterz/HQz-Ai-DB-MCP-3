import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { DatabaseStorage } from "./storage-db";
import { z } from "zod";
import { insertPlantTypeSchema, insertPlantPartSchema, insertIndustrySchema, insertIndustrySubCategorySchema, insertUsesProductsSchema, insertResearchEntrySchema, plantTypes } from "@shared/schema";
import { log } from "./vite";
import { db } from "./db";
import { dbAlt } from "./db-alt";  // Import alternative connection
import { initializeDatabase } from "./db-init";

function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize the database if needed
  try {
    if (process.env.NODE_ENV !== 'test') {
      log("Initializing database schema...");
      await initializeDatabase();

      // Check if we have data already
      const existingData = await db.select().from(plantTypes);

      // Only initialize if we only have the test data or no data
      if (existingData.length <= 1) {
        log("Adding sample data to database...");

        // Check if initializeData method exists on the storage object
        if (typeof storage.initializeData === 'function') {
          await storage.initializeData();
          log("Database initialization completed.");
        } else {
          log(
            "Storage implementation doesn't have an initializeData method, skipping initialization."
          );
        }
      } else {
        log("Database already contains data, skipping initialization.");
      }
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }

  // API routes for the hemp database
  app.get(
    "/api/plant-types",
    asyncHandler(async (req, res) => {
      const plantTypes = await storage.getAllPlantTypes();
      res.json(plantTypes);
    })
  );

  app.get(
    "/api/plant-types/:id",
    asyncHandler(async (req, res) => {
      const id = parseInt(req.params.id);
      const plantType = await storage.getPlantType(id);
      if (!plantType) {
        return res.status(404).json({ message: "Plant type not found" });
      }
      res.json(plantType);
    })
  );

  app.get(
    "/api/plant-parts",
    asyncHandler(async (req, res) => {
      const plantTypeId = req.query.plantTypeId
        ? parseInt(req.query.plantTypeId as string)
        : undefined;

      if (plantTypeId) {
        const plantParts = await storage.getPlantPartsByType(plantTypeId);
        return res.json(plantParts);
      } else {
        const plantParts = await storage.getAllPlantParts();
        return res.json(plantParts);
      }
    })
  );

  app.get(
    "/api/plant-parts/:id",
    asyncHandler(async (req, res) => {
      const id = parseInt(req.params.id);
      const plantPart = await storage.getPlantPart(id);
      if (!plantPart) {
        return res.status(404).json({ message: "Plant part not found" });
      }
      res.json(plantPart);
    })
  );

  app.get(
    "/api/industries",
    asyncHandler(async (_req, res) => {
      const industries = await storage.getAllIndustries();
      res.json(industries);
    })
  );

  app.get(
    "/api/industries/:id",
    asyncHandler(async (req, res) => {
      const id = parseInt(req.params.id);
      const industry = await storage.getIndustry(id);
      if (!industry) {
        return res.status(404).json({ message: "Industry not found" });
      }
      res.json(industry);
    })
  );

  app.get(
    "/api/sub-industries",
    asyncHandler(async (req, res) => {
      const industryId = req.query.industryId
        ? parseInt(req.query.industryId as string)
        : undefined;

      if (industryId) {
        const subIndustries = await storage.getSubIndustriesByIndustry(industryId);
        return res.json(subIndustries);
      } else {
        const subIndustries = await storage.getAllSubIndustries();
        return res.json(subIndustries);
      }
    })
  );

  app.get(
    "/api/sub-industries/:id",
    asyncHandler(async (req, res) => {
      const id = parseInt(req.params.id);
      const subIndustry = await storage.getSubIndustry(id);
      if (!subIndustry) {
        return res.status(404).json({ message: "Sub-industry not found" });
      }
      res.json(subIndustry);
    })
  );

  app.get(
    "/api/hemp-products",
    asyncHandler(async (req, res) => {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const plantPartId = req.query.plantPartId
        ? parseInt(req.query.plantPartId as string)
        : undefined;
      const industryId = req.query.industryId
        ? parseInt(req.query.industryId as string)
        : undefined;

      if (req.query.pagination === "true") {
        const { products, total } = await storage.getPaginatedHempProducts(
          page,
          limit,
          plantPartId,
          industryId
        );
        return res.json({
          products,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        });
      } else if (plantPartId && industryId) {
        const products = await storage.getHempProductsByPartAndIndustry(
          plantPartId,
          industryId
        );
        return res.json(products);
      } else if (plantPartId) {
        const products = await storage.getHempProductsByPart(plantPartId);
        return res.json(products);
      } else if (industryId) {
        const products = await storage.getHempProductsByIndustry(industryId);
        return res.json(products);
      } else {
        const products = await storage.getAllHempProducts();
        return res.json(products);
      }
    })
  );

  app.get(
    "/api/hemp-products/:id",
    asyncHandler(async (req, res) => {
      const id = parseInt(req.params.id);
      const product = await storage.getHempProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Hemp product not found" });
      }
      res.json(product);
    })
  );

  app.get(
    "/api/hemp-products/search",
    asyncHandler(async (req, res) => {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const products = await storage.searchHempProducts(query);
      res.json(products);
    })
  );

  app.get(
    "/api/stats",
    asyncHandler(async (_req, res) => {
      const totalProducts = await storage.countTotalHempProducts();
      const industries = await storage.getAllIndustries();
      const plantParts = await storage.getAllPlantParts();

      res.json({
        totalProducts,
        totalIndustries: industries.length,
        totalPlantParts: plantParts.length,
      });
    })
  );

  // Research paper routes
  app.get(
    "/api/research-papers",
    asyncHandler(async (_req, res) => {
      const papers = await storage.getAllResearchPapers();
      res.json(papers);
    })
  );

  app.get(
    "/api/research-papers/:id",
    asyncHandler(async (req, res) => {
      const id = parseInt(req.params.id);
      const paper = await storage.getResearchPaper(id);
      if (!paper) {
        return res.status(404).json({ message: "Research paper not found" });
      }
      res.json(paper);
    })
  );

  app.get(
    "/api/research-papers/plant-type/:plantTypeId",
    asyncHandler(async (req, res) => {
      const plantTypeId = parseInt(req.params.plantTypeId);
      const papers = await storage.getResearchPapersByPlantType(plantTypeId);
      res.json(papers);
    })
  );

  app.get(
    "/api/research-papers/plant-part/:plantPartId",
    asyncHandler(async (req, res) => {
      const plantPartId = parseInt(req.params.plantPartId);
      const papers = await storage.getResearchPapersByPlantPart(plantPartId);
      res.json(papers);
    })
  );

  app.get(
    "/api/research-papers/industry/:industryId",
    asyncHandler(async (req, res) => {
      const industryId = parseInt(req.params.industryId);
      const papers = await storage.getResearchPapersByIndustry(industryId);
      res.json(papers);
    })
  );

  app.get(
    "/api/research-papers/search",
    asyncHandler(async (req, res) => {
      const query = (req.query.q as string) || "";
      const papers = await storage.searchResearchPapers(query);
      res.json(papers);
    })
  );
  
  app.post(
    "/api/research-papers",
    asyncHandler(async (req, res) => {
      const validatedData = insertResearchEntrySchema.parse(req.body);
      const paper = await storage.createResearchPaper(validatedData);
      res.status(201).json(paper);
    })
  );

  // POST routes for potential admin functionality
  app.post(
    "/api/plant-types",
    asyncHandler(async (req, res) => {
      const validatedData = insertPlantTypeSchema.parse(req.body);
      const plantType = await storage.createPlantType(validatedData);
      res.status(201).json(plantType);
    })
  );

  app.post(
    "/api/plant-parts",
    asyncHandler(async (req, res) => {
      const validatedData = insertPlantPartSchema.parse(req.body);
      const plantPart = await storage.createPlantPart(validatedData);
      res.status(201).json(plantPart);
    })
  );

  app.post(
    "/api/industries",
    asyncHandler(async (req, res) => {
      const validatedData = insertIndustrySchema.parse(req.body);
      const industry = await storage.createIndustry(validatedData);
      res.status(201).json(industry);
    })
  );

  app.post(
    "/api/sub-industries",
    asyncHandler(async (req, res) => {
      const validatedData = insertIndustrySubCategorySchema.parse(req.body);
      const subIndustry = await storage.createSubIndustry(validatedData);
      res.status(201).json(subIndustry);
    })
  );

  app.post(
    "/api/hemp-products",
    asyncHandler(async (req, res) => {
      const validatedData = insertUsesProductsSchema.parse(req.body);
      const product = await storage.createHempProduct(validatedData);
      res.status(201).json(product);
    })
  );

  const httpServer = createServer(app);
  return httpServer;
}
