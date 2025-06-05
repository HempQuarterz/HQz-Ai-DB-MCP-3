"""
Advanced Hemp Products Population Script
This script adds comprehensive hemp products to the uses_products table
Based on the project plan's detailed categorization
"""

import os
from datetime import datetime
import json
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Supabase connection
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://ktoqznqmlnxrtvubewyz.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")

if not SUPABASE_KEY:
    print("Error: SUPABASE_ANON_KEY not found in environment variables")
    exit(1)

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Comprehensive hemp products data based on project plan
HEMP_PRODUCTS_DATA = [
    # Textile & Fashion Products
    {
        "category": "Textiles & Fashion",
        "products": [
            {
                "name": "Hemp T-Shirts",
                "description": "Comfortable, breathable t-shirts made from hemp fiber blends. Naturally antimicrobial and UV resistant.",
                "plant_part": "Stalk - Bast Fiber",
                "benefits_advantages": [
                    "3x stronger than cotton",
                    "Naturally antimicrobial",
                    "UV resistant",
                    "Becomes softer with each wash",
                    "Biodegradable"
                ],
                "commercialization_stage": "Established",
                "manufacturing_processes_summary": "Hemp fibers are extracted through decortication, degummed, carded, and spun into yarn. The yarn is then woven or knitted into fabric for t-shirt production.",
                "sustainability_aspects": [
                    "Uses 50% less water than cotton",
                    "No pesticides needed",
                    "Carbon negative crop",
                    "Fully biodegradable"
                ],
                "historical_context_facts": [
                    "Hemp clothing worn for thousands of years",
                    "Levi Strauss's first jeans contained hemp fiber"
                ],
                "technical_specifications": [
                    {"name": "Fiber length", "value": "15-25", "unit": "mm"},
                    {"name": "Tensile strength", "value": "550-900", "unit": "MPa"},
                    {"name": "Moisture absorption", "value": "8-12", "unit": "%"}
                ],
                "keywords": ["hemp clothing", "sustainable fashion", "hemp t-shirt", "eco-friendly apparel"]
            },
            {
                "name": "Hemp Denim Jeans",
                "description": "Durable denim jeans made from hemp-cotton blend, offering superior strength and comfort.",
                "plant_part": "Stalk - Bast Fiber",
                "benefits_advantages": [
                    "More durable than cotton denim",
                    "Breathable and moisture-wicking",
                    "Mold resistant",
                    "Retains shape better"
                ],
                "commercialization_stage": "Growing",
                "manufacturing_processes_summary": "Hemp fibers blended with cotton or organic cotton, woven into denim fabric using traditional denim weaving techniques with modified settings for hemp fiber.",
                "sustainability_aspects": [
                    "Reduces cotton dependency",
                    "Lower environmental impact",
                    "Longer product lifespan"
                ],
                "historical_context_facts": [
                    "Original Levi's contained hemp",
                    "Hemp denim revival started in 1990s"
                ],
                "keywords": ["hemp denim", "sustainable jeans", "hemp fashion"]
            },
            {
                "name": "Hemp Rope and Cordage",
                "description": "Strong, durable ropes made from twisted hemp fibers, ideal for marine and industrial applications.",
                "plant_part": "Stalk - Bast Fiber",
                "benefits_advantages": [
                    "Superior tensile strength",
                    "Resistant to saltwater",
                    "Natural UV resistance",
                    "Biodegradable"
                ],
                "commercialization_stage": "Established",
                "manufacturing_processes_summary": "Long hemp fibers are cleaned, combed, and twisted together using traditional rope-making machinery adapted for hemp fiber.",
                "sustainability_aspects": [
                    "Renewable resource",
                    "No synthetic materials",
                    "Compostable at end of life"
                ],
                "historical_context_facts": [
                    "Used in sailing ships for millennia",
                    "Essential for naval operations until 20th century",
                    "Columbus's ships used hemp rope"
                ],
                "keywords": ["hemp rope", "marine cordage", "industrial rope"]
            }
        ]
    },
    # Construction & Building Materials
    {
        "category": "Construction & Building Materials",
        "products": [
            {
                "name": "Hempcrete Blocks",
                "description": "Lightweight, insulating building blocks made from hemp hurds mixed with lime-based binders. Carbon-negative construction material.",
                "plant_part": "Stalk - Hurd/Shiv",
                "benefits_advantages": [
                    "Carbon negative material",
                    "Excellent insulation properties",
                    "Fire resistant",
                    "Pest resistant",
                    "Regulates humidity naturally"
                ],
                "commercialization_stage": "Growing",
                "manufacturing_processes_summary": "Hemp hurds mixed with lime binder and water, cast into blocks or forms, then cured for 6-8 weeks to achieve full strength.",
                "sustainability_aspects": [
                    "Sequesters CO2 during curing",
                    "Low embodied energy",
                    "Non-toxic",
                    "Recyclable"
                ],
                "historical_context_facts": [
                    "Used in France since 1990s",
                    "Ancient Romans used hemp-lime mortars",
                    "Gaining popularity in green building"
                ],
                "technical_specifications": [
                    {"name": "Density", "value": "300-400", "unit": "kg/m³"},
                    {"name": "R-value", "value": "2.5", "unit": "per inch"},
                    {"name": "Compressive strength", "value": "0.5-1.0", "unit": "MPa"}
                ],
                "keywords": ["hempcrete", "green building", "sustainable construction", "carbon negative"]
            },
            {
                "name": "Hemp Fiber Insulation",
                "description": "Natural thermal and acoustic insulation made from hemp fibers, safe to handle and install without protective equipment.",
                "plant_part": "Stalk - Bast Fiber",
                "benefits_advantages": [
                    "Non-toxic and safe to handle",
                    "Excellent thermal performance",
                    "Sound absorption",
                    "Mold and pest resistant",
                    "Breathable material"
                ],
                "commercialization_stage": "Established",
                "manufacturing_processes_summary": "Hemp fibers are cleaned, treated with natural fire retardants, and formed into batts or rolls using mechanical bonding.",
                "sustainability_aspects": [
                    "No harmful chemicals",
                    "Biodegradable",
                    "Low energy manufacturing",
                    "Carbon storage"
                ],
                "historical_context_facts": [
                    "Traditional building material in Europe",
                    "Modern hemp insulation developed in 1990s"
                ],
                "keywords": ["hemp insulation", "natural insulation", "thermal insulation"]
            }
        ]
    },
    # Food & Beverages
    {
        "category": "Food & Beverages",
        "products": [
            {
                "name": "Hemp Hearts (Hulled Seeds)",
                "description": "Nutrient-dense hulled hemp seeds ready for consumption. Complete protein source with ideal omega fatty acid ratio.",
                "plant_part": "Whole Hemp Seeds",
                "benefits_advantages": [
                    "Complete protein (all amino acids)",
                    "Perfect omega 3:6 ratio",
                    "Rich in minerals",
                    "Easy to digest",
                    "Gluten-free"
                ],
                "commercialization_stage": "Established",
                "manufacturing_processes_summary": "Hemp seeds are cleaned, dehulled using mechanical process, sorted to remove shell fragments, then packaged.",
                "sustainability_aspects": [
                    "Low water requirements",
                    "No pesticides needed",
                    "Minimal processing",
                    "Compostable packaging available"
                ],
                "historical_context_facts": [
                    "Traditional food in China for 3000 years",
                    "Used as famine food historically",
                    "Modern superfood since 2000s"
                ],
                "technical_specifications": [
                    {"name": "Protein content", "value": "25", "unit": "%"},
                    {"name": "Omega-3 content", "value": "3", "unit": "g/serving"},
                    {"name": "Fiber content", "value": "1.2", "unit": "g/serving"}
                ],
                "keywords": ["hemp hearts", "hemp seeds", "plant protein", "superfood"]
            },
            {
                "name": "Cold-Pressed Hemp Oil",
                "description": "Premium culinary oil extracted from hemp seeds without heat, preserving nutrients and delicate nutty flavor.",
                "plant_part": "Hemp Seed Oil",
                "benefits_advantages": [
                    "Optimal omega fatty acid profile",
                    "Rich in vitamin E",
                    "Supports heart health",
                    "Anti-inflammatory properties",
                    "Enhances salad dressings"
                ],
                "commercialization_stage": "Established",
                "manufacturing_processes_summary": "Seeds are cold-pressed below 49°C to extract oil, filtered, and bottled in dark containers to preserve quality.",
                "sustainability_aspects": [
                    "Minimal processing energy",
                    "No chemical solvents",
                    "Seed cake used as animal feed",
                    "Sustainable crop"
                ],
                "historical_context_facts": [
                    "Used in traditional Chinese medicine",
                    "Historical lamp oil before petroleum"
                ],
                "keywords": ["hemp oil", "omega-3", "culinary oil", "cold-pressed"]
            },
            {
                "name": "Hemp Protein Powder",
                "description": "Plant-based protein powder made from hemp seed cake, containing all essential amino acids and fiber.",
                "plant_part": "Hemp Protein",
                "benefits_advantages": [
                    "Complete protein source",
                    "High in fiber",
                    "Easy to digest",
                    "No allergens",
                    "Supports muscle recovery"
                ],
                "commercialization_stage": "Established",
                "manufacturing_processes_summary": "Hemp seed cake (after oil extraction) is milled into fine powder, sieved for consistency, and packaged.",
                "sustainability_aspects": [
                    "Byproduct utilization",
                    "No waste in production",
                    "Lower carbon than whey protein"
                ],
                "historical_context_facts": [
                    "Modern development since 1990s",
                    "Popular in vegan athletics"
                ],
                "keywords": ["hemp protein", "plant protein", "vegan protein", "sports nutrition"]
            }
        ]
    },
    # Personal Care & Cosmetics
    {
        "category": "Personal Care & Cosmetics",
        "products": [
            {
                "name": "Hemp Seed Oil Face Moisturizer",
                "description": "Lightweight facial moisturizer formulated with hemp seed oil, perfect for all skin types including sensitive skin.",
                "plant_part": "Hemp Seed Oil",
                "benefits_advantages": [
                    "Non-comedogenic",
                    "Balances oil production",
                    "Anti-aging properties",
                    "Soothes inflammation",
                    "Rich in antioxidants"
                ],
                "commercialization_stage": "Established",
                "manufacturing_processes_summary": "Hemp seed oil is combined with natural emulsifiers, preservatives, and complementary botanical extracts using cosmetic manufacturing standards.",
                "sustainability_aspects": [
                    "Natural ingredients",
                    "Cruelty-free",
                    "Recyclable packaging",
                    "Sustainably sourced"
                ],
                "historical_context_facts": [
                    "Hemp oil used in beauty for centuries",
                    "Cleopatra reportedly used hemp beauty products"
                ],
                "keywords": ["hemp moisturizer", "hemp skincare", "natural cosmetics"]
            },
            {
                "name": "Hemp Soap Bars",
                "description": "Natural soap bars made with hemp seed oil, providing gentle cleansing with moisturizing benefits.",
                "plant_part": "Hemp Seed Oil",
                "benefits_advantages": [
                    "Gentle on sensitive skin",
                    "Moisturizing properties",
                    "Natural antibacterial",
                    "Rich lather",
                    "Long-lasting bars"
                ],
                "commercialization_stage": "Established",
                "manufacturing_processes_summary": "Cold process soap making with hemp oil as primary oil, combined with lye, cured for 4-6 weeks.",
                "sustainability_aspects": [
                    "Biodegradable",
                    "Minimal packaging",
                    "No synthetic chemicals",
                    "Zero waste potential"
                ],
                "historical_context_facts": [
                    "Traditional soap ingredient",
                    "Revival in natural cosmetics movement"
                ],
                "keywords": ["hemp soap", "natural soap", "hemp bath products"]
            }
        ]
    },
    # Automotive Industry
    {
        "category": "Automotive",
        "products": [
            {
                "name": "Hemp Fiber Car Door Panels",
                "description": "Lightweight, strong automotive interior panels made from hemp fiber composites, reducing vehicle weight and improving sustainability.",
                "plant_part": "Stalk - Bast Fiber",
                "benefits_advantages": [
                    "30% lighter than traditional panels",
                    "Impact resistant",
                    "Improved acoustic properties",
                    "Reduced manufacturing energy",
                    "Recyclable"
                ],
                "commercialization_stage": "Growing",
                "manufacturing_processes_summary": "Hemp fibers combined with bio-based or recycled plastics, compression molded into automotive components.",
                "sustainability_aspects": [
                    "Reduces petroleum plastics",
                    "Lower vehicle emissions",
                    "Renewable material",
                    "End-of-life recyclability"
                ],
                "historical_context_facts": [
                    "Henry Ford's 1941 hemp car prototype",
                    "BMW, Mercedes using hemp composites since 2000s"
                ],
                "technical_specifications": [
                    {"name": "Weight reduction", "value": "30", "unit": "%"},
                    {"name": "Tensile strength", "value": "40-60", "unit": "MPa"},
                    {"name": "Impact resistance", "value": "15-25", "unit": "kJ/m²"}
                ],
                "keywords": ["hemp composites", "automotive hemp", "biocomposites", "car parts"]
            }
        ]
    },
    # Paper & Pulp
    {
        "category": "Paper & Pulp",
        "products": [
            {
                "name": "Hemp Printing Paper",
                "description": "High-quality printing and writing paper made from hemp fiber, offering superior durability and environmental benefits.",
                "plant_part": "Stalk - Bast Fiber",
                "benefits_advantages": [
                    "Stronger than wood paper",
                    "Doesn't yellow with age",
                    "Higher yield per acre",
                    "Archival quality",
                    "Smooth printing surface"
                ],
                "commercialization_stage": "Niche",
                "manufacturing_processes_summary": "Hemp fibers are pulped using less chemicals than wood, bleached with hydrogen peroxide, formed into sheets.",
                "sustainability_aspects": [
                    "Saves forests",
                    "Less chemical processing",
                    "4x more paper per acre than trees",
                    "Annual crop vs decades for trees"
                ],
                "historical_context_facts": [
                    "First paper made from hemp in China",
                    "US Constitution drafted on hemp paper",
                    "Gutenberg Bible printed on hemp"
                ],
                "keywords": ["hemp paper", "tree-free paper", "sustainable paper"]
            }
        ]
    },
    # Bioplastics & Composites
    {
        "category": "Bioplastics & Composites",
        "products": [
            {
                "name": "Hemp Bioplastic Pellets",
                "description": "Biodegradable plastic pellets made from hemp cellulose, suitable for injection molding and 3D printing applications.",
                "plant_part": "Stalk - Cellulose",
                "benefits_advantages": [
                    "Fully biodegradable",
                    "High strength-to-weight ratio",
                    "Reduced carbon footprint",
                    "Versatile processing",
                    "Non-toxic"
                ],
                "commercialization_stage": "Pilot",
                "manufacturing_processes_summary": "Hemp cellulose extracted and processed into polymer chains, pelletized for standard plastic processing equipment.",
                "sustainability_aspects": [
                    "Replaces petroleum plastics",
                    "Compostable",
                    "Carbon negative production",
                    "Renewable resource"
                ],
                "historical_context_facts": [
                    "Hemp plastics developed in 1940s",
                    "Ford's hemp car used hemp plastic panels"
                ],
                "keywords": ["hemp plastic", "bioplastic", "sustainable plastic", "hemp polymer"]
            }
        ]
    },
    # Environmental & Agricultural
    {
        "category": "Environmental & Agricultural Applications",
        "products": [
            {
                "name": "Hemp Biochar",
                "description": "Carbon-rich soil amendment produced from hemp biomass pyrolysis, improving soil health and sequestering carbon.",
                "plant_part": "Hemp Biomass",
                "benefits_advantages": [
                    "Improves soil water retention",
                    "Increases nutrient availability",
                    "Long-term carbon storage",
                    "Reduces fertilizer needs",
                    "Supports beneficial microbes"
                ],
                "commercialization_stage": "Pilot",
                "manufacturing_processes_summary": "Hemp stalks and waste biomass heated in oxygen-limited environment (pyrolysis) to create stable carbon structure.",
                "sustainability_aspects": [
                    "Carbon sequestration",
                    "Waste utilization",
                    "Reduces agricultural emissions",
                    "Permanent carbon storage"
                ],
                "historical_context_facts": [
                    "Biochar inspired by Amazon terra preta",
                    "Modern hemp biochar since 2010s"
                ],
                "keywords": ["hemp biochar", "soil amendment", "carbon sequestration"]
            },
            {
                "name": "Hemp Animal Bedding",
                "description": "Super-absorbent animal bedding made from hemp hurds, offering superior odor control and comfort for livestock and pets.",
                "plant_part": "Stalk - Hurd/Shiv",
                "benefits_advantages": [
                    "4x more absorbent than straw",
                    "Natural odor control",
                    "Low dust",
                    "Compostable",
                    "Pest resistant"
                ],
                "commercialization_stage": "Established",
                "manufacturing_processes_summary": "Hemp hurds are screened for size consistency, dust removed, and packaged in compressed bales.",
                "sustainability_aspects": [
                    "Agricultural waste utilization",
                    "Reduces landfill waste",
                    "Composts quickly",
                    "Chemical-free"
                ],
                "historical_context_facts": [
                    "Traditional use in horse stables",
                    "Premium bedding in modern times"
                ],
                "keywords": ["hemp bedding", "animal bedding", "pet bedding", "hemp hurds"]
            }
        ]
    }
]

