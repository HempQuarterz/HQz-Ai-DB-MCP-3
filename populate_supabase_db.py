"""
Comprehensive Hemp Database Population Script for Supabase
This script populates all tables in the HQz-DB-Ai-MCP database with realistic hemp industry data
"""

import os
from datetime import datetime, date, timedelta
import random
import json
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Supabase connection
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://ktoqznqmlnxrtvubewyz.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")  # You'll need to add this to your .env file

if not SUPABASE_KEY:
    print("Error: SUPABASE_ANON_KEY not found in environment variables")
    print("Please add it to your .env file")
    exit(1)

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Helper function to check if data exists
def table_has_data(table_name):
    """Check if a table already has data"""
    try:
        result = supabase.table(table_name).select("*").limit(1).execute()
        return len(result.data) > 0
    except Exception as e:
        print(f"Error checking {table_name}: {e}")
        return False

# Helper function to insert data safely
def safe_insert(table_name, data, check_existing=True):
    """Safely insert data into a table"""
    try:
        if check_existing and table_has_data(table_name):
            print(f"✓ {table_name} already has data, skipping...")
            return True
        
        if isinstance(data, list):
            # Batch insert
            result = supabase.table(table_name).insert(data).execute()
        else:
            # Single insert
            result = supabase.table(table_name).insert(data).execute()
        
        print(f"✓ Successfully populated {table_name}")
        return True
    except Exception as e:
        print(f"✗ Error populating {table_name}: {e}")
        return False

# 1. Populate Companies
def populate_companies():
    """Populate companies table with real hemp industry companies"""
    companies_data = [
        {
            "name": "HempFlax",
            "website": "https://www.hempflax.com",
            "location": "Netherlands",
            "primary_activity": "Processing",
            "specialization": "Hemp fiber processing and manufacturing",
            "description": "One of Europe's largest hemp processors, specializing in fiber, shivs, and seeds",
            "logo_url": "https://example.com/hempflax-logo.png"
        },
        {
            "name": "Manitoba Harvest",
            "website": "https://manitobaharvest.com",
            "location": "Canada",
            "primary_activity": "Manufacturing",
            "specialization": "Hemp food products",
            "description": "Leading hemp food manufacturer, producing hemp hearts, protein powder, and oils",
            "logo_url": "https://example.com/manitoba-harvest-logo.png"
        },
        {
            "name": "Charlotte's Web",
            "website": "https://www.charlottesweb.com",
            "location": "USA",
            "primary_activity": "Manufacturing",
            "specialization": "CBD and hemp extract products",
            "description": "Premium hemp extract and CBD wellness products",
            "logo_url": "https://example.com/charlottes-web-logo.png"
        },
        {
            "name": "Hempcrete Natural Building",
            "website": "https://www.hempcretenatural.com",
            "location": "USA",
            "primary_activity": "Construction",
            "specialization": "Hempcrete construction",
            "description": "Sustainable building solutions using hempcrete materials",
            "logo_url": "https://example.com/hempcrete-logo.png"
        },
        {
            "name": "EnviroTextiles",
            "website": "https://www.envirotextiles.com",
            "location": "USA",
            "primary_activity": "Manufacturing",
            "specialization": "Hemp textiles and fabrics",
            "description": "Hemp fabric manufacturer for fashion and industrial applications",
            "logo_url": "https://example.com/envirotextiles-logo.png"
        },
        {
            "name": "Hemp Inc.",
            "website": "https://www.hempinc.com",
            "location": "USA",
            "primary_activity": "Farming",
            "specialization": "Industrial hemp cultivation",
            "description": "Large-scale industrial hemp farming and processing",
            "logo_url": "https://example.com/hempinc-logo.png"
        },
        {
            "name": "Hempitecture",
            "website": "https://www.hempitecture.com",
            "location": "USA",
            "primary_activity": "Manufacturing",
            "specialization": "Hemp building materials",
            "description": "Innovative hemp-based insulation and building materials",
            "logo_url": "https://example.com/hempitecture-logo.png"
        },
        {
            "name": "Hemp Fortex Industries",
            "website": "https://www.hempfortex.com",
            "location": "Canada",
            "primary_activity": "Processing",
            "specialization": "Hemp fiber processing",
            "description": "Advanced hemp fiber processing for textile applications",
            "logo_url": "https://example.com/hempfortex-logo.png"
        },
        {
            "name": "Canopy Growth Corporation",
            "website": "https://www.canopygrowth.com",
            "location": "Canada",
            "primary_activity": "Manufacturing",
            "specialization": "Cannabis and hemp products",
            "description": "Leading cannabis company with hemp product lines",
            "logo_url": "https://example.com/canopy-logo.png"
        },
        {
            "name": "Hemp Traders",
            "website": "https://www.hemptraders.com",
            "location": "USA",
            "primary_activity": "Distribution",
            "specialization": "Hemp materials distribution",
            "description": "Wholesale distributor of hemp fabrics, fibers, and seeds",
            "logo_url": "https://example.com/hemptraders-logo.png"
        }
    ]
    
    safe_insert("companies", companies_data)

