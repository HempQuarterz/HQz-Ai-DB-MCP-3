"""
Monetization Agent for HempQuarterz
Identifies revenue opportunities and optimizes pricing strategies
"""

import asyncio
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple
import logging
from dataclasses import dataclass
import statistics
import numpy as np

from supabase import create_client, Client
import httpx

from ..core.base_agent import BaseAgent, rate_limited, track_performance
from ..utils.ai_providers import AIProvider
from .pricing_analyzer import PricingAnalyzer
from .product_analyzer import ProductAnalyzer

logger = logging.getLogger(__name__)

@dataclass
class MonetizationOpportunity:
    """Represents a monetization opportunity"""
    opportunity_id: str
    opportunity_type: str  # product, service, affiliate, subscription, marketplace
    name: str
    description: str
    market_size: float
    investment_required: float
    expected_revenue: float
    roi_percentage: float
    time_to_market: int  # days
    risk_level: str  # low, medium, high
    confidence_score: float
    implementation_steps: List[str]
    
@dataclass
class MarketGap:
    """Represents a gap in the market"""
    category: str
    subcategory: str
    gap_description: str
    demand_level: str  # low, medium, high, very_high
    competition_level: str  # low, medium, high
    estimated_market_value: float
    target_audience: str
    product_suggestions: List[Dict[str, Any]]

@dataclass
class PricingStrategy:
    """Represents a pricing strategy recommendation"""
    product_id: str
    product_name: str
    current_price: float
    recommended_price: float
    price_range: Tuple[float, float]
    strategy_type: str  # premium, competitive, penetration, skimming, bundle
    justification: str
    expected_revenue_change: float
    competitor_analysis: Dict[str, float]