def get_or_create_lookup_data():
    """Get IDs for plant parts, industries, and sub-categories"""
    lookup_data = {
        "plant_parts": {},
        "industries": {},
        "sub_categories": {}
    }
    
    # Get plant parts
    plant_parts = supabase.table("plant_parts").select("id, name").execute()
    for part in plant_parts.data:
        lookup_data["plant_parts"][part["name"]] = part["id"]
    
    # Get industries
    industries = supabase.table("industries").select("id, name").execute()
    for industry in industries.data:
        lookup_data["industries"][industry["name"]] = industry["id"]
    
    # Get sub-categories
    sub_categories = supabase.table("industry_sub_categories").select("id, name, industry_id").execute()
    for sub_cat in sub_categories.data:
        lookup_data["sub_categories"][sub_cat["name"]] = {
            "id": sub_cat["id"],
            "industry_id": sub_cat["industry_id"]
        }
    
    return lookup_data

def find_matching_ids(product_data, category, lookup_data):
    """Find matching IDs for plant part and industry"""
    # Find plant part ID
    plant_part_id = None
    for part_name, part_id in lookup_data["plant_parts"].items():
        if product_data["plant_part"].lower() in part_name.lower() or part_name.lower() in product_data["plant_part"].lower():
            plant_part_id = part_id
            break
    
    # Find industry ID
    industry_id = None
    sub_category_id = None
    
    for industry_name, industry_id_val in lookup_data["industries"].items():
        if category.lower() in industry_name.lower() or industry_name.lower() in category.lower():
            industry_id = industry_id_val
            break
    
    return plant_part_id, industry_id, sub_category_id

