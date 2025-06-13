"""SEO optimization utilities for content generation."""

import re
import json
import logging
from typing import Dict, List, Optional, Tuple
from collections import Counter
import asyncio

logger = logging.getLogger(__name__)


class SEOOptimizer:
    """Optimizes content for search engines."""
    
    def __init__(self):
        self.keyword_density_target = 0.015  # 1.5%
        self.min_word_count = 300
        self.ideal_title_length = (50, 60)
        self.ideal_meta_length = (150, 160)
        
    async def research_keywords(self, product_name: str) -> Dict[str, Any]:
        """Research keywords for a product."""
        # In a real implementation, this would use APIs like:
        # - Google Keyword Planner
        # - SEMrush
        # - Ahrefs
        # - Moz
        
        # For now, generate keywords based on product name
        base_keyword = product_name.lower()
        
        # Generate variations
        keyword_variations = self._generate_keyword_variations(base_keyword)
        
        # Simulate keyword data
        keywords = {
            'primary_keyword': base_keyword,
            'secondary_keywords': keyword_variations[:5],
            'long_tail_keywords': [
                f"best {base_keyword}",
                f"{base_keyword} benefits",
                f"how to use {base_keyword}",
                f"{base_keyword} vs alternatives",
                f"sustainable {base_keyword}"
            ],
            'all_keywords': [base_keyword] + keyword_variations,
            'search_volume': {
                base_keyword: 1000,  # Simulated monthly searches
                **{kw: 100 + (i * 50) for i, kw in enumerate(keyword_variations)}
            },
            'difficulty': {
                base_keyword: 0.6,  # 0-1 scale
                **{kw: 0.4 + (i * 0.1) for i, kw in enumerate(keyword_variations)}
            }
        }
        
        return keywords
    
    def _generate_keyword_variations(self, base_keyword: str) -> List[str]:
        """Generate keyword variations."""
        variations = []
        
        # Add hemp-specific modifiers
        prefixes = ['hemp', 'industrial hemp', 'sustainable', 'eco-friendly', 'organic']
        suffixes = ['products', 'uses', 'applications', 'benefits', 'industry']
        
        for prefix in prefixes:
            if prefix not in base_keyword:
                variations.append(f"{prefix} {base_keyword}")
        
        for suffix in suffixes:
            if suffix not in base_keyword:
                variations.append(f"{base_keyword} {suffix}")
        
        # Add location-based variations
        variations.extend([
            f"{base_keyword} USA",
            f"{base_keyword} wholesale",
            f"{base_keyword} manufacturers"
        ])
        
        return variations[:10]  # Limit to top 10
    
    async def optimize_content(self, content: str, primary_keyword: str, 
                             secondary_keywords: List[str] = None) -> Dict[str, Any]:
        """Optimize content for SEO."""
        if not secondary_keywords:
            secondary_keywords = []
        
        # Extract or generate title
        title = self._extract_or_generate_title(content, primary_keyword)
        
        # Optimize title
        optimized_title = self._optimize_title(title, primary_keyword)
        
        # Generate meta description
        meta_description = self._generate_meta_description(content, primary_keyword)
        
        # Optimize content structure
        optimized_content = self._optimize_content_structure(content, primary_keyword, secondary_keywords)
        
        # Add schema markup suggestions
        schema_markup = self._suggest_schema_markup(content)
        
        # Calculate improvements
        improvements = self._identify_improvements(content, optimized_content)
        
        return {
            'title': optimized_title,
            'meta_description': meta_description,
            'content': optimized_content,
            'excerpt': self._generate_excerpt(optimized_content),
            'improvements': improvements,
            'schema_markup': schema_markup,
            'keyword_density': self._calculate_keyword_density(optimized_content, primary_keyword),
            'readability_score': self.calculate_readability_score(optimized_content)
        }
    
    def _extract_or_generate_title(self, content: str, keyword: str) -> str:
        """Extract title from content or generate one."""
        # Look for H1 or first line
        lines = content.split('\n')
        for line in lines[:5]:
            if line.strip() and (line.startswith('#') or len(line) < 100):
                return line.strip('#').strip()
        
        # Generate title
        return f"Complete Guide to {keyword.title()}"
    
    def _optimize_title(self, title: str, keyword: str) -> str:
        """Optimize title for SEO."""
        # Ensure keyword is in title
        if keyword.lower() not in title.lower():
            title = f"{keyword.title()}: {title}"
        
        # Optimize length
        if len(title) < self.ideal_title_length[0]:
            title += f" - Hemp Industry Guide"
        elif len(title) > self.ideal_title_length[1]:
            title = title[:self.ideal_title_length[1]-3] + "..."
        
        return title
    
    def _generate_meta_description(self, content: str, keyword: str) -> str:
        """Generate SEO-optimized meta description."""
        # Extract first paragraph or summary
        paragraphs = [p.strip() for p in content.split('\n\n') if p.strip()]
        
        if paragraphs:
            description = paragraphs[0][:200]
        else:
            description = content[:200]
        
        # Ensure keyword is included
        if keyword.lower() not in description.lower():
            description = f"Discover {keyword} - {description}"
        
        # Optimize length
        if len(description) > self.ideal_meta_length[1]:
            description = description[:self.ideal_meta_length[1]-3] + "..."
        
        # Add call to action if space
        if len(description) < self.ideal_meta_length[0]:
            description += " Learn more about hemp innovation."
        
        return description
    
    def _optimize_content_structure(self, content: str, primary_keyword: str, 
                                  secondary_keywords: List[str]) -> str:
        """Optimize content structure for SEO."""
        lines = content.split('\n')
        optimized_lines = []
        
        # Track keyword usage
        primary_count = 0
        target_primary_count = max(3, int(len(content.split()) * self.keyword_density_target))
        
        for i, line in enumerate(lines):
            # Optimize headings
            if line.startswith('#'):
                line = self._optimize_heading(line, primary_keyword, secondary_keywords)
            
            # Add keywords naturally
            elif len(line) > 50 and primary_count < target_primary_count:
                if primary_keyword.lower() not in line.lower() and i % 5 == 0:
                    line = self._insert_keyword_naturally(line, primary_keyword)
                    primary_count += 1
            
            optimized_lines.append(line)
        
        # Ensure proper heading hierarchy
        optimized_content = '\n'.join(optimized_lines)
        optimized_content = self._ensure_heading_hierarchy(optimized_content)
        
        return optimized_content
    
    def _optimize_heading(self, heading: str, primary_keyword: str, 
                         secondary_keywords: List[str]) -> str:
        """Optimize a heading for SEO."""
        heading_text = heading.strip('#').strip()
        
        # Add keywords to headings if not present
        keywords_in_heading = any(
            kw.lower() in heading_text.lower() 
            for kw in [primary_keyword] + secondary_keywords
        )
        
        if not keywords_in_heading and len(heading_text.split()) < 8:
            # Add a relevant keyword
            if 'benefit' in heading_text.lower():
                heading_text = f"{primary_keyword} {heading_text}"
            elif 'how' in heading_text.lower():
                heading_text = heading_text.replace('How', f'How {primary_keyword}')
        
        # Preserve heading level
        level = len(heading) - len(heading.lstrip('#'))
        return '#' * level + ' ' + heading_text
    
    def _insert_keyword_naturally(self, text: str, keyword: str) -> str:
        """Insert keyword naturally into text."""
        # Simple implementation - in production would use NLP
        words = text.split()
        
        # Find good insertion points
        insertion_words = ['with', 'using', 'including', 'such as', 'like']
        
        for i, word in enumerate(words):
            if word.lower() in insertion_words and i < len(words) - 1:
                words.insert(i + 1, keyword)
                break
        else:
            # Insert at beginning of sentence
            if len(words) > 10:
                words.insert(5, f"({keyword})")
        
        return ' '.join(words)
    
    def _ensure_heading_hierarchy(self, content: str) -> str:
        """Ensure proper H1 -> H2 -> H3 hierarchy."""
        lines = content.split('\n')
        
        # Track heading levels
        has_h1 = any(line.startswith('# ') for line in lines)
        
        if not has_h1:
            # Add H1 at beginning
            lines.insert(0, f"# {lines[0].strip('#').strip()}")
        
        return '\n'.join(lines)
    
    def _generate_excerpt(self, content: str) -> str:
        """Generate excerpt from content."""
        # Remove markdown formatting
        text = re.sub(r'#+ ', '', content)
        text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
        text = re.sub(r'\*(.*?)\*', r'\1', text)
        text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)
        
        # Get first 2-3 sentences
        sentences = text.split('. ')[:3]
        excerpt = '. '.join(sentences)
        
        if len(excerpt) > 300:
            excerpt = excerpt[:297] + '...'
        
        return excerpt
    
    def _suggest_schema_markup(self, content: str) -> Dict[str, Any]:
        """Suggest appropriate schema markup."""
        # Detect content type and suggest schema
        schema_suggestions = {
            'Article': {
                '@context': 'https://schema.org',
                '@type': 'Article',
                'headline': 'Title here',
                'description': 'Meta description here',
                'author': {
                    '@type': 'Organization',
                    'name': 'HempQuarterz'
                }
            }
        }
        
        # Add product schema if product-focused
        if 'product' in content.lower() or 'price' in content.lower():
            schema_suggestions['Product'] = {
                '@context': 'https://schema.org',
                '@type': 'Product',
                'name': 'Product name',
                'description': 'Product description',
                'category': 'Hemp Products'
            }
        
        return schema_suggestions
    
    def _identify_improvements(self, original: str, optimized: str) -> List[str]:
        """Identify improvements made."""
        improvements = []
        
        # Check keyword additions
        original_lower = original.lower()
        optimized_lower = optimized.lower()
        
        for keyword in ['hemp', 'sustainable', 'industrial']:
            if optimized_lower.count(keyword) > original_lower.count(keyword):
                improvements.append(f"Added '{keyword}' keyword for better SEO")
        
        # Check structure improvements
        if optimized.count('#') > original.count('#'):
            improvements.append("Improved heading structure")
        
        # Check meta elements
        if len(optimized) > len(original):
            improvements.append("Expanded content for better coverage")
        
        return improvements
    
    def _calculate_keyword_density(self, content: str, keyword: str) -> float:
        """Calculate keyword density."""
        words = content.lower().split()
        keyword_count = content.lower().count(keyword.lower())
        
        if len(words) == 0:
            return 0
        
        return keyword_count / len(words)
    
    def calculate_readability_score(self, content: str) -> float:
        """Calculate readability score (simplified Flesch Reading Ease)."""
        # Remove markdown
        text = re.sub(r'[#*\[\]()]', '', content)
        
        # Count sentences
        sentences = len(re.findall(r'[.!?]+', text))
        if sentences == 0:
            sentences = 1
        
        # Count words
        words = len(text.split())
        if words == 0:
            return 0
        
        # Count syllables (simplified)
        syllables = sum(self._count_syllables(word) for word in text.split())
        
        # Flesch Reading Ease formula
        score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
        
        # Normalize to 0-1 scale
        normalized = max(0, min(100, score)) / 100
        
        return round(normalized, 2)
    
    def _count_syllables(self, word: str) -> int:
        """Count syllables in a word (simplified)."""
        word = word.lower()
        vowels = 'aeiou'
        syllables = 0
        previous_was_vowel = False
        
        for char in word:
            is_vowel = char in vowels
            if is_vowel and not previous_was_vowel:
                syllables += 1
            previous_was_vowel = is_vowel
        
        # Adjust for silent e
        if word.endswith('e'):
            syllables -= 1
        
        # Ensure at least 1 syllable
        return max(1, syllables)
    
    def calculate_seo_score(self, content: Dict, keywords: Dict) -> float:
        """Calculate overall SEO score."""
        score = 0.0
        max_score = 0.0
        
        # Title optimization (20%)
        max_score += 20
        title = content.get('title', '')
        if keywords['primary_keyword'].lower() in title.lower():
            score += 10
        if self.ideal_title_length[0] <= len(title) <= self.ideal_title_length[1]:
            score += 10
        
        # Meta description (15%)
        max_score += 15
        meta = content.get('meta_description', '')
        if keywords['primary_keyword'].lower() in meta.lower():
            score += 8
        if self.ideal_meta_length[0] <= len(meta) <= self.ideal_meta_length[1]:
            score += 7
        
        # Content length (15%)
        max_score += 15
        word_count = len(content.get('content', '').split())
        if word_count >= 1500:
            score += 15
        elif word_count >= 1000:
            score += 10
        elif word_count >= 500:
            score += 5
        
        # Keyword density (20%)
        max_score += 20
        density = content.get('keyword_density', 0)
        if 0.01 <= density <= 0.02:
            score += 20
        elif 0.005 <= density <= 0.025:
            score += 10
        
        # Heading structure (15%)
        max_score += 15
        content_text = content.get('content', '')
        if content_text.count('# ') >= 1:  # Has H1
            score += 5
        if content_text.count('## ') >= 3:  # Has multiple H2s
            score += 10
        
        # Readability (15%)
        max_score += 15
        readability = content.get('readability_score', 0)
        score += readability * 15
        
        return round(score / max_score, 2) if max_score > 0 else 0