# 2. Populate Research Institutions
def populate_research_institutions():
    """Populate research institutions focused on hemp research"""
    institutions_data = [
        {
            "name": "University of Kentucky Hemp Research",
            "location": "Kentucky, USA",
            "website": "https://hemp.ca.uky.edu",
            "focus_areas": ["Hemp agronomy", "Cannabinoid research", "Fiber applications", "Economic analysis"]
        },
        {
            "name": "Colorado State University Hemp Program",
            "location": "Colorado, USA",
            "website": "https://agsci.colostate.edu/hemp",
            "focus_areas": ["Hemp genetics", "Pest management", "Soil science", "Processing technology"]
        },
        {
            "name": "Nova Scotia Hemp Research",
            "location": "Nova Scotia, Canada",
            "website": "https://www.dal.ca/hemp",
            "focus_areas": ["Maritime hemp cultivation", "Hemp nutrition", "Sustainable farming"]
        },
        {
            "name": "Leibniz Institute for Agricultural Engineering",
            "location": "Germany",
            "website": "https://www.atb-potsdam.de",
            "focus_areas": ["Hemp processing technology", "Biorefinery concepts", "Material science"]
        },
        {
            "name": "VTT Technical Research Centre",
            "location": "Finland",
            "website": "https://www.vtt.fi",
            "focus_areas": ["Hemp composites", "Bioplastics", "Sustainable materials"]
        },
        {
            "name": "USDA Agricultural Research Service",
            "location": "USA",
            "website": "https://www.ars.usda.gov",
            "focus_areas": ["Hemp breeding", "Disease resistance", "Yield optimization", "Market analysis"]
        },
        {
            "name": "Agriculture and Agri-Food Canada",
            "location": "Canada",
            "website": "https://www.agr.gc.ca",
            "focus_areas": ["Hemp cultivars", "Processing innovations", "Market development"]
        },
        {
            "name": "Institute of Natural Fibres and Medicinal Plants",
            "location": "Poland",
            "website": "https://www.iwnirz.pl",
            "focus_areas": ["Hemp breeding", "Fiber quality", "Medical applications", "Processing technology"]
        }
    ]
    
    safe_insert("research_institutions", institutions_data)

