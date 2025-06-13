"""
Outreach Agent for HempQuarterz
Manages partnerships, outreach campaigns, and relationship building
"""

import asyncio
import json
import re
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple
import logging
from dataclasses import dataclass
from urllib.parse import urlparse
import uuid

from supabase import create_client, Client
import httpx
from bs4 import BeautifulSoup

from ..core.base_agent import BaseAgent, rate_limited, track_performance
from ..utils.ai_providers import AIProvider
from .contact_finder import ContactFinder
from .email_templates import EmailTemplateGenerator

logger = logging.getLogger(__name__)

@dataclass
class OutreachOpportunity:
    """Represents a potential partnership or outreach opportunity"""
    company_name: str
    website: str
    industry: str
    contact_person: Optional[str] = None
    contact_email: Optional[str] = None
    opportunity_type: str = "partnership"  # partnership, supplier, distributor, investor
    score: float = 0.0
    notes: str = ""
    
@dataclass
class EmailCampaign:
    """Represents an email outreach campaign"""
    campaign_id: str
    name: str
    target_audience: str
    template_type: str
    status: str  # draft, active, paused, completed
    recipients: List[Dict[str, Any]]
    metrics: Dict[str, int]

class OutreachAgent(BaseAgent):
    """Agent responsible for managing outreach and partnerships"""
    
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config, "Outreach Agent")
        self.supabase_url = config.get('supabase_url')
        self.supabase_key = config.get('supabase_key')
        
        if self.supabase_url and self.supabase_key:
            self.supabase = create_client(self.supabase_url, self.supabase_key)
        else:
            self.supabase = None
            
        self.ai_provider = AIProvider()
        self.contact_finder = ContactFinder(config)
        self.template_generator = EmailTemplateGenerator(config)
        
    @track_performance
    @rate_limited(max_calls=10, window=3600)
    async def find_partnership_opportunities(
        self,
        industry: str,
        opportunity_type: str = "partnership",
        limit: int = 20
    ) -> List[OutreachOpportunity]:
        """Find potential partnership opportunities in a specific industry"""
        try:
            logger.info(f"Finding {opportunity_type} opportunities in {industry}")
            
            # Generate search queries
            search_queries = self._generate_search_queries(industry, opportunity_type)
            
            opportunities = []
            
            for query in search_queries[:3]:  # Limit to 3 queries
                # Search for companies
                companies = await self._search_companies(query, limit=10)
                
                for company in companies:
                    # Analyze company fit
                    opportunity = await self._analyze_company_fit(
                        company, industry, opportunity_type
                    )
                    
                    if opportunity and opportunity.score >= 0.6:
                        opportunities.append(opportunity)
            
            # Sort by score
            opportunities.sort(key=lambda x: x.score, reverse=True)
            
            # Store in database
            if self.supabase:
                await self._store_opportunities(opportunities[:limit])
            
            logger.info(f"Found {len(opportunities)} opportunities")
            return opportunities[:limit]
            
        except Exception as e:
            logger.error(f"Error finding opportunities: {e}")
            await self._log_error("find_partnership_opportunities", str(e))
            return []
    
    @track_performance
    async def generate_outreach_emails(
        self,
        opportunities: List[OutreachOpportunity],
        campaign_name: str,
        template_type: str = "partnership_intro"
    ) -> EmailCampaign:
        """Generate personalized outreach emails for opportunities"""
        try:
            logger.info(f"Generating emails for {len(opportunities)} opportunities")
            
            campaign_id = str(uuid.uuid4())
            recipients = []
            
            for opp in opportunities:
                # Generate personalized email
                email_content = await self.template_generator.generate_email(
                    template_type=template_type,
                    company_name=opp.company_name,
                    contact_name=opp.contact_person,
                    industry=opp.industry,
                    opportunity_type=opp.opportunity_type
                )
                
                recipient = {
                    "company_name": opp.company_name,
                    "contact_email": opp.contact_email,
                    "contact_person": opp.contact_person,
                    "email_subject": email_content.get("subject"),
                    "email_body": email_content.get("body"),
                    "status": "pending",
                    "opportunity_score": opp.score
                }
                
                recipients.append(recipient)
            
            # Create campaign
            campaign = EmailCampaign(
                campaign_id=campaign_id,
                name=campaign_name,
                target_audience=opportunities[0].industry if opportunities else "",
                template_type=template_type,
                status="draft",
                recipients=recipients,
                metrics={
                    "total_recipients": len(recipients),
                    "sent": 0,
                    "opened": 0,
                    "clicked": 0,
                    "replied": 0
                }
            )
            
            # Store campaign in database
            if self.supabase:
                await self._store_campaign(campaign)
            
            logger.info(f"Created campaign {campaign_id} with {len(recipients)} recipients")
            return campaign
            
        except Exception as e:
            logger.error(f"Error generating emails: {e}")
            await self._log_error("generate_outreach_emails", str(e))
            raise
    
    @track_performance
    @rate_limited(max_calls=50, window=3600)
    async def send_campaign_emails(
        self,
        campaign_id: str,
        batch_size: int = 10,
        delay_seconds: int = 30
    ) -> Dict[str, Any]:
        """Send emails for a campaign (simulation - actual sending would use email service)"""
        try:
            logger.info(f"Sending emails for campaign {campaign_id}")
            
            # Get campaign from database
            if not self.supabase:
                return {"error": "Database not connected"}
            
            campaign_data = self.supabase.table('agent_outreach_campaigns')\
                .select('*')\
                .eq('campaign_id', campaign_id)\
                .single()\
                .execute()
            
            if not campaign_data.data:
                return {"error": "Campaign not found"}
            
            # Get pending recipients
            recipients = self.supabase.table('agent_outreach_recipients')\
                .select('*')\
                .eq('campaign_id', campaign_id)\
                .eq('status', 'pending')\
                .limit(batch_size)\
                .execute()
            
            sent_count = 0
            
            for recipient in recipients.data:
                # Simulate email sending
                # In production, this would integrate with an email service
                logger.info(f"Sending email to {recipient['contact_email']}")
                
                # Update recipient status
                self.supabase.table('agent_outreach_recipients')\
                    .update({
                        'status': 'sent',
                        'sent_at': datetime.utcnow().isoformat()
                    })\
                    .eq('id', recipient['id'])\
                    .execute()
                
                sent_count += 1
                
                # Delay between sends
                if delay_seconds > 0:
                    await asyncio.sleep(delay_seconds)
            
            # Update campaign metrics
            metrics = campaign_data.data.get('metrics', {})
            metrics['sent'] = metrics.get('sent', 0) + sent_count
            
            self.supabase.table('agent_outreach_campaigns')\
                .update({
                    'metrics': metrics,
                    'status': 'active' if sent_count > 0 else campaign_data.data['status']
                })\
                .eq('campaign_id', campaign_id)\
                .execute()
            
            return {
                "campaign_id": campaign_id,
                "sent_count": sent_count,
                "total_sent": metrics['sent']
            }
            
        except Exception as e:
            logger.error(f"Error sending campaign: {e}")
            await self._log_error("send_campaign_emails", str(e))
            return {"error": str(e)}
    
    @track_performance
    async def track_campaign_performance(self, campaign_id: str) -> Dict[str, Any]:
        """Track performance metrics for an outreach campaign"""
        try:
            if not self.supabase:
                return {"error": "Database not connected"}
            
            # Get campaign data
            campaign = self.supabase.table('agent_outreach_campaigns')\
                .select('*')\
                .eq('campaign_id', campaign_id)\
                .single()\
                .execute()
            
            if not campaign.data:
                return {"error": "Campaign not found"}
            
            # Get recipient statistics
            recipients = self.supabase.table('agent_outreach_recipients')\
                .select('status')\
                .eq('campaign_id', campaign_id)\
                .execute()
            
            # Calculate metrics
            status_counts = {}
            for recipient in recipients.data:
                status = recipient['status']
                status_counts[status] = status_counts.get(status, 0) + 1
            
            metrics = {
                "campaign_name": campaign.data['name'],
                "status": campaign.data['status'],
                "total_recipients": len(recipients.data),
                "sent": status_counts.get('sent', 0),
                "opened": status_counts.get('opened', 0),
                "clicked": status_counts.get('clicked', 0),
                "replied": status_counts.get('replied', 0),
                "bounced": status_counts.get('bounced', 0),
                "unsubscribed": status_counts.get('unsubscribed', 0),
                "open_rate": status_counts.get('opened', 0) / max(status_counts.get('sent', 1), 1),
                "click_rate": status_counts.get('clicked', 0) / max(status_counts.get('opened', 1), 1),
                "reply_rate": status_counts.get('replied', 0) / max(status_counts.get('sent', 1), 1)
            }
            
            # Update campaign metrics
            self.supabase.table('agent_outreach_campaigns')\
                .update({'metrics': metrics})\
                .eq('campaign_id', campaign_id)\
                .execute()
            
            return metrics
            
        except Exception as e:
            logger.error(f"Error tracking campaign: {e}")
            await self._log_error("track_campaign_performance", str(e))
            return {"error": str(e)}
    
    @track_performance
    async def score_lead_quality(self, opportunity: OutreachOpportunity) -> float:
        """Score the quality of a lead based on various factors"""
        try:
            score = 0.0
            
            # Website quality check
            if opportunity.website:
                website_score = await self._analyze_website_quality(opportunity.website)
                score += website_score * 0.3
            
            # Industry relevance
            industry_keywords = ["hemp", "cannabis", "cbd", "sustainable", "eco", "textile", "construction", "health"]
            industry_matches = sum(1 for keyword in industry_keywords if keyword in opportunity.industry.lower())
            score += min(industry_matches * 0.1, 0.3)
            
            # Contact information completeness
            if opportunity.contact_email:
                score += 0.2
            if opportunity.contact_person:
                score += 0.1
            
            # Opportunity type value
            type_scores = {
                "partnership": 0.1,
                "distributor": 0.15,
                "supplier": 0.1,
                "investor": 0.2
            }
            score += type_scores.get(opportunity.opportunity_type, 0.05)
            
            return min(score, 1.0)
            
        except Exception as e:
            logger.error(f"Error scoring lead: {e}")
            return 0.0
    
    # Helper methods
    def _generate_search_queries(self, industry: str, opportunity_type: str) -> List[str]:
        """Generate search queries for finding companies"""
        base_queries = {
            "partnership": [
                f"{industry} companies seeking partnerships",
                f"{industry} B2B collaboration opportunities",
                f"sustainable {industry} business partners"
            ],
            "supplier": [
                f"{industry} suppliers directory",
                f"{industry} wholesale manufacturers",
                f"{industry} B2B suppliers"
            ],
            "distributor": [
                f"{industry} distributors network",
                f"{industry} distribution partners",
                f"{industry} retail distribution"
            ],
            "investor": [
                f"{industry} investment opportunities",
                f"sustainable {industry} investors",
                f"{industry} venture capital"
            ]
        }
        
        return base_queries.get(opportunity_type, [f"{industry} business opportunities"])
    
    async def _search_companies(self, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Search for companies using web scraping"""
        # This is a simplified version - in production, you'd use a business API
        companies = []
        
        try:
            # Simulate web search results
            # In production, this would actually search the web
            async with httpx.AsyncClient() as client:
                # This is placeholder logic
                search_url = f"https://www.google.com/search?q={query}"
                # Note: Google blocks automated requests - use a proper API in production
                
                # For now, return mock data
                mock_companies = [
                    {
                        "name": f"Hemp Company {i}",
                        "website": f"https://hempcompany{i}.com",
                        "description": f"A leading {query} company"
                    }
                    for i in range(min(limit, 5))
                ]
                
                return mock_companies
                
        except Exception as e:
            logger.error(f"Error searching companies: {e}")
            return []
    
    async def _analyze_company_fit(
        self,
        company: Dict[str, Any],
        industry: str,
        opportunity_type: str
    ) -> Optional[OutreachOpportunity]:
        """Analyze if a company is a good fit for outreach"""
        try:
            # Use AI to analyze company fit
            prompt = f"""
            Analyze if this company is a good fit for a {opportunity_type} opportunity in the {industry} industry:
            
            Company: {company.get('name')}
            Website: {company.get('website')}
            Description: {company.get('description', 'N/A')}
            
            Consider:
            1. Industry alignment
            2. Company size and capability
            3. Potential synergies
            4. Geographic compatibility
            
            Respond with:
            - FIT_SCORE: 0.0 to 1.0
            - CONTACT_PERSON: Best guess at contact person title
            - NOTES: Brief explanation
            """
            
            response, tokens, cost = await self.ai_provider.generate(
                prompt,
                temperature=0.3,
                max_tokens=200
            )
            
            # Parse response
            fit_score = 0.7  # Default score
            contact_person = "Business Development Manager"
            notes = response[:200]
            
            # Extract score if present
            if "FIT_SCORE:" in response:
                try:
                    score_text = response.split("FIT_SCORE:")[1].split("\n")[0].strip()
                    fit_score = float(score_text)
                except:
                    pass
            
            if fit_score < 0.6:
                return None
            
            # Find contact information
            contact_info = await self.contact_finder.find_contact(
                company.get('website', ''),
                contact_person
            )
            
            return OutreachOpportunity(
                company_name=company.get('name', 'Unknown'),
                website=company.get('website', ''),
                industry=industry,
                contact_person=contact_info.get('name'),
                contact_email=contact_info.get('email'),
                opportunity_type=opportunity_type,
                score=fit_score,
                notes=notes
            )
            
        except Exception as e:
            logger.error(f"Error analyzing company: {e}")
            return None
    
    async def _analyze_website_quality(self, website: str) -> float:
        """Analyze website quality and legitimacy"""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(website)
                
                if response.status_code != 200:
                    return 0.3
                
                # Check for quality indicators
                soup = BeautifulSoup(response.text, 'html.parser')
                
                score = 0.5  # Base score
                
                # Check for professional indicators
                if soup.find('meta', {'name': 'description'}):
                    score += 0.1
                if soup.find('nav') or soup.find('header'):
                    score += 0.1
                if 'contact' in response.text.lower() or 'about' in response.text.lower():
                    score += 0.1
                if soup.find_all('a', href=True).__len__() > 10:
                    score += 0.1
                if 'privacy' in response.text.lower() or 'terms' in response.text.lower():
                    score += 0.1
                
                return min(score, 1.0)
                
        except Exception as e:
            logger.error(f"Error analyzing website {website}: {e}")
            return 0.0
    
    async def _store_opportunities(self, opportunities: List[OutreachOpportunity]):
        """Store opportunities in database"""
        if not self.supabase:
            return
        
        for opp in opportunities:
            try:
                self.supabase.table('agent_outreach_opportunities').insert({
                    'company_name': opp.company_name,
                    'website': opp.website,
                    'industry': opp.industry,
                    'contact_person': opp.contact_person,
                    'contact_email': opp.contact_email,
                    'opportunity_type': opp.opportunity_type,
                    'score': opp.score,
                    'notes': opp.notes,
                    'status': 'new',
                    'created_at': datetime.utcnow().isoformat()
                }).execute()
            except Exception as e:
                logger.error(f"Error storing opportunity: {e}")
    
    async def _store_campaign(self, campaign: EmailCampaign):
        """Store campaign and recipients in database"""
        if not self.supabase:
            return
        
        try:
            # Store campaign
            self.supabase.table('agent_outreach_campaigns').insert({
                'campaign_id': campaign.campaign_id,
                'name': campaign.name,
                'target_audience': campaign.target_audience,
                'template_type': campaign.template_type,
                'status': campaign.status,
                'metrics': campaign.metrics,
                'created_at': datetime.utcnow().isoformat()
            }).execute()
            
            # Store recipients
            for recipient in campaign.recipients:
                self.supabase.table('agent_outreach_recipients').insert({
                    'campaign_id': campaign.campaign_id,
                    'company_name': recipient['company_name'],
                    'contact_email': recipient['contact_email'],
                    'contact_person': recipient['contact_person'],
                    'email_subject': recipient['email_subject'],
                    'email_body': recipient['email_body'],
                    'status': recipient['status'],
                    'opportunity_score': recipient['opportunity_score'],
                    'created_at': datetime.utcnow().isoformat()
                }).execute()
                
        except Exception as e:
            logger.error(f"Error storing campaign: {e}")
            raise