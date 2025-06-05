# Industrial Hemp Database

An interactive web application designed to demystify industrial hemp through engaging, educational interfaces that showcase diverse hemp applications and environmental potential.

## Project Overview

This application organizes hemp data hierarchically by:
- Plant type (e.g., Fiber Hemp, Seed Hemp)
- Plant part (e.g., Stalk, Seeds, Leaves)
- Industry (e.g., Construction, Textiles, Food)
- Subcategory
- Product

## Recent Enhancements

This repository now integrates the best features from both Replit-UI (UI) and AiHQzMCP (backend):

### 1. Enhanced Database Schema

- Added full-text search capabilities with `search_vector` columns
- Improved schema with array data types for:
  - `benefits` and `uses` fields in the hemp_products table
  - `authors` and `keywords` fields in the research_papers table
- Set up a proper migrations folder structure following Supabase best practices

### 2. Improved Supabase Integration

- Updated Supabase client with enhanced auth settings including:
  - Auto refresh token
  - Session persistence
  - URL session detection

### 3. Enhanced Search Capabilities

- Implemented full-text search for both hemp products and research papers
- Added fallback to traditional ILIKE search if full-text search is unavailable

## Features

- Interactive 3D models of hemp plants
- Comprehensive database of hemp products and applications
- Searchable research paper repository with enhanced full-text search
- Industry-specific categorization
- Environmental and economic impact data
- Matrix-inspired visual design

## Technology Stack

- **Frontend**: React.js with Vite, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL via Supabase
- **ORM**: Drizzle ORM
- **3D Visualization**: Three.js, React Three Fiber
- **API**: RESTful API endpoints
- **Authentication**: Passport.js (future implementation)

## Exporting to Windsurf

See the [Export Guide](./EXPORT_GUIDE.md) for detailed instructions on exporting this project from Replit to Windsurf.

## Database Schema

The database schema for this application is documented in [Database Schema](./DATABASE_SCHEMA.md).

## Database Migration

To set up the database with the enhanced schema:

1. Navigate to your Supabase project
2. Open the SQL Editor
3. Execute the SQL in `supabase/migrations/20250519123456_enhanced_schema/up.sql`

This will create the tables with full-text search capabilities.

## Key Files

- `server/db.ts`: Database connection configuration
- `shared/schema.ts`: Database schema definitions
- `server/storage-db.ts`: Data access layer
- `server/routes.ts`: API endpoints
- `client/src/lib/supabase-client.ts`: Supabase client configuration
- `client/src/hooks/use-plant-data.ts`: Data fetching hooks for plant data
- `client/src/hooks/use-product-data.ts`: Data fetching hooks for product data
- `client/src/hooks/use-research-papers.ts`: Data fetching hooks for research papers
- `supabase/migrations/`: Database migration files

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
4. Start the development server: `npm run dev`

## API Endpoints

- `/api/plant-types`: Get all plant types
- `/api/plant-type/:id`: Get a specific plant type
- `/api/plant-parts`: Get all plant parts
- `/api/plant-parts/:plantTypeId`: Get plant parts by type
- `/api/plant-part/:id`: Get a specific plant part
- `/api/industries`: Get all industries
- `/api/industry/:id`: Get a specific industry
- `/api/hemp-products`: Get all hemp products
- `/api/hemp-product/:id`: Get a specific hemp product
- `/api/hemp-products/plant-part/:plantPartId`: Get products by plant part
- `/api/hemp-products/search?q=query`: Search hemp products
- `/api/research-papers`: Get all research papers
- `/api/research-paper/:id`: Get a specific research paper
- `/api/stats`: Get application statistics

## License

This project is licensed under the MIT License.