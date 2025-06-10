# Hemp Agent Migration Guide

This guide explains how to transition from the basic `hemp_agent.py` to the enhanced version that properly integrates with your main database tables.

## Overview

The enhanced hemp agent (`hemp_agent_enhanced.py`) provides:
- ✅ Integration with main `uses_products` and `companies` tables
- ✅ Proper mapping to plant parts and industry categories
- ✅ Duplicate prevention across all tables
- ✅ Backward compatibility with automation tables
- ✅ Full product metadata storage

## Database Structure

### Main Tables (schema.sql)
- `hemp_plant_archetypes` - Plant types
- `plant_parts` - Parts of the plant (seeds, fiber, oil, etc.)
- `industries` - Main industry categories
- `industry_sub_categories` - Specific industry segments
- `uses_products` - Main product catalog
- `companies` - Company directory
- `product_companies` - Links products to companies

### Automation Tables (schema_automation.sql)
- `hemp_automation_companies` - Tracking for automated discoveries
- `hemp_automation_products` - Automated product entries
- `hemp_agent_runs` - Agent execution logs

## Setup Instructions

### 1. Create Automation Tables
Run the `schema_automation.sql` in your Supabase SQL editor:
```sql
-- This creates the automation tables if they don't exist
-- See schema_automation.sql
```

### 2. Update Your Workflows
Replace `hemp_agent.py` with `hemp_agent_enhanced.py` in your GitHub Actions:

```yaml
# In .github/workflows/hemp-automation.yml
- name: Run Hemp Agent - ${{ matrix.agent }}
  env:
    SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
    SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
  run: |
    # Change this line:
    # python hemp_agent.py --type "${{ matrix.agent }}" --limit 5
    # To:
    python hemp_agent_enhanced.py --type "${{ matrix.agent }}" --limit 5
```

### 3. Test Locally
```bash
# Test a single agent
python hemp_agent_enhanced.py seeds-food --limit 2

# Test all agents with small limit
python hemp_agent_enhanced.py all --limit 1
```

## Key Differences

### Old Behavior (hemp_agent.py)
- Saves only to `hemp_automation_products` and `hemp_automation_companies`
- No integration with main database schema
- Limited product metadata

### New Behavior (hemp_agent_enhanced.py)
- Saves to both main tables AND automation tables
- Creates proper relationships:
  - Products → Plant Parts → Archetypes
  - Products → Industry Sub-categories → Industries
  - Products ↔ Companies (many-to-many)
- Stores full metadata:
  - Manufacturing processes
  - Sustainability aspects
  - Technical specifications
  - Benefits and advantages

## Data Flow

1. **Agent researches products** using OpenAI
2. **Gets or creates plant part**:
   - Creates archetype if needed
   - Creates plant part linked to archetype
3. **Gets or creates industry category**:
   - Maps agent industry to main industry
   - Creates sub-category under main industry
4. **Saves company** to `companies` table
5. **Saves product** to `uses_products` table with:
   - Full description and metadata
   - Link to plant part
   - Link to industry sub-category
6. **Creates relationship** in `product_companies`
7. **Saves to automation tables** for tracking
8. **Logs run** in `hemp_agent_runs`

## Monitoring

Use the existing `monitor_hemp.py` to track:
```bash
python monitor_hemp.py --recent 24
```

To query the main tables directly:
```sql
-- Products by plant part
SELECT 
    pp.name as plant_part,
    COUNT(up.id) as product_count
FROM uses_products up
JOIN plant_parts pp ON up.plant_part_id = pp.id
GROUP BY pp.name;

-- Products by industry
SELECT 
    i.name as industry,
    isc.name as sub_category,
    COUNT(up.id) as product_count
FROM uses_products up
JOIN industry_sub_categories isc ON up.industry_sub_category_id = isc.id
JOIN industries i ON isc.industry_id = i.id
GROUP BY i.name, isc.name
ORDER BY product_count DESC;

-- Recent products with companies
SELECT 
    up.name as product,
    c.name as company,
    pp.name as plant_part,
    up.created_at
FROM uses_products up
JOIN plant_parts pp ON up.plant_part_id = pp.id
JOIN product_companies pc ON up.id = pc.use_product_id
JOIN companies c ON pc.company_id = c.id
ORDER BY up.created_at DESC
LIMIT 10;
```

## Rollback Plan

If you need to revert:
1. Change workflow back to use `hemp_agent.py`
2. Data in automation tables remains intact
3. Data in main tables is preserved

## Benefits

- **Unified Database**: All products in one place
- **Better Relationships**: Proper foreign keys and joins
- **Rich Metadata**: Full product information stored
- **No Duplicates**: Checks prevent duplicate entries
- **Backward Compatible**: Still populates automation tables

## Next Steps

1. Run `schema_automation.sql` in Supabase
2. Test `hemp_agent_enhanced.py` locally
3. Update GitHub Actions workflows
4. Monitor results

The enhanced agent ensures all autonomous entries are properly categorized and stored in your main database structure!
