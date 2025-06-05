# Hemp Database Population Script

This Python script automatically populates the HQz-DB-Ai-MCP Supabase database with comprehensive hemp industry data.

## Features

The script populates the following tables:
- **Companies** - Real hemp industry companies with details
- **Research Institutions** - Universities and research centers studying hemp
- **Research Entries** - Scientific papers, patents, and clinical trials
- **Market Data Reports** - Industry market analysis and forecasts
- **Regulatory Jurisdictions** - Countries, regions, and states with hemp regulations
- **Regulations** - Specific hemp laws and regulations
- **Historical Events** - Important events in hemp history
- **Product Images** - Images for hemp products
- **Affiliate Links** - Purchase links for products
- **Relationship Tables** - Links between products, companies, research, and regulations

## Prerequisites

1. Python 3.7 or higher
2. A Supabase account with the HQz-DB-Ai-MCP project
3. Your Supabase project's anon key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/HempQuarterz/HQz-Ai-DB-MCP-3.git
cd HQz-Ai-DB-MCP-3
```

2. Install required packages:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Edit `.env` and add your Supabase anon key:
```
SUPABASE_URL=https://ktoqznqmlnxrtvubewyz.supabase.co
SUPABASE_ANON_KEY=your_actual_anon_key_here
```

## Getting Your Supabase Anon Key

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project (HQz-DB-Ai-MCP)
3. Go to Settings → API
4. Copy the "anon public" key

## Usage

Run the script:
```bash
python populate_supabase_db.py
```

The script will:
1. Check which tables already have data
2. Skip tables that are already populated
3. Populate empty tables with realistic hemp industry data
4. Create relationships between related data
5. Display a summary of all tables and record counts

## What Gets Populated

### Companies (10 records)
- HempFlax, Manitoba Harvest, Charlotte's Web, and more
- Real companies in the hemp industry
- Includes websites, locations, and specializations

### Research Data
- Research institutions focusing on hemp
- Scientific papers and patents
- Clinical trials on hemp products

### Market Data
- Global and regional market reports
- Market sizes and growth rates (CAGR)
- Segment-specific analysis

### Regulatory Information
- Jurisdictions (countries and states)
- Specific regulations like the 2018 Farm Bill
- THC limits and cultivation rules

### Historical Events
- Ancient hemp cultivation in China
- Hemp paper invention
- US prohibition and re-legalization

## Customization

You can modify the script to add more data:
1. Edit the data arrays in each `populate_*` function
2. Add new records following the existing format
3. Ensure foreign key relationships are valid

## Troubleshooting

If you encounter errors:
1. Check your Supabase credentials in `.env`
2. Ensure all required tables exist (run schema.sql first)
3. Check for foreign key constraint violations
4. Look at the error messages for specific issues

## Database Schema

The database follows the schema defined in `schema.sql`. Key tables include:
- `hemp_plant_archetypes` - Types of hemp plants
- `plant_parts` - Parts of the plant (seeds, stalks, etc.)
- `industries` - Industries using hemp
- `uses_products` - Specific hemp products and applications
- Plus supporting tables for companies, research, regulations, etc.

## Contributing

To add more data:
1. Fork the repository
2. Add data to the appropriate populate functions
3. Test the script locally
4. Submit a pull request

## License

This project is part of the HempQuarterz initiative to create a comprehensive hemp industry database.
