import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const franchises = pgTable("franchises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sapCode: text("sap_code").notNull().unique(),
  city: text("city").notNull(),
  state: text("state").notNull(),
});

export const assets = pgTable("assets", {
  id: serial("id").primaryKey(),
  serialNumber: text("serial_number").notNull().unique(),
  assetMake: text("asset_make").notNull(),
  assetModel: text("asset_model").notNull(),
  iotNumber: text("iot_number"),
  assetCategory: text("asset_category").notNull(), // battery, charger, soc-meter, harness
  franchiseId: integer("franchise_id").references(() => franchises.id),
  status: text("status").notNull().default("pending"), // pending, verified, mismatch
  assetStatus: text("asset_status"), // rtb-franchise, rmt-franchise, deployed-driver, etc.
  qrCodeAvailable: boolean("qr_code_available").default(false),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const audits = pgTable("audits", {
  id: serial("id").primaryKey(),
  franchiseId: integer("franchise_id").references(() => franchises.id),
  kaeId: integer("kae_id").references(() => users.id),
  status: text("status").notNull().default("in-progress"), // in-progress, completed, signed-off
  totalAssets: integer("total_assets").notNull().default(0),
  verifiedAssets: integer("verified_assets").notNull().default(0),
  pendingAssets: integer("pending_assets").notNull().default(0),
  mismatchAssets: integer("mismatch_assets").notNull().default(0),
  socMeterCount: integer("soc_meter_count").default(0),
  harnessCount: integer("harness_count").default(0),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const auditEntries = pgTable("audit_entries", {
  id: serial("id").primaryKey(),
  auditId: integer("audit_id").references(() => audits.id),
  assetId: integer("asset_id").references(() => assets.id),
  verificationMethod: text("verification_method").notNull(), // qr-scan, manual-entry
  serialNumberScanned: text("serial_number_scanned"),
  photoUrl: text("photo_url"),
  notes: text("notes"),
  auditedAt: timestamp("audited_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertFranchiseSchema = createInsertSchema(franchises).omit({
  id: true,
});

export const insertAssetSchema = createInsertSchema(assets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAuditSchema = createInsertSchema(audits).omit({
  id: true,
  startedAt: true,
  completedAt: true,
});

export const insertAuditEntrySchema = createInsertSchema(auditEntries).omit({
  id: true,
  auditedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Franchise = typeof franchises.$inferSelect;
export type InsertFranchise = z.infer<typeof insertFranchiseSchema>;

export type Asset = typeof assets.$inferSelect;
export type InsertAsset = z.infer<typeof insertAssetSchema>;

export type Audit = typeof audits.$inferSelect;
export type InsertAudit = z.infer<typeof insertAuditSchema>;

export type AuditEntry = typeof auditEntries.$inferSelect;
export type InsertAuditEntry = z.infer<typeof insertAuditEntrySchema>;
