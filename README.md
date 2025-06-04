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

## 📁 Project Structure

```
HQz-Ai-DB-MCP-3/
├── schema.sql                          # Main database schema
├── populate_supabase_db.py            # Comprehensive database population script
├── populate_hemp_products_advanced.py  # Advanced products population script
├── Project_Plan_Hemp_App.md          # Detailed project plan and specifications
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

5. **Populate the database:**
   ```bash
   # Basic population (all tables)
   python populate_supabase_db.py
   
   # Advanced products with detailed data
   python populate_hemp_products_advanced.py
   ```

## 📊 Database Schema

The database includes the following main tables:

### Core Tables
- `hemp_plant_archetypes` - Different types of hemp plants
- `plant_parts` - Usable parts of hemp plants
- `industries` - Industries utilizing hemp
- `industry_sub_categories` - Detailed industry segments
- `uses_products` - Comprehensive product catalog

### Supporting Tables
- `companies` - Hemp industry companies
- `research_institutions` - Research organizations
- `research_entries` - Papers, patents, studies
- `market_data_reports` - Market analysis
- `regulatory_jurisdictions` - Legal jurisdictions
- `regulations` - Specific regulations
- `historical_events` - Hemp history timeline

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
- `HempResourceHub/db_manager.py` - Database management utilities

### TypeScript Scripts (in HempResourceHub/scripts/)
- `populate-hemp-products.ts` - Product population
- `populate-from-pubmed.ts` - Research data import
- `data-automation.ts` - Automated data collection

## 📚 Documentation

- [Project Plan](Project_Plan_Hemp_App.md) - Comprehensive project specifications
- [Population Guide](README_POPULATE.md) - Detailed guide for database population
- [Database Schema](HempResourceHub/DATABASE_SCHEMA.md) - Schema documentation

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

## 🔒 Security

- Uses Supabase Row Level Security (RLS)
- Environment variables for sensitive data
- Secure API connections

## 📞 Contact

HempQuarterz - [@HempQuarterz](https://github.com/HempQuarterz)

Project Link: [https://github.com/HempQuarterz/HQz-Ai-DB-MCP-3](https://github.com/HempQuarterz/HQz-Ai-DB-MCP-3)

## 🙏 Acknowledgments

- Supabase for database hosting
- Industrial hemp research community
- Open source contributors
