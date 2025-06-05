# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Frontend Development (HempResourceHub)
```bash
cd HempResourceHub
npm install                    # Install dependencies
npm run dev                    # Start development server (runs Express + Vite)
npm run build                  # Build for production
npm run start                  # Start production server
npm run check                  # TypeScript type checking
npm run test                   # Run Express API tests
```

### Database Operations
```bash
cd HempResourceHub
npm run db:push               # Push schema to database using Drizzle Kit
```

### Python Scripts (Root Directory)
```bash
pip install -r requirements.txt                  # Install Python dependencies
python populate_supabase_db.py                   # Populate all database tables
python populate_hemp_products_advanced.py        # Add detailed product data
```

## High-Level Architecture

### Project Structure
This is a full-stack industrial hemp database application with:
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js API server
- **Database**: PostgreSQL via Supabase
- **ORM**: Drizzle ORM with TypeScript schemas
- **State Management**: React Query (TanStack Query)
- **UI Components**: shadcn/ui components library

### Database Architecture
The application uses a hierarchical data model:
1. **Hemp Plant Archetypes** → Different types of hemp plants
2. **Plant Parts** → Usable parts from each plant type
3. **Industries & Sub-categories** → Industry classifications
4. **Products/Uses** → Comprehensive product catalog with relationships

Key relationships:
- Plant types have multiple plant parts
- Plant parts are used in multiple products
- Products belong to industries and sub-industries
- Products can have companies, research entries, regulations, and images

### Frontend Architecture
- **Routing**: Using Wouter (lightweight router)
- **Data Fetching**: React Query hooks in `/client/src/hooks/`
- **Supabase Integration**: Direct client connections via `@supabase/supabase-js`
- **Component Structure**: 
  - `/components/ui/` - Reusable UI components
  - `/components/layout/` - Layout components (navbar, footer)
  - `/components/product/`, `/components/plant/`, etc. - Feature components
  - `/pages/` - Route page components

### Backend Architecture
- **Entry Point**: `/server/index.ts` - Express server setup
- **Database Connection**: `/server/db.ts` - PostgreSQL connection via Drizzle
- **API Routes**: `/server/routes.ts` - RESTful endpoints
- **Data Access**: `/server/storage-db.ts` - Database queries
- **Multiple DB Configurations**: Various `/server/db-*.ts` files for different setups

### Environment Configuration
Required environment variables:
```
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# Database Connection (for server)
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

### Testing Strategy
- Backend API tests: `/server/tests/` (using Node.js test runner)
- Run with: `npm run test`

### Data Population Scripts
Two approaches for populating the database:
1. **Python Scripts** (recommended for initial setup):
   - `populate_supabase_db.py` - Comprehensive data population
   - `populate_hemp_products_advanced.py` - Detailed product data
2. **TypeScript Scripts** in `/scripts/`:
   - `populate-hemp-products.ts`
   - `populate-from-pubmed.ts`
   - `data-automation.ts`

### Key Integration Points
- **Supabase Client**: Configured in `/client/src/lib/supabase-client.ts`
- **API Client**: HTTP requests in `/client/src/lib/api.ts`
- **Schema Definitions**: Shared between client/server in `/shared/schema.ts`
- **Type Definitions**: TypeScript types in `/client/src/types/schema.ts`

### Development Workflow
1. Database changes: Update schema in `/shared/schema.ts`, then run `npm run db:push`
2. API changes: Update routes in `/server/routes.ts` and queries in `/server/storage-db.ts`
3. Frontend changes: Update components and hooks, hot-reload via Vite
4. Testing: Write tests in `/server/tests/` for new API endpoints

### Deployment Considerations
- Production build outputs to `/dist/`
- Static assets served from `/dist/client/`
- Server bundle in `/dist/index.js`
- Ensure all environment variables are set in production
- Database migrations tracked in `/supabase/migrations/`