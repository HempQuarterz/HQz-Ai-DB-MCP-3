"""Blog post template for hemp content generation."""

import json
from typing import Dict, Any, Optional
from datetime import datetime


class BlogPostTemplate:
    """Template for generating blog posts about hemp products."""
    
    def __init__(self):
        self.sections = [
            'introduction',
            'what_is',
            'benefits',
            'sustainability',
            'applications',
            'production',
            'future_outlook',
            'conclusion'
        ]
        
    async def generate(self, product: Dict[str, Any], ai_provider, 
                      word_count: int = 1500, tone: str = 'informative') -> Dict[str, Any]:
        """Generate a blog post using the template."""
        
        # Build comprehensive prompt
        prompt = self._build_prompt(product, word_count, tone)
        
        # Generate content
        response, provider, cost = await ai_provider.generate(
            prompt,
            temperature=0.7,
            max_tokens=3000
        )
        
        # Parse and structure response
        try:
            content_data = json.loads(response)
        except json.JSONDecodeError:
            # Fallback structure
            content_data = {
                'title': f"The Complete Guide to {product['name']}",
                'content': response,
                'meta_description': f"Learn about {product['name']} - benefits, uses, and sustainability.",
                'excerpt': product['description'][:150]
            }
        
        # Add metadata
        content_data['metadata'] = {
            'template': 'blog_post',
            'product_id': product.get('id'),
            'generated_at': datetime.now().isoformat(),
            'word_count_target': word_count,
            'tone': tone,
            'ai_cost': cost
        }
        
        return content_data
    
    def _build_prompt(self, product: Dict, word_count: int, tone: str) -> str:
        """Build the generation prompt."""
        return f"""
        Write a comprehensive, SEO-optimized blog post about {product['name']}.
        
        Product Information:
        - Name: {product['name']}
        - Description: {product['description']}
        - Plant Part: {product['plant_part']}
        - Industry: {product['industry']}
        - Benefits: {', '.join(product.get('benefits_advantages', []))}
        - Sustainability: {', '.join(product.get('sustainability_aspects', []))}
        - Technical Specs: {json.dumps(product.get('technical_specifications', {}))}
        - Stage: {product.get('commercialization_stage', 'Growing')}
        
        Requirements:
        1. Target length: {word_count} words
        2. Tone: {tone}
        3. SEO-optimized with natural keyword usage
        4. Engaging and informative
        5. Scientifically accurate
        6. No unsubstantiated health claims
        
        Structure:
        
        # [SEO Title - 50-60 characters]
        
        ## Introduction (150-200 words)
        - Hook the reader
        - Introduce {product['name']}
        - Preview what they'll learn
        
        ## What is {product['name']}? (200-250 words)
        - Clear definition
        - How it's derived from hemp
        - Key characteristics
        
        ## Benefits and Advantages (300-400 words)
        - Expand on each benefit
        - Compare to alternatives
        - Real-world impact
        
        ## Sustainability Aspects (250-300 words)
        - Environmental benefits
        - Carbon footprint
        - Renewable aspects
        
        ## Applications and Use Cases (300-350 words)
        - Current applications
        - Industry adoption
        - Case studies or examples
        
        ## How {product['name']} is Made (200-250 words)
        - Production process
        - Quality considerations
        - Innovation in manufacturing
        
        ## Future Outlook (200-250 words)
        - Market trends
        - Emerging applications
        - Research developments
        
        ## Conclusion (150-200 words)
        - Summarize key points
        - Call to action
        - Future potential
        
        Output as JSON:
        {{
            "title": "SEO-optimized title",
            "meta_description": "150-160 character description",
            "excerpt": "2-3 sentence summary",
            "content": "Full blog post in markdown format",
            "keywords": ["primary", "secondary", "keywords"],
            "internal_links": ["suggested internal link opportunities"],
            "external_links": ["authoritative sources to reference"]
        }}
        """
    
    def validate_output(self, content: Dict) -> tuple[bool, list[str]]:
        """Validate the generated content meets requirements."""
        errors = []
        
        # Check required fields
        required_fields = ['title', 'content', 'meta_description']
        for field in required_fields:
            if field not in content:
                errors.append(f"Missing required field: {field}")
        
        # Validate title length
        if 'title' in content:
            title_len = len(content['title'])
            if title_len < 30:
                errors.append("Title too short (min 30 chars)")
            elif title_len > 70:
                errors.append("Title too long (max 70 chars)")
        
        # Validate meta description
        if 'meta_description' in content:
            meta_len = len(content['meta_description'])
            if meta_len < 120:
                errors.append("Meta description too short (min 120 chars)")
            elif meta_len > 160:
                errors.append("Meta description too long (max 160 chars)")
        
        # Validate content structure
        if 'content' in content:
            content_text = content['content']
            
            # Check for required sections
            for section in self.sections:
                section_keywords = {
                    'introduction': ['introduction', 'intro'],
                    'what_is': ['what is', 'definition'],
                    'benefits': ['benefits', 'advantages'],
                    'sustainability': ['sustainab', 'eco-friendly', 'environmental'],
                    'applications': ['application', 'use case', 'uses'],
                    'production': ['how', 'made', 'produc', 'manufactur'],
                    'future_outlook': ['future', 'outlook', 'trend'],
                    'conclusion': ['conclusion', 'summary']
                }
                
                # Check if section exists
                section_found = any(
                    keyword in content_text.lower() 
                    for keyword in section_keywords.get(section, [])
                )
                
                if not section_found:
                    errors.append(f"Missing section: {section}")
        
        return len(errors) == 0, errors
    
    def enhance_with_cta(self, content: str, product_name: str) -> str:
        """Add call-to-action elements to the content."""
        cta_options = [
            f"\n\n**Ready to explore {product_name}?** Contact our experts to learn more about incorporating this sustainable solution into your business.",
            f"\n\n**Interested in {product_name}?** Browse our selection of high-quality hemp products and discover the perfect solution for your needs.",
            f"\n\n**Take the Next Step** - Join the hemp revolution with {product_name}. Get in touch with our team for samples and pricing.",
            f"\n\n**Learn More About Hemp Innovation** - Subscribe to our newsletter for the latest updates on {product_name} and other hemp industry developments."
        ]
        
        # Add CTA if not already present
        if 'contact' not in content.lower() and 'learn more' not in content.lower():
            import random
            content += random.choice(cta_options)
        
        return content