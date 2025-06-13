"""Hemp Research Agent - Discovers and analyzes hemp products and industry trends."""

import asyncio
import json
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from urllib.parse import urlparse, urljoin
import aiohttp
from bs4 import BeautifulSoup
import feedparser
from tenacity import retry, stop_after_attempt, wait_exponential

from ..core.base_agent import BaseAgent, rate_limited, track_performance

logger = logging.getLogger(__name__)


class HempResearchAgent(BaseAgent):
    """Agent responsible for researching hemp products, trends, and industry updates."""
    
    def __init__(self, supabase_client, ai_provider=None):
        super().__init__(supabase_client, ai_provider)
        self.session = None
        self.sources = self._initialize_sources()
        
    def _initialize_sources(self) -> List[Dict]:
        """Initialize research sources."""
        return [
            {
                'name': 'EIHA',
                'url': 'https://eiha.org',
                'type': 'industry',
                'selectors': {
                    'news': '.news-item',
                    'title': 'h2, h3',
                    'content': '.content, .description'
                }
            },
            {
                'name': 'Hemp Industry Daily',
                'url': 'https://hempindustrydaily.com',
                'type': 'news',
                'rss': 'https://hempindustrydaily.com/feed/',
                'selectors': {
                    'article': 'article',
                    'title': 'h1, .entry-title',
                    'content': '.entry-content'
                }
            },
            {
                'name': 'Vote Hemp',
                'url': 'https://www.votehemp.com',
                'type': 'advocacy',
                'selectors': {
                    'news': '.news-post',
                    'title': 'h2',
                    'content': '.post-content'
                }
            },
            {
                'name': 'USDA Hemp Program',
                'url': 'https://www.ams.usda.gov/rules-regulations/hemp',
                'type': 'government',
                'selectors': {
                    'updates': '.update-item',
                    'title': 'h3',
                    'content': '.content'
                }
            }
        ]
    
    async def __aenter__(self):
        """Async context manager entry."""
        self.session = aiohttp.ClientSession()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        if self.session:
            await self.session.close()
    
    @track_performance
    async def execute(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute research task."""
        action = task.get('action')
        
        if action == 'discover_products':
            return await self.discover_hemp_products(task.get('params', {}))
        elif action == 'analyze_trends':
            return await self.analyze_industry_trends(task.get('params', {}))
        elif action == 'monitor_regulations':
            return await self.monitor_regulatory_changes(task.get('params', {}))
        elif action == 'research_competitors':
            return await self.research_competitors(task.get('params', {}))
        else:
            raise ValueError(f"Unknown research action: {action}")
    
    @rate_limited(calls=10, period=60)
    async def discover_hemp_products(self, params: Dict) -> Dict[str, Any]:
        """Discover new hemp products from various sources."""
        limit = params.get('limit', 20)
        categories = params.get('categories', ['all'])
        
        logger.info(f"Discovering hemp products: limit={limit}, categories={categories}")
        
        all_products = []
        
        # Scrape each source
        for source in self.sources:
            try:
                if source.get('rss'):
                    products = await self._scrape_rss_feed(source)
                else:
                    products = await self._scrape_website(source)
                
                all_products.extend(products)
                
            except Exception as e:
                logger.error(f"Error scraping {source['name']}: {e}")
                continue
        
        # Structure and validate products
        structured_products = []
        for raw_product in all_products[:limit]:
            try:
                structured = await self._structure_product_data(raw_product)
                if structured and self._validate_product_data(structured):
                    structured_products.append(structured)
            except Exception as e:
                logger.error(f"Error structuring product: {e}")
                continue
        
        # Save to database
        saved_count = await self._save_products_to_db(structured_products)
        
        return {
            'status': 'completed',
            'discovered_count': len(all_products),
            'structured_count': len(structured_products),
            'saved_count': saved_count,
            'products': structured_products[:10]  # Return sample
        }
    
    async def _scrape_rss_feed(self, source: Dict) -> List[Dict]:
        """Scrape products from RSS feed."""
        products = []
        
        try:
            feed = feedparser.parse(source['rss'])
            
            for entry in feed.entries[:20]:  # Limit to recent entries
                product_data = {
                    'source': source['name'],
                    'source_type': source['type'],
                    'title': entry.get('title', ''),
                    'description': entry.get('summary', ''),
                    'url': entry.get('link', ''),
                    'published_date': entry.get('published', ''),
                    'raw_content': entry.get('content', [{}])[0].get('value', '') if entry.get('content') else ''
                }
                products.append(product_data)
                
        except Exception as e:
            logger.error(f"RSS feed error for {source['name']}: {e}")
            
        return products
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def _scrape_website(self, source: Dict) -> List[Dict]:
        """Scrape products from website."""
        products = []
        
        if not self.session:
            self.session = aiohttp.ClientSession()
        
        try:
            async with self.session.get(source['url'], timeout=30) as response:
                if response.status == 200:
                    html = await response.text()
                    soup = BeautifulSoup(html, 'html.parser')
                    
                    # Find news/product items
                    selectors = source.get('selectors', {})
                    items = soup.select(selectors.get('news', '.item'))[:20]
                    
                    for item in items:
                        title_elem = item.select_one(selectors.get('title', 'h2'))
                        content_elem = item.select_one(selectors.get('content', '.content'))
                        
                        if title_elem:
                            product_data = {
                                'source': source['name'],
                                'source_type': source['type'],
                                'title': title_elem.get_text(strip=True),
                                'description': content_elem.get_text(strip=True) if content_elem else '',
                                'url': urljoin(source['url'], item.get('href', '')),
                                'raw_content': str(item)
                            }
                            products.append(product_data)
                            
        except Exception as e:
            logger.error(f"Website scraping error for {source['name']}: {e}")
            
        return products
    
    async def _structure_product_data(self, raw_data: Dict) -> Optional[Dict]:
        """Use AI to structure raw scraped data into product format."""
        prompt = f"""
        Extract hemp product information from this data and structure it for our database.
        
        Raw data:
        Title: {raw_data.get('title', '')}
        Description: {raw_data.get('description', '')}
        Content: {raw_data.get('raw_content', '')[:1000]}
        
        Extract and return as JSON:
        - name: Product name (clear and specific)
        - description: 2-3 sentence description
        - plant_part: One of [seeds, fiber, oil, flower, hurds, roots, leaves, biomass]
        - industry: Primary industry category
        - sub_industry: Specific sub-category
        - benefits_advantages: Array of 3-4 key benefits
        - sustainability_aspects: Array of 2-3 environmental benefits
        - technical_specifications: Object with relevant specs
        - commercialization_stage: One of [R&D, Pilot, Niche, Growing, Established]
        - potential_applications: Array of use cases
        
        If this doesn't appear to be about a specific hemp product, return null.
        """
        
        try:
            response, provider, cost = await self.ai_provider.generate(prompt, temperature=0.3)
            
            # Log AI usage
            await self._log_ai_usage('structure_product', cost)
            
            # Parse response
            if response.strip().lower() == 'null':
                return None
                
            structured = json.loads(response)
            
            # Add metadata
            structured['source_url'] = raw_data.get('url', '')
            structured['discovered_date'] = datetime.now().isoformat()
            structured['data_source'] = raw_data.get('source', '')
            
            return structured
            
        except json.JSONDecodeError:
            logger.error(f"Failed to parse AI response as JSON")
            return None
        except Exception as e:
            logger.error(f"Error structuring product data: {e}")
            return None
    
    def _validate_product_data(self, product: Dict) -> bool:
        """Validate structured product data."""
        required_fields = ['name', 'description', 'plant_part', 'industry']
        
        # Check required fields
        for field in required_fields:
            if not product.get(field):
                logger.warning(f"Product missing required field: {field}")
                return False
        
        # Validate plant part
        valid_plant_parts = ['seeds', 'fiber', 'oil', 'flower', 'hurds', 'roots', 'leaves', 'biomass']
        if product['plant_part'] not in valid_plant_parts:
            logger.warning(f"Invalid plant part: {product['plant_part']}")
            return False
        
        # Validate commercialization stage
        valid_stages = ['R&D', 'Pilot', 'Niche', 'Growing', 'Established']
        if product.get('commercialization_stage') and product['commercialization_stage'] not in valid_stages:
            logger.warning(f"Invalid commercialization stage: {product['commercialization_stage']}")
            return False
        
        return True
    
    async def _save_products_to_db(self, products: List[Dict]) -> int:
        """Save discovered products to database."""
        saved_count = 0
        
        for product in products:
            try:
                # Check if product already exists
                existing = await self.supabase.table('uses_products').select('id').eq('name', product['name']).execute()
                
                if not existing.data:
                    # Map to database schema
                    db_product = {
                        'name': product['name'],
                        'description': product['description'],
                        'plant_part': product['plant_part'],
                        'industry': product['industry'],
                        'sub_industry': product.get('sub_industry'),
                        'benefits_advantages': product.get('benefits_advantages', []),
                        'sustainability_aspects': product.get('sustainability_aspects', []),
                        'technical_specifications': product.get('technical_specifications', {}),
                        'commercialization_stage': product.get('commercialization_stage', 'R&D'),
                        'market_potential': product.get('market_potential'),
                        'source_urls': [product.get('source_url')] if product.get('source_url') else []
                    }
                    
                    # Insert into database
                    result = await self.supabase.table('uses_products').insert(db_product).execute()
                    
                    if result.data:
                        saved_count += 1
                        logger.info(f"Saved new product: {product['name']}")
                else:
                    logger.info(f"Product already exists: {product['name']}")
                    
            except Exception as e:
                logger.error(f"Error saving product {product['name']}: {e}")
                continue
        
        return saved_count
    
    @rate_limited(calls=5, period=60)
    async def analyze_industry_trends(self, params: Dict) -> Dict[str, Any]:
        """Analyze current hemp industry trends."""
        timeframe_days = params.get('timeframe_days', 30)
        
        logger.info(f"Analyzing industry trends for past {timeframe_days} days")
        
        # Fetch recent products
        since_date = (datetime.now() - timedelta(days=timeframe_days)).isoformat()
        
        recent_products = await self.supabase.table('uses_products')\
            .select('*')\
            .gte('created_at', since_date)\
            .execute()
        
        # Analyze trends using AI
        trends_analysis = await self._analyze_trends_with_ai(recent_products.data)
        
        # Save analysis
        analysis_record = {
            'analysis_type': 'trend_analysis',
            'market_segment': 'hemp_industry',
            'key_trends': trends_analysis.get('trends', []),
            'opportunities': trends_analysis.get('opportunities', []),
            'recommendations': trends_analysis.get('recommendations', []),
            'growth_rate': trends_analysis.get('growth_rate'),
            'confidence_level': trends_analysis.get('confidence', 0.7),
            'valid_until': (datetime.now() + timedelta(days=30)).isoformat()
        }
        
        await self.supabase.table('agent_market_analyses').insert(analysis_record).execute()
        
        return {
            'status': 'completed',
            'analysis': trends_analysis,
            'products_analyzed': len(recent_products.data),
            'timeframe_days': timeframe_days
        }
    
    async def _analyze_trends_with_ai(self, products: List[Dict]) -> Dict[str, Any]:
        """Use AI to analyze product trends."""
        # Prepare summary data
        plant_parts = {}
        industries = {}
        stages = {}
        
        for product in products:
            # Count plant parts
            part = product.get('plant_part')
            plant_parts[part] = plant_parts.get(part, 0) + 1
            
            # Count industries
            industry = product.get('industry')
            industries[industry] = industries.get(industry, 0) + 1
            
            # Count commercialization stages
            stage = product.get('commercialization_stage')
            stages[stage] = stages.get(stage, 0) + 1
        
        prompt = f"""
        Analyze these hemp industry trends based on {len(products)} recent products:
        
        Plant parts distribution: {json.dumps(plant_parts)}
        Industries distribution: {json.dumps(industries)}
        Commercialization stages: {json.dumps(stages)}
        
        Sample products: {json.dumps([p['name'] for p in products[:10]])}
        
        Provide analysis as JSON with:
        - trends: Array of 3-5 key trends observed
        - opportunities: Array of 2-3 market opportunities
        - recommendations: Array of 2-3 strategic recommendations
        - growth_rate: Estimated annual growth percentage
        - emerging_categories: Array of emerging product categories
        - declining_categories: Array of declining categories
        - confidence: Confidence level (0-1)
        """
        
        try:
            response, provider, cost = await self.ai_provider.generate(prompt, temperature=0.5)
            await self._log_ai_usage('analyze_trends', cost)
            
            return json.loads(response)
            
        except Exception as e:
            logger.error(f"Error analyzing trends: {e}")
            return {
                'trends': ['Unable to analyze trends due to error'],
                'opportunities': [],
                'recommendations': [],
                'growth_rate': 0,
                'confidence': 0.3
            }
    
    @track_performance
    async def monitor_regulatory_changes(self, params: Dict) -> Dict[str, Any]:
        """Monitor regulatory changes affecting hemp industry."""
        jurisdictions = params.get('jurisdictions', ['federal', 'state'])
        
        logger.info(f"Monitoring regulatory changes for: {jurisdictions}")
        
        # This would typically involve:
        # 1. Scraping government websites
        # 2. Monitoring regulatory RSS feeds
        # 3. Analyzing changes with AI
        
        # For now, return placeholder
        return {
            'status': 'completed',
            'changes_found': 0,
            'jurisdictions_checked': jurisdictions,
            'message': 'Regulatory monitoring not yet fully implemented'
        }
    
    async def research_competitors(self, params: Dict) -> Dict[str, Any]:
        """Research competitor products and strategies."""
        competitor_urls = params.get('competitor_urls', [])
        
        # Placeholder implementation
        return {
            'status': 'completed',
            'competitors_analyzed': len(competitor_urls),
            'message': 'Competitor research not yet fully implemented'
        }
    
    async def _log_ai_usage(self, operation: str, cost: float):
        """Log AI usage and costs."""
        await self.supabase.table('agent_performance_metrics').insert({
            'agent_name': 'research_agent',
            'metric_date': datetime.now().date().isoformat(),
            'total_cost_usd': cost,
            'metadata': {'operation': operation}
        }).execute()