# 3. Populate Research Entries
def populate_research_entries():
    """Populate research entries (papers, patents, studies)"""
    
    # First get research institutions
    institutions = supabase.table("research_institutions").select("id").execute()
    if not institutions.data:
        print("No research institutions found, populating them first...")
        populate_research_institutions()
        institutions = supabase.table("research_institutions").select("id").execute()
    
    # Get plant types and industries for references
    plant_types = supabase.table("hemp_plant_archetypes").select("id").execute()
    plant_parts = supabase.table("plant_parts").select("id").execute()
    industries = supabase.table("industries").select("id").execute()
    
    research_data = [
        {
            "title": "Optimization of Hemp Fiber Extraction Methods for Textile Applications",
            "entry_type": "Paper",
            "authors_or_assignees": ["Dr. Sarah Johnson", "Prof. Michael Chen", "Dr. Emily Williams"],
            "publication_or_filing_date": "2024-03-15",
            "abstract_summary": "This study examines various mechanical and chemical methods for extracting high-quality fibers from industrial hemp stalks. Results show that enzymatic retting combined with mechanical decortication yields fibers with superior tensile strength and flexibility suitable for textile manufacturing.",
            "journal_or_office": "Journal of Industrial Hemp",
            "doi_or_patent_number": "10.1234/jih.2024.0315",
            "keywords": ["hemp fiber", "textile", "extraction", "retting", "decortication"],
            "citations": 12,
            "research_institution_id": random.choice(institutions.data)["id"] if institutions.data else None,
            "plant_type_id": random.choice(plant_types.data)["id"] if plant_types.data else None,
            "plant_part_id": random.choice(plant_parts.data)["id"] if plant_parts.data else None,
            "industry_id": random.choice(industries.data)["id"] if industries.data else None
        },
        {
            "title": "Hemp-Based Biodegradable Plastics: A Comprehensive Review",
            "entry_type": "Paper",
            "authors_or_assignees": ["Dr. Amanda Rodriguez", "Dr. James Liu", "Prof. Robert Anderson"],
            "publication_or_filing_date": "2024-01-20",
            "abstract_summary": "This review analyzes the current state of hemp-based bioplastic development, examining mechanical properties, biodegradability rates, and commercial viability. Hemp fiber reinforced PLA composites show promising results for packaging applications.",
            "journal_or_office": "Materials Science and Engineering",
            "doi_or_patent_number": "10.5678/mse.2024.0120",
            "keywords": ["bioplastics", "hemp composites", "biodegradable", "sustainable materials"],
            "citations": 28,
            "research_institution_id": random.choice(institutions.data)["id"] if institutions.data else None
        },
        {
            "title": "Method for Producing High-Strength Hempcrete Building Blocks",
            "entry_type": "Patent",
            "authors_or_assignees": ["GreenBuild Technologies Inc.", "John Smith", "Maria Garcia"],
            "publication_or_filing_date": "2023-11-10",
            "abstract_summary": "A novel method for producing hempcrete blocks with enhanced compressive strength through optimized lime binder formulation and curing process. The invention achieves 40% higher strength compared to traditional hempcrete.",
            "journal_or_office": "USPTO",
            "doi_or_patent_number": "US11234567B1",
            "keywords": ["hempcrete", "construction", "building materials", "sustainable"],
            "citations": 5
        },
        {
            "title": "Nutritional Profile and Health Benefits of Hemp Seeds: Clinical Trial Results",
            "entry_type": "Clinical Trial",
            "authors_or_assignees": ["Dr. Lisa Thompson", "Dr. Mark Davis", "Nutrition Research Institute"],
            "publication_or_filing_date": "2024-02-28",
            "abstract_summary": "A 12-week clinical trial examining the effects of daily hemp seed consumption on cardiovascular health markers. Results show significant improvements in cholesterol levels and omega-3 fatty acid profiles.",
            "journal_or_office": "Journal of Nutritional Science",
            "doi_or_patent_number": "NCT04567890",
            "keywords": ["hemp seeds", "nutrition", "clinical trial", "omega-3", "cardiovascular health"],
            "citations": 15
        },
        {
            "title": "Hemp Fiber Reinforced Automotive Composites: Mechanical Properties and Life Cycle Assessment",
            "entry_type": "Paper",
            "authors_or_assignees": ["Dr. Klaus Weber", "Dr. Anna Schmidt", "Prof. Hans Mueller"],
            "publication_or_filing_date": "2023-09-12",
            "abstract_summary": "Study on hemp fiber composites for automotive applications, demonstrating 30% weight reduction compared to glass fiber composites while maintaining comparable mechanical properties. LCA shows 65% reduction in carbon footprint.",
            "journal_or_office": "Composites Part A",
            "doi_or_patent_number": "10.9012/compa.2023.0912",
            "keywords": ["automotive", "composites", "hemp fiber", "sustainability", "LCA"],
            "citations": 22
        }
    ]
    
    safe_insert("research_entries", research_data)

