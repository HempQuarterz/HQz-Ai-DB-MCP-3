# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Latest Update (Jan 12, 2025 - Evening)

### AI Agent Implementation Progress (Jan 12 PM)
1. ✅ **Applied Agent Infrastructure Migration** - All 11 agent tables created in Supabase
2. ✅ **Completed File Structure** - 100% match with AI Agent Blueprint
3. ✅ **Implemented Research Agent** - Full web scraping and data structuring capabilities
4. ✅ **Implemented Content Agent** - Blog, social media, and SEO optimization
5. ✅ **Created Progress Documentation** - AI_AGENT_PROGRESS_JAN12.md with detailed next steps

### Morning Session Progress (Jan 12 AM)
1. ✅ **Fixed Puppeteer MCP Tool** - Installed Chrome dependencies for WSL
2. ✅ **Fixed Content Security Policy** - Google Fonts now load properly
3. ✅ **Fixed Missing Routes** - `/hemp-dex` and `/debug-supabase` now work
4. ✅ **Verified Table Name Fixes** - Frontend successfully fetches data (6 plant types, stats working)
5. ✅ **Created Documentation** - SESSION_SUMMARY_JAN11_NIGHT.md with detailed fixes

### Morning Session Progress (Jan 11)
1. **Created Comprehensive Improvement Plan** - Documented all known issues with prioritized solutions
2. **Reviewed GitHub PRs** - Analyzed 6 open PRs, fixed PR #5 table name issues
3. **Committed Local Changes** - All changes committed, ready for push
4. **Updated Documentation** - Created PROJECT_STATUS_SUMMARY.md with current state
5. ✅ **COMPLETED Table Name Fixes** - Fixed ALL table name inconsistencies:
   - Updated `supabase-api.ts` to use `research_entries` instead of `research_papers`
   - Fixed `storage-db.ts` SQL INSERT statements to use correct table names
   - Updated `schema.ts` foreign key from `archetypeId` to `plantTypeId`
   - Discovered actual DB uses `plant_type_id` NOT `archetype_id`

### Immediate Priorities (AI Agents)
1. **Implement remaining agents**: SEO, Outreach, Monetization
2. **Complete infrastructure**: Message Queue, State Manager
3. **Integration testing**: Verify agent-database communication
4. **Build admin dashboard**: Monitor agent activity

### Other Priorities
1. Push to GitHub: `git push origin main`
2. Fix server database connection (IPv6 error)
3. Populate database with Python scripts
4. Implement search functionality

See AI_AGENT_PROGRESS_JAN12.md for detailed agent implementation status and next steps.

## Recent Session Summary (Jan 2025)

### What Was Fixed
1. **Supabase Connection Issues**
   - Updated project URL from `lnclfnomfnoaqpatmqhj` to `ktoqznqmlnxrtvubewyz`
   - Fixed environment variables (added both VITE_ prefixed and non-prefixed versions)
   - Resolved SSL certificate issues by setting `rejectUnauthorized: false`
   - URL-encoded password with special characters (#4HQZgasswo → %234HQZgasswo)

2. **Database Table Mismatches**
   - Fixed `hemp_products` → `uses_products` references in frontend
   - Plant types cards now correctly fetch from Supabase
   - Stats counter now shows actual data (products, industries, plant parts)

3. **UI Fixes**
   - Limited home page to show only first 3 plant type cards
   - Changed background images from `cover` to `contain` to prevent stretching
   - Fixed plant parts page to fetch from `plant_parts` table instead of plant types
   - Added `useAllPlantParts()` hook for fetching all plant parts
   - Fixed Content Security Policy to allow Google Fonts
   - Removed unnecessary Replit development banner script
   - Added missing routes for `/hemp-dex` and `/debug-supabase`

4. **Cleanup**
   - Removed outdated schema files (supabase-schema.sql, supabase-schema-modified.sql)
   - Main schema.sql in root is the correct one to use

### Current Database Structure (IMPORTANT)
The actual Supabase database uses these table names:
- `hemp_plant_archetypes` (NOT plant_types)
- `uses_products` (NOT hemp_products)
- `industry_sub_categories` (NOT sub_industries)
- `research_entries` (NOT research_papers)
- `plant_parts` with `plant_type_id` foreign key (NOT archetype_id - confirmed via MCP)

### Known Issues to Fix Next
1. ✅ ~~**Table Name Inconsistencies**: Many files still reference old table names~~ (FIXED)
2. ✅ ~~**Foreign Key Mismatches**: Code uses `plant_type_id` but schema has `archetype_id`~~ (FIXED - DB actually uses `plant_type_id`)
3. ✅ ~~**Missing Routes**: `/hemp-dex` and `/debug-supabase` returned 404~~ (FIXED)
4. **No Product Data**: Database has structure but `uses_products` is empty
5. **Search Not Implemented**: Search bar exists but doesn't function
6. **Server DB Connection**: IPv6 connection error (ENETUNREACH)

### Environment Variables Required
```
VITE_SUPABASE_URL=https://ktoqznqmlnxrtvubewyz.supabase.co
VITE_SUPABASE_ANON_KEY=[actual key from Supabase dashboard]
DATABASE_URL=postgresql://postgres:[password]@db.ktoqznqmlnxrtvubewyz.supabase.co:5432/postgres
```

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
- Visual testing with Puppeteer MCP (requires Chrome dependencies in WSL)

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

### Troubleshooting

#### Puppeteer in WSL
If Puppeteer fails with Chrome launch errors:
```bash
sudo apt-get update
sudo apt-get install -y chromium-browser
sudo apt-get install -y libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2
```

#### Content Security Policy
If external resources are blocked, check CSP configuration in `/server/index.ts`:
- Google Fonts: Add to `styleSrc` and `fontSrc`
- External scripts: Add to `scriptSrc`
- External images: Add to `imgSrc`