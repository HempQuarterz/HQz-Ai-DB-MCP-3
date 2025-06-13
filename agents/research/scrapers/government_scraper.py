"""Government website scraper for hemp regulatory information."""

import asyncio
import logging
from typing import Dict, List, Optional
from datetime import datetime
import aiohttp
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

logger = logging.getLogger(__name__)


class GovernmentScraper:
    """Scrapes government websites for hemp-related regulatory information."""
    
    def __init__(self):
        self.session = None
        self.sources = self._initialize_sources()
        
    def _initialize_sources(self) -> List[Dict]:
        """Initialize government data sources."""
        return [
            {
                'name': 'USDA AMS Hemp',
                'url': 'https://www.ams.usda.gov/rules-regulations/hemp',
                'type': 'federal',
                'jurisdiction': 'USA',
                'selectors': {
                    'updates': '.node--type-announcement, .node--type-news',
                    'title': 'h2, .node__title',
                    'content': '.node__content, .field--name-body',
                    'date': '.field--name-post-date, time'
                }
            },
            {
                'name': 'FDA Hemp & CBD',
                'url': 'https://www.fda.gov/news-events/public-health-focus/fda-regulation-cannabis-and-cannabis-derived-products',
                'type': 'federal',
                'jurisdiction': 'USA',
                'selectors': {
                    'updates': '.list-item',
                    'title': 'h3, .title',
                    'content': '.description',
                    'date': '.date'
                }
            },
            {
                'name': 'DEA Hemp',
                'url': 'https://www.dea.gov/drug-information/hemp',
                'type': 'federal',
                'jurisdiction': 'USA',
                'selectors': {
                    'content': '.content-area',
                    'regulations': '.regulation-item'
                }
            },
            {
                'name': 'Health Canada Hemp',
                'url': 'https://www.canada.ca/en/health-canada/services/drugs-medication/cannabis/industry-licensees-applicants/licensing-summary/guide-cannabis-regulations.html',
                'type': 'federal',
                'jurisdiction': 'Canada',
                'selectors': {
                    'sections': '.module-content',
                    'updates': '.alert',
                    'content': '.mrgn-tp-lg'
                }
            }
        ]
    
    async def scrape_all(self) -> List[Dict]:
        """Scrape all government sources for regulatory updates."""
        all_updates = []
        
        async with aiohttp.ClientSession() as self.session:
            tasks = [self.scrape_source(source) for source in self.sources]
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            for result in results:
                if isinstance(result, Exception):
                    logger.error(f"Scraping error: {result}")
                else:
                    all_updates.extend(result)
        
        return all_updates
    
    async def scrape_source(self, source: Dict) -> List[Dict]:
        """Scrape a single government source."""
        updates = []
        
        try:
            async with self.session.get(source['url'], timeout=30) as response:
                if response.status == 200:
                    html = await response.text()
                    soup = BeautifulSoup(html, 'html.parser')
                    
                    # Extract updates based on selectors
                    updates = self._extract_updates(soup, source)
                    
                    logger.info(f"Scraped {len(updates)} updates from {source['name']}")
                else:
                    logger.warning(f"Failed to scrape {source['name']}: HTTP {response.status}")
                    
        except asyncio.TimeoutError:
            logger.error(f"Timeout scraping {source['name']}")
        except Exception as e:
            logger.error(f"Error scraping {source['name']}: {e}")
            
        return updates
    
    def _extract_updates(self, soup: BeautifulSoup, source: Dict) -> List[Dict]:
        """Extract regulatory updates from parsed HTML."""
        updates = []
        selectors = source.get('selectors', {})
        
        # Find update elements
        update_selector = selectors.get('updates')
        if update_selector:
            update_elements = soup.select(update_selector)
            
            for element in update_elements[:10]:  # Limit to recent updates
                update = self._parse_update_element(element, source, soup)
                if update:
                    updates.append(update)
        else:
            # Fallback: extract general content
            content_selector = selectors.get('content', 'body')
            content_element = soup.select_one(content_selector)
            
            if content_element:
                update = {
                    'source': source['name'],
                    'url': source['url'],
                    'type': 'general_content',
                    'jurisdiction': source['jurisdiction'],
                    'title': self._extract_page_title(soup),
                    'content': self._clean_text(content_element.get_text()),
                    'extracted_date': datetime.now().isoformat()
                }
                updates.append(update)
        
        return updates
    
    def _parse_update_element(self, element, source: Dict, soup: BeautifulSoup) -> Optional[Dict]:
        """Parse a single update element."""
        selectors = source.get('selectors', {})
        
        # Extract title
        title_selector = selectors.get('title')
        title_elem = element.select_one(title_selector) if title_selector else None
        title = self._clean_text(title_elem.get_text()) if title_elem else None
        
        if not title:
            # Try to find any heading
            heading = element.find(['h1', 'h2', 'h3', 'h4'])
            title = self._clean_text(heading.get_text()) if heading else 'Untitled Update'
        
        # Extract content
        content_selector = selectors.get('content')
        content_elem = element.select_one(content_selector) if content_selector else element
        content = self._clean_text(content_elem.get_text())
        
        # Extract date
        date_selector = selectors.get('date')
        date_elem = element.select_one(date_selector) if date_selector else None
        date_str = self._parse_date(date_elem) if date_elem else None
        
        # Extract URL if it's a link
        link = element.find('a') or element.find_parent('a')
        url = urljoin(source['url'], link.get('href')) if link else source['url']
        
        return {
            'source': source['name'],
            'url': url,
            'type': 'regulatory_update',
            'jurisdiction': source['jurisdiction'],
            'title': title,
            'content': content[:1000],  # Limit content length
            'full_content': content,
            'date_published': date_str,
            'extracted_date': datetime.now().isoformat(),
            'metadata': {
                'source_type': source['type'],
                'selectors_used': selectors
            }
        }
    
    def _extract_page_title(self, soup: BeautifulSoup) -> str:
        """Extract page title."""
        # Try various title selectors
        title_selectors = ['h1', 'title', '.page-title', '#page-title']
        
        for selector in title_selectors:
            title_elem = soup.select_one(selector)
            if title_elem:
                return self._clean_text(title_elem.get_text())
        
        return 'Untitled Page'
    
    def _parse_date(self, date_elem) -> Optional[str]:
        """Parse date from various formats."""
        if not date_elem:
            return None
            
        date_text = date_elem.get_text(strip=True)
        
        # Try to parse common date formats
        date_formats = [
            '%B %d, %Y',  # January 1, 2024
            '%m/%d/%Y',   # 01/01/2024
            '%Y-%m-%d',   # 2024-01-01
            '%d %B %Y',   # 1 January 2024
        ]
        
        for fmt in date_formats:
            try:
                parsed_date = datetime.strptime(date_text, fmt)
                return parsed_date.isoformat()
            except ValueError:
                continue
        
        # If parsing fails, return the raw text
        return date_text
    
    def _clean_text(self, text: str) -> str:
        """Clean and normalize text."""
        # Remove excessive whitespace
        text = ' '.join(text.split())
        
        # Remove common artifacts
        text = text.replace('\n', ' ')
        text = text.replace('\t', ' ')
        text = text.replace('\xa0', ' ')  # Non-breaking space
        
        return text.strip()
    
    async def scrape_specific_regulation(self, url: str) -> Optional[Dict]:
        """Scrape a specific regulation page."""
        async with aiohttp.ClientSession() as session:
            try:
                async with session.get(url, timeout=30) as response:
                    if response.status == 200:
                        html = await response.text()
                        soup = BeautifulSoup(html, 'html.parser')
                        
                        # Extract regulation details
                        regulation = {
                            'url': url,
                            'title': self._extract_page_title(soup),
                            'content': self._extract_regulation_content(soup),
                            'effective_date': self._extract_effective_date(soup),
                            'jurisdiction': self._determine_jurisdiction(url),
                            'extracted_date': datetime.now().isoformat()
                        }
                        
                        return regulation
                        
            except Exception as e:
                logger.error(f"Error scraping regulation {url}: {e}")
                
        return None
    
    def _extract_regulation_content(self, soup: BeautifulSoup) -> str:
        """Extract main content from regulation page."""
        # Common content selectors
        content_selectors = [
            '.content', '#content', 'main', 
            'article', '.regulation-text', '.body-content'
        ]
        
        for selector in content_selectors:
            content = soup.select_one(selector)
            if content:
                return self._clean_text(content.get_text())
        
        # Fallback to body
        body = soup.find('body')
        return self._clean_text(body.get_text()) if body else ''
    
    def _extract_effective_date(self, soup: BeautifulSoup) -> Optional[str]:
        """Extract effective date from regulation page."""
        # Look for common effective date patterns
        date_patterns = [
            'effective date', 'effective:', 'in effect',
            'implementation date', 'compliance date'
        ]
        
        text = soup.get_text().lower()
        
        for pattern in date_patterns:
            if pattern in text:
                # Extract text around the pattern
                idx = text.find(pattern)
                surrounding_text = text[idx:idx+100]
                
                # Try to parse date from surrounding text
                # This is simplified - in production would use more sophisticated parsing
                import re
                date_match = re.search(r'\b(\d{1,2}/\d{1,2}/\d{2,4}|\w+ \d{1,2}, \d{4})\b', surrounding_text)
                if date_match:
                    return date_match.group(1)
        
        return None
    
    def _determine_jurisdiction(self, url: str) -> str:
        """Determine jurisdiction from URL."""
        domain = urlparse(url).netloc.lower()
        
        if '.gov' in domain:
            if 'usda' in domain or 'fda' in domain or 'dea' in domain:
                return 'USA Federal'
            elif any(state in domain for state in ['.ca.gov', '.ny.gov', '.co.gov']):
                return 'USA State'
        elif '.gc.ca' in domain or 'canada.ca' in domain:
            return 'Canada Federal'
        elif '.gov.uk' in domain:
            return 'UK'
        elif '.europa.eu' in domain:
            return 'EU'
        
        return 'Unknown'