class MonetizationAgent(BaseAgent):
    """Agent responsible for identifying and optimizing monetization opportunities"""
    
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config, "Monetization Agent")
        self.supabase_url = config.get('supabase_url')
        self.supabase_key = config.get('supabase_key')
        
        if self.supabase_url and self.supabase_key:
            self.supabase = create_client(self.supabase_url, self.supabase_key)
        else:
            self.supabase = None
            
        self.ai_provider = AIProvider()
        self.pricing_analyzer = PricingAnalyzer(config)
        self.product_analyzer = ProductAnalyzer(config)
    
    @track_performance
    @rate_limited(max_calls=10, window=3600)
    async def analyze_product_opportunities(
        self,
        market_data: Optional[Dict[str, Any]] = None,
        focus_areas: Optional[List[str]] = None
    ) -> List[MonetizationOpportunity]:
        """Analyze product opportunities based on market data and trends"""
        try:
            logger.info("Analyzing product monetization opportunities")
            
            # Get current products and their performance
            if self.supabase:
                products_data = await self._get_product_performance()
            else:
                products_data = []
            
            # Get market trends
            market_trends = await self._analyze_market_trends(focus_areas)
            
            opportunities = []
            
            # Analyze different opportunity types
            opportunity_types = [
                ("product_expansion", self._analyze_product_expansion),
                ("new_products", self._analyze_new_product_opportunities),
                ("service_offerings", self._analyze_service_opportunities),
                ("affiliate_programs", self._analyze_affiliate_opportunities),
                ("subscription_models", self._analyze_subscription_opportunities)
            ]
            
            for opp_type, analyzer_func in opportunity_types:
                opps = await analyzer_func(products_data, market_trends)
                opportunities.extend(opps)
            
            # Score and rank opportunities
            scored_opportunities = await self._score_opportunities(opportunities)
            
            # Sort by ROI and confidence
            scored_opportunities.sort(
                key=lambda x: (x.roi_percentage * x.confidence_score),
                reverse=True
            )
            
            # Store top opportunities in database
            if self.supabase:
                await self._store_opportunities(scored_opportunities[:20])
            
            logger.info(f"Found {len(scored_opportunities)} monetization opportunities")
            return scored_opportunities[:20]
            
        except Exception as e:
            logger.error(f"Error analyzing opportunities: {e}")
            await self._log_error("analyze_product_opportunities", str(e))
            return []
    
    @track_performance
    @rate_limited(max_calls=15, window=3600)
    async def identify_market_gaps(
        self,
        categories: Optional[List[str]] = None
    ) -> List[MarketGap]:
        """Identify gaps in the hemp market"""
        try:
            logger.info("Identifying market gaps")
            
            # Get existing products by category
            if self.supabase:
                existing_products = await self._get_products_by_category(categories)
            else:
                existing_products = {}
            
            # Analyze market demand vs supply
            market_gaps = []
            
            # Default categories if none provided
            if not categories:
                categories = [
                    "Textiles", "Construction", "Food & Beverages",
                    "Health & Wellness", "Cosmetics", "Industrial",
                    "Agriculture", "Automotive"
                ]
            
            for category in categories:
                gaps = await self._analyze_category_gaps(category, existing_products)
                market_gaps.extend(gaps)
            
            # Use AI to identify additional gaps
            ai_gaps = await self._ai_identify_gaps(existing_products, market_gaps)
            market_gaps.extend(ai_gaps)
            
            # Rank gaps by opportunity value
            market_gaps.sort(
                key=lambda x: self._calculate_gap_value(x),
                reverse=True
            )
            
            logger.info(f"Identified {len(market_gaps)} market gaps")
            return market_gaps
            
        except Exception as e:
            logger.error(f"Error identifying market gaps: {e}")
            await self._log_error("identify_market_gaps", str(e))
            return []
    
    @track_performance
    async def calculate_roi_potential(
        self,
        opportunity: Dict[str, Any],
        time_horizon: int = 365  # days
    ) -> Dict[str, Any]:
        """Calculate detailed ROI potential for an opportunity"""
        try:
            logger.info(f"Calculating ROI for opportunity: {opportunity.get('name')}")
            
            # Extract key metrics
            investment = float(opportunity.get('investment_required', 0))
            revenue_per_month = float(opportunity.get('expected_monthly_revenue', 0))
            costs_per_month = float(opportunity.get('expected_monthly_costs', 0))
            
            # Calculate cash flows
            months = time_horizon // 30
            cash_flows = []
            cumulative_profit = -investment
            
            for month in range(months):
                monthly_profit = revenue_per_month - costs_per_month
                
                # Apply growth/decay factors
                if month < 6:
                    # Ramp-up period
                    monthly_profit *= (month + 1) / 6
                
                cash_flows.append(monthly_profit)
                cumulative_profit += monthly_profit
            
            # Calculate metrics
            total_revenue = sum(cash_flows) + (revenue_per_month * months)
            total_profit = sum(cash_flows)
            roi_percentage = (total_profit / investment * 100) if investment > 0 else 0
            payback_period = self._calculate_payback_period(investment, cash_flows)
            
            # Calculate NPV with 10% discount rate
            npv = self._calculate_npv(investment, cash_flows, 0.10)
            
            return {
                "opportunity_name": opportunity.get('name'),
                "investment_required": investment,
                "total_revenue": total_revenue,
                "total_profit": total_profit,
                "roi_percentage": roi_percentage,
                "payback_period_months": payback_period,
                "npv": npv,
                "monthly_cash_flows": cash_flows[:12],  # First year
                "break_even_month": self._find_break_even(investment, cash_flows)
            }
            
        except Exception as e:
            logger.error(f"Error calculating ROI: {e}")
            return {
                "error": str(e),
                "roi_percentage": 0
            }
    
    @track_performance
    @rate_limited(max_calls=20, window=3600)
    async def suggest_pricing_strategies(
        self,
        product_ids: Optional[List[str]] = None
    ) -> List[PricingStrategy]:
        """Suggest optimal pricing strategies for products"""
        try:
            logger.info("Generating pricing strategy suggestions")
            
            # Get products to analyze
            if self.supabase:
                if product_ids:
                    products = await self._get_products_by_ids(product_ids)
                else:
                    products = await self._get_all_products()
            else:
                products = []
            
            pricing_strategies = []
            
            for product in products[:50]:  # Limit to 50 products
                # Analyze competitors
                competitor_prices = await self.pricing_analyzer.get_competitor_prices(
                    product['name'],
                    product.get('category', '')
                )
                
                # Analyze price sensitivity
                price_sensitivity = await self._analyze_price_sensitivity(
                    product,
                    competitor_prices
                )
                
                # Generate pricing recommendation
                strategy = await self._generate_pricing_strategy(
                    product,
                    competitor_prices,
                    price_sensitivity
                )
                
                if strategy:
                    pricing_strategies.append(strategy)
            
            # Sort by expected revenue change
            pricing_strategies.sort(
                key=lambda x: x.expected_revenue_change,
                reverse=True
            )
            
            # Store recommendations
            if self.supabase:
                await self._store_pricing_strategies(pricing_strategies)
            
            logger.info(f"Generated {len(pricing_strategies)} pricing strategies")
            return pricing_strategies
            
        except Exception as e:
            logger.error(f"Error suggesting pricing strategies: {e}")
            await self._log_error("suggest_pricing_strategies", str(e))
            return []
    
    @track_performance
    async def track_revenue_opportunities(
        self,
        time_period: str = "30d"
    ) -> Dict[str, Any]:
        """Track and analyze revenue opportunities over time"""
        try:
            logger.info(f"Tracking revenue opportunities for {time_period}")
            
            if not self.supabase:
                return {"error": "Database not connected"}
            
            # Parse time period
            days = int(time_period.replace('d', ''))
            start_date = datetime.utcnow() - timedelta(days=days)
            
            # Get opportunities from database
            opportunities = self.supabase.table('agent_monetization_opportunities')\
                .select('*')\
                .gte('created_at', start_date.isoformat())\
                .execute()
            
            # Analyze opportunities
            total_potential_revenue = 0
            total_investment_required = 0
            opportunities_by_type = {}
            opportunities_by_risk = {}
            
            for opp in opportunities.data:
                total_potential_revenue += opp.get('expected_revenue', 0)
                total_investment_required += opp.get('investment_required', 0)
                
                # Group by type
                opp_type = opp.get('opportunity_type', 'unknown')
                if opp_type not in opportunities_by_type:
                    opportunities_by_type[opp_type] = {
                        'count': 0,
                        'total_revenue': 0,
                        'avg_roi': 0
                    }
                
                opportunities_by_type[opp_type]['count'] += 1
                opportunities_by_type[opp_type]['total_revenue'] += opp.get('expected_revenue', 0)
                
                # Group by risk
                risk_level = opp.get('risk_level', 'medium')
                if risk_level not in opportunities_by_risk:
                    opportunities_by_risk[risk_level] = 0
                opportunities_by_risk[risk_level] += 1
            
            # Calculate averages
            for opp_type in opportunities_by_type:
                count = opportunities_by_type[opp_type]['count']
                if count > 0:
                    opportunities_by_type[opp_type]['avg_revenue'] = (
                        opportunities_by_type[opp_type]['total_revenue'] / count
                    )
            
            # Get implementation status
            implemented = len([o for o in opportunities.data if o.get('status') == 'implemented'])
            in_progress = len([o for o in opportunities.data if o.get('status') == 'in_progress'])
            
            return {
                "period": time_period,
                "total_opportunities": len(opportunities.data),
                "total_potential_revenue": total_potential_revenue,
                "total_investment_required": total_investment_required,
                "average_roi": (total_potential_revenue / total_investment_required * 100) if total_investment_required > 0 else 0,
                "opportunities_by_type": opportunities_by_type,
                "opportunities_by_risk": opportunities_by_risk,
                "implementation_status": {
                    "implemented": implemented,
                    "in_progress": in_progress,
                    "pending": len(opportunities.data) - implemented - in_progress
                },
                "top_opportunities": sorted(
                    opportunities.data,
                    key=lambda x: x.get('roi_percentage', 0) * x.get('confidence_score', 0),
                    reverse=True
                )[:5]
            }
            
        except Exception as e:
            logger.error(f"Error tracking revenue opportunities: {e}")
            await self._log_error("track_revenue_opportunities", str(e))
            return {"error": str(e)}
    
    # Helper methods
    async def _get_product_performance(self) -> List[Dict[str, Any]]:
        """Get product performance data from database"""
        try:
            # This would connect to analytics/sales data
            # For now, return mock data
            return [
                {
                    "product_id": "prod_1",
                    "name": "Hemp Fiber Textile",
                    "category": "Textiles",
                    "current_revenue": 50000,
                    "growth_rate": 0.15,
                    "margin": 0.35
                }
            ]
        except Exception as e:
            logger.error(f"Error getting product performance: {e}")
            return []
    
    async def _analyze_market_trends(self, focus_areas: Optional[List[str]]) -> Dict[str, Any]:
        """Analyze current market trends"""
        try:
            prompt = f"""
            Analyze current market trends in the hemp industry, focusing on:
            {', '.join(focus_areas) if focus_areas else 'all sectors'}
            
            Provide insights on:
            1. Growing market segments
            2. Emerging technologies
            3. Consumer preferences
            4. Regulatory changes
            5. Investment trends
            
            Format as JSON with trend_name, growth_rate, and opportunity_level.
            """
            
            response, tokens, cost = await self.ai_provider.generate(
                prompt,
                temperature=0.5,
                max_tokens=500
            )
            
            # Parse response
            try:
                # Extract JSON from response
                import re
                json_match = re.search(r'\{[\s\S]*\}', response)
                if json_match:
                    return json.loads(json_match.group())
            except:
                pass
            
            return {
                "trends": [
                    {
                        "name": "Sustainable Construction Materials",
                        "growth_rate": 0.25,
                        "opportunity_level": "high"
                    },
                    {
                        "name": "Hemp-based Foods",
                        "growth_rate": 0.20,
                        "opportunity_level": "medium"
                    }
                ]
            }
            
        except Exception as e:
            logger.error(f"Error analyzing market trends: {e}")
            return {"trends": []}
    
    async def _analyze_product_expansion(
        self,
        products_data: List[Dict[str, Any]],
        market_trends: Dict[str, Any]
    ) -> List[MonetizationOpportunity]:
        """Analyze opportunities for expanding existing products"""
        opportunities = []
        
        for product in products_data:
            # Check if product aligns with growing trends
            for trend in market_trends.get('trends', []):
                if trend['opportunity_level'] in ['high', 'very_high']:
                    opp = MonetizationOpportunity(
                        opportunity_id=f"expand_{product['product_id']}_{trend['name']}",
                        opportunity_type="product_expansion",
                        name=f"Expand {product['name']} into {trend['name']}",
                        description=f"Leverage existing {product['name']} to enter {trend['name']} market",
                        market_size=1000000 * trend.get('growth_rate', 1),
                        investment_required=50000,
                        expected_revenue=200000,
                        roi_percentage=300,
                        time_to_market=90,
                        risk_level="low",
                        confidence_score=0.8,
                        implementation_steps=[
                            "Market research",
                            "Product adaptation",
                            "Pilot testing",
                            "Full launch"
                        ]
                    )
                    opportunities.append(opp)
        
        return opportunities
    
    async def _analyze_new_product_opportunities(
        self,
        products_data: List[Dict[str, Any]],
        market_trends: Dict[str, Any]
    ) -> List[MonetizationOpportunity]:
        """Identify new product opportunities"""
        # Use AI to suggest new products based on trends
        prompt = """
        Based on current hemp industry trends, suggest 5 innovative product ideas with:
        - Product name
        - Target market
        - Estimated development cost
        - Revenue potential
        - Unique value proposition
        """
        
        try:
            response, tokens, cost = await self.ai_provider.generate(
                prompt,
                temperature=0.7,
                max_tokens=400
            )
            
            # Create opportunities from AI suggestions
            # This is simplified - in production, parse structured response
            return [
                MonetizationOpportunity(
                    opportunity_id="new_prod_1",
                    opportunity_type="new_product",
                    name="Hemp-based Battery Components",
                    description="Sustainable battery materials using hemp fibers",
                    market_size=5000000,
                    investment_required=200000,
                    expected_revenue=1000000,
                    roi_percentage=400,
                    time_to_market=180,
                    risk_level="medium",
                    confidence_score=0.7,
                    implementation_steps=[
                        "R&D partnership",
                        "Prototype development",
                        "Testing & certification",
                        "Manufacturing setup",
                        "Market launch"
                    ]
                )
            ]
        except Exception as e:
            logger.error(f"Error analyzing new products: {e}")
            return []
    
    async def _analyze_service_opportunities(
        self,
        products_data: List[Dict[str, Any]],
        market_trends: Dict[str, Any]
    ) -> List[MonetizationOpportunity]:
        """Identify service-based opportunities"""
        return [
            MonetizationOpportunity(
                opportunity_id="service_consulting",
                opportunity_type="service",
                name="Hemp Industry Consulting Services",
                description="B2B consulting for hemp businesses",
                market_size=2000000,
                investment_required=20000,
                expected_revenue=300000,
                roi_percentage=1400,
                time_to_market=30,
                risk_level="low",
                confidence_score=0.9,
                implementation_steps=[
                    "Develop service packages",
                    "Create marketing materials",
                    "Build expert network",
                    "Launch services"
                ]
            )
        ]
    
    async def _analyze_affiliate_opportunities(
        self,
        products_data: List[Dict[str, Any]],
        market_trends: Dict[str, Any]
    ) -> List[MonetizationOpportunity]:
        """Identify affiliate marketing opportunities"""
        return [
            MonetizationOpportunity(
                opportunity_id="affiliate_program",
                opportunity_type="affiliate",
                name="Hemp Products Affiliate Network",
                description="Create affiliate program for hemp products",
                market_size=500000,
                investment_required=10000,
                expected_revenue=100000,
                roi_percentage=900,
                time_to_market=45,
                risk_level="low",
                confidence_score=0.85,
                implementation_steps=[
                    "Setup affiliate platform",
                    "Recruit affiliates",
                    "Create promotional materials",
                    "Launch program"
                ]
            )
        ]
    
    async def _analyze_subscription_opportunities(
        self,
        products_data: List[Dict[str, Any]],
        market_trends: Dict[str, Any]
    ) -> List[MonetizationOpportunity]:
        """Identify subscription model opportunities"""
        return [
            MonetizationOpportunity(
                opportunity_id="subscription_box",
                opportunity_type="subscription",
                name="Hemp Wellness Subscription Box",
                description="Monthly curated hemp product subscription",
                market_size=3000000,
                investment_required=50000,
                expected_revenue=600000,
                roi_percentage=1100,
                time_to_market=60,
                risk_level="medium",
                confidence_score=0.75,
                implementation_steps=[
                    "Product curation",
                    "Subscription platform setup",
                    "Fulfillment partnerships",
                    "Marketing campaign",
                    "Launch"
                ]
            )
        ]
    
    async def _score_opportunities(
        self,
        opportunities: List[MonetizationOpportunity]
    ) -> List[MonetizationOpportunity]:
        """Score and validate opportunities"""
        for opp in opportunities:
            # Adjust confidence based on risk
            risk_multipliers = {
                "low": 1.0,
                "medium": 0.8,
                "high": 0.6
            }
            opp.confidence_score *= risk_multipliers.get(opp.risk_level, 0.7)
            
            # Validate ROI calculation
            if opp.investment_required > 0:
                calculated_roi = ((opp.expected_revenue - opp.investment_required) / 
                                opp.investment_required * 100)
                opp.roi_percentage = calculated_roi
        
        return opportunities
    
    def _calculate_gap_value(self, gap: MarketGap) -> float:
        """Calculate the value of a market gap"""
        demand_scores = {"low": 0.2, "medium": 0.5, "high": 0.8, "very_high": 1.0}
        competition_scores = {"low": 1.0, "medium": 0.7, "high": 0.4}
        
        demand_score = demand_scores.get(gap.demand_level, 0.5)
        competition_score = competition_scores.get(gap.competition_level, 0.5)
        
        return gap.estimated_market_value * demand_score * competition_score
    
    def _calculate_payback_period(self, investment: float, cash_flows: List[float]) -> float:
        """Calculate payback period in months"""
        cumulative = 0
        for i, cf in enumerate(cash_flows):
            cumulative += cf
            if cumulative >= investment:
                return i + 1
        return len(cash_flows)
    
    def _calculate_npv(self, investment: float, cash_flows: List[float], discount_rate: float) -> float:
        """Calculate Net Present Value"""
        npv = -investment
        monthly_rate = discount_rate / 12
        
        for i, cf in enumerate(cash_flows):
            npv += cf / ((1 + monthly_rate) ** (i + 1))
        
        return npv
    
    def _find_break_even(self, investment: float, cash_flows: List[float]) -> int:
        """Find break-even month"""
        cumulative = -investment
        for i, cf in enumerate(cash_flows):
            cumulative += cf
            if cumulative >= 0:
                return i + 1
        return -1
    
    async def _store_opportunities(self, opportunities: List[MonetizationOpportunity]):
        """Store opportunities in database"""
        if not self.supabase:
            return
        
        for opp in opportunities:
            try:
                self.supabase.table('agent_monetization_opportunities').insert({
                    'opportunity_id': opp.opportunity_id,
                    'opportunity_type': opp.opportunity_type,
                    'name': opp.name,
                    'description': opp.description,
                    'market_size': opp.market_size,
                    'investment_required': opp.investment_required,
                    'expected_revenue': opp.expected_revenue,
                    'roi_percentage': opp.roi_percentage,
                    'time_to_market': opp.time_to_market,
                    'risk_level': opp.risk_level,
                    'confidence_score': opp.confidence_score,
                    'implementation_steps': opp.implementation_steps,
                    'status': 'identified',
                    'created_at': datetime.utcnow().isoformat()
                }).execute()
            except Exception as e:
                logger.error(f"Error storing opportunity: {e}")
    
    async def _store_pricing_strategies(self, strategies: List[PricingStrategy]):
        """Store pricing strategies in database"""
        if not self.supabase:
            return
        
        for strategy in strategies:
            try:
                # Store in a pricing recommendations table
                # This would need to be added to the database schema
                logger.info(f"Would store pricing strategy for {strategy.product_name}")
            except Exception as e:
                logger.error(f"Error storing pricing strategy: {e}")
    
    async def _get_products_by_category(self, categories: Optional[List[str]]) -> Dict[str, List[Dict]]:
        """Get products grouped by category"""
        if not self.supabase:
            return {}
        
        try:
            query = self.supabase.table('uses_products').select('*')
            if categories:
                # Note: This would need proper filtering logic
                pass
            
            result = query.execute()
            
            # Group by category
            grouped = {}
            for product in result.data:
                category = product.get('category', 'Unknown')
                if category not in grouped:
                    grouped[category] = []
                grouped[category].append(product)
            
            return grouped
            
        except Exception as e:
            logger.error(f"Error getting products by category: {e}")
            return {}
    
    async def _analyze_category_gaps(
        self,
        category: str,
        existing_products: Dict[str, List[Dict]]
    ) -> List[MarketGap]:
        """Analyze gaps in a specific category"""
        category_products = existing_products.get(category, [])
        
        # Use AI to identify gaps
        prompt = f"""
        Analyze the {category} category in the hemp industry.
        Existing products: {len(category_products)}
        
        Identify 3 market gaps or underserved areas with:
        - Gap description
        - Demand level (low/medium/high/very_high)
        - Competition level (low/medium/high)
        - Target audience
        - Estimated market value
        """
        
        try:
            response, tokens, cost = await self.ai_provider.generate(
                prompt,
                temperature=0.6,
                max_tokens=300
            )
            
            # Create market gap from response
            # This is simplified - in production, parse structured response
            return [
                MarketGap(
                    category=category,
                    subcategory=f"{category} Innovation",
                    gap_description=f"Advanced {category.lower()} solutions using hemp",
                    demand_level="high",
                    competition_level="low",
                    estimated_market_value=1000000,
                    target_audience="B2B manufacturers",
                    product_suggestions=[
                        {
                            "name": f"Hemp-based {category} Component",
                            "description": "Innovative solution for the industry",
                            "potential_revenue": 500000
                        }
                    ]
                )
            ]
            
        except Exception as e:
            logger.error(f"Error analyzing category gaps: {e}")
            return []
    
    async def _ai_identify_gaps(
        self,
        existing_products: Dict[str, List[Dict]],
        current_gaps: List[MarketGap]
    ) -> List[MarketGap]:
        """Use AI to identify additional market gaps"""
        # This would use AI to find gaps not covered by category analysis
        return []
    
    async def _get_products_by_ids(self, product_ids: List[str]) -> List[Dict[str, Any]]:
        """Get specific products by IDs"""
        if not self.supabase:
            return []
        
        try:
            result = self.supabase.table('uses_products')\
                .select('*')\
                .in_('id', product_ids)\
                .execute()
            return result.data
        except Exception as e:
            logger.error(f"Error getting products by IDs: {e}")
            return []
    
    async def _get_all_products(self) -> List[Dict[str, Any]]:
        """Get all products from database"""
        if not self.supabase:
            return []
        
        try:
            result = self.supabase.table('uses_products')\
                .select('*')\
                .limit(100)\
                .execute()
            return result.data
        except Exception as e:
            logger.error(f"Error getting all products: {e}")
            return []
    
    async def _analyze_price_sensitivity(
        self,
        product: Dict[str, Any],
        competitor_prices: List[float]
    ) -> Dict[str, Any]:
        """Analyze price sensitivity for a product"""
        # Simple elasticity estimation
        current_price = product.get('price', 0)
        
        if not competitor_prices:
            return {"elasticity": -1.0, "optimal_range": (current_price * 0.9, current_price * 1.1)}
        
        avg_competitor_price = statistics.mean(competitor_prices)
        price_variance = statistics.variance(competitor_prices) if len(competitor_prices) > 1 else 0
        
        # Estimate elasticity based on price variance and position
        if current_price < avg_competitor_price * 0.8:
            elasticity = -0.5  # Less sensitive, already low
        elif current_price > avg_competitor_price * 1.2:
            elasticity = -2.0  # More sensitive, already high
        else:
            elasticity = -1.0  # Normal sensitivity
        
        return {
            "elasticity": elasticity,
            "optimal_range": (
                avg_competitor_price * 0.95,
                avg_competitor_price * 1.05
            ),
            "competitor_avg": avg_competitor_price,
            "price_variance": price_variance
        }
    
    async def _generate_pricing_strategy(
        self,
        product: Dict[str, Any],
        competitor_prices: List[float],
        price_sensitivity: Dict[str, Any]
    ) -> Optional[PricingStrategy]:
        """Generate optimal pricing strategy for a product"""
        current_price = product.get('price', 0)
        if current_price == 0:
            return None
        
        # Determine strategy type based on market position
        competitor_avg = price_sensitivity.get('competitor_avg', current_price)
        
        if current_price < competitor_avg * 0.7:
            strategy_type = "penetration"
            recommended_price = current_price * 1.15  # Gradual increase
        elif current_price > competitor_avg * 1.3:
            strategy_type = "premium"
            recommended_price = current_price  # Maintain premium
        else:
            strategy_type = "competitive"
            recommended_price = competitor_avg
        
        # Calculate expected revenue change
        elasticity = price_sensitivity.get('elasticity', -1.0)
        price_change_pct = (recommended_price - current_price) / current_price
        quantity_change_pct = elasticity * price_change_pct
        revenue_change_pct = (1 + price_change_pct) * (1 + quantity_change_pct) - 1
        
        return PricingStrategy(
            product_id=product.get('id', ''),
            product_name=product.get('name', ''),
            current_price=current_price,
            recommended_price=recommended_price,
            price_range=price_sensitivity.get('optimal_range', (current_price * 0.9, current_price * 1.1)),
            strategy_type=strategy_type,
            justification=f"Based on competitor analysis and {strategy_type} strategy",
            expected_revenue_change=revenue_change_pct,
            competitor_analysis={
                "average": competitor_avg,
                "min": min(competitor_prices) if competitor_prices else current_price,
                "max": max(competitor_prices) if competitor_prices else current_price
            }
        )