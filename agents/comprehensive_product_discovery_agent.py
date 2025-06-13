"""
Comprehensive Hemp Product Discovery Agent
This agent systematically discovers and adds hemp products to the database

Key improvements:
1. Systematic coverage of all plant part x industry combinations
2. Use of web search APIs for product discovery
3. Proper data validation and deduplication
4. Progress tracking and error recovery
"""

import os
import json
import asyncio
import aiohttp
from datetime import datetime
from typing import List, Dict, Any, Optional
from supabase import create_client, Client
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://ktoqznqmlnxrtvubewyz.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")
SERPAPI_KEY = os.getenv("SERPAPI_KEY")  # For web searches
OPENAI_KEY = os.getenv("OPENAI_KEY")    # For product description generation

# Initialize clients
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class HempProductDiscoveryAgent:
    """Agent for discovering and cataloging hemp products"""
    
    def __init__(self):
        self.supabase = supabase
        self.discovered_products = []
        self.coverage_gaps = []
        
    async def analyze_coverage(self) -> Dict[str, Any]:
        """Analyze current product coverage and identify gaps"""
        logger.info("Analyzing product coverage...")
        
        # Get all plant parts and industries
        plant_parts = self.supabase.table("plant_parts").select("*").execute().data
        industries = self.supabase.table("industries").select("*").execute().data
        
        # Get existing products
        existing_products = self.supabase.table("uses_products").select(
            "plant_part_id, industry_sub_category_id"
        ).execute().data
        
        # Create coverage matrix
        coverage = {}
        gaps = []
        
        for plant_part in plant_parts:
            for industry in industries:
                key = f"{plant_part['id']}_{industry['id']}"
                # Check if combination exists
                product_count = sum(
                    1 for p in existing_products 
                    if p['plant_part_id'] == plant_part['id']
                )
                
                coverage[key] = {
                    'plant_part': plant_part['name'],
                    'industry': industry['name'],
                    'count': product_count
                }
                
                if product_count < 3:  # Target at least 3 products per combination
                    gaps.append({
                        'plant_part_id': plant_part['id'],
                        'plant_part_name': plant_part['name'],
                        'industry_id': industry['id'],
                        'industry_name': industry['name'],
                        'current_count': product_count,
                        'needed': 3 - product_count
                    })
        
        self.coverage_gaps = gaps
        return {
            'total_combinations': len(plant_parts) * len(industries),
            'covered': len([c for c in coverage.values() if c['count'] > 0]),
            'gaps': len(gaps),
            'details': gaps[:10]  # Show first 10 gaps
        }
    
    async def search_products(self, plant_part: str, industry: str, limit: int = 5) -> List[Dict]:
        """Search for hemp products using web APIs"""
        search_queries = [
            f"hemp {plant_part} products {industry}",
            f"industrial hemp {plant_part} applications {industry}",
            f"hemp-based {plant_part} {industry} uses",
            f"commercial hemp {plant_part} {industry}"
        ]
        
        discovered = []
        
        for query in search_queries:
            try:
                # Use SerpAPI or similar service
                if SERPAPI_KEY:
                    async with aiohttp.ClientSession() as session:
                        params = {
                            'q': query,
                            'api_key': SERPAPI_KEY,
                            'num': 10
                        }
                        async with session.get('https://serpapi.com/search', params=params) as resp:
                            if resp.status == 200:
                                data = await resp.json()
                                for result in data.get('organic_results', [])[:limit]:
                                    product = self.extract_product_info(result, plant_part, industry)
                                    if product:
                                        discovered.append(product)
                
                # Fallback to predefined product templates
                if not discovered:
                    discovered = self.generate_product_templates(plant_part, industry)
                    
            except Exception as e:
                logger.error(f"Search error for {plant_part} x {industry}: {e}")
        
        return discovered
    
    def extract_product_info(self, search_result: Dict, plant_part: str, industry: str) -> Optional[Dict]:
        """Extract product information from search results"""
        try:
            # Parse search result to extract product info
            title = search_result.get('title', '')
            snippet = search_result.get('snippet', '')
            
            # Basic extraction logic (can be enhanced with NLP)
            if 'hemp' in title.lower() or 'hemp' in snippet.lower():
                return {
                    'name': self.clean_product_name(title),
                    'description': snippet,
                    'plant_part': plant_part,
                    'industry': industry,
                    'source_url': search_result.get('link', ''),
                    'discovered_date': datetime.now().isoformat()
                }
        except Exception as e:
            logger.error(f"Extraction error: {e}")
        
        return None
    
    def clean_product_name(self, title: str) -> str:
        """Clean and standardize product names"""
        # Remove common suffixes/prefixes
        clean_name = title.replace(' - Google Search', '')
        clean_name = clean_name.replace('Buy ', '').replace('Shop ', '')
        # Capitalize properly
        return ' '.join(word.capitalize() for word in clean_name.split()[:5])
    
    def generate_product_templates(self, plant_part: str, industry: str) -> List[Dict]:
        """Generate product templates based on common patterns"""
        templates = {
            ('Hemp Seed', 'Food & Beverages'): [
                {'name': 'Hemp Seed Milk', 'description': 'Nutritious plant-based milk alternative made from hemp seeds'},
                {'name': 'Hemp Seed Flour', 'description': 'Gluten-free flour made from ground hemp seeds'},
                {'name': 'Hemp Energy Bars', 'description': 'Protein-rich energy bars with hemp seed ingredients'}
            ],
            ('Hemp Bast (Fiber)', 'Automotive'): [
                {'name': 'Hemp Fiber Dashboard', 'description': 'Lightweight automotive dashboard made from hemp fiber composites'},
                {'name': 'Hemp Car Seat Covers', 'description': 'Durable and breathable seat covers made from hemp fabric'},
                {'name': 'Hemp Sound Insulation', 'description': 'Natural sound dampening material for vehicles'}
            ],
            ('Hemp Hurd (Shivs)', 'Animal Care'): [
                {'name': 'Hemp Pet Bedding', 'description': 'Super-absorbent bedding for pets made from hemp hurds'},
                {'name': 'Hemp Horse Stall Mats', 'description': 'Cushioned flooring for horse stalls using compressed hemp'},
                {'name': 'Hemp Cat Litter', 'description': 'Biodegradable cat litter made from hemp hurds'}
            ],
            ('Hemp Leaves', 'Cosmetics'): [
                {'name': 'Hemp Leaf Extract Serum', 'description': 'Anti-aging serum with hemp leaf extracts'},
                {'name': 'Hemp Leaf Face Mask', 'description': 'Purifying face mask with ground hemp leaves'},
                {'name': 'Hemp Leaf Toner', 'description': 'Balancing skin toner infused with hemp leaf compounds'}
            ],
            ('Hemp Roots', 'Medicine'): [
                {'name': 'Hemp Root Salve', 'description': 'Traditional healing salve made from hemp root extracts'},
                {'name': 'Hemp Root Tea', 'description': 'Herbal tea blend featuring dried hemp roots'},
                {'name': 'Hemp Root Tincture', 'description': 'Concentrated liquid extract from hemp roots'}
            ]
        }
        
        key = (plant_part, industry)
        if key in templates:
            return templates[key]
        
        # Generic template if no specific match
        return [
            {
                'name': f'Hemp {plant_part} {industry} Product',
                'description': f'Innovative {industry.lower()} product utilizing {plant_part.lower()}',
                'plant_part': plant_part,
                'industry': industry
            }
        ]
    
    async def save_products(self, products: List[Dict]) -> Dict[str, int]:
        """Save discovered products to database"""
        saved = 0
        skipped = 0
        errors = 0
        
        for product in products:
            try:
                # Check if product already exists
                existing = self.supabase.table("uses_products").select("id").eq(
                    "name", product['name']
                ).execute()
                
                if existing.data:
                    skipped += 1
                    continue
                
                # Get plant part and industry IDs
                plant_part = self.supabase.table("plant_parts").select("id").eq(
                    "name", product['plant_part']
                ).execute().data[0]
                
                industry = self.supabase.table("industries").select("id").eq(
                    "name", product['industry']
                ).execute().data[0]
                
                # Prepare product data
                product_data = {
                    'name': product['name'],
                    'description': product.get('description', ''),
                    'plant_part_id': plant_part['id'],
                    'benefits_advantages': product.get('benefits', []),
                    'keywords': self.generate_keywords(product),
                    'data_sources': [{'type': 'agent', 'name': 'comprehensive_discovery'}],
                    'data_completeness_score': self.calculate_completeness(product),
                    'last_enriched_date': datetime.now().isoformat()
                }
                
                # Insert product
                self.supabase.table("uses_products").insert(product_data).execute()
                saved += 1
                
            except Exception as e:
                logger.error(f"Error saving product {product.get('name', 'Unknown')}: {e}")
                errors += 1
        
        return {'saved': saved, 'skipped': skipped, 'errors': errors}
    
    def generate_keywords(self, product: Dict) -> List[str]:
        """Generate keywords for a product"""
        keywords = []
        
        # Add words from name and description
        name_words = product['name'].lower().split()
        desc_words = product.get('description', '').lower().split()[:10]
        
        keywords.extend(name_words)
        keywords.extend([w for w in desc_words if len(w) > 3])
        
        # Add standard hemp keywords
        keywords.extend(['hemp', 'sustainable', 'eco-friendly', product['industry'].lower()])
        
        return list(set(keywords))[:10]  # Unique keywords, max 10
    
    def calculate_completeness(self, product: Dict) -> int:
        """Calculate data completeness score for a product"""
        score = 0
        
        # Check required fields
        if product.get('name'): score += 20
        if product.get('description'): score += 20
        if len(product.get('description', '')) > 50: score += 10
        if product.get('benefits'): score += 15
        if product.get('applications'): score += 15
        if product.get('technical_specs'): score += 10
        if product.get('sustainability_info'): score += 10
        
        return min(score, 100)
    
    async def run_discovery_cycle(self):
        """Run a complete discovery cycle"""
        logger.info("Starting discovery cycle...")
        
        # Analyze coverage
        coverage = await self.analyze_coverage()
        logger.info(f"Coverage analysis: {coverage['covered']}/{coverage['total_combinations']} combinations covered")
        logger.info(f"Gaps found: {coverage['gaps']}")
        
        # Process gaps
        total_saved = 0
        total_errors = 0
        
        for gap in self.coverage_gaps[:20]:  # Process top 20 gaps
            logger.info(f"Processing gap: {gap['plant_part_name']} x {gap['industry_name']}")
            
            # Search for products
            products = await self.search_products(
                gap['plant_part_name'], 
                gap['industry_name'],
                gap['needed']
            )
            
            # Save products
            results = await self.save_products(products)
            total_saved += results['saved']
            total_errors += results['errors']
            
            logger.info(f"Gap processed: {results['saved']} saved, {results['skipped']} skipped")
            
            # Rate limiting
            await asyncio.sleep(2)
        
        # Log run to agent_runs table
        run_data = {
            'agent_name': 'comprehensive_product_discovery',
            'products_found': len(self.discovered_products),
            'products_saved': total_saved,
            'status': 'completed' if total_errors == 0 else 'completed_with_errors',
            'error_message': f"{total_errors} errors occurred" if total_errors > 0 else None
        }
        
        self.supabase.table("hemp_agent_runs").insert(run_data).execute()
        
        return {
            'coverage_before': coverage,
            'products_saved': total_saved,
            'errors': total_errors
        }

async def main():
    """Main execution function"""
    agent = HempProductDiscoveryAgent()
    
    # Run discovery
    results = await agent.run_discovery_cycle()
    
    logger.info("Discovery cycle completed!")
    logger.info(f"Results: {json.dumps(results, indent=2)}")

if __name__ == "__main__":
    asyncio.run(main())