# 4. Populate Market Data Reports
def populate_market_data():
    """Populate market data reports with industry statistics"""
    market_data = [
        {
            "title": "Global Industrial Hemp Market Report 2024",
            "region": "Global",
            "segment": "All Segments",
            "year": 2024,
            "value": 18500000000,  # $18.5 billion
            "cagr": 16.8,
            "source_url": "https://www.grandviewresearch.com/hemp-market",
            "summary": "The global industrial hemp market size was valued at USD 18.5 billion in 2024 and is expected to grow at a CAGR of 16.8% from 2024 to 2030.",
            "published_date": "2024-03-01"
        },
        {
            "title": "North American Hemp Fiber Market Analysis",
            "region": "North America",
            "segment": "Fiber",
            "year": 2024,
            "value": 2100000000,  # $2.1 billion
            "cagr": 14.2,
            "source_url": "https://www.marketsandmarkets.com/hemp-fiber",
            "summary": "North American hemp fiber market driven by increasing demand from textile and automotive industries.",
            "published_date": "2024-02-15"
        },
        {
            "title": "European CBD Market Forecast 2024-2030",
            "region": "Europe",
            "segment": "CBD Products",
            "year": 2024,
            "value": 3800000000,  # $3.8 billion
            "cagr": 25.6,
            "source_url": "https://www.euromonitor.com/cbd-europe",
            "summary": "European CBD market experiencing rapid growth due to regulatory clarity and consumer acceptance.",
            "published_date": "2024-01-20"
        },
        {
            "title": "Hemp Construction Materials Market - Asia Pacific",
            "region": "Asia Pacific",
            "segment": "Construction",
            "year": 2023,
            "value": 890000000,  # $890 million
            "cagr": 28.4,
            "source_url": "https://www.researchandmarkets.com/hemp-construction",
            "summary": "Hempcrete and hemp insulation gaining traction in sustainable construction projects across APAC.",
            "published_date": "2023-12-10"
        },
        {
            "title": "Global Hemp Seed Food Products Market",
            "region": "Global",
            "segment": "Food & Nutrition",
            "year": 2024,
            "value": 1650000000,  # $1.65 billion
            "cagr": 12.3,
            "source_url": "https://www.foodmarketresearch.com/hemp-seeds",
            "summary": "Hemp seeds and derived products seeing increased adoption in health food and supplement markets.",
            "published_date": "2024-04-05"
        }
    ]
    
    safe_insert("market_data_reports", market_data)

# 5. Populate Regulatory Jurisdictions
def populate_regulatory_jurisdictions():
    """Populate regulatory jurisdictions with hierarchy"""
    jurisdictions_data = [
        # Top level - Countries/Regions
        {"name": "United States", "region": "North America", "parent_jurisdiction_id": None},
        {"name": "Canada", "region": "North America", "parent_jurisdiction_id": None},
        {"name": "European Union", "region": "Europe", "parent_jurisdiction_id": None},
        {"name": "United Kingdom", "region": "Europe", "parent_jurisdiction_id": None},
        {"name": "Australia", "region": "Oceania", "parent_jurisdiction_id": None},
        {"name": "China", "region": "Asia", "parent_jurisdiction_id": None},
    ]
    
    # Insert top-level jurisdictions first
    safe_insert("regulatory_jurisdictions", jurisdictions_data)
    
    # Get USA ID for state jurisdictions
    usa_result = supabase.table("regulatory_jurisdictions").select("id").eq("name", "United States").execute()
    if usa_result.data:
        usa_id = usa_result.data[0]["id"]
        
        # US States
        states_data = [
            {"name": "California", "region": "North America", "parent_jurisdiction_id": usa_id},
            {"name": "Colorado", "region": "North America", "parent_jurisdiction_id": usa_id},
            {"name": "Kentucky", "region": "North America", "parent_jurisdiction_id": usa_id},
            {"name": "Oregon", "region": "North America", "parent_jurisdiction_id": usa_id},
            {"name": "New York", "region": "North America", "parent_jurisdiction_id": usa_id},
        ]
        
        safe_insert("regulatory_jurisdictions", states_data, check_existing=False)

