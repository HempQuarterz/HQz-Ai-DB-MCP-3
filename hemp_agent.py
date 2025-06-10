# hemp_agent.py
"""
Hemp Product Research Agent - Automated data collection for hemp products
This agent researches and saves hemp product information to your Supabase database
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

class HempResearchAgent:
    def __init__(self, plant_part, industry):
        self.plant_part = plant_part
        self.industry = industry
        
        # Initialize clients
        self.openai = OpenAI(api_key=os.environ['OPENAI_API_KEY'])
        self.supabase = create_client(
            os.environ['SUPABASE_URL'],
            os.environ['SUPABASE_ANON_KEY']
        )
        
        print(f"🌿 Initialized {plant_part} - {industry} agent")
    
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
        
        Focus on real, currently available products. Include both well-known brands and smaller companies.
        
        Format as JSON array:
        [{{
            "product_name": "",
            "company_name": "",
            "description": "",
            "benefits": ["", "", ""],
            "target_market": "",
            "price_range": "",
            "website": ""
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
        """Save products and companies to database"""
        saved_products = 0
        saved_companies = 0
        
        for product in products_data:
            try:
                # Check if company exists
                company_result = self.supabase.table('hemp_automation_companies').select('id').eq('name', product['company_name']).execute()
                
                if not company_result.data:
                    # Create company
                    company_data = {
                        'name': product['company_name'],
                        'website': product.get('website', ''),
                        'primary_focus': self.industry,
                        'created_at': datetime.now().isoformat()
                    }
                    company_result = self.supabase.table('hemp_automation_companies').insert(company_data).execute()
                    saved_companies += 1
                    company_id = company_result.data[0]['id']
                    print(f"  ✅ New company: {product['company_name']}")
                else:
                    company_id = company_result.data[0]['id']
                
                # Check if product exists
                product_result = self.supabase.table('hemp_automation_products').select('id').eq('name', product['product_name']).eq('company_id', company_id).execute()
                
                if not product_result.data:
                    # Create product
                    product_data = {
                        'name': product['product_name'],
                        'company_id': company_id,
                        'description': product['description'],
                        'plant_part': self.plant_part,
                        'industry': self.industry,
                        'benefits': product.get('benefits', []),
                        'target_market': product.get('target_market', ''),
                        'price_range': product.get('price_range', ''),
                        'availability': product.get('website', ''),
                        'created_at': datetime.now().isoformat()
                    }
                    self.supabase.table('hemp_automation_products').insert(product_data).execute()
                    saved_products += 1
                    print(f"  ✅ New product: {product['product_name']}")
                else:
                    print(f"  ℹ️  Product already exists: {product['product_name']}")
                    
            except Exception as e:
                print(f"  ❌ Error saving {product.get('product_name', 'Unknown')}: {e}")
        
        return saved_products, saved_companies
    
    def run(self, limit=5):
        """Execute the agent"""
        print(f"\n{'='*60}")
        print(f"🚀 Starting {self.plant_part} - {self.industry} Agent")
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
    parser = argparse.ArgumentParser(description='Hemp Product Research Agent')
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
        print("   1. Get Supabase anon key from: https://supabase.com/dashboard/project/ktoqznqmlnxrtvubewyz/settings/api")
        print("   2. Get OpenAI API key from: https://platform.openai.com/api-keys")
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
            print(f"🌿 Running ALL hemp research agents (limit: {limit} products each)...")
            for name, (plant_part, industry) in agents.items():
                agent = HempResearchAgent(plant_part, industry)
                agent.run(limit=limit)
                time.sleep(2)  # Small delay between agents
        elif agent_type in agents:
            # Run specific agent
            plant_part, industry = agents[agent_type]
            agent = HempResearchAgent(plant_part, industry)
            agent.run(limit=limit)
        else:
            print(f"❌ Unknown agent type: {agent_type}")
            print(f"\n📋 Available agents:")
            for name in agents.keys():
                print(f"   - {name}")
            print(f"   - all (runs all agents)")
    else:
        # Show help
        print("🌿 Hemp Research Agent")
        print("\nUsage: python hemp_agent.py [agent-type]")
        print("\nAvailable agents:")
        for name, (plant_part, industry) in agents.items():
            print(f"   {name:20} - Research {plant_part} in {industry}")
        print(f"   {'all':20} - Run all agents")
        print("\nExample: python hemp_agent.py seeds-food")