def populate_advanced_products():
    """Populate the database with comprehensive product data"""
    lookup_data = get_or_create_lookup_data()
    
    inserted_count = 0
    skipped_count = 0
    
    for category_group in HEMP_PRODUCTS_DATA:
        category = category_group["category"]
        print(f"\nProcessing {category} products...")
        
        for product in category_group["products"]:
            try:
                # Find matching IDs
                plant_part_id, industry_id, sub_category_id = find_matching_ids(
                    product, category, lookup_data
                )
                
                if not plant_part_id:
                    print(f"  ⚠️  Skipping {product['name']}: No matching plant part found")
                    skipped_count += 1
                    continue
                
                # Prepare the data for insertion
                product_data = {
                    "name": product["name"],
                    "description": product["description"],
                    "plant_part_id": plant_part_id,
                    "industry_sub_category_id": sub_category_id,
                    "benefits_advantages": product.get("benefits_advantages", []),
                    "commercialization_stage": product.get("commercialization_stage"),
                    "manufacturing_processes_summary": product.get("manufacturing_processes_summary"),
                    "sustainability_aspects": product.get("sustainability_aspects", []),
                    "historical_context_facts": product.get("historical_context_facts", []),
                    "technical_specifications": product.get("technical_specifications", {}),
                    "keywords": product.get("keywords", [])
                }
                
                # Insert the product
                result = supabase.table("uses_products").insert(product_data).execute()
                print(f"  ✓ Inserted: {product['name']}")
                inserted_count += 1
                
            except Exception as e:
                print(f"  ✗ Error inserting {product['name']}: {e}")
                skipped_count += 1
    
    print(f"\n📊 Summary:")
    print(f"✅ Successfully inserted: {inserted_count} products")
    print(f"⚠️  Skipped: {skipped_count} products")

def main():
    """Main execution"""
    print("\n🌿 Advanced Hemp Products Population Script 🌿\n")
    populate_advanced_products()
    
    # Show total count
    total = supabase.table("uses_products").select("id", count="exact").execute()
    print(f"\n📈 Total products in database: {total.count}")

if __name__ == "__main__":
    main()
