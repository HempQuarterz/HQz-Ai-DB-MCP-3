# Industrial Hemp Database Schema Guide

This document outlines the database schema used in the Industrial Hemp Database application. Use this as a reference when setting up your database on a new platform.

## Database Tables

The application uses the following tables:

### users
- `id`: Primary key, auto-incrementing
- `username`: User's username
- `password_hash`: Hashed password for authentication
- `full_name`: User's full name
- `email`: User's email address
- `created_at`: Timestamp when the user was created

### plant_types
- `id`: Primary key, auto-incrementing
- `name`: Name of the plant type (e.g., "Fiber Hemp")
- `description`: Detailed description of the plant type
- `image_url`: URL to an image of the plant type
- `model_url`: URL to a 3D model (if available)

### plant_parts
- `id`: Primary key, auto-incrementing
- `plant_type_id`: Foreign key referencing plant_types.id
- `name`: Name of the plant part (e.g., "Stalk", "Seeds")
- `description`: Detailed description of the plant part
- `image_url`: URL to an image of the plant part

### industries
- `id`: Primary key, auto-incrementing
- `name`: Name of the industry (e.g., "Construction", "Textiles")
- `description`: Detailed description of the industry
- `icon`: Icon identifier for the industry

### sub_industries
- `id`: Primary key, auto-incrementing
- `industry_id`: Foreign key referencing industries.id
- `name`: Name of the sub-industry
- `description`: Detailed description of the sub-industry

### hemp_products
- `id`: Primary key, auto-incrementing
- `plant_part_id`: Foreign key referencing plant_parts.id
- `industry_id`: Foreign key referencing industries.id
- `sub_industry_id`: Foreign key referencing sub_industries.id (optional)
- `name`: Name of the hemp product
- `description`: Detailed description of the product
- `image_url`: URL to an image of the product
- `environmental_impact`: Description of environmental benefits
- `economic_impact`: Description of economic benefits
- `traditional_alternative`: Description of traditional alternatives

### research_papers
- `id`: Primary key, auto-incrementing
- `title`: Title of the research paper
- `authors`: Authors of the paper
- `publication_date`: Date of publication
- `abstract`: Abstract of the paper
- `doi`: Digital Object Identifier
- `url`: URL to the full paper
- `plant_type_id`: Foreign key referencing plant_types.id (optional)
- `plant_part_id`: Foreign key referencing plant_parts.id (optional)
- `industry_id`: Foreign key referencing industries.id (optional)
- `keywords`: Keywords associated with the paper

## Database Relationships

- A `plant_type` can have multiple `plant_parts` (one-to-many)
- An `industry` can have multiple `sub_industries` (one-to-many)
- A `plant_part` can be used in multiple `hemp_products` (one-to-many)
- An `industry` can have multiple `hemp_products` (one-to-many)
- A `sub_industry` can have multiple `hemp_products` (one-to-many)
- `research_papers` can be related to `plant_types`, `plant_parts`, and `industries` (many-to-many)

## Database Initialization

To initialize your database with sample data, refer to the following files:

1. `/shared/schema.ts` - Contains the Drizzle ORM schema definitions
2. `/server/storage-db.ts` - Contains methods for interacting with the database
3. `/server/routes.ts` - Contains API routes for database operations

## Migration to a New Environment

When migrating to a new environment, follow these steps:

1. Set up a PostgreSQL database
2. Configure the database connection in `server/db.ts`
3. Run database migrations:
   ```
   npm run db:push
   ```
4. If needed, import data from your existing database

## Sample Data (Optional)

If you need to populate your database with sample data, you can use the `initializeData()` method in `server/storage-db.ts`.

## Important Notes

- Make sure to set up proper indexes for performance optimization
- Ensure proper database security and user permissions
- Implement regular backups of your database
- Consider adding database monitoring for production environments