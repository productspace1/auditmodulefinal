import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAssetSchema, insertAuditEntrySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get franchise data (for current KAE session)
  app.get("/api/franchise/:id", async (req, res) => {
    try {
      const franchiseId = parseInt(req.params.id);
      const franchise = await storage.getFranchise(franchiseId);
      
      if (!franchise) {
        return res.status(404).json({ message: "Franchise not found" });
      }
      
      res.json(franchise);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch franchise data" });
    }
  });

  // Get assets for franchise
  app.get("/api/assets/franchise/:franchiseId", async (req, res) => {
    try {
      const franchiseId = parseInt(req.params.franchiseId);
      const assets = await storage.getAssetsByFranchise(franchiseId);
      res.json(assets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assets" });
    }
  });

  // Get current audit for franchise
  app.get("/api/audit/franchise/:franchiseId", async (req, res) => {
    try {
      const franchiseId = parseInt(req.params.franchiseId);
      const audit = await storage.getAuditByFranchise(franchiseId);
      
      if (!audit) {
        return res.status(404).json({ message: "No active audit found" });
      }
      
      res.json(audit);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch audit data" });
    }
  });

  // Update asset status
  app.patch("/api/assets/:id", async (req, res) => {
    try {
      const assetId = parseInt(req.params.id);
      const updates = req.body;
      
      const updatedAsset = await storage.updateAsset(assetId, updates);
      
      if (!updatedAsset) {
        return res.status(404).json({ message: "Asset not found" });
      }
      
      res.json(updatedAsset);
    } catch (error) {
      res.status(500).json({ message: "Failed to update asset" });
    }
  });

  // Submit audit entry
  app.post("/api/audit-entries", async (req, res) => {
    try {
      const validatedData = insertAuditEntrySchema.parse(req.body);
      const auditEntry = await storage.createAuditEntry(validatedData);
      res.json(auditEntry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid audit entry data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create audit entry" });
    }
  });

  // Add new asset
  app.post("/api/assets", async (req, res) => {
    try {
      const validatedData = insertAssetSchema.parse(req.body);
      const asset = await storage.createAsset(validatedData);
      res.json(asset);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid asset data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create asset" });
    }
  });

  // Update audit progress
  app.patch("/api/audits/:id", async (req, res) => {
    try {
      const auditId = parseInt(req.params.id);
      const updates = req.body;
      
      const updatedAudit = await storage.updateAudit(auditId, updates);
      
      if (!updatedAudit) {
        return res.status(404).json({ message: "Audit not found" });
      }
      
      res.json(updatedAudit);
    } catch (error) {
      res.status(500).json({ message: "Failed to update audit" });
    }
  });

  // Handle file uploads (photos)
  app.post("/api/upload", async (req, res) => {
    // In a real implementation, this would handle file uploads
    // For now, we'll return a mock URL
    res.json({ url: "/uploads/asset-photo-" + Date.now() + ".jpg" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
