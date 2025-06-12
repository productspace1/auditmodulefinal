import { 
  users, franchises, assets, audits, auditEntries,
  type User, type InsertUser,
  type Franchise, type InsertFranchise,
  type Asset, type InsertAsset,
  type Audit, type InsertAudit,
  type AuditEntry, type InsertAuditEntry
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Franchise methods
  getFranchise(id: number): Promise<Franchise | undefined>;
  getFranchiseBySapCode(sapCode: string): Promise<Franchise | undefined>;
  getAllFranchises(): Promise<Franchise[]>;
  createFranchise(franchise: InsertFranchise): Promise<Franchise>;

  // Asset methods
  getAsset(id: number): Promise<Asset | undefined>;
  getAssetBySerialNumber(serialNumber: string): Promise<Asset | undefined>;
  getAssetsByFranchise(franchiseId: number): Promise<Asset[]>;
  createAsset(asset: InsertAsset): Promise<Asset>;
  updateAsset(id: number, updates: Partial<Asset>): Promise<Asset | undefined>;
  deleteAsset(id: number): Promise<boolean>;

  // Audit methods
  getAudit(id: number): Promise<Audit | undefined>;
  getAuditByFranchise(franchiseId: number): Promise<Audit | undefined>;
  createAudit(audit: InsertAudit): Promise<Audit>;
  updateAudit(id: number, updates: Partial<Audit>): Promise<Audit | undefined>;

  // Audit entry methods
  getAuditEntries(auditId: number): Promise<AuditEntry[]>;
  createAuditEntry(entry: InsertAuditEntry): Promise<AuditEntry>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private franchises: Map<number, Franchise>;
  private assets: Map<number, Asset>;
  private audits: Map<number, Audit>;
  private auditEntries: Map<number, AuditEntry>;
  private currentUserId: number;
  private currentFranchiseId: number;
  private currentAssetId: number;
  private currentAuditId: number;
  private currentAuditEntryId: number;

  constructor() {
    this.users = new Map();
    this.franchises = new Map();
    this.assets = new Map();
    this.audits = new Map();
    this.auditEntries = new Map();
    this.currentUserId = 1;
    this.currentFranchiseId = 1;
    this.currentAssetId = 1;
    this.currentAuditId = 1;
    this.currentAuditEntryId = 1;
    
    this.initializeData();
  }

  private initializeData() {
    // Create sample franchise
    const franchise: Franchise = {
      id: this.currentFranchiseId++,
      name: "Franchise ABC - Mumbai",
      sapCode: "FP001",
      city: "Mumbai",
      state: "Maharashtra"
    };
    this.franchises.set(franchise.id, franchise);

    // Create sample KAE user
    const kae: User = {
      id: this.currentUserId++,
      username: "kae_mumbai",
      password: "password123"
    };
    this.users.set(kae.id, kae);

    // Create sample assets
    const sampleAssets: InsertAsset[] = [
      {
        serialNumber: "BAT-2024-001",
        assetMake: "Exide",
        assetModel: "EXD-500",
        iotNumber: "IOT123456",
        assetCategory: "battery",
        franchiseId: franchise.id,
        status: "pending",
        qrCodeAvailable: true
      },
      {
        serialNumber: "CHG-2024-002",
        assetMake: "Delta",
        assetModel: "DLT-200",
        iotNumber: "IOT789012",
        assetCategory: "charger",
        franchiseId: franchise.id,
        status: "verified",
        assetStatus: "deployed-driver",
        qrCodeAvailable: true
      },
      {
        serialNumber: "SOC-2024-003",
        assetMake: "TechSoc",
        assetModel: "TS-100",
        iotNumber: "IOT345678",
        assetCategory: "soc-meter",
        franchiseId: franchise.id,
        status: "mismatch",
        qrCodeAvailable: false
      }
    ];

    sampleAssets.forEach(asset => {
      const newAsset: Asset = {
        ...asset,
        id: this.currentAssetId++,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.assets.set(newAsset.id, newAsset);
    });

    // Create sample audit
    const audit: Audit = {
      id: this.currentAuditId++,
      franchiseId: franchise.id,
      kaeId: kae.id,
      status: "in-progress",
      totalAssets: 25,
      verifiedAssets: 8,
      pendingAssets: 13,
      mismatchAssets: 1,
      socMeterCount: 0,
      harnessCount: 0,
      startedAt: new Date(),
      completedAt: null
    };
    this.audits.set(audit.id, audit);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = { ...insertUser, id: this.currentUserId++ };
    this.users.set(user.id, user);
    return user;
  }

  // Franchise methods
  async getFranchise(id: number): Promise<Franchise | undefined> {
    return this.franchises.get(id);
  }

  async getFranchiseBySapCode(sapCode: string): Promise<Franchise | undefined> {
    return Array.from(this.franchises.values()).find(f => f.sapCode === sapCode);
  }

  async getAllFranchises(): Promise<Franchise[]> {
    return Array.from(this.franchises.values());
  }

  async createFranchise(insertFranchise: InsertFranchise): Promise<Franchise> {
    const franchise: Franchise = { ...insertFranchise, id: this.currentFranchiseId++ };
    this.franchises.set(franchise.id, franchise);
    return franchise;
  }

  // Asset methods
  async getAsset(id: number): Promise<Asset | undefined> {
    return this.assets.get(id);
  }

  async getAssetBySerialNumber(serialNumber: string): Promise<Asset | undefined> {
    return Array.from(this.assets.values()).find(a => a.serialNumber === serialNumber);
  }

  async getAssetsByFranchise(franchiseId: number): Promise<Asset[]> {
    return Array.from(this.assets.values()).filter(a => a.franchiseId === franchiseId);
  }

  async createAsset(insertAsset: InsertAsset): Promise<Asset> {
    const asset: Asset = {
      ...insertAsset,
      id: this.currentAssetId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.assets.set(asset.id, asset);
    return asset;
  }

  async updateAsset(id: number, updates: Partial<Asset>): Promise<Asset | undefined> {
    const asset = this.assets.get(id);
    if (!asset) return undefined;
    
    const updatedAsset = { ...asset, ...updates, updatedAt: new Date() };
    this.assets.set(id, updatedAsset);
    return updatedAsset;
  }

  async deleteAsset(id: number): Promise<boolean> {
    return this.assets.delete(id);
  }

  // Audit methods
  async getAudit(id: number): Promise<Audit | undefined> {
    return this.audits.get(id);
  }

  async getAuditByFranchise(franchiseId: number): Promise<Audit | undefined> {
    return Array.from(this.audits.values()).find(a => a.franchiseId === franchiseId);
  }

  async createAudit(insertAudit: InsertAudit): Promise<Audit> {
    const audit: Audit = {
      ...insertAudit,
      id: this.currentAuditId++,
      startedAt: new Date(),
      completedAt: null
    };
    this.audits.set(audit.id, audit);
    return audit;
  }

  async updateAudit(id: number, updates: Partial<Audit>): Promise<Audit | undefined> {
    const audit = this.audits.get(id);
    if (!audit) return undefined;
    
    const updatedAudit = { ...audit, ...updates };
    this.audits.set(id, updatedAudit);
    return updatedAudit;
  }

  // Audit entry methods
  async getAuditEntries(auditId: number): Promise<AuditEntry[]> {
    return Array.from(this.auditEntries.values()).filter(e => e.auditId === auditId);
  }

  async createAuditEntry(insertEntry: InsertAuditEntry): Promise<AuditEntry> {
    const entry: AuditEntry = {
      ...insertEntry,
      id: this.currentAuditEntryId++,
      auditedAt: new Date()
    };
    this.auditEntries.set(entry.id, entry);
    return entry;
  }
}

export const storage = new MemStorage();
