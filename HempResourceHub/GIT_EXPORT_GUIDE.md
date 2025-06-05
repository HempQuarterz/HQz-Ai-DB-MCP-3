# Git Export Guide for Hemp Database Project

This guide provides instructions for exporting this Replit project to a Git repository.

## Method 1: Using Replit's Built-in GitHub Integration

1. In the Replit interface, click on the "Version Control" tab (branch icon) in the left sidebar
2. Connect your GitHub account if prompted
3. Click "Create a Git repo" 
4. Fill in the repository details and publish your code
5. Your code will be pushed to GitHub automatically

## Method 2: Manual Export to Any Git Provider

1. **Download your project**:
   - In Replit, click on the three dots (...) in the file browser
   - Select "Download as zip"

2. **On your local computer**:
   - Extract the ZIP file to a folder
   - Open a terminal/command prompt in that folder

3. **Initialize a new Git repository**:
   ```bash
   git init
   ```

4. **Add your files to the repository**:
   ```bash
   git add .
   ```

5. **Make your initial commit**:
   ```bash
   git commit -m "Initial commit from Replit export"
   ```

6. **Create a repository on GitHub, GitLab, etc.**
   - Go to the provider's website and create a new repository
   - Copy the repository URL (e.g., `https://github.com/username/repo-name.git`)

7. **Add the remote repository**:
   ```bash
   git remote add origin https://github.com/username/repo-name.git
   ```

8. **Push your code**:
   ```bash
   git push -u origin main
   # or if you're on the master branch:
   git push -u origin master
   ```

## Important Files to Include

Make sure these key files are included in your repository:

- All source files in `/client` and `/server` directories
- `package.json` and other configuration files
- The SQL schema files (`supabase-schema.sql` and `supabase-schema-modified.sql`)
- Environment setup instructions (but NOT the actual secret values)

## Environment Variables

Create a .env.example file with the required environment variables (without real values):

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase Setup

Include the SUPABASE_SETUP.md file in your repository to help others set up the database.