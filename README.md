# HQz-Ai-DB-MCP-3

HempQuarterz Database on VS Code with Supabase connected - A comprehensive industrial hemp database system.

## 🌿 Project Overview

This project implements a comprehensive database system for tracking and managing all aspects of the industrial hemp industry, including:
- Hemp plant types and parts
- Products and applications
- Companies and organizations
- Research papers and institutions
- Market data and analysis
- Regulatory information
- Historical context
- **🎨 Automated Image Generation** (NEW!)

## 📁 Project Structure

```
HQz-Ai-DB-MCP-3/
├── schema.sql                          # Main database schema
├── populate_supabase_db.py            # Comprehensive database population script
├── populate_hemp_products_advanced.py  # Advanced products population script
├── Project_Plan_Hemp_App.md          # Detailed project plan and specifications
├── image_generation/                   # Image generation automation system (NEW!)
│   ├── README.md                      # Image generation documentation
│   ├── schema_image_generation.sql    # Database schema for image system
│   ├── hemp_image_generator.py        # Main image generation script
│   └── setup_image_generation.py      # Setup script
├── supabase/functions/                # Edge Functions
│   └── hemp-image-generator/          # Serverless image generation
├── HempResourceHub/                   # Frontend application resources
│   ├── scripts/                       # TypeScript population scripts
│   ├── client/                        # Frontend client code
│   └── server/                        # Backend server code
├── requirements.txt                   # Python dependencies
├── .env.example                       # Environment variables template
└── README_POPULATE.md                 # Detailed population guide
```

## 🚀 Quick Start

### Prerequisites
- Python 3.7+
- Supabase account
- PostgreSQL (via Supabase)
- Node.js (for TypeScript scripts)

### Database Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/HempQuarterz/HQz-Ai-DB-MCP-3.git
   cd HQz-Ai-DB-MCP-3
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env and add your Supabase credentials
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create database schema:**
   - Run `schema.sql` in your Supabase SQL editor
   - Run `image_generation/schema_image_generation.sql` for image system

5. **Populate the database:**
   ```bash
   # Basic population (all tables)
   python populate_supabase_db.py
   
   # Advanced products with detailed data
   python populate_hemp_products_advanced.py
   ```

6. **Setup image generation (NEW!):**
   ```bash
   # Initialize image generation system
   python image_generation/setup_image_generation.py
   
   # Start generating images
   python image_generation/hemp_image_generator.py
   ```

## 🎨 Image Generation System (NEW!)

Automated image generation for all hemp products:

### Features
- **Smart Prompt Generation**: Context-aware prompts based on product attributes
- **Multi-Provider Support**: Placeholder, Stable Diffusion, DALL-E
- **Queue Management**: Automatic retry and priority handling
- **Progress Tracking**: Real-time monitoring dashboard
- **Edge Function**: Scalable serverless processing

### Quick Start
```bash
# Setup the system
python image_generation/setup_image_generation.py

# Generate images
python image_generation/hemp_image_generator.py --mode continuous

# Monitor progress
python image_generation/hemp_image_generator.py --mode monitor
```

For detailed setup, see [Image Generation Setup Guide](IMAGE_GENERATION_SETUP.md)

## 📊 Database Schema

The database includes the following main tables:

### Core Tables
- `hemp_plant_archetypes` - Different types of hemp plants
- `plant_parts` - Usable parts of hemp plants
- `industries` - Industries utilizing hemp
- `industry_sub_categories` - Detailed industry segments
- `uses_products` - Comprehensive product catalog (149+ products)

### Supporting Tables
- `companies` - Hemp industry companies
- `research_institutions` - Research organizations
- `research_entries` - Papers, patents, studies
- `market_data_reports` - Market analysis
- `regulatory_jurisdictions` - Legal jurisdictions
- `regulations` - Specific regulations
- `historical_events` - Hemp history timeline

### Image Generation Tables (NEW!)
- `image_generation_queue` - Queue management
- `image_generation_history` - Generation history
- `image_generation_schedule` - Automated scheduling

### Relationship Tables
- `product_companies`
- `product_research_entries`
- `product_regulations`
- `product_images`
- `affiliate_links`

## 🔧 Development Tools

### Python Scripts
- `populate_supabase_db.py` - Populates all tables with realistic data
- `populate_hemp_products_advanced.py` - Adds detailed product information
- `hemp_image_generator.py` - Automated image generation (NEW!)
- `HempResourceHub/db_manager.py` - Database management utilities

### TypeScript Scripts (in HempResourceHub/scripts/)
- `populate-hemp-products.ts` - Product population
- `populate-from-pubmed.ts` - Research data import
- `data-automation.ts` - Automated data collection

### Edge Functions
- `hemp-image-generator` - Serverless image generation

### Running TypeScript Tests

Tests for the Express API are located under `HempResourceHub/server/tests` and
can be executed with:

```bash
cd HempResourceHub
npm run test
```

## 📚 Documentation

- [Project Plan](Project_Plan_Hemp_App.md) - Comprehensive project specifications
- [Population Guide](README_POPULATE.md) - Detailed guide for database population
- [Database Schema](HempResourceHub/DATABASE_SCHEMA.md) - Schema documentation
- [Image Generation Setup](IMAGE_GENERATION_SETUP.md) - Image system setup guide (NEW!)
- [Image Generation README](image_generation/README.md) - Detailed image system docs (NEW!)

## 🌐 Frontend Application

The HempResourceHub directory contains a full-stack web application for interacting with the hemp database, built with modern web technologies.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📈 Data Sources

The database includes data from:
- Industry reports and market research
- Scientific publications
- Government regulations
- Historical records
- Company directories
- Product specifications
- AI-generated product images (NEW!)

## 🔒 Security

- Uses Supabase Row Level Security (RLS)
- Environment variables for sensitive data
- Secure API connections
- API key management for image providers

## 📞 Contact

HempQuarterz - [@HempQuarterz](https://github.com/HempQuarterz)

Project Link: [https://github.com/HempQuarterz/HQz-Ai-DB-MCP-3](https://github.com/HempQuarterz/HQz-Ai-DB-MCP-3)

## 🙏 Acknowledgments

- Supabase for database hosting
- Industrial hemp research community
- Open source contributors
- Image generation providers (Stability AI, OpenAI)