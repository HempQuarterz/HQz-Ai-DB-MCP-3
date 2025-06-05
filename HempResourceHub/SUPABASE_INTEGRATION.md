# Supabase Integration for Hemp Database

This project has been refactored to connect with Supabase: Ai-HQZ-Database.

## Changes Made

1. **Server-side Changes**:
   - Created a Supabase client (`server/supabase.ts`)
   - Updated database connection in `server/db.ts` to use Supabase PostgreSQL
   - Added database initialization function (`server/db-init.ts`)
   - Added environment variable loading and validation (`server/env.ts`)
   - Updated server initialization to properly connect to Supabase

2. **Client-side Changes**:
   - Added Supabase client for frontend (`client/src/lib/supabase.ts`)
   - Created API service with Supabase queries (`client/src/lib/api.ts`)
   - Added frontend environment variables

3. **Configuration**:
   - Added `.env` files for both server and client
   - Updated `.gitignore` to exclude sensitive information

## How to Use

### Setup

1. Set your Supabase database password in the `.env` file:
   ```
   DB_PASSWORD=your_database_password
   ```

2. Make sure the environment variables are correctly set in both:
   - Root `.env` file (for server-side)
   - Client `.env` file (for client-side)

### Run the Application

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### Database Structure

The application uses the same schema as before, which is defined in `shared/schema.ts`. The tables include:

- plant_types
- plant_parts
- industries
- sub_industries
- hemp_products
- research_papers

## Notes

- All API endpoints remain the same, ensuring compatibility with the existing frontend
- The application will automatically create the required tables in Supabase if they don't exist
- Database queries now go through Supabase instead of directly to PostgreSQL

## Troubleshooting

If you encounter connection issues:

1. Check your database password in the `.env` file
2. Verify that your Supabase project is active
3. Check the console logs for specific error messages