# 6. Populate Regulations
def populate_regulations():
    """Populate regulations table"""
    # Get jurisdictions
    jurisdictions = supabase.table("regulatory_jurisdictions").select("id, name").execute()
    
    if not jurisdictions.data:
        print("No jurisdictions found, populating them first...")
        populate_regulatory_jurisdictions()
        jurisdictions = supabase.table("regulatory_jurisdictions").select("id, name").execute()
    
    # Create a mapping of jurisdiction names to IDs
    jurisdiction_map = {j["name"]: j["id"] for j in jurisdictions.data}
    
    regulations_data = [
        {
            "jurisdiction_id": jurisdiction_map.get("United States"),
            "regulation_title": "2018 Farm Bill - Hemp Legalization",
            "summary": "Removes hemp from Schedule I controlled substances and allows commercial cultivation of hemp with less than 0.3% THC",
            "full_text_url": "https://www.congress.gov/bill/115th-congress/house-bill/2",
            "effective_date": "2018-12-20",
            "topic": "Hemp Legalization"
        },
        {
            "jurisdiction_id": jurisdiction_map.get("European Union"),
            "regulation_title": "EU Regulation 2021/2115 - Hemp THC Limits",
            "summary": "Increases THC limit for industrial hemp from 0.2% to 0.3% for EU agricultural subsidies",
            "full_text_url": "https://eur-lex.europa.eu/eli/reg/2021/2115",
            "effective_date": "2023-01-01",
            "topic": "THC Limit Cultivation"
        },
        {
            "jurisdiction_id": jurisdiction_map.get("Canada"),
            "regulation_title": "Industrial Hemp Regulations (IHR)",
            "summary": "Comprehensive regulations for cultivation, processing, and sale of industrial hemp in Canada",
            "full_text_url": "https://laws-lois.justice.gc.ca/eng/regulations/SOR-2018-145",
            "effective_date": "2018-10-17",
            "topic": "Comprehensive Hemp Regulation"
        },
        {
            "jurisdiction_id": jurisdiction_map.get("Colorado"),
            "regulation_title": "Colorado Hemp Advancement and Management Plan (CHAMP)",
            "summary": "State-level hemp cultivation and processing regulations aligned with USDA guidelines",
            "full_text_url": "https://www.colorado.gov/pacific/agplants/hemp",
            "effective_date": "2022-01-01",
            "topic": "State Hemp Program"
        },
        {
            "jurisdiction_id": jurisdiction_map.get("European Union"),
            "regulation_title": "Novel Food Regulation - CBD Classification",
            "summary": "CBD extracts classified as novel foods requiring pre-market authorization",
            "full_text_url": "https://eur-lex.europa.eu/eli/reg/2015/2283",
            "effective_date": "2019-01-15",
            "topic": "CBD in Food"
        }
    ]
    
    safe_insert("regulations", regulations_data)

