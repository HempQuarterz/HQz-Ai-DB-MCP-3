# Development Server Fix Instructions

## Issue
The `lucide-react` ESM modules were missing, causing module resolution errors when trying to run `npm run dev`.

## Solution Applied
1. Force reinstalled all npm dependencies using `npm install --force`
2. This recreated the node_modules directory with all proper ESM modules

## To Run the Development Server

In your Windows PowerShell or Command Prompt, navigate to the project directory and run:

```bash
cd C:\Users\hempq\OneDrive\Desktop\HQz-Ai-DB-MCP-3\HempResourceHub
npm run dev
```

The server should now start successfully on http://localhost:3000

## Note about WSL
There are some Windows binary files (like esbuild.exe) that can't be deleted from WSL, but this doesn't affect the functionality. The warnings you see are normal when working with node_modules across Windows and WSL environments.

## If Issues Persist
If you still encounter errors, try running these commands in Windows PowerShell (not WSL):
1. Delete node_modules folder manually
2. Run `npm install` in PowerShell
3. Run `npm run dev` in PowerShell