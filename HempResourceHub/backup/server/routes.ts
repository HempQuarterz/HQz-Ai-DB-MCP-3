import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { DatabaseStorage } from "./storage-db";
import { z } from "zod";
import { insertPlantTypeSchema, insertPlantPartSchema, insertIndustrySchema, insertSubIndustrySchema, insertHempProductSchema, insertResearchPaperSchema, plantTypes } from "@shared/schema";
import { log } from "./vite";
import { db } from "./db";
import { dbAlt } from "./db-alt";  // Import alternative connection
import { initializeDatabase } from "./db-init";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize the database if needed
  try {
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
        log("Storage implementation doesn't have an initializeData method, skipping initialization.");
      }
    } else {
      log("Database already contains data, skipping initialization.");
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }

  // API routes for the hemp database
  app.get("/api/plant-types", async (req, res) => {
    try {
      const plantTypes = await storage.getAllPlantTypes();
      res.json(plantTypes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch plant types" });
    }
  });

  app.get("/api/plant-types/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const plantType = await storage.getPlantType(id);
      if (!plantType) {
        return res.status(404).json({ message: "Plant type not found" });
      }
      res.json(plantType);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch plant type" });
    }
  });

  app.get("/api/plant-parts", async (req, res) => {
    try {
      const plantTypeId = req.query.plantTypeId ? parseInt(req.query.plantTypeId as string) : undefined;
      
      if (plantTypeId) {
        const plantParts = await storage.getPlantPartsByType(plantTypeId);
        return res.json(plantParts);
      } else {
        const plantParts = await storage.getAllPlantParts();
        return res.json(plantParts);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch plant parts" });
    }
  });

  app.get("/api/plant-parts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const plantPart = await storage.getPlantPart(id);
      if (!plantPart) {
        return res.status(404).json({ message: "Plant part not found" });
      }
      res.json(plantPart);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch plant part" });
    }
  });

  app.get("/api/industries", async (req, res) => {
    try {
      const industries = await storage.getAllIndustries();
      res.json(industries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch industries" });
    }
  });

  app.get("/api/industries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const industry = await storage.getIndustry(id);
      if (!industry) {
        return res.status(404).json({ message: "Industry not found" });
      }
      res.json(industry);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch industry" });
    }
  });

  app.get("/api/sub-industries", async (req, res) => {
    try {
      const industryId = req.query.industryId ? parseInt(req.query.industryId as string) : undefined;
      
      if (industryId) {
        const subIndustries = await storage.getSubIndustriesByIndustry(industryId);
        return res.json(subIndustries);
      } else {
        const subIndustries = await storage.getAllSubIndustries();
        return res.json(subIndustries);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sub-industries" });
    }
  });

  app.get("/api/sub-industries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const subIndustry = await storage.getSubIndustry(id);
      if (!subIndustry) {
        return res.status(404).json({ message: "Sub-industry not found" });
      }
      res.json(subIndustry);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sub-industry" });
    }
  });

  app.get("/api/hemp-products", async (req, res) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const plantPartId = req.query.plantPartId ? parseInt(req.query.plantPartId as string) : undefined;
      const industryId = req.query.industryId ? parseInt(req.query.industryId as string) : undefined;
      
      if (req.query.pagination === 'true') {
        const { products, total } = await storage.getPaginatedHempProducts(page, limit, plantPartId, industryId);
        return res.json({
          products,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        });
      } else if (plantPartId && industryId) {
        const products = await storage.getHempProductsByPartAndIndustry(plantPartId, industryId);
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
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hemp products" });
    }
  });

  app.get("/api/hemp-products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getHempProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Hemp product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hemp product" });
    }
  });

  app.get("/api/hemp-products/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const products = await storage.searchHempProducts(query);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to search hemp products" });
    }
  });

  app.get("/api/stats", async (req, res) => {
    try {
      const totalProducts = await storage.countTotalHempProducts();
      const industries = await storage.getAllIndustries();
      const plantParts = await storage.getAllPlantParts();
      
      res.json({
        totalProducts,
        totalIndustries: industries.length,
        totalPlantParts: plantParts.length
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Research paper routes
  app.get("/api/research-papers", async (req, res) => {
    try {
      const papers = await storage.getAllResearchPapers();
      res.json(papers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch research papers" });
    }
  });

  app.get("/api/research-papers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const paper = await storage.getResearchPaper(id);
      if (!paper) {
        return res.status(404).json({ message: "Research paper not found" });
      }
      res.json(paper);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch research paper" });
    }
  });

  app.get("/api/research-papers/plant-type/:plantTypeId", async (req, res) => {
    try {
      const plantTypeId = parseInt(req.params.plantTypeId);
      const papers = await storage.getResearchPapersByPlantType(plantTypeId);
      res.json(papers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch research papers by plant type" });
    }
  });

  app.get("/api/research-papers/plant-part/:plantPartId", async (req, res) => {
    try {
      const plantPartId = parseInt(req.params.plantPartId);
      const papers = await storage.getResearchPapersByPlantPart(plantPartId);
      res.json(papers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch research papers by plant part" });
    }
  });

  app.get("/api/research-papers/industry/:industryId", async (req, res) => {
    try {
      const industryId = parseInt(req.params.industryId);
      const papers = await storage.getResearchPapersByIndustry(industryId);
      res.json(papers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch research papers by industry" });
    }
  });

  app.get("/api/research-papers/search", async (req, res) => {
    try {
      const query = req.query.q as string || "";
      const papers = await storage.searchResearchPapers(query);
      res.json(papers);
    } catch (error) {
      res.status(500).json({ message: "Failed to search research papers" });
    }
  });
  
  app.post("/api/research-papers", async (req, res) => {
    try {
      const validatedData = insertResearchPaperSchema.parse(req.body);
      const paper = await storage.createResearchPaper(validatedData);
      res.status(201).json(paper);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create research paper" });
    }
  });

  // POST routes for potential admin functionality
  app.post("/api/plant-types", async (req, res) => {
    try {
      const validatedData = insertPlantTypeSchema.parse(req.body);
      const plantType = await storage.createPlantType(validatedData);
      res.status(201).json(plantType);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create plant type" });
    }
  });

  app.post("/api/plant-parts", async (req, res) => {
    try {
      const validatedData = insertPlantPartSchema.parse(req.body);
      const plantPart = await storage.createPlantPart(validatedData);
      res.status(201).json(plantPart);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create plant part" });
    }
  });

  app.post("/api/industries", async (req, res) => {
    try {
      const validatedData = insertIndustrySchema.parse(req.body);
      const industry = await storage.createIndustry(validatedData);
      res.status(201).json(industry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create industry" });
    }
  });

  app.post("/api/sub-industries", async (req, res) => {
    try {
      const validatedData = insertSubIndustrySchema.parse(req.body);
      const subIndustry = await storage.createSubIndustry(validatedData);
      res.status(201).json(subIndustry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create sub-industry" });
    }
  });

  app.post("/api/hemp-products", async (req, res) => {
    try {
      const validatedData = insertHempProductSchema.parse(req.body);
      const product = await storage.createHempProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create hemp product" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
