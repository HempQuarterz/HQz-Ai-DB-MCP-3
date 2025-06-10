# hemp_agent_enhanced.py
"""
Enhanced Hemp Product Research Agent - Integrates with main database tables
This version properly adds products to uses_products table with full relationships
"""

import os
import json
import time
import argparse
from datetime import datetime
from openai import OpenAI
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class EnhancedHempResearchAgent:
    def __init__(self, plant_part, industry):
        self.plant_part = plant_part
        self.industry = industry
        
        # Initialize clients
        self.openai = OpenAI(api_key=os.environ['OPENAI_API_KEY'])
        self.supabase = create_client(
            os.environ['SUPABASE_URL'],
            os.environ['SUPABASE_ANON_KEY']
        )
        
        # Cache for IDs to avoid repeated lookups
        self.plant_part_id = None
        self.industry_id = None
        self.industry_sub_category_id = None
        
        print(f"🌿 Initialized Enhanced {plant_part} - {industry} agent")
    
    def get_or_create_plant_part(self):
        """Get or create plant part and archetype"""
        # First, check if we need to create archetype
        archetype_name = f"{self.plant_part.capitalize()} Archetype"
        archetype_result = self.supabase.table('hemp_plant_archetypes').select('id').eq('name', archetype_name).execute()
        
        if not archetype_result.data:
            archetype_data = {
                'name': archetype_name,
                'description': f'Hemp plants optimized for {self.plant_part} production',
                'cultivation_focus_notes': f'Focus on maximizing {self.plant_part} yield'
            }
            archetype_result = self.supabase.table('hemp_plant_archetypes').insert(archetype_data).execute()
            archetype_id = archetype_result.data[0]['id']
        else:
            archetype_id = archetype_result.data[0]['id']
        
        # Now get or create plant part
        part_result = self.supabase.table('plant_parts').select('id').eq('name', self.plant_part).eq('archetype_id', archetype_id).execute()
        
        if not part_result.data:
            part_data = {
                'archetype_id': archetype_id,
                'name': self.plant_part,
                'description': f'The {self.plant_part} part of the hemp plant'
            }
            part_result = self.supabase.table('plant_parts').insert(part_data).execute()
            self.plant_part_id = part_result.data[0]['id']
        else:
            self.plant_part_id = part_result.data[0]['id']
        
        return self.plant_part_id
    
    def get_or_create_industry_category(self):
        """Get or create industry and sub-category"""
        # Map agent industries to main industries
        industry_mapping = {
            'food_beverage': 'Food & Beverage',
            'nutritional_supplements': 'Health & Wellness',
            'textiles': 'Textiles & Fashion',
            'composites': 'Manufacturing',
            'cosmetics': 'Personal Care',
            'wellness': 'Health & Wellness',
            'biofuel': 'Energy',
            'pharmaceuticals': 'Health & Wellness',
            'cbd_products': 'Health & Wellness',
            'construction': 'Construction',
            'animal_bedding': 'Agriculture',
            'hempcrete': 'Construction',
            'traditional_medicine': 'Health & Wellness',
            'biotech': 'Biotechnology',
            'animal_feed': 'Agriculture',
            'medicine': 'Health & Wellness',
            'energy': 'Energy',
            'sustainability': 'Environmental'
        }
        
        main_industry = industry_mapping.get(self.industry, 'Other')
        
        # Get or create main industry
        industry_result = self.supabase.table('industries').select('id').eq('name', main_industry).execute()
        
        if not industry_result.data:
            industry_data = {
                'name': main_industry,
                'description': f'{main_industry} industry applications for hemp'
            }
            industry_result = self.supabase.table('industries').insert(industry_data).execute()
            self.industry_id = industry_result.data[0]['id']
        else:
            self.industry_id = industry_result.data[0]['id']
        
        # Get or create sub-category
        sub_category_name = self.industry.replace('_', ' ').title()
        sub_result = self.supabase.table('industry_sub_categories').select('id').eq('name', sub_category_name).eq('industry_id', self.industry_id).execute()
        
        if not sub_result.data:
            sub_data = {
                'industry_id': self.industry_id,
                'name': sub_category_name,
                'description': f'{sub_category_name} applications'
            }
            sub_result = self.supabase.table('industry_sub_categories').insert(sub_data).execute()
            self.industry_sub_category_id = sub_result.data[0]['id']
        else:
            self.industry_sub_category_id = sub_result.data[0]['id']
        
        return self.industry_sub_category_id
    
    def research_products(self, limit=5):
        """Research hemp products using AI"""
        prompt = f"""
        Research current hemp {self.plant_part} products in the {self.industry} industry.
        Find {limit} specific products that actually exist in the market today.
        
        For each product provide:
        - Product name (exact name as marketed)
        - Company name (exact company name)
        - Product description (2-3 detailed sentences)
        - Key benefits/features (list of 3-4 specific benefits)
        - Target market (specific demographics)
        - Price range (if available, e.g., "$20-30")
        - Website or where to buy (if available)
        - Manufacturing process summary (brief overview)
        - Sustainability aspects (2-3 points)
        - Technical specifications (any relevant specs)
        
        Focus on real, currently available products. Include both well-known brands and smaller companies.
        
        Format as JSON array:
        [{{
            "product_name": "",
            "company_name": "",
            "description": "",
            "benefits": ["", "", ""],
            "target_market": "",
            "price_range": "",
            "website": "",
            "manufacturing_process": "",
            "sustainability": ["", "", ""],
            "specifications": {{}}
        }}]
        """
        
        try:
            response = self.openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a hemp industry research specialist with deep knowledge of current hemp products in the market. Always provide accurate, real product information."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            # Parse response
            content = response.choices[0].message.content
            start = content.find('[')
            end = content.rfind(']') + 1
            
            if start != -1 and end != 0:
                products = json.loads(content[start:end])
                return products
            else:
                print(f"Could not parse JSON from response")
                return []
                
        except Exception as e:
            print(f"Error in research: {e}")
            return []
    
    def save_to_database(self, products_data):
        """Save products and companies to main database tables"""
        saved_products = 0
        saved_companies = 0
        
        # Ensure we have plant part and industry IDs
        if not self.plant_part_id:
            self.get_or_create_plant_part()
        if not self.industry_sub_category_id:
            self.get_or_create_industry_category()
        
        for product in products_data:
            try:
                # Check if company exists in main companies table
                company_result = self.supabase.table('companies').select('id').eq('name', product['company_name']).execute()
                
                if not company_result.data:
                    # Create company in main table
                    company_data = {
                        'name': product['company_name'],
                        'website': product.get('website', ''),
                        'primary_activity': f'Hemp {self.industry}',
                        'specialization': f'{self.plant_part} products',
                        'description': f'Company specializing in hemp {self.plant_part} for {self.industry}'
                    }
                    company_result = self.supabase.table('companies').insert(company_data).execute()
                    saved_companies += 1
                    company_id = company_result.data[0]['id']
                    print(f"  ✅ New company: {product['company_name']}")
                else:
                    company_id = company_result.data[0]['id']
                
                # Check if product exists in uses_products table
                product_result = self.supabase.table('uses_products').select('id').eq('name', product['product_name']).eq('plant_part_id', self.plant_part_id).execute()
                
                if not product_result.data:
                    # Create product in main uses_products table
                    product_data = {
                        'name': product['product_name'],
                        'description': product['description'],
                        'plant_part_id': self.plant_part_id,
                        'industry_sub_category_id': self.industry_sub_category_id,
                        'benefits_advantages': product.get('benefits', []),
                        'commercialization_stage': 'Market Ready',
                        'manufacturing_processes_summary': product.get('manufacturing_process', ''),
                        'sustainability_aspects': product.get('sustainability', []),
                        'technical_specifications': product.get('specifications', {}),
                        'miscellaneous_info': {
                            'target_market': product.get('target_market', ''),
                            'price_range': product.get('price_range', ''),
                            'availability': product.get('website', '')
                        }
                    }
                    product_result = self.supabase.table('uses_products').insert(product_data).execute()
                    saved_products += 1
                    product_id = product_result.data[0]['id']
                    print(f"  ✅ New product: {product['product_name']}")
                    
                    # Create product-company relationship
                    self.supabase.table('product_companies').insert({
                        'use_product_id': product_id,
                        'company_id': company_id
                    }).execute()
                    
                    # Also save to automation tables for tracking
                    self.save_to_automation_tables(product, company_id)
                    
                else:
                    print(f"  ℹ️  Product already exists: {product['product_name']}")
                    
            except Exception as e:
                print(f"  ❌ Error saving {product.get('product_name', 'Unknown')}: {e}")
        
        return saved_products, saved_companies
    
    def save_to_automation_tables(self, product, company_id):
        """Also save to automation tables for backward compatibility and tracking"""
        try:
            # Check/create in automation companies table
            auto_company_result = self.supabase.table('hemp_automation_companies').select('id').eq('name', product['company_name']).execute()
            
            if not auto_company_result.data:
                auto_company_data = {
                    'name': product['company_name'],
                    'website': product.get('website', ''),
                    'primary_focus': self.industry,
                    'created_at': datetime.now().isoformat()
                }
                auto_company_result = self.supabase.table('hemp_automation_companies').insert(auto_company_data).execute()
                auto_company_id = auto_company_result.data[0]['id']
            else:
                auto_company_id = auto_company_result.data[0]['id']
            
            # Save to automation products table
            auto_product_data = {
                'name': product['product_name'],
                'company_id': auto_company_id,
                'description': product['description'],
                'plant_part': self.plant_part,
                'industry': self.industry,
                'benefits': product.get('benefits', []),
                'target_market': product.get('target_market', ''),
                'price_range': product.get('price_range', ''),
                'availability': product.get('website', ''),
                'created_at': datetime.now().isoformat()
            }
            self.supabase.table('hemp_automation_products').insert(auto_product_data).execute()
            
        except Exception as e:
            print(f"  ⚠️  Error saving to automation tables: {e}")
    
    def run(self, limit=5):
        """Execute the agent"""
        print(f"\n{'='*60}")
        print(f"🚀 Starting Enhanced {self.plant_part} - {self.industry} Agent")
        print(f"⏰ Time: {datetime.now()}")
        print(f"{'='*60}")
        
        # Research products
        products = self.research_products(limit)
        print(f"\n📊 Found {len(products)} products")
        
        if products:
            # Save to database
            saved_products, saved_companies = self.save_to_database(products)
            print(f"\n📈 Results:")
            print(f"   Products saved: {saved_products}")
            print(f"   Companies saved: {saved_companies}")
            
            # Log the run
            log_data = {
                'agent_name': f"{self.plant_part}_{self.industry}",
                'products_found': len(products),
                'products_saved': saved_products,
                'companies_saved': saved_companies,
                'timestamp': datetime.now().isoformat(),
                'status': 'success'
            }
            self.supabase.table('hemp_agent_runs').insert(log_data).execute()
            print(f"\n✅ Agent run logged successfully")
        else:
            print("❌ No products found in this run")
            
            # Log the failed run
            log_data = {
                'agent_name': f"{self.plant_part}_{self.industry}",
                'products_found': 0,
                'products_saved': 0,
                'companies_saved': 0,
                'timestamp': datetime.now().isoformat(),
                'status': 'no_results'
            }
            self.supabase.table('hemp_agent_runs').insert(log_data).execute()
        
        print(f"\n{'='*60}\n")