# 7. Populate Historical Events
def populate_historical_events():
    """Populate historical events related to hemp"""
    events_data = [
        {
            "event_name": "Ancient Chinese Hemp Cultivation",
            "event_date": date(1, 1, 1),  # Approximate - 2800 BCE
            "description": "Evidence of hemp cultivation in ancient China for fiber and medicine",
            "significance": "One of the earliest recorded uses of hemp in human civilization",
            "related_uses_keywords": ["fiber", "medicine", "ancient cultivation"]
        },
        {
            "event_name": "Hemp Paper Invention",
            "event_date": date(105, 1, 1),  # Approximate - 105 CE
            "description": "Chinese court official Ts'ai Lun credited with inventing hemp-based paper",
            "significance": "Revolutionary development in written communication and record keeping",
            "related_uses_keywords": ["paper", "writing", "China"]
        },
        {
            "event_name": "Gutenberg Bible Printed on Hemp",
            "event_date": date(1455, 1, 1),
            "description": "First Gutenberg Bibles printed on hemp paper",
            "significance": "Hemp paper's role in the spread of printed knowledge",
            "related_uses_keywords": ["paper", "printing", "books"]
        },
        {
            "event_name": "US Declaration of Independence Drafted",
            "event_date": date(1776, 7, 4),
            "description": "Early drafts of the Declaration of Independence written on hemp paper",
            "significance": "Hemp's role in foundational American documents",
            "related_uses_keywords": ["paper", "history", "America"]
        },
        {
            "event_name": "Marihuana Tax Act",
            "event_date": date(1937, 8, 2),
            "description": "US law that effectively banned hemp production",
            "significance": "Beginning of hemp prohibition era in the United States",
            "related_uses_keywords": ["prohibition", "regulation", "United States"]
        },
        {
            "event_name": "Hemp for Victory Campaign",
            "event_date": date(1942, 1, 1),
            "description": "USDA film encouraging hemp cultivation for WWII war effort",
            "significance": "Temporary reversal of hemp prohibition for military needs",
            "related_uses_keywords": ["WWII", "fiber", "rope", "military"]
        },
        {
            "event_name": "Canada Legalizes Industrial Hemp",
            "event_date": date(1998, 3, 12),
            "description": "Canada becomes first major economy to re-legalize industrial hemp",
            "significance": "Beginning of modern hemp industry renaissance",
            "related_uses_keywords": ["legalization", "Canada", "industrial hemp"]
        },
        {
            "event_name": "2014 US Farm Bill Hemp Pilot Programs",
            "event_date": date(2014, 2, 7),
            "description": "Allows state departments of agriculture to grow hemp for research",
            "significance": "First step toward hemp re-legalization in the US",
            "related_uses_keywords": ["research", "pilot program", "United States"]
        },
        {
            "event_name": "2018 US Farm Bill Hemp Legalization",
            "event_date": date(2018, 12, 20),
            "description": "Full legalization of industrial hemp in the United States",
            "significance": "Removal of hemp from controlled substances, opening massive market",
            "related_uses_keywords": ["legalization", "Farm Bill", "industrial hemp"]
        }
    ]
    
    safe_insert("historical_events", events_data)

# 8. Populate Product Images
def populate_product_images():
    """Populate product images for existing products"""
    # Get some existing products
    products = supabase.table("uses_products").select("id, name").limit(10).execute()
    
    if not products.data:
        print("No products found to add images to")
        return
    
    images_data = []
    for product in products.data:
        # Add 2-3 images per product
        images_data.extend([
            {
                "use_product_id": product["id"],
                "image_url": f"https://example.com/hemp-products/{product['id']}-main.jpg",
                "caption": f"Main product image for {product['name']}",
                "alt_text": f"{product['name']} product photo",
                "is_primary": True,
                "order": 1
            },
            {
                "use_product_id": product["id"],
                "image_url": f"https://example.com/hemp-products/{product['id']}-detail.jpg",
                "caption": f"Detail view of {product['name']}",
                "alt_text": f"{product['name']} detail photo",
                "is_primary": False,
                "order": 2
            }
        ])
    
    safe_insert("product_images", images_data)

# 9. Populate Affiliate Links
def populate_affiliate_links():
    """Populate affiliate links for products"""
    # Get some existing products
    products = supabase.table("uses_products").select("id, name").limit(10).execute()
    
    if not products.data:
        print("No products found to add affiliate links to")
        return
    
    vendors = ["Amazon", "Hemp Traders", "Direct Hemp", "Green Market", "EcoHemp Store"]
    
    affiliate_data = []
    for product in products.data:
        # Add 1-2 affiliate links per product
        for i in range(random.randint(1, 2)):
            vendor = random.choice(vendors)
            affiliate_data.append({
                "use_product_id": product["id"],
                "vendor_name": vendor,
                "product_url": f"https://{vendor.lower().replace(' ', '')}.com/products/{product['id']}?ref=hqz",
                "logo_url": f"https://example.com/vendor-logos/{vendor.lower().replace(' ', '-')}.png",
                "description": f"Purchase {product['name']} from {vendor}"
            })
    
    safe_insert("affiliate_links", affiliate_data)

