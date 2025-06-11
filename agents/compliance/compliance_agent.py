"""
Compliance Agent for HempQuarterz
Monitors regulatory changes and ensures platform compliance
"""

import asyncio
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import logging
from dataclasses import dataclass
import re

from supabase import create_client, Client
import httpx
from bs4 import BeautifulSoup

from ..core.base_agent import BaseAgent, rate_limited, track_performance
from ..utils.ai_utils import get_ai_client, AIProvider

logger = logging.getLogger(__name__)

@dataclass
class ComplianceCheck:
    """Represents a compliance check result"""
    jurisdiction: str
    regulation_type: str
    status: str  # 'compliant', 'non_compliant', 'warning'
    details: str
    affected_products: List[str]
    severity: str  # 'critical', 'high', 'medium', 'low'
    action_required: Optional[str] = None
    deadline: Optional[datetime] = None

@dataclass
class PlatformPolicy:
    """Represents a platform's policy"""
    platform: str
    policy_name: str
    requirements: Dict[str, Any]
    last_checked: datetime
    next_check: datetime

class ComplianceAgent(BaseAgent):
    """Agent responsible for monitoring regulations and ensuring compliance"""
    
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config, "Compliance Agent")
        self.supabase_url = config.get('supabase_url')
        self.supabase_key = config.get('supabase_key')
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
        self.platform_apis = {
            'stripe': config.get('stripe_api_key'),
            'amazon': config.get('amazon_mws_key'),
            'shopify': config.get('shopify_api_key')
        }
        self.email_service = config.get('email_service')
        self.slack_webhook = config.get('slack_webhook_url')
        
    @track_performance
    @rate_limited(calls_per_minute=10)
    async def monitor_regulatory_changes(self) -> List[Dict[str, Any]]:
        """Monitor for updates to hemp/CBD regulations"""
        try:
            logger.info("Monitoring regulatory changes...")
            changes = []
            
            # Get list of jurisdictions to monitor
            jurisdictions = await self._get_monitored_jurisdictions()
            
            for jurisdiction in jurisdictions:
                # Check for updates from regulatory sources
                jurisdiction_changes = await self._check_jurisdiction_updates(jurisdiction)
                if jurisdiction_changes:
                    changes.extend(jurisdiction_changes)
                    
            # Analyze changes for impact
            if changes:
                impact_analysis = await self._analyze_regulatory_impact(changes)
                await self._store_regulatory_updates(changes, impact_analysis)
                await self._send_regulatory_alerts(impact_analysis)
                
            return changes
            
        except Exception as e:
            logger.error(f"Error monitoring regulatory changes: {str(e)}")
            raise
            
    @track_performance
    @rate_limited(calls_per_minute=5)
    async def check_platform_compliance(self, platform: str = None) -> List[ComplianceCheck]:
        """Check compliance with platform policies (Stripe, Amazon, Shopify)"""
        try:
            platforms_to_check = [platform] if platform else ['stripe', 'amazon', 'shopify']
            compliance_results = []
            
            for platform_name in platforms_to_check:
                logger.info(f"Checking {platform_name} compliance...")
                
                if platform_name == 'stripe':
                    results = await self._check_stripe_compliance()
                elif platform_name == 'amazon':
                    results = await self._check_amazon_compliance()
                elif platform_name == 'shopify':
                    results = await self._check_shopify_compliance()
                else:
                    continue
                    
                compliance_results.extend(results)
                
            # Store compliance results
            await self._store_compliance_results(compliance_results)
            
            # Send alerts for non-compliant items
            critical_issues = [r for r in compliance_results if r.status == 'non_compliant']
            if critical_issues:
                await self._send_compliance_alerts(critical_issues)
                
            return compliance_results
            
        except Exception as e:
            logger.error(f"Error checking platform compliance: {str(e)}")
            raise
            
    @track_performance
    async def analyze_product_compliance(self, product_id: Optional[str] = None) -> List[ComplianceCheck]:
        """Analyze products for compliance with regulations"""
        try:
            # Get products to analyze
            if product_id:
                products = await self._get_product_by_id(product_id)
            else:
                products = await self._get_all_active_products()
                
            compliance_results = []
            
            for product in products:
                logger.info(f"Analyzing compliance for product: {product['name']}")
                
                # Check THC limits by jurisdiction
                thc_compliance = await self._check_thc_compliance(product)
                compliance_results.extend(thc_compliance)
                
                # Check Novel Food status for EU
                if self._ships_to_eu(product):
                    eu_compliance = await self._check_eu_novel_food(product)
                    compliance_results.extend(eu_compliance)
                    
                # Check state-specific US requirements
                us_compliance = await self._check_us_state_compliance(product)
                compliance_results.extend(us_compliance)
                
                # Check labeling requirements
                labeling_compliance = await self._check_labeling_requirements(product)
                compliance_results.extend(labeling_compliance)
                
            return compliance_results
            
        except Exception as e:
            logger.error(f"Error analyzing product compliance: {str(e)}")
            raise
            
    @track_performance
    async def generate_compliance_report(self, 
                                       period: str = 'monthly',
                                       jurisdiction: Optional[str] = None) -> Dict[str, Any]:
        """Generate comprehensive compliance status report"""
        try:
            logger.info(f"Generating {period} compliance report...")
            
            # Determine report period
            end_date = datetime.utcnow()
            if period == 'weekly':
                start_date = end_date - timedelta(days=7)
            elif period == 'monthly':
                start_date = end_date - timedelta(days=30)
            elif period == 'quarterly':
                start_date = end_date - timedelta(days=90)
            else:
                start_date = end_date - timedelta(days=30)
                
            # Gather compliance data
            compliance_data = await self._gather_compliance_data(start_date, end_date, jurisdiction)
            
            # Generate report sections
            report = {
                'period': {
                    'start': start_date.isoformat(),
                    'end': end_date.isoformat()
                },
                'summary': await self._generate_compliance_summary(compliance_data),
                'regulatory_updates': await self._get_regulatory_updates(start_date, end_date),
                'platform_compliance': await self._get_platform_compliance_status(),
                'product_compliance': await self._get_product_compliance_summary(compliance_data),
                'violations': await self._get_compliance_violations(start_date, end_date),
                'upcoming_changes': await self._get_upcoming_regulatory_changes(),
                'recommendations': await self._generate_compliance_recommendations(compliance_data),
                'generated_at': datetime.utcnow().isoformat()
            }
            
            # Store report
            await self._store_compliance_report(report)
            
            # Use AI to generate executive summary
            ai_client = get_ai_client(AIProvider.CLAUDE)
            executive_summary = await ai_client.generate_text(
                f"""Generate an executive summary for this compliance report:
                {json.dumps(report, indent=2)}
                
                Focus on:
                1. Key compliance risks
                2. Critical action items
                3. Overall compliance health
                4. Strategic recommendations
                
                Keep it concise but comprehensive."""
            )
            
            report['executive_summary'] = executive_summary
            
            return report
            
        except Exception as e:
            logger.error(f"Error generating compliance report: {str(e)}")
            raise
            
    @track_performance
    async def send_compliance_alerts(self, alerts: List[ComplianceCheck]) -> Dict[str, Any]:
        """Send alerts about compliance violations or changes"""
        try:
            alert_results = {
                'email_sent': 0,
                'slack_sent': 0,
                'database_stored': 0,
                'errors': []
            }
            
            for alert in alerts:
                # Prioritize alerts by severity
                if alert.severity in ['critical', 'high']:
                    # Send immediate notifications
                    try:
                        # Email alert
                        if self.email_service:
                            await self._send_email_alert(alert)
                            alert_results['email_sent'] += 1
                            
                        # Slack alert
                        if self.slack_webhook:
                            await self._send_slack_alert(alert)
                            alert_results['slack_sent'] += 1
                            
                    except Exception as e:
                        alert_results['errors'].append(f"Failed to send alert: {str(e)}")
                        
                # Store all alerts in database
                await self._store_compliance_alert(alert)
                alert_results['database_stored'] += 1
                
            return alert_results
            
        except Exception as e:
            logger.error(f"Error sending compliance alerts: {str(e)}")
            raise
            
    # Helper methods
    async def _get_monitored_jurisdictions(self) -> List[Dict[str, Any]]:
        """Get list of jurisdictions to monitor"""
        result = self.supabase.table('regulatory_jurisdictions').select('*').eq('active', True).execute()
        return result.data
        
    async def _check_jurisdiction_updates(self, jurisdiction: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Check for regulatory updates in a specific jurisdiction"""
        # This would integrate with regulatory APIs or web scraping
        # For now, returns mock data
        return []
        
    async def _check_stripe_compliance(self) -> List[ComplianceCheck]:
        """Check Stripe payment processing compliance"""
        compliance_checks = []
        
        # Check high-risk indicator keywords
        products = await self._get_all_active_products()
        
        for product in products:
            # Stripe restricted terms
            restricted_terms = ['cure', 'treat', 'medical', 'prescription', 'FDA']
            description_lower = product.get('description', '').lower()
            
            violations = [term for term in restricted_terms if term in description_lower]
            
            if violations:
                compliance_checks.append(ComplianceCheck(
                    jurisdiction='stripe',
                    regulation_type='payment_processing',
                    status='warning',
                    details=f"Product contains restricted terms: {', '.join(violations)}",
                    affected_products=[product['id']],
                    severity='medium',
                    action_required=f"Remove restricted terms from product description"
                ))
                
        return compliance_checks
        
    async def _check_amazon_compliance(self) -> List[ComplianceCheck]:
        """Check Amazon marketplace compliance"""
        compliance_checks = []
        
        # Amazon specific CBD/Hemp rules
        # Check for required disclaimers, THC content claims, etc.
        
        return compliance_checks
        
    async def _check_shopify_compliance(self) -> List[ComplianceCheck]:
        """Check Shopify platform compliance"""
        compliance_checks = []
        
        # Shopify CBD/Hemp policies
        # Check for proper categorization, required pages, etc.
        
        return compliance_checks
        
    async def _check_thc_compliance(self, product: Dict[str, Any]) -> List[ComplianceCheck]:
        """Check THC content compliance by jurisdiction"""
        compliance_checks = []
        
        thc_content = product.get('thc_percentage', 0)
        
        # US Federal limit
        if thc_content > 0.3:
            compliance_checks.append(ComplianceCheck(
                jurisdiction='US Federal',
                regulation_type='thc_limit',
                status='non_compliant',
                details=f"THC content {thc_content}% exceeds federal limit of 0.3%",
                affected_products=[product['id']],
                severity='critical',
                action_required="Reduce THC content or restrict sales"
            ))
            
        return compliance_checks
        
    async def _get_all_active_products(self) -> List[Dict[str, Any]]:
        """Get all active products from database"""
        result = self.supabase.table('products').select('*').eq('status', 'active').execute()
        return result.data
        
    async def _store_compliance_results(self, results: List[ComplianceCheck]):
        """Store compliance check results in database"""
        for result in results:
            data = {
                'jurisdiction': result.jurisdiction,
                'regulation_type': result.regulation_type,
                'status': result.status,
                'details': result.details,
                'affected_products': result.affected_products,
                'severity': result.severity,
                'action_required': result.action_required,
                'checked_at': datetime.utcnow().isoformat()
            }
            self.supabase.table('agent_compliance_alerts').insert(data).execute()
            
    def _ships_to_eu(self, product: Dict[str, Any]) -> bool:
        """Check if product ships to EU countries"""
        shipping_regions = product.get('shipping_regions', [])
        eu_countries = ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'PL']
        return any(country in shipping_regions for country in eu_countries)


if __name__ == "__main__":
    # Test the compliance agent
    import os
    from dotenv import load_dotenv
    
    load_dotenv()
    
    config = {
        'supabase_url': os.getenv('SUPABASE_URL'),
        'supabase_key': os.getenv('SUPABASE_SERVICE_KEY'),
        'anthropic_api_key': os.getenv('ANTHROPIC_API_KEY'),
        'stripe_api_key': os.getenv('STRIPE_API_KEY'),
        'email_service': os.getenv('SENDGRID_API_KEY'),
        'slack_webhook_url': os.getenv('SLACK_WEBHOOK_URL')
    }
    
    agent = ComplianceAgent(config)
    
    # Test compliance monitoring
    asyncio.run(agent.monitor_regulatory_changes())