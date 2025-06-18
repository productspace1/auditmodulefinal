# Battery Asset Audit Application

## Overview

This is a mobile-optimized frontend application designed for Key Account Executives (KAEs) to conduct battery asset audits at franchise locations. The system enables auditing of various asset types (batteries, chargers, SOC meters, harnesses) through QR code scanning, manual entry, and photo documentation. The application provides real-time tracking of audit progress with an interactive frontend experience.

## System Architecture

The application follows a frontend-focused architecture with minimal backend for demonstration:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **UI Framework**: Shadcn/ui components with Tailwind CSS
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with custom design tokens

### Backend Architecture (Minimal)
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Storage**: In-memory storage for demonstration
- **API**: RESTful endpoints for frontend interaction

### Mobile-First Design
- Progressive Web App (PWA) capabilities
- Mobile-optimized UI with touch-friendly interactions
- Camera integration for QR scanning and photo capture
- Responsive design across all screen sizes

## Key Components

### Data Structure
The system uses five main entities stored in memory:

1. **Users**: KAE authentication and management
2. **Franchises**: Franchise location data with SAP codes
3. **Assets**: Individual asset tracking with serial numbers, categories, and status
4. **Audits**: Audit session management with progress tracking
5. **Audit Entries**: Individual asset verification records

### Asset Management
- Support for four asset categories: battery, charger, soc-meter, harness
- Multiple asset status types (RTB at Franchise, RMT at Franchise, Deployed to Driver, etc.)
- QR code availability tracking
- Photo documentation capabilities

### Audit Workflow
- Real-time audit progress tracking
- QR code scanning for asset verification
- Manual entry fallback for assets without QR codes
- Photo capture for asset documentation
- Bulk quantity entry for SOC meters and harnesses
- Audit completion and report generation

## Data Flow

1. **Audit Initiation**: KAE starts audit session for a specific franchise
2. **Asset Discovery**: System loads all assets associated with the franchise
3. **Asset Verification**: KAE scans QR codes or manually enters asset information
4. **Status Updates**: Asset status updated in real-time (pending → verified/mismatch)
5. **Progress Tracking**: Audit statistics updated continuously
6. **Completion**: Final report generated with audit summary

## External Dependencies

### Core Dependencies
- **Storage**: In-memory data storage for demonstration
- **Mock Services**: Simulated QR scanning and photo upload functionality
- **File Upload**: Mock implementation for photo storage demonstration

### UI Dependencies
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **TanStack Query**: Server state management
- **React Hook Form**: Form validation and management

### Development Dependencies
- **Vite**: Build tool with React plugin
- **TypeScript**: Type safety and developer experience
- **ESBuild**: Production bundling for server code
- **Tailwind CSS**: Utility-first styling

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20
- **Storage**: In-memory storage for frontend demonstration
- **Development Server**: Vite dev server with hot reload
- **Port Configuration**: Application runs on port 5000

### Production Build
- **Client Build**: Vite builds optimized React application
- **Server Build**: ESBuild bundles server code with external packages
- **Deployment Target**: Autoscale deployment on Replit
- **Static Assets**: Served from dist/public directory

### Environment Configuration
- Minimal backend configuration for frontend demonstration
- In-memory data persistence during development session
- Mock service implementations for QR scanning and photo upload

## Changelog
- June 18, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.