# 10. Create Product-Company Relationships
def populate_product_companies():
    """Create relationships between products and companies"""
    # Get products and companies
    products = supabase.table("uses_products").select("id").limit(20).execute()
    companies = supabase.table("companies").select("id").execute()
    
    if not products.data or not companies.data:
        print("Need both products and companies to create relationships")
        return
    
    relationships = []
    for product in products.data:
        # Assign 1-3 companies to each product
        num_companies = random.randint(1, min(3, len(companies.data)))
        selected_companies = random.sample(companies.data, num_companies)
        
        for company in selected_companies:
            relationships.append({
                "use_product_id": product["id"],
                "company_id": company["id"]
            })
    
    safe_insert("product_companies", relationships)

# 11. Create Product-Research Relationships
def populate_product_research_entries():
    """Create relationships between products and research entries"""
    # Get products and research entries
    products = supabase.table("uses_products").select("id").limit(10).execute()
    research = supabase.table("research_entries").select("id").execute()
    
    if not products.data or not research.data:
        print("Need both products and research entries to create relationships")
        return
    
    relationships = []
    for product in products.data:
        # Assign 1-2 research entries to each product
        num_research = random.randint(1, min(2, len(research.data)))
        selected_research = random.sample(research.data, num_research)
        
        for entry in selected_research:
            relationships.append({
                "use_product_id": product["id"],
                "research_entry_id": entry["id"]
            })
    
    safe_insert("product_research_entries", relationships)

# 12. Create Product-Regulation Relationships
def populate_product_regulations():
    """Create relationships between products and regulations"""
    # Get products and regulations
    products = supabase.table("uses_products").select("id").limit(10).execute()
    regulations = supabase.table("regulations").select("id").execute()
    
    if not products.data or not regulations.data:
        print("Need both products and regulations to create relationships")
        return
    
    relationships = []
    for product in products.data:
        # Assign 1-2 regulations to each product
        num_regs = random.randint(1, min(2, len(regulations.data)))
        selected_regs = random.sample(regulations.data, num_regs)
        
        for reg in selected_regs:
            relationships.append({
                "use_product_id": product["id"],
                "regulation_id": reg["id"]
            })
    
    safe_insert("product_regulations", relationships)

# Main execution function
def main():
    """Execute all population functions"""
    print("\n🌿 Starting Hemp Database Population Script 🌿\n")
    
    # Order matters for foreign key relationships
    population_functions = [
        ("Companies", populate_companies),
        ("Research Institutions", populate_research_institutions),
        ("Research Entries", populate_research_entries),
        ("Market Data Reports", populate_market_data),
        ("Regulatory Jurisdictions", populate_regulatory_jurisdictions),
        ("Regulations", populate_regulations),
        ("Historical Events", populate_historical_events),
        ("Product Images", populate_product_images),
        ("Affiliate Links", populate_affiliate_links),
        ("Product-Company Relationships", populate_product_companies),
        ("Product-Research Relationships", populate_product_research_entries),
        ("Product-Regulation Relationships", populate_product_regulations),
    ]
    
    for name, func in population_functions:
        print(f"\n📊 Populating {name}...")
        try:
            func()
        except Exception as e:
            print(f"❌ Error in {name}: {e}")
    
    print("\n✅ Database population completed!")
    print("\nDatabase Summary:")
    
    # Print summary of data in each table
    tables = [
        "hemp_plant_archetypes", "plant_parts", "industries", "industry_sub_categories",
        "uses_products", "companies", "research_institutions", "research_entries",
        "market_data_reports", "regulatory_jurisdictions", "regulations", "historical_events"
    ]
    
    for table in tables:
        try:
            count = supabase.table(table).select("id", count="exact").execute()
            print(f"  {table}: {count.count} records")
        except:
            pass

if __name__ == "__main__":
    main()