# Parse command-line arguments
def parse_arguments():
    parser = argparse.ArgumentParser(description='Enhanced Hemp Product Research Agent')
    parser.add_argument('agent_type', nargs='?', help='Agent type to run')
    parser.add_argument('--type', dest='agent_type_flag', help='Agent type (alternative syntax)')
    parser.add_argument('--limit', type=int, default=10, help='Maximum products to research per run')
    
    args = parser.parse_args()
    
    # Handle both positional and flag-based agent type
    agent_type = args.agent_type or args.agent_type_flag
    
    return agent_type, args.limit


# Main execution
if __name__ == "__main__":
    import sys
    
    # Check environment variables
    required_vars = ['OPENAI_API_KEY', 'SUPABASE_URL', 'SUPABASE_ANON_KEY']
    missing = [var for var in required_vars if not os.environ.get(var)]
    
    if missing:
        print("❌ Missing environment variables:")
        for var in missing:
            print(f"   - {var}")
        print("\n📋 Please update your .env file with the required keys")
        exit(1)
    
    # Define available agents
    agents = {
        'seeds-food': ('seeds', 'food_beverage'),
        'seeds-nutrition': ('seeds', 'nutritional_supplements'),
        'fiber-textiles': ('fiber', 'textiles'),
        'fiber-composites': ('fiber', 'composites'),
        'oil-cosmetics': ('oil', 'cosmetics'),
        'oil-wellness': ('oil', 'wellness'),
        'oil-biofuel': ('oil', 'biofuel'),
        'flower-pharma': ('flower', 'pharmaceuticals'),
        'flower-cbd': ('flower', 'cbd_products'),
        'flower-wellness': ('flower', 'wellness'),
        'hurds-construction': ('hurds', 'construction'),
        'hurds-bedding': ('hurds', 'animal_bedding'),
        'hurds-hempcrete': ('hurds', 'hempcrete'),
        'roots-medicine': ('roots', 'traditional_medicine'),
        'roots-biotech': ('roots', 'biotech'),
        'leaves-feed': ('leaves', 'animal_feed'),
        'leaves-medicine': ('leaves', 'medicine'),
        'biomass-energy': ('biomass', 'energy'),
        'whole-plant': ('whole_plant', 'sustainability')
    }
    
    # Parse arguments
    agent_type, limit = parse_arguments()
    
    if agent_type:
        if agent_type == 'all':
            # Run all agents
            print(f"🌿 Running ALL enhanced hemp research agents (limit: {limit} products each)...")
            for name, (plant_part, industry) in agents.items():
                agent = EnhancedHempResearchAgent(plant_part, industry)
                agent.run(limit=limit)
                time.sleep(2)  # Small delay between agents
        elif agent_type in agents:
            # Run specific agent
            plant_part, industry = agents[agent_type]
            agent = EnhancedHempResearchAgent(plant_part, industry)
            agent.run(limit=limit)
        else:
            print(f"❌ Unknown agent type: {agent_type}")
            print(f"\n📋 Available agents:")
            for name in agents.keys():
                print(f"   - {name}")
            print(f"   - all (runs all agents)")
    else:
        # Show help
        print("🌿 Enhanced Hemp Research Agent")
        print("\nUsage: python hemp_agent_enhanced.py [agent-type]")
        print("\nAvailable agents:")
        for name, (plant_part, industry) in agents.items():
            print(f"   {name:20} - Research {plant_part} in {industry}")
        print(f"   {'all':20} - Run all agents")
        print("\nExample: python hemp_agent_enhanced.py seeds-food")
