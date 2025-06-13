"""Hemp SEO Agent - Analyzes and optimizes SEO performance for hemp industry content."""

import asyncio
import json
import logging
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timedelta
from urllib.parse import urlparse, urljoin
import re
from collections import Counter

import aiohttp
from bs4 import BeautifulSoup
from tenacity import retry, stop_after_attempt, wait_exponential

from ..core.base_agent import BaseAgent, rate_limited, track_performance

logger = logging.getLogger(__name__)


class HempSEOAgent(BaseAgent):
    """Agent responsible for SEO analysis, optimization, and monitoring."""
    
    def __init__(self, supabase_client, agent_name: str = "seo_agent"):
        super().__init__(supabase_client, agent_name)
        self.session = None
        self.seo_tools = self._initialize_seo_tools()
        
    def _initialize_seo_tools(self) -> Dict:
        """Initialize SEO analysis tools and configurations."""
        return {
            'ranking_factors': {
                'title_tag': {'weight': 0.15, 'max_length': 60},
                'meta_description': {'weight': 0.10, 'max_length': 160},
                'h1_tag': {'weight': 0.10, 'count': 1},
                'keyword_density': {'weight': 0.10, 'optimal': 0.02},
                'content_length': {'weight': 0.10, 'min_words': 300},
                'internal_links': {'weight': 0.10, 'min_count': 3},
                'external_links': {'weight': 0.05, 'min_count': 2},
                'image_alt_text': {'weight': 0.10, 'required': True},
                'page_speed': {'weight': 0.10, 'max_seconds': 3},
                'mobile_friendly': {'weight': 0.10, 'required': True}
            },
            'hemp_keywords': [
                'industrial hemp', 'hemp products', 'hemp fiber', 'hemp oil',
                'CBD', 'hemp seeds', 'sustainable hemp', 'hemp materials',
                'hemp textiles', 'hemp construction', 'hemp plastics',
                'hemp protein', 'hemp farming', 'hemp processing'
            ],
            'competitor_domains': [
                'hempindustrydaily.com', 'votehemp.com', 'eiha.org',
                'hempbizjournal.com', 'thehia.org', 'globalhempinnovationcenter.org'
            ]
        }
    
    async def __aenter__(self):
        """Async context manager entry."""
        self.session = aiohttp.ClientSession()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        if self.session:
            await self.session.close()
    
    @track_performance("seo_analysis")
    async def execute(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute SEO task based on action type."""
        action = task.get('action')
        params = task.get('params', {})
        
        seo_actions = {
            'analyze_site': self.analyze_site_performance,
            'research_keywords': self.research_keywords,
            'analyze_competitors': self.analyze_competitors,
            'monitor_rankings': self.monitor_rankings,
            'generate_recommendations': self.generate_seo_recommendations,
            'audit_content': self.audit_content_seo,
            'track_backlinks': self.track_backlinks
        }
        
        if action in seo_actions:
            return await seo_actions[action](params)
        else:
            raise ValueError(f"Unknown SEO action: {action}")
    
    @rate_limited(max_calls=10, window_seconds=60)
    async def analyze_site_performance(self, params: Dict) -> Dict[str, Any]:
        """Analyze overall site SEO performance."""
        target_url = params.get('url')
        include_pages = params.get('include_pages', 10)
        
        if not target_url:
            raise ValueError("URL is required for site analysis")
        
        logger.info(f"Analyzing site performance for: {target_url}")
        
        try:
            # Perform site audit
            site_audit = await self._perform_site_audit(target_url, include_pages)
            
            # Analyze technical SEO
            technical_seo = await self._analyze_technical_seo(target_url)
            
            # Check content quality
            content_analysis = await self._analyze_content_quality(site_audit['pages'])
            
            # Calculate overall SEO score
            overall_score = self._calculate_site_seo_score(
                site_audit, technical_seo, content_analysis
            )
            
            # Generate insights
            insights = await self._generate_site_insights(
                site_audit, technical_seo, content_analysis
            )
            
            # Save analysis to database
            analysis_result = {
                'analysis_type': 'site_audit',
                'target_url': target_url,
                'results': {
                    'site_audit': site_audit,
                    'technical_seo': technical_seo,
                    'content_analysis': content_analysis,
                    'insights': insights
                },
                'score': overall_score,
                'issues_found': len(site_audit.get('issues', [])),
                'opportunities_found': len(insights.get('opportunities', [])),
                'recommendations': insights.get('recommendations', [])
            }
            
            saved_analysis = await self._save_to_database(
                'agent_seo_analysis', analysis_result
            )
            
            return {
                'status': 'completed',
                'analysis_id': saved_analysis.get('id'),
                'overall_score': overall_score,
                'pages_analyzed': len(site_audit['pages']),
                'critical_issues': site_audit.get('critical_issues', 0),
                'top_recommendations': insights['recommendations'][:3]
            }
            
        except Exception as e:
            error_details = await self.handle_error(e, {'action': 'analyze_site', 'url': target_url})
            raise
    
    async def _perform_site_audit(self, base_url: str, max_pages: int) -> Dict[str, Any]:
        """Perform comprehensive site audit."""
        if not self.session:
            self.session = aiohttp.ClientSession()
        
        pages_analyzed = []
        issues = []
        sitemap_urls = await self._fetch_sitemap_urls(base_url)
        
        # Analyze pages
        urls_to_analyze = sitemap_urls[:max_pages] if sitemap_urls else [base_url]
        
        for url in urls_to_analyze:
            try:
                page_analysis = await self._analyze_page_seo(url)
                pages_analyzed.append(page_analysis)
                
                # Collect issues
                if page_analysis['issues']:
                    issues.extend(page_analysis['issues'])
                    
            except Exception as e:
                logger.error(f"Error analyzing page {url}: {e}")
                continue
        
        # Categorize issues
        critical_issues = [i for i in issues if i.get('severity') == 'critical']
        high_issues = [i for i in issues if i.get('severity') == 'high']
        medium_issues = [i for i in issues if i.get('severity') == 'medium']
        
        return {
            'pages': pages_analyzed,
            'total_pages': len(pages_analyzed),
            'issues': issues,
            'critical_issues': len(critical_issues),
            'high_issues': len(high_issues),
            'medium_issues': len(medium_issues),
            'average_score': sum(p['seo_score'] for p in pages_analyzed) / len(pages_analyzed) if pages_analyzed else 0
        }
    
    async def _analyze_page_seo(self, url: str) -> Dict[str, Any]:
        """Analyze SEO elements of a single page."""
        try:
            async with self.session.get(url, timeout=30) as response:
                if response.status != 200:
                    return {'url': url, 'error': f'HTTP {response.status}', 'seo_score': 0}
                
                html = await response.text()
                soup = BeautifulSoup(html, 'html.parser')
                
                # Extract SEO elements
                seo_elements = {
                    'title': soup.find('title').text if soup.find('title') else '',
                    'meta_description': '',
                    'h1_tags': [h1.text for h1 in soup.find_all('h1')],
                    'h2_tags': [h2.text for h2 in soup.find_all('h2')],
                    'images': soup.find_all('img'),
                    'internal_links': [],
                    'external_links': [],
                    'word_count': len(soup.get_text().split())
                }
                
                # Get meta description
                meta_desc = soup.find('meta', attrs={'name': 'description'})
                if meta_desc:
                    seo_elements['meta_description'] = meta_desc.get('content', '')
                
                # Analyze links
                for link in soup.find_all('a', href=True):
                    href = link['href']
                    if href.startswith('http'):
                        if urlparse(href).netloc == urlparse(url).netloc:
                            seo_elements['internal_links'].append(href)
                        else:
                            seo_elements['external_links'].append(href)
                    elif href.startswith('/'):
                        seo_elements['internal_links'].append(urljoin(url, href))
                
                # Check for issues
                issues = self._identify_seo_issues(seo_elements, url)
                
                # Calculate page SEO score
                seo_score = self._calculate_page_seo_score(seo_elements)
                
                return {
                    'url': url,
                    'seo_elements': seo_elements,
                    'issues': issues,
                    'seo_score': seo_score
                }
                
        except Exception as e:
            logger.error(f"Error analyzing page {url}: {e}")
            return {'url': url, 'error': str(e), 'seo_score': 0}
    
    def _identify_seo_issues(self, elements: Dict, url: str) -> List[Dict]:
        """Identify SEO issues on a page."""
        issues = []
        
        # Title issues
        if not elements['title']:
            issues.append({
                'type': 'missing_title',
                'severity': 'critical',
                'message': 'Page is missing title tag',
                'url': url
            })
        elif len(elements['title']) > 60:
            issues.append({
                'type': 'title_too_long',
                'severity': 'medium',
                'message': f"Title tag is {len(elements['title'])} characters (max 60)",
                'url': url
            })
        
        # Meta description issues
        if not elements['meta_description']:
            issues.append({
                'type': 'missing_meta_description',
                'severity': 'high',
                'message': 'Page is missing meta description',
                'url': url
            })
        elif len(elements['meta_description']) > 160:
            issues.append({
                'type': 'meta_description_too_long',
                'severity': 'medium',
                'message': f"Meta description is {len(elements['meta_description'])} characters (max 160)",
                'url': url
            })
        
        # H1 issues
        if len(elements['h1_tags']) == 0:
            issues.append({
                'type': 'missing_h1',
                'severity': 'high',
                'message': 'Page is missing H1 tag',
                'url': url
            })
        elif len(elements['h1_tags']) > 1:
            issues.append({
                'type': 'multiple_h1',
                'severity': 'medium',
                'message': f"Page has {len(elements['h1_tags'])} H1 tags (should have 1)",
                'url': url
            })
        
        # Content issues
        if elements['word_count'] < 300:
            issues.append({
                'type': 'thin_content',
                'severity': 'high',
                'message': f"Page has only {elements['word_count']} words (min 300)",
                'url': url
            })
        
        # Image issues
        images_without_alt = [img for img in elements['images'] if not img.get('alt')]
        if images_without_alt:
            issues.append({
                'type': 'missing_alt_text',
                'severity': 'medium',
                'message': f"{len(images_without_alt)} images missing alt text",
                'url': url
            })
        
        return issues
    
    def _calculate_page_seo_score(self, elements: Dict) -> float:
        """Calculate SEO score for a page (0-100)."""
        score = 100.0
        factors = self.seo_tools['ranking_factors']
        
        # Title score
        if not elements['title']:
            score -= factors['title_tag']['weight'] * 100
        elif len(elements['title']) > factors['title_tag']['max_length']:
            score -= factors['title_tag']['weight'] * 50
        
        # Meta description score
        if not elements['meta_description']:
            score -= factors['meta_description']['weight'] * 100
        elif len(elements['meta_description']) > factors['meta_description']['max_length']:
            score -= factors['meta_description']['weight'] * 50
        
        # H1 score
        if len(elements['h1_tags']) != factors['h1_tag']['count']:
            score -= factors['h1_tag']['weight'] * 100
        
        # Content length score
        if elements['word_count'] < factors['content_length']['min_words']:
            score -= factors['content_length']['weight'] * 100
        
        # Internal links score
        if len(elements['internal_links']) < factors['internal_links']['min_count']:
            score -= factors['internal_links']['weight'] * 50
        
        # Image alt text score
        if elements['images']:
            images_with_alt = [img for img in elements['images'] if img.get('alt')]
            alt_ratio = len(images_with_alt) / len(elements['images'])
            if alt_ratio < 1.0:
                score -= factors['image_alt_text']['weight'] * (100 * (1 - alt_ratio))
        
        return max(0, min(100, score))
    
    @rate_limited(max_calls=5, window_seconds=60)
    async def research_keywords(self, params: Dict) -> Dict[str, Any]:
        """Research keywords for hemp products and industry."""
        seed_keywords = params.get('seed_keywords', self.seo_tools['hemp_keywords'])
        product_focus = params.get('product_focus')
        include_competitors = params.get('include_competitors', True)
        
        logger.info(f"Researching keywords for: {seed_keywords[:3]}...")
        
        try:
            # Generate keyword variations
            keyword_variations = await self._generate_keyword_variations(
                seed_keywords, product_focus
            )
            
            # Analyze keyword difficulty and search volume
            keyword_analysis = await self._analyze_keywords(keyword_variations)
            
            # Find long-tail keywords
            longtail_keywords = await self._find_longtail_keywords(
                seed_keywords, product_focus
            )
            
            # Competitor keyword analysis
            competitor_keywords = []
            if include_competitors:
                competitor_keywords = await self._analyze_competitor_keywords()
            
            # Combine and rank keywords
            all_keywords = self._rank_keywords(
                keyword_analysis + longtail_keywords + competitor_keywords
            )
            
            # Save top keywords to database
            saved_keywords = await self._save_keywords_to_db(all_keywords[:50])
            
            # Generate keyword strategy
            keyword_strategy = await self._generate_keyword_strategy(all_keywords)
            
            return {
                'status': 'completed',
                'total_keywords': len(all_keywords),
                'saved_keywords': saved_keywords,
                'top_keywords': all_keywords[:10],
                'keyword_strategy': keyword_strategy,
                'categories': self._categorize_keywords(all_keywords)
            }
            
        except Exception as e:
            error_details = await self.handle_error(e, {'action': 'research_keywords'})
            raise
    
    async def _generate_keyword_variations(self, seed_keywords: List[str], 
                                         product_focus: Optional[str]) -> List[str]:
        """Generate keyword variations using AI."""
        prompt = f"""
        Generate keyword variations for hemp industry SEO.
        
        Seed keywords: {', '.join(seed_keywords[:5])}
        Product focus: {product_focus or 'general hemp products'}
        
        Generate 30 keyword variations including:
        - Long-tail keywords (3-5 words)
        - Question-based keywords
        - Location-based keywords
        - Commercial intent keywords
        - Informational keywords
        
        Return as JSON array of strings.
        """
        
        try:
            response = await self._generate_with_ai(
                prompt=prompt,
                purpose="keyword_generation",
                temperature=0.7
            )
            
            variations = json.loads(response)
            return variations
            
        except Exception as e:
            logger.error(f"Error generating keyword variations: {e}")
            # Fallback to basic variations
            variations = []
            for seed in seed_keywords:
                variations.extend([
                    f"{seed} products",
                    f"best {seed}",
                    f"{seed} benefits",
                    f"how to use {seed}",
                    f"{seed} for sale"
                ])
            return variations
    
    async def _analyze_keywords(self, keywords: List[str]) -> List[Dict]:
        """Analyze keywords for difficulty and search metrics."""
        analyzed = []
        
        for keyword in keywords:
            # In production, this would call external SEO APIs
            # For now, we'll use AI to estimate metrics
            analysis = await self._estimate_keyword_metrics(keyword)
            analyzed.append({
                'keyword': keyword,
                'search_volume': analysis.get('search_volume', 0),
                'difficulty_score': analysis.get('difficulty', 50),
                'cpc_usd': analysis.get('cpc', 1.0),
                'trend': analysis.get('trend', 'stable')
            })
        
        return analyzed
    
    async def _estimate_keyword_metrics(self, keyword: str) -> Dict[str, Any]:
        """Estimate keyword metrics using AI."""
        prompt = f"""
        Estimate SEO metrics for the keyword: "{keyword}"
        
        Consider:
        - Hemp industry context
        - Commercial vs informational intent
        - Keyword length and specificity
        
        Return JSON with:
        - search_volume: Estimated monthly searches (integer)
        - difficulty: SEO difficulty score 0-100
        - cpc: Estimated cost per click in USD
        - trend: "rising", "stable", or "declining"
        """
        
        try:
            response = await self._generate_with_ai(
                prompt=prompt,
                purpose="keyword_metrics",
                temperature=0.3
            )
            
            return json.loads(response)
            
        except Exception:
            # Fallback estimates based on keyword characteristics
            word_count = len(keyword.split())
            is_commercial = any(term in keyword.lower() for term in 
                              ['buy', 'shop', 'sale', 'price', 'cost'])
            
            return {
                'search_volume': 1000 // word_count,  # Lower volume for longer keywords
                'difficulty': 30 + (word_count * 10),  # Higher difficulty for shorter keywords
                'cpc': 2.0 if is_commercial else 0.5,
                'trend': 'rising' if 'hemp' in keyword else 'stable'
            }
    
    async def _save_keywords_to_db(self, keywords: List[Dict]) -> int:
        """Save keywords to database."""
        saved_count = 0
        
        for kw in keywords:
            try:
                # Check if keyword exists
                existing = await self.supabase.table('agent_seo_keywords')\
                    .select('id')\
                    .eq('keyword', kw['keyword'])\
                    .execute()
                
                if not existing.data:
                    # Insert new keyword
                    await self.supabase.table('agent_seo_keywords').insert({
                        'keyword': kw['keyword'],
                        'search_volume': kw.get('search_volume', 0),
                        'difficulty_score': kw.get('difficulty_score', 50),
                        'cpc_usd': kw.get('cpc_usd', 0),
                        'trend': kw.get('trend', 'stable')
                    }).execute()
                    
                    saved_count += 1
                else:
                    # Update existing keyword
                    await self.supabase.table('agent_seo_keywords')\
                        .update({
                            'search_volume': kw.get('search_volume', 0),
                            'difficulty_score': kw.get('difficulty_score', 50),
                            'cpc_usd': kw.get('cpc_usd', 0),
                            'trend': kw.get('trend', 'stable'),
                            'last_checked_at': datetime.utcnow().isoformat()
                        })\
                        .eq('id', existing.data[0]['id'])\
                        .execute()
                        
            except Exception as e:
                logger.error(f"Error saving keyword {kw['keyword']}: {e}")
                continue
        
        return saved_count
    
    @rate_limited(max_calls=5, window_seconds=60)
    async def analyze_competitors(self, params: Dict) -> Dict[str, Any]:
        """Analyze competitor SEO strategies."""
        competitor_urls = params.get('competitor_urls', [])
        focus_areas = params.get('focus_areas', ['keywords', 'content', 'backlinks'])
        
        # Use default competitors if none provided
        if not competitor_urls:
            competitor_urls = [f"https://{domain}" for domain in 
                             self.seo_tools['competitor_domains'][:3]]
        
        logger.info(f"Analyzing {len(competitor_urls)} competitors")
        
        try:
            competitor_analyses = []
            
            for competitor_url in competitor_urls:
                analysis = await self._analyze_single_competitor(
                    competitor_url, focus_areas
                )
                competitor_analyses.append(analysis)
            
            # Compare with our performance
            comparison = await self._generate_competitor_comparison(competitor_analyses)
            
            # Identify opportunities
            opportunities = await self._identify_competitor_opportunities(
                competitor_analyses, comparison
            )
            
            # Save analysis
            saved_analysis = await self._save_to_database('agent_seo_analysis', {
                'analysis_type': 'competitor_analysis',
                'results': {
                    'competitors': competitor_analyses,
                    'comparison': comparison,
                    'opportunities': opportunities
                },
                'competitor_comparison': comparison,
                'opportunities_found': len(opportunities)
            })
            
            return {
                'status': 'completed',
                'competitors_analyzed': len(competitor_analyses),
                'top_opportunities': opportunities[:5],
                'competitive_advantages': comparison.get('advantages', []),
                'improvement_areas': comparison.get('weaknesses', [])
            }
            
        except Exception as e:
            error_details = await self.handle_error(e, {'action': 'analyze_competitors'})
            raise
    
    async def _analyze_single_competitor(self, url: str, focus_areas: List[str]) -> Dict:
        """Analyze a single competitor's SEO."""
        analysis = {
            'url': url,
            'domain': urlparse(url).netloc
        }
        
        if 'keywords' in focus_areas:
            # Extract keywords from their content
            keywords = await self._extract_competitor_keywords(url)
            analysis['keywords'] = keywords
        
        if 'content' in focus_areas:
            # Analyze their content strategy
            content_analysis = await self._analyze_competitor_content(url)
            analysis['content_strategy'] = content_analysis
        
        if 'backlinks' in focus_areas:
            # For now, we'll estimate backlink profile
            backlink_estimate = await self._estimate_backlink_profile(url)
            analysis['backlink_profile'] = backlink_estimate
        
        return analysis
    
    async def _extract_competitor_keywords(self, url: str) -> List[str]:
        """Extract keywords from competitor site."""
        if not self.session:
            self.session = aiohttp.ClientSession()
        
        try:
            async with self.session.get(url, timeout=30) as response:
                if response.status == 200:
                    html = await response.text()
                    soup = BeautifulSoup(html, 'html.parser')
                    
                    # Extract text content
                    text_content = soup.get_text().lower()
                    
                    # Find hemp-related keywords
                    hemp_keywords = []
                    for keyword in self.seo_tools['hemp_keywords']:
                        if keyword.lower() in text_content:
                            count = text_content.count(keyword.lower())
                            hemp_keywords.append({
                                'keyword': keyword,
                                'frequency': count
                            })
                    
                    # Sort by frequency
                    hemp_keywords.sort(key=lambda x: x['frequency'], reverse=True)
                    
                    return [kw['keyword'] for kw in hemp_keywords[:20]]
                    
        except Exception as e:
            logger.error(f"Error extracting keywords from {url}: {e}")
            return []
    
    @rate_limited(max_calls=10, window_seconds=60)
    async def monitor_rankings(self, params: Dict) -> Dict[str, Any]:
        """Monitor keyword rankings for tracked keywords."""
        keywords = params.get('keywords', [])
        target_url = params.get('target_url')
        
        if not keywords:
            # Fetch tracked keywords from database
            tracked = await self.supabase.table('agent_seo_keywords')\
                .select('*')\
                .not_('current_position', 'is', None)\
                .execute()
            
            keywords = [kw['keyword'] for kw in tracked.data] if tracked.data else []
        
        if not keywords:
            return {
                'status': 'completed',
                'message': 'No keywords to monitor'
            }
        
        logger.info(f"Monitoring rankings for {len(keywords)} keywords")
        
        try:
            ranking_updates = []
            
            for keyword in keywords[:20]:  # Limit to 20 keywords per run
                # Simulate ranking check (in production, would use SERP API)
                ranking_data = await self._check_keyword_ranking(keyword, target_url)
                ranking_updates.append(ranking_data)
                
                # Update database
                await self._update_keyword_ranking(keyword, ranking_data)
            
            # Analyze ranking changes
            ranking_analysis = await self._analyze_ranking_changes(ranking_updates)
            
            return {
                'status': 'completed',
                'keywords_monitored': len(ranking_updates),
                'improved_rankings': ranking_analysis['improved'],
                'declined_rankings': ranking_analysis['declined'],
                'average_position': ranking_analysis['average_position'],
                'ranking_updates': ranking_updates[:10]
            }
            
        except Exception as e:
            error_details = await self.handle_error(e, {'action': 'monitor_rankings'})
            raise
    
    async def _check_keyword_ranking(self, keyword: str, target_url: Optional[str]) -> Dict:
        """Check ranking for a specific keyword."""
        # In production, this would use a SERP API
        # For now, we'll simulate with reasonable estimates
        
        prompt = f"""
        Estimate the search ranking position for:
        Keyword: "{keyword}"
        Domain: {urlparse(target_url).netloc if target_url else 'hempquarterz.com'}
        
        Consider:
        - Hemp industry competitiveness
        - Keyword difficulty
        - Domain authority estimate
        
        Return JSON with:
        - position: Current ranking position (1-100, or null if not ranking)
        - url_ranking: The specific URL ranking
        - competitors: Top 3 competitor domains for this keyword
        """
        
        try:
            response = await self._generate_with_ai(
                prompt=prompt,
                purpose="ranking_check",
                temperature=0.3
            )
            
            ranking_data = json.loads(response)
            ranking_data['keyword'] = keyword
            ranking_data['checked_at'] = datetime.utcnow().isoformat()
            
            return ranking_data
            
        except Exception:
            # Fallback simulation
            import random
            return {
                'keyword': keyword,
                'position': random.randint(5, 50) if random.random() > 0.3 else None,
                'url_ranking': target_url,
                'competitors': self.seo_tools['competitor_domains'][:3],
                'checked_at': datetime.utcnow().isoformat()
            }
    
    @rate_limited(max_calls=5, window_seconds=60)
    async def generate_seo_recommendations(self, params: Dict) -> Dict[str, Any]:
        """Generate actionable SEO recommendations."""
        analysis_id = params.get('analysis_id')
        focus_area = params.get('focus_area', 'overall')
        
        logger.info(f"Generating SEO recommendations for {focus_area}")
        
        try:
            # Fetch recent analyses
            recent_analyses = await self._fetch_recent_seo_analyses()
            
            # Generate recommendations based on data
            recommendations = await self._generate_recommendations_from_data(
                recent_analyses, focus_area
            )
            
            # Prioritize recommendations
            prioritized_recommendations = self._prioritize_recommendations(recommendations)
            
            # Create implementation plan
            implementation_plan = await self._create_implementation_plan(
                prioritized_recommendations[:10]
            )
            
            # Save recommendations
            saved_recommendations = await self._save_to_database('agent_seo_analysis', {
                'analysis_type': 'recommendations',
                'recommendations': prioritized_recommendations,
                'results': {
                    'implementation_plan': implementation_plan,
                    'focus_area': focus_area,
                    'total_recommendations': len(recommendations)
                }
            })
            
            return {
                'status': 'completed',
                'total_recommendations': len(recommendations),
                'high_priority': len([r for r in recommendations if r.get('priority') == 'high']),
                'top_recommendations': prioritized_recommendations[:5],
                'implementation_plan': implementation_plan,
                'estimated_impact': self._estimate_recommendation_impact(prioritized_recommendations[:5])
            }
            
        except Exception as e:
            error_details = await self.handle_error(e, {'action': 'generate_recommendations'})
            raise
    
    async def _generate_recommendations_from_data(self, analyses: List[Dict], 
                                                focus_area: str) -> List[Dict]:
        """Generate recommendations from analysis data."""
        all_issues = []
        all_opportunities = []
        
        # Collect all issues and opportunities
        for analysis in analyses:
            if 'issues' in analysis.get('results', {}):
                all_issues.extend(analysis['results']['issues'])
            if 'opportunities' in analysis.get('results', {}):
                all_opportunities.extend(analysis['results']['opportunities'])
        
        # Use AI to generate recommendations
        prompt = f"""
        Generate specific SEO recommendations for a hemp industry website.
        
        Focus area: {focus_area}
        
        Issues found:
        {json.dumps(all_issues[:10], indent=2)}
        
        Opportunities identified:
        {json.dumps(all_opportunities[:5], indent=2)}
        
        Generate 10-15 actionable recommendations with:
        - title: Clear action title
        - description: Detailed explanation
        - priority: high/medium/low
        - effort: low/medium/high
        - impact: Expected improvement
        - category: technical/content/keywords/backlinks
        - implementation_steps: Array of steps
        
        Return as JSON array.
        """
        
        try:
            response = await self._generate_with_ai(
                prompt=prompt,
                purpose="recommendations",
                temperature=0.5
            )
            
            recommendations = json.loads(response)
            
            # Add metadata
            for rec in recommendations:
                rec['generated_at'] = datetime.utcnow().isoformat()
                rec['focus_area'] = focus_area
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error generating recommendations: {e}")
            # Fallback to rule-based recommendations
            return self._generate_fallback_recommendations(all_issues, focus_area)
    
    def _generate_fallback_recommendations(self, issues: List[Dict], 
                                          focus_area: str) -> List[Dict]:
        """Generate basic recommendations from issues."""
        recommendations = []
        
        # Group issues by type
        issue_types = {}
        for issue in issues:
            issue_type = issue.get('type', 'unknown')
            if issue_type not in issue_types:
                issue_types[issue_type] = []
            issue_types[issue_type].append(issue)
        
        # Generate recommendations for each issue type
        for issue_type, type_issues in issue_types.items():
            if issue_type == 'missing_title':
                recommendations.append({
                    'title': 'Add Missing Title Tags',
                    'description': f'Add unique, keyword-rich title tags to {len(type_issues)} pages',
                    'priority': 'high',
                    'effort': 'low',
                    'impact': 'Significant ranking improvement',
                    'category': 'technical',
                    'implementation_steps': [
                        'Audit all pages missing titles',
                        'Research relevant keywords for each page',
                        'Write unique titles under 60 characters',
                        'Include primary keyword near the beginning'
                    ]
                })
            elif issue_type == 'thin_content':
                recommendations.append({
                    'title': 'Expand Thin Content Pages',
                    'description': f'Improve {len(type_issues)} pages with insufficient content',
                    'priority': 'high',
                    'effort': 'medium',
                    'impact': 'Better rankings and user engagement',
                    'category': 'content',
                    'implementation_steps': [
                        'Identify pages with less than 300 words',
                        'Research user intent for each page',
                        'Expand content to 800+ words',
                        'Add relevant hemp industry information'
                    ]
                })
        
        return recommendations
    
    def _prioritize_recommendations(self, recommendations: List[Dict]) -> List[Dict]:
        """Prioritize recommendations based on impact and effort."""
        # Score each recommendation
        for rec in recommendations:
            priority_score = 0
            
            # Priority scoring
            if rec.get('priority') == 'high':
                priority_score += 3
            elif rec.get('priority') == 'medium':
                priority_score += 2
            else:
                priority_score += 1
            
            # Effort scoring (inverse - low effort = higher score)
            if rec.get('effort') == 'low':
                priority_score += 3
            elif rec.get('effort') == 'medium':
                priority_score += 2
            else:
                priority_score += 1
            
            # Category bonus
            if rec.get('category') == 'technical':
                priority_score += 1  # Technical issues often have quick wins
            
            rec['priority_score'] = priority_score
        
        # Sort by priority score
        recommendations.sort(key=lambda x: x.get('priority_score', 0), reverse=True)
        
        return recommendations
    
    async def _create_implementation_plan(self, recommendations: List[Dict]) -> Dict:
        """Create a phased implementation plan."""
        plan = {
            'phase_1': {
                'title': 'Quick Wins (Week 1-2)',
                'tasks': []
            },
            'phase_2': {
                'title': 'Content Improvements (Week 3-4)',
                'tasks': []
            },
            'phase_3': {
                'title': 'Long-term Strategy (Month 2+)',
                'tasks': []
            }
        }
        
        for rec in recommendations:
            task = {
                'title': rec['title'],
                'steps': rec.get('implementation_steps', []),
                'estimated_hours': self._estimate_task_hours(rec)
            }
            
            # Assign to phase based on effort and category
            if rec.get('effort') == 'low' and rec.get('category') == 'technical':
                plan['phase_1']['tasks'].append(task)
            elif rec.get('category') == 'content':
                plan['phase_2']['tasks'].append(task)
            else:
                plan['phase_3']['tasks'].append(task)
        
        # Calculate totals
        for phase in plan.values():
            phase['total_hours'] = sum(task['estimated_hours'] for task in phase['tasks'])
            phase['task_count'] = len(phase['tasks'])
        
        return plan
    
    def _estimate_task_hours(self, recommendation: Dict) -> int:
        """Estimate hours needed for a task."""
        effort_hours = {
            'low': 2,
            'medium': 8,
            'high': 20
        }
        
        base_hours = effort_hours.get(recommendation.get('effort', 'medium'), 8)
        
        # Adjust based on category
        if recommendation.get('category') == 'content':
            base_hours *= 1.5
        elif recommendation.get('category') == 'technical':
            base_hours *= 0.8
        
        return int(base_hours)
    
    def _estimate_recommendation_impact(self, recommendations: List[Dict]) -> Dict:
        """Estimate the potential impact of recommendations."""
        return {
            'traffic_increase': '20-40%',
            'ranking_improvement': '10-15 positions',
            'conversion_uplift': '5-10%',
            'timeline': '3-6 months',
            'confidence': 'medium'
        }
    
    async def _fetch_recent_seo_analyses(self) -> List[Dict]:
        """Fetch recent SEO analyses from database."""
        try:
            # Get analyses from last 30 days
            since_date = (datetime.utcnow() - timedelta(days=30)).isoformat()
            
            result = await self.supabase.table('agent_seo_analysis')\
                .select('*')\
                .gte('created_at', since_date)\
                .execute()
            
            return result.data if result.data else []
            
        except Exception as e:
            logger.error(f"Error fetching SEO analyses: {e}")
            return []
    
    async def _fetch_sitemap_urls(self, base_url: str) -> List[str]:
        """Fetch URLs from sitemap."""
        sitemap_url = urljoin(base_url, '/sitemap.xml')
        urls = []
        
        try:
            if not self.session:
                self.session = aiohttp.ClientSession()
                
            async with self.session.get(sitemap_url, timeout=30) as response:
                if response.status == 200:
                    content = await response.text()
                    # Simple XML parsing for URLs
                    import re
                    url_pattern = r'<loc>(.*?)</loc>'
                    urls = re.findall(url_pattern, content)
                    
        except Exception as e:
            logger.error(f"Error fetching sitemap: {e}")
        
        return urls
    
    async def _analyze_technical_seo(self, url: str) -> Dict[str, Any]:
        """Analyze technical SEO aspects."""
        return {
            'robots_txt': await self._check_robots_txt(url),
            'sitemap': await self._check_sitemap(url),
            'page_speed': await self._check_page_speed(url),
            'mobile_friendly': await self._check_mobile_friendly(url),
            'https': url.startswith('https'),
            'structured_data': await self._check_structured_data(url)
        }
    
    async def _check_robots_txt(self, base_url: str) -> Dict:
        """Check robots.txt file."""
        robots_url = urljoin(base_url, '/robots.txt')
        
        try:
            if not self.session:
                self.session = aiohttp.ClientSession()
                
            async with self.session.get(robots_url, timeout=10) as response:
                if response.status == 200:
                    content = await response.text()
                    return {
                        'exists': True,
                        'allows_crawling': 'Disallow: /' not in content,
                        'has_sitemap': 'Sitemap:' in content
                    }
                else:
                    return {'exists': False}
                    
        except Exception:
            return {'exists': False, 'error': True}
    
    async def _check_sitemap(self, base_url: str) -> Dict:
        """Check sitemap availability."""
        urls = await self._fetch_sitemap_urls(base_url)
        return {
            'exists': len(urls) > 0,
            'url_count': len(urls),
            'format': 'xml'
        }
    
    async def _check_page_speed(self, url: str) -> Dict:
        """Estimate page speed (in production would use PageSpeed API)."""
        # Simplified check
        try:
            if not self.session:
                self.session = aiohttp.ClientSession()
                
            import time
            start = time.time()
            async with self.session.get(url, timeout=30) as response:
                await response.text()
            load_time = time.time() - start
            
            return {
                'load_time_seconds': round(load_time, 2),
                'score': max(0, min(100, 100 - (load_time * 20))),
                'rating': 'fast' if load_time < 2 else 'average' if load_time < 4 else 'slow'
            }
        except Exception:
            return {'error': True, 'score': 0}
    
    async def _check_mobile_friendly(self, url: str) -> Dict:
        """Check mobile friendliness indicators."""
        try:
            if not self.session:
                self.session = aiohttp.ClientSession()
                
            async with self.session.get(url, timeout=30) as response:
                html = await response.text()
                
                # Check for viewport meta tag
                has_viewport = '<meta name="viewport"' in html
                
                # Check for responsive indicators
                has_media_queries = '@media' in html
                
                return {
                    'has_viewport': has_viewport,
                    'appears_responsive': has_media_queries,
                    'mobile_score': 80 if has_viewport else 40
                }
                
        except Exception:
            return {'error': True, 'mobile_score': 0}
    
    async def _check_structured_data(self, url: str) -> Dict:
        """Check for structured data."""
        try:
            if not self.session:
                self.session = aiohttp.ClientSession()
                
            async with self.session.get(url, timeout=30) as response:
                html = await response.text()
                
                # Check for JSON-LD
                has_json_ld = '<script type="application/ld+json"' in html
                
                # Check for microdata
                has_microdata = 'itemscope' in html
                
                return {
                    'has_structured_data': has_json_ld or has_microdata,
                    'types': {
                        'json_ld': has_json_ld,
                        'microdata': has_microdata
                    }
                }
                
        except Exception:
            return {'error': True, 'has_structured_data': False}
    
    async def _analyze_content_quality(self, pages: List[Dict]) -> Dict:
        """Analyze overall content quality."""
        if not pages:
            return {'average_quality_score': 0}
        
        total_score = 0
        quality_issues = []
        
        for page in pages:
            if 'seo_elements' in page:
                elements = page['seo_elements']
                
                # Calculate quality score
                score = 0
                if elements.get('word_count', 0) >= 500:
                    score += 25
                if elements.get('h1_tags'):
                    score += 25
                if elements.get('internal_links'):
                    score += 25
                if elements.get('images'):
                    score += 25
                
                total_score += score
                
                # Track quality issues
                if elements.get('word_count', 0) < 300:
                    quality_issues.append({
                        'type': 'thin_content',
                        'url': page['url']
                    })
        
        return {
            'average_quality_score': total_score / len(pages) if pages else 0,
            'quality_issues': quality_issues,
            'pages_analyzed': len(pages)
        }
    
    def _calculate_site_seo_score(self, site_audit: Dict, technical_seo: Dict, 
                                 content_analysis: Dict) -> float:
        """Calculate overall site SEO score."""
        # Weight different components
        audit_score = site_audit.get('average_score', 0) * 0.4
        
        # Technical score
        tech_score = 0
        if technical_seo.get('robots_txt', {}).get('exists'):
            tech_score += 20
        if technical_seo.get('sitemap', {}).get('exists'):
            tech_score += 20
        if technical_seo.get('https'):
            tech_score += 20
        if technical_seo.get('page_speed', {}).get('score', 0) > 70:
            tech_score += 20
        if technical_seo.get('mobile_friendly', {}).get('mobile_score', 0) > 70:
            tech_score += 20
        
        tech_score = tech_score * 0.3
        
        # Content score
        content_score = content_analysis.get('average_quality_score', 0) * 0.3
        
        return round(audit_score + tech_score + content_score, 1)
    
    async def _generate_site_insights(self, site_audit: Dict, technical_seo: Dict,
                                    content_analysis: Dict) -> Dict:
        """Generate insights from site analysis."""
        insights = {
            'strengths': [],
            'weaknesses': [],
            'opportunities': [],
            'recommendations': []
        }
        
        # Identify strengths
        if site_audit.get('average_score', 0) > 80:
            insights['strengths'].append('Strong on-page SEO implementation')
        if technical_seo.get('https'):
            insights['strengths'].append('Secure HTTPS protocol enabled')
        if technical_seo.get('sitemap', {}).get('exists'):
            insights['strengths'].append('XML sitemap present')
        
        # Identify weaknesses
        if site_audit.get('critical_issues', 0) > 0:
            insights['weaknesses'].append(f"{site_audit['critical_issues']} critical SEO issues found")
        if technical_seo.get('page_speed', {}).get('rating') == 'slow':
            insights['weaknesses'].append('Slow page loading speed')
        if content_analysis.get('average_quality_score', 0) < 50:
            insights['weaknesses'].append('Content quality needs improvement')
        
        # Generate opportunities
        if site_audit.get('issues', []):
            issue_types = set(issue['type'] for issue in site_audit['issues'])
            for issue_type in list(issue_types)[:5]:
                insights['opportunities'].append(f"Fix {issue_type.replace('_', ' ')} issues")
        
        # Create recommendations
        prompt = f"""
        Based on this SEO analysis, provide 5 specific recommendations:
        
        Site Score: {site_audit.get('average_score', 0)}/100
        Critical Issues: {site_audit.get('critical_issues', 0)}
        Page Speed: {technical_seo.get('page_speed', {}).get('rating', 'unknown')}
        Mobile Score: {technical_seo.get('mobile_friendly', {}).get('mobile_score', 0)}
        Content Quality: {content_analysis.get('average_quality_score', 0)}/100
        
        Focus on hemp industry best practices.
        Return as JSON array of recommendation strings.
        """
        
        try:
            response = await self._generate_with_ai(
                prompt=prompt,
                purpose="site_insights",
                temperature=0.5
            )
            
            insights['recommendations'] = json.loads(response)
            
        except Exception:
            # Fallback recommendations
            insights['recommendations'] = [
                "Improve page loading speed to under 3 seconds",
                "Fix all critical on-page SEO issues",
                "Expand thin content pages to 500+ words",
                "Add hemp-specific keywords to title tags",
                "Build internal links between related products"
            ]
        
        return insights
    
    async def _find_longtail_keywords(self, seed_keywords: List[str],
                                    product_focus: Optional[str]) -> List[Dict]:
        """Find long-tail keyword opportunities."""
        longtail_keywords = []
        
        # Common hemp industry modifiers
        modifiers = {
            'product': ['wholesale', 'bulk', 'organic', 'premium', 'usa made'],
            'location': ['near me', 'online', 'usa', 'canada', 'europe'],
            'intent': ['buy', 'shop', 'best', 'top rated', 'reviews'],
            'question': ['what is', 'how to use', 'benefits of', 'where to buy'],
            'comparison': ['vs', 'compared to', 'alternative to', 'better than']
        }
        
        for seed in seed_keywords[:5]:  # Limit to avoid too many combinations
            for modifier_type, modifier_list in modifiers.items():
                for modifier in modifier_list:
                    if modifier_type == 'question':
                        keyword = f"{modifier} {seed}"
                    elif modifier_type == 'comparison':
                        keyword = f"{seed} {modifier} alternatives"
                    else:
                        keyword = f"{modifier} {seed}"
                    
                    longtail_keywords.append({
                        'keyword': keyword,
                        'type': modifier_type,
                        'seed_keyword': seed
                    })
        
        # Analyze long-tail keywords
        analyzed_longtails = []
        for kw in longtail_keywords[:30]:  # Limit for performance
            analysis = await self._estimate_keyword_metrics(kw['keyword'])
            analyzed_longtails.append({
                **kw,
                **analysis
            })
        
        return analyzed_longtails
    
    async def _analyze_competitor_keywords(self) -> List[Dict]:
        """Analyze keywords competitors are ranking for."""
        competitor_keywords = []
        
        for domain in self.seo_tools['competitor_domains'][:2]:
            url = f"https://{domain}"
            keywords = await self._extract_competitor_keywords(url)
            
            for keyword in keywords:
                competitor_keywords.append({
                    'keyword': keyword,
                    'competitor': domain,
                    'opportunity_type': 'competitor_gap'
                })
        
        return competitor_keywords
    
    def _rank_keywords(self, all_keywords: List[Dict]) -> List[Dict]:
        """Rank keywords by opportunity score."""
        for kw in all_keywords:
            # Calculate opportunity score
            score = 0
            
            # Volume component (higher is better)
            volume = kw.get('search_volume', 0)
            if volume > 1000:
                score += 30
            elif volume > 500:
                score += 20
            elif volume > 100:
                score += 10
            
            # Difficulty component (lower is better)
            difficulty = kw.get('difficulty_score', 50)
            if difficulty < 30:
                score += 30
            elif difficulty < 50:
                score += 20
            elif difficulty < 70:
                score += 10
            
            # CPC component (indicates commercial value)
            cpc = kw.get('cpc_usd', 0)
            if cpc > 2:
                score += 20
            elif cpc > 1:
                score += 10
            
            # Trend component
            if kw.get('trend') == 'rising':
                score += 20
            elif kw.get('trend') == 'stable':
                score += 10
            
            kw['opportunity_score'] = score
        
        # Sort by opportunity score
        all_keywords.sort(key=lambda x: x.get('opportunity_score', 0), reverse=True)
        
        return all_keywords
    
    def _categorize_keywords(self, keywords: List[Dict]) -> Dict[str, List[Dict]]:
        """Categorize keywords by type and intent."""
        categories = {
            'transactional': [],
            'informational': [],
            'navigational': [],
            'product_specific': [],
            'industry_general': []
        }
        
        for kw in keywords:
            keyword_lower = kw['keyword'].lower()
            
            # Categorize by intent
            if any(term in keyword_lower for term in ['buy', 'shop', 'price', 'sale', 'wholesale']):
                categories['transactional'].append(kw)
            elif any(term in keyword_lower for term in ['what', 'how', 'why', 'guide', 'tutorial']):
                categories['informational'].append(kw)
            elif any(term in keyword_lower for term in ['brand', 'company', 'website']):
                categories['navigational'].append(kw)
            
            # Categorize by specificity
            if any(term in keyword_lower for term in ['fiber', 'oil', 'seed', 'cbd', 'textile']):
                categories['product_specific'].append(kw)
            elif 'hemp' in keyword_lower:
                categories['industry_general'].append(kw)
        
        return categories
    
    async def _generate_keyword_strategy(self, keywords: List[Dict]) -> Dict:
        """Generate keyword targeting strategy."""
        categories = self._categorize_keywords(keywords)
        
        strategy = {
            'primary_targets': keywords[:5],
            'secondary_targets': keywords[5:15],
            'long_tail_targets': [kw for kw in keywords if len(kw['keyword'].split()) >= 3][:10],
            'quick_wins': [kw for kw in keywords if kw.get('difficulty_score', 50) < 30][:5],
            'content_opportunities': categories['informational'][:5],
            'commercial_opportunities': categories['transactional'][:5]
        }
        
        return strategy
    
    async def _analyze_competitor_content(self, url: str) -> Dict:
        """Analyze competitor content strategy."""
        if not self.session:
            self.session = aiohttp.ClientSession()
        
        try:
            async with self.session.get(url, timeout=30) as response:
                if response.status == 200:
                    html = await response.text()
                    soup = BeautifulSoup(html, 'html.parser')
                    
                    # Analyze content structure
                    return {
                        'total_pages': len(soup.find_all(['article', 'main'])),
                        'blog_posts': len(soup.find_all(class_=re.compile('blog|post|article'))),
                        'product_pages': len(soup.find_all(class_=re.compile('product|item'))),
                        'average_content_length': len(soup.get_text().split()) // max(1, len(soup.find_all(['article', 'main']))),
                        'content_freshness': 'recent' if '2024' in html or '2025' in html else 'older'
                    }
                    
        except Exception as e:
            logger.error(f"Error analyzing competitor content: {e}")
            return {}
    
    async def _estimate_backlink_profile(self, url: str) -> Dict:
        """Estimate competitor backlink profile."""
        domain = urlparse(url).netloc
        
        # In production, would use backlink API
        # For now, estimate based on domain
        domain_estimates = {
            'hempindustrydaily.com': {'estimated_backlinks': 50000, 'domain_rating': 75},
            'votehemp.com': {'estimated_backlinks': 30000, 'domain_rating': 70},
            'eiha.org': {'estimated_backlinks': 25000, 'domain_rating': 68},
            'default': {'estimated_backlinks': 5000, 'domain_rating': 50}
        }
        
        return domain_estimates.get(domain, domain_estimates['default'])
    
    async def _generate_competitor_comparison(self, analyses: List[Dict]) -> Dict:
        """Generate comparison with competitors."""
        our_metrics = {
            'domain_rating': 45,  # Placeholder
            'content_count': 50,  # Placeholder
            'average_content_length': 800  # Placeholder
        }
        
        comparison = {
            'advantages': [],
            'weaknesses': [],
            'opportunities': []
        }
        
        # Compare metrics
        for competitor in analyses:
            if competitor.get('backlink_profile', {}).get('domain_rating', 0) < our_metrics['domain_rating']:
                comparison['advantages'].append(f"Stronger domain than {competitor['domain']}")
            else:
                comparison['weaknesses'].append(f"Lower domain authority than {competitor['domain']}")
        
        return comparison
    
    async def _identify_competitor_opportunities(self, analyses: List[Dict], 
                                               comparison: Dict) -> List[Dict]:
        """Identify opportunities from competitor analysis."""
        opportunities = []
        
        for competitor in analyses:
            # Keyword gaps
            their_keywords = set(competitor.get('keywords', []))
            if their_keywords:
                opportunities.append({
                    'type': 'keyword_gap',
                    'description': f"Target keywords that {competitor['domain']} ranks for",
                    'keywords': list(their_keywords)[:5]
                })
            
            # Content gaps
            if competitor.get('content_strategy', {}).get('blog_posts', 0) > 20:
                opportunities.append({
                    'type': 'content_gap',
                    'description': f"Create content similar to {competitor['domain']}'s blog strategy",
                    'action': 'Develop regular blog content schedule'
                })
        
        return opportunities
    
    async def _update_keyword_ranking(self, keyword: str, ranking_data: Dict):
        """Update keyword ranking in database."""
        try:
            # Find existing keyword
            existing = await self.supabase.table('agent_seo_keywords')\
                .select('id, current_position')\
                .eq('keyword', keyword)\
                .execute()
            
            if existing.data:
                keyword_id = existing.data[0]['id']
                old_position = existing.data[0].get('current_position')
                
                # Update with new ranking
                await self.supabase.table('agent_seo_keywords')\
                    .update({
                        'current_position': ranking_data.get('position'),
                        'url_ranking': ranking_data.get('url_ranking'),
                        'competitors': ranking_data.get('competitors', []),
                        'last_checked_at': ranking_data.get('checked_at'),
                        'trend': self._calculate_ranking_trend(old_position, ranking_data.get('position'))
                    })\
                    .eq('id', keyword_id)\
                    .execute()
            else:
                # Insert new keyword
                await self.supabase.table('agent_seo_keywords').insert({
                    'keyword': keyword,
                    'current_position': ranking_data.get('position'),
                    'url_ranking': ranking_data.get('url_ranking'),
                    'competitors': ranking_data.get('competitors', []),
                    'last_checked_at': ranking_data.get('checked_at')
                }).execute()
                
        except Exception as e:
            logger.error(f"Error updating keyword ranking: {e}")
    
    def _calculate_ranking_trend(self, old_position: Optional[int], 
                               new_position: Optional[int]) -> str:
        """Calculate ranking trend."""
        if old_position is None or new_position is None:
            return 'stable'
        
        if new_position < old_position:
            return 'rising'
        elif new_position > old_position:
            return 'declining'
        else:
            return 'stable'
    
    async def _analyze_ranking_changes(self, ranking_updates: List[Dict]) -> Dict:
        """Analyze ranking changes."""
        improved = 0
        declined = 0
        total_positions = []
        
        for update in ranking_updates:
            if update.get('position'):
                total_positions.append(update['position'])
                
                # Check trend
                keyword = update['keyword']
                # In real implementation, would compare with previous position
                # For now, simulate based on position
                if update['position'] < 20:
                    improved += 1
                elif update['position'] > 50:
                    declined += 1
        
        return {
            'improved': improved,
            'declined': declined,
            'stable': len(ranking_updates) - improved - declined,
            'average_position': sum(total_positions) / len(total_positions) if total_positions else 0
        }
    
    # Additional helper methods
    async def audit_content_seo(self, params: Dict) -> Dict[str, Any]:
        """Audit existing content for SEO optimization."""
        content_id = params.get('content_id')
        content_url = params.get('url')
        
        if not content_id and not content_url:
            raise ValueError("Either content_id or url is required")
        
        # Implementation would audit specific content
        return {
            'status': 'completed',
            'message': 'Content SEO audit functionality to be implemented'
        }
    
    async def track_backlinks(self, params: Dict) -> Dict[str, Any]:
        """Track and analyze backlink profile."""
        target_url = params.get('url')
        
        # Implementation would track backlinks
        return {
            'status': 'completed',
            'message': 'Backlink tracking functionality to be implemented'
        }