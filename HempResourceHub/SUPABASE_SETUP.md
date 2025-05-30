# Supabase Setup Guide for Hemp Database

This guide provides detailed instructions for setting up a new Supabase database to work with your Hemp Database UI components.

## Creating a Supabase Project

1. **Sign Up/Login to Supabase**:
   - Go to [https://supabase.com/](https://supabase.com/)
   - Create an account or log in

2. **Create a New Project**:
   - Click "New Project"
   - Choose your organization (create one if needed)
   - Name your project (e.g., "Hemp Database")
   - Set a secure database password (save this somewhere safe)
   - Choose a region closest to your users
   - Click "Create new project"

3. **Wait for Database Setup**:
   - Supabase will initialize your project (may take a few minutes)

## Getting Your Supabase Credentials

1. **Find Your Project URL and API Key**:
   - In your Supabase project dashboard, click on the gear icon (Settings) in the left sidebar
   - Click on "API" in the settings menu
   - Under "Project URL," copy your URL. This will be your `VITE_SUPABASE_URL`
   - Under "Project API keys," copy the "anon" key (public). This will be your `VITE_SUPABASE_ANON_KEY`

2. **Save Your Credentials**:
   - In your project, create a `.env` file in the root directory
   - Add your credentials:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

## Setting Up Your Database Schema

1. **Access SQL Editor**:
   - In your Supabase dashboard, click on "SQL Editor" in the left sidebar
   - Click "New Query"

2. **Create Database Tables**:
   - Copy the entire contents of `supabase-schema-modified.sql` from your project
   - Paste it into the SQL editor
   - Click "Run" to execute the SQL and create your tables
   - This will create all the tables needed for the Hemp Database:
     - plant_types
     - plant_parts
     - industries
     - sub_industries
     - hemp_products
     - research_papers
     - users

3. **Add Sample Data** (Optional):
   - Create another new query
   - Copy and paste the sample data SQL from the UI_EXPORT_GUIDE.md
   - Click "Run" to populate your tables with initial data

## Connecting Your UI to Supabase

1. **Update Environment Variables in Your Project**:
   - Make sure your `.env` file contains the correct Supabase URL and anonymous key
   - These values will be used in `client/src/lib/supabase-client.ts`

2. **Test the Connection**:
   - Start your application (`npm run dev`)
   - Visit the `/supabase-test` route in your application
   - If the connection is successful, you'll see a success message
   - If not, check your environment variables and Supabase project settings

## Accessing Your Database Tables

The following files contain the functions to interact with your Supabase database:

- `client/src/lib/supabase-api.ts` - Contains all the API functions for CRUD operations
- `client/src/hooks/use-supabase-data.ts` - React Query hooks for data fetching

## Adjusting Public Access Settings

By default, Row Level Security (RLS) is enabled in Supabase, which may block public access:

1. **Enable Public Access** (for development only):
   - Go to "Authentication" → "Policies" in your Supabase dashboard
   - For each table, create a policy that allows anonymous access:
   ```sql
   CREATE POLICY "Allow public read access" ON public.plant_types FOR SELECT USING (true);
   ```
   - Repeat for each table that needs public access

2. **For Production**:
   - Configure more restrictive policies based on your security requirements
   - Consider adding authentication for write operations

## Troubleshooting

If you encounter connection issues:

1. **Check Network Connectivity**:
   - Ensure your application can reach the Supabase servers
   - Check for CORS issues in the browser console

2. **Verify Credentials**:
   - Double-check that your URL and API key are correct
   - Make sure the `.env` file is being loaded properly

3. **Check Table Permissions**:
   - Ensure RLS policies allow the operations you're trying to perform
   - You may need to enable public access for read operations

4. **Database Browser**:
   - Use the "Table Editor" in your Supabase dashboard to view and edit data directly
   - This can help verify that your schema was created correctly

## Migrating Existing Data

If you need to migrate data from your old database:

1. **Export Data**:
   - Use the Table Editor or SQL queries to export data as CSV or JSON
   - You can also use the Supabase CLI for more complex migrations

2. **Import Data**:
   - Use SQL INSERT statements or the Table Editor to import your data
   - For large datasets, consider using the Supabase CLI or batch imports

## Next Steps

After setting up your database:

1. **Customize UI Components**:
   - Update components to match your specific hemp database needs
   - Add authentication if needed for administrative functions

2. **Set Up Backups**:
   - Configure regular database backups in your Supabase project settings

3. **Monitor Usage**:
   - Keep an eye on your database usage in the Supabase dashboard
   - Free tier has limits on database size and activity