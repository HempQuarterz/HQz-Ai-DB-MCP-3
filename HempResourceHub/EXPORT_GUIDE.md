# Exporting Your Industrial Hemp Database from Replit to Windsurf

This guide will help you migrate your project from Replit to Windsurf.

## Step 1: Export the codebase

1. Go to your Replit project's main page
2. Click the three dots (⋮) menu in the top-right corner
3. Select "Download as zip"
4. Save the zip file to your local computer
5. Extract the contents of the zip file to a folder on your computer

## Step 2: Set up the project on Windsurf

1. Create a new project on Windsurf
2. Upload your project files using one of these methods:
   - Upload the zip file directly if Windsurf supports it
   - Use Git to push your code to Windsurf:
     ```
     cd your-extracted-project-folder
     git init
     git add .
     git commit -m "Initial commit"
     git remote add windsurf [your-windsurf-git-url]
     git push -u windsurf main
     ```

## Step 3: Set up environment variables

Make sure to configure the following environment variables in your Windsurf project:

- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase public key

## Step 4: Set up the database

1. Create a PostgreSQL database on Windsurf or use an external one
2. Run the schema migrations:
   ```
   npm run db:push
   ```

## Step 5: Install dependencies and start the application

1. Install Node.js dependencies:
   ```
   npm install
   ```

2. Start the application:
   ```
   npm run dev
   ```

## Important files to review

Make sure these key files are properly configured for your Windsurf environment:

- `server/db.ts`: Database connection configuration
- `client/src/lib/supabase.ts`: Supabase client configuration
- `package.json`: Check scripts and dependencies
- Environment variables configuration

## Database considerations

If you need to migrate your data from Replit to Windsurf:

1. Export your data from Replit PostgreSQL
2. Import it into your Windsurf database

## Additional resources

- [Windsurf documentation](https://windsurf.io/docs)
- [Node.js deployment guides](https://nodejs.org/en/learn/getting-started/deployment)