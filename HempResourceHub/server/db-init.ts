import { supabase } from './supabase';
import { db } from './db';
import * as schema from '@shared/schema';

/**
 * Initialize the database by creating tables if they don't exist
 * This is a helper function that can be called on application startup
 */
export async function initializeDatabase() {
  try {
    // Skip initialization if no database URL
    if (!process.env.DATABASE_URL) {
      console.log('No DATABASE_URL found, skipping database initialization');
      return false;
    }
    console.log('Initializing database tables...');

    // Create each table defined in the schema
    const tableCreationQueries = [
      `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
      `,
      `
      CREATE TABLE IF NOT EXISTS plant_types (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT,
        planting_density TEXT,
        characteristics TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
      `,
      `
      CREATE TABLE IF NOT EXISTS plant_parts (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT,
        archetype_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
      `,
      `
      CREATE TABLE IF NOT EXISTS industries (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        icon_name TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
      `,
      `
      CREATE TABLE IF NOT EXISTS industry_sub_categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        industry_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
      `,
      `
      CREATE TABLE IF NOT EXISTS uses_products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT,
        plant_part_id INTEGER NOT NULL,
        industry_id INTEGER NOT NULL,
        sub_industry_id INTEGER,
        properties JSONB,
        facts JSONB,
        sustainability_impact TEXT,
        affiliate_links JSONB,
        related_product_ids JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
      `,
      `
      CREATE TABLE IF NOT EXISTS research_papers (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        authors TEXT NOT NULL,
        abstract TEXT NOT NULL,
        publication_date DATE,
        journal TEXT,
        doi TEXT,
        url TEXT,
        pdf_url TEXT,
        image_url TEXT,
        archetype_id INTEGER REFERENCES plant_types(id),
        plant_part_id INTEGER REFERENCES plant_parts(id),
        industry_id INTEGER REFERENCES industries(id),
        keywords TEXT[],
        citations INTEGER,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
      `
    ];

    // Execute each table creation query
    for (const query of tableCreationQueries) {
      await db.execute(query);
    }

    console.log('Database tables initialized successfully!');
    return true;
  } catch (error) {
    console.error('Error initializing database tables:', error);
    return false;
  }
}