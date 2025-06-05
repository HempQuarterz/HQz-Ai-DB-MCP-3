import { config as dotenvConfig } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenvConfig({ path: path.resolve(process.cwd(), '.env') });

// Export configuration object with defaults
export const appConfig = {
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    dbHost: process.env.DB_HOST || '',
    dbPort: process.env.DB_PORT || '5432',
    dbName: process.env.DB_NAME || 'postgres',
    dbUser: process.env.DB_USER || 'postgres',
    dbPassword: process.env.DB_PASSWORD || ''
  }
};

export default function validateEnv() {
  // Ensure dotenv is loaded first
  import('dotenv').then(dotenv => {
    dotenv.config({ path: path.resolve(process.cwd(), '.env') });
  });

  const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'DATABASE_URL'
  ];
  
  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );
  
  if (missingEnvVars.length > 0) {
    console.warn(
      `Warning: Missing required environment variables: ${missingEnvVars.join(', ')}`
    );
    console.warn('Create a .env file in the project root or set these variables in your environment.');
  } else {
    console.log('All required environment variables found!');
    console.log(`Database host: ${process.env.DB_HOST}`);
    console.log(`Database port: ${process.env.DB_PORT}`);
    console.log(`Database name: ${process.env.DB_NAME}`);
    console.log(`Database user: ${process.env.DB_USER}`);
    console.log(`Database password: ${process.env.DB_PASSWORD ? '******' : 'Not set'}`);
  }
  
  return missingEnvVars.length === 0;
}