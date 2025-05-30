# UI Export Guide for Hemp Database Project

This guide helps you export just the user interface components of the project, so you can connect them to a new Supabase database.

## UI Components to Export

The key UI components and files for this project are:

### Core UI Components
- `client/src/components/` - All UI components
- `client/src/pages/` - Page layouts and routes
- `client/src/hooks/` - React hooks for data fetching
- `client/src/lib/` - Utility functions and configuration
- `client/src/assets/` - Images, fonts, and other static assets
- `client/src/types/` - TypeScript type definitions

### Supabase Connection Files
- `client/src/lib/supabase-client.ts` - Supabase client configuration
- `client/src/lib/supabase-api.ts` - API functions for Supabase
- `client/src/hooks/use-supabase-data.ts` - React hooks for Supabase

### Configuration Files
- `client/index.html` - Main HTML template
- `package.json` - Dependencies list
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite configuration
- `postcss.config.js` and `tailwind.config.ts` - Styling configuration

## Steps to Export UI Components

1. **Download the project** from Replit as a ZIP file:
   - Click the three dots in the file explorer
   - Select "Download as ZIP"

2. **Extract the ZIP file** to a local folder

3. **Create a new project folder** for your UI-only export:
   ```
   mkdir hemp-database-ui
   ```

4. **Copy the UI components** to the new folder:
   ```
   cp -r /path/to/extracted/client/src/* /path/to/hemp-database-ui/src/
   cp /path/to/extracted/client/index.html /path/to/hemp-database-ui/
   cp /path/to/extracted/*.json /path/to/hemp-database-ui/
   cp /path/to/extracted/*.config.* /path/to/hemp-database-ui/
   ```

5. **Copy the SQL schema files** for reference:
   ```
   cp /path/to/extracted/supabase-schema*.sql /path/to/hemp-database-ui/
   ```

## Setting Up a New Supabase Database

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)

2. **Run the schema SQL** in the Supabase SQL Editor:
   - Go to SQL Editor in your Supabase dashboard
   - Create a new query
   - Paste the contents of `supabase-schema-modified.sql`
   - Run the SQL to create your tables

3. **Update the environment variables** in your project:
   - Create a `.env` file with:
   ```
   VITE_SUPABASE_URL=your_new_supabase_url
   VITE_SUPABASE_ANON_KEY=your_new_supabase_anon_key
   ```

4. **Initialize your project**:
   ```bash
   npm install
   npm run dev
   ```

## Sample Data Guide

### Adding Initial Data

After setting up your tables, add some basic data:

```sql
-- Sample Plant Types
INSERT INTO public.plant_types (name, description, image_url) VALUES 
('Fiber Hemp', 'Hemp grown primarily for fiber production with minimal THC content.', 'https://example.com/fiber-hemp.jpg'),
('Seed Hemp', 'Hemp varieties optimized for seed production.', 'https://example.com/seed-hemp.jpg'),
('CBD Hemp', 'Hemp cultivated for high CBD content with low THC.', 'https://example.com/cbd-hemp.jpg');

-- Sample Industries
INSERT INTO public.industries (name, description, icon_name) VALUES 
('Construction', 'Building materials and construction applications', 'building'),
('Textiles', 'Fabric and clothing applications', 'scissors'),
('Food', 'Edible hemp products and ingredients', 'utensils'),
('Cosmetics', 'Skincare and beauty products', 'droplet'),
('Biofuel', 'Renewable energy from hemp biomass', 'flame');

-- Sample Plant Parts (after adding Plant Types)
INSERT INTO public.plant_parts (name, description, plant_type_id) VALUES 
('Stalk', 'The main stem of the hemp plant', 1),
('Seeds', 'Hemp seeds used for food and oil production', 2),
('Flowers', 'The flowering part of the hemp plant containing cannabinoids', 3),
('Leaves', 'The fan leaves of the hemp plant', 1),
('Roots', 'The underground portion of the hemp plant', 1);
```

## UI Customization

This export contains all UI components, including:

- Navbar and navigation components
- Product listing and detail pages
- Research paper listings
- Plant type and parts explorer
- Industry categorization
- Administrative interfaces for data management

You can customize these components as needed for your specific application.

## Questions or Issues?

If you encounter any issues:

1. Check the Supabase connection settings
2. Verify your SQL schema was executed correctly
3. Look for error messages in the browser console
4. Ensure your environment variables are correctly set