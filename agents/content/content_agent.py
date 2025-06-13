"""Hemp Content Agent - Generates optimized content for various platforms."""

import asyncio
import json
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import yaml
from pathlib import Path

from ..core.base_agent import BaseAgent, rate_limited, track_performance
from .seo_optimizer import SEOOptimizer
from .templates import BlogPostTemplate, ProductDescriptionTemplate, SocialMediaTemplate

logger = logging.getLogger(__name__)


class HempContentAgent(BaseAgent):
    """Agent responsible for generating SEO-optimized content about hemp products."""
    
    def __init__(self, supabase_client, ai_provider=None):
        super().__init__(supabase_client, ai_provider)
        self.seo_optimizer = SEOOptimizer()
        self.templates = self._load_templates()
        self.prompts = self._load_prompts()
        
    def _load_templates(self) -> Dict:
        """Load content templates."""
        return {
            'blog_post': BlogPostTemplate(),
            'product_description': ProductDescriptionTemplate(),
            'social_media': SocialMediaTemplate()
        }
    
    def _load_prompts(self) -> Dict:
        """Load prompt templates from YAML."""
        prompts_path = Path(__file__).parent.parent.parent / 'config' / 'prompts' / 'content_prompts.yaml'
        
        if prompts_path.exists():
            with open(prompts_path, 'r') as f:
                return yaml.safe_load(f)
        else:
            logger.warning("Content prompts file not found, using defaults")
            return self._default_prompts()
    
    def _default_prompts(self) -> Dict:
        """Default prompts if YAML file not found."""
        return {
            'blog_post_generation': {
                'system': 'You are an expert content writer specializing in the hemp industry.',
                'user': 'Write a comprehensive blog post about {product_name}.'
            },
            'social_media_templates': {
                'twitter': {
                    'system': 'You are a social media expert who creates engaging Twitter content.',
                    'user': 'Create {variations} Twitter posts about {product_name}.'
                }
            }
        }
    
    @track_performance
    async def execute(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute content generation task."""
        action = task.get('action')
        
        content_actions = {
            'generate_blog_post': self.generate_blog_post,
            'generate_product_description': self.generate_product_description,
            'generate_social_media': self.generate_social_media,
            'generate_email_content': self.generate_email_content,
            'optimize_existing_content': self.optimize_existing_content,
            'generate_content_batch': self.generate_content_batch
        }
        
        if action in content_actions:
            return await content_actions[action](task.get('params', {}))
        else:
            raise ValueError(f"Unknown content action: {action}")
    
    @rate_limited(calls=5, period=60)
    async def generate_blog_post(self, params: Dict) -> Dict[str, Any]:
        """Generate SEO-optimized blog post about a hemp product."""
        product_id = params.get('product_id')
        word_count = params.get('word_count', 1500)
        tone = params.get('tone', 'informative')
        
        if not product_id:
            raise ValueError("product_id is required")
        
        logger.info(f"Generating blog post for product {product_id}")
        
        # Fetch product data
        product = await self._fetch_product_data(product_id)
        if not product:
            raise ValueError(f"Product {product_id} not found")
        
        # Get SEO keywords
        keywords = await self.seo_optimizer.research_keywords(product['name'])
        
        # Generate content using AI
        content = await self._generate_blog_content(product, keywords, word_count, tone)
        
        # Optimize for SEO
        optimized_content = await self.seo_optimizer.optimize_content(
            content['content'],
            keywords['primary_keyword'],
            keywords['secondary_keywords']
        )
        
        # Calculate scores
        seo_score = self.seo_optimizer.calculate_seo_score(optimized_content, keywords)
        readability_score = self.seo_optimizer.calculate_readability_score(optimized_content['content'])
        
        # Save to database
        saved_content = await self._save_generated_content({
            'content_type': 'blog_post',
            'title': optimized_content['title'],
            'content': optimized_content['content'],
            'excerpt': optimized_content.get('excerpt', ''),
            'meta_description': optimized_content['meta_description'],
            'seo_keywords': keywords['all_keywords'],
            'product_id': product_id,
            'word_count': len(optimized_content['content'].split()),
            'seo_score': seo_score,
            'readability_score': readability_score,
            'tone': tone,
            'status': 'draft'
        })
        
        return {
            'status': 'completed',
            'content_id': saved_content['id'],
            'title': optimized_content['title'],
            'word_count': len(optimized_content['content'].split()),
            'seo_score': seo_score,
            'readability_score': readability_score,
            'keywords_used': keywords['all_keywords'][:5]
        }
    
    async def _fetch_product_data(self, product_id: int) -> Optional[Dict]:
        """Fetch product data from database."""
        try:
            result = await self.supabase.table('uses_products')\
                .select('*')\
                .eq('id', product_id)\
                .single()\
                .execute()
            
            return result.data
        except Exception as e:
            logger.error(f"Error fetching product {product_id}: {e}")
            return None
    
    async def _generate_blog_content(self, product: Dict, keywords: Dict, 
                                   word_count: int, tone: str) -> Dict[str, Any]:
        """Generate blog content using AI."""
        prompt_template = self.prompts.get('blog_post_generation', {})
        
        # Build the prompt
        user_prompt = f"""
        Write a comprehensive, SEO-optimized blog post about {product['name']}.
        
        Product details:
        - Description: {product['description']}
        - Plant part: {product['plant_part']}
        - Industry: {product['industry']}
        - Benefits: {', '.join(product.get('benefits_advantages', []))}
        - Sustainability: {', '.join(product.get('sustainability_aspects', []))}
        
        Target keywords: {keywords['primary_keyword']}, {', '.join(keywords['secondary_keywords'][:3])}
        
        Requirements:
        - Length: approximately {word_count} words
        - Tone: {tone}
        - Include these sections:
          1. Engaging introduction with hook
          2. What is {product['name']}?
          3. Benefits and advantages (expand on each)
          4. Sustainability aspects
          5. Market applications and use cases
          6. How it's made/processed
          7. Future outlook and innovations
          8. Conclusion with call-to-action
        
        SEO requirements:
        - Use primary keyword "{keywords['primary_keyword']}" 3-5 times naturally
        - Include secondary keywords throughout
        - Create an SEO-friendly title (50-60 characters)
        - Write a meta description (150-160 characters)
        - Use H2 headings for main sections
        - Include H3 subheadings where appropriate
        
        Output format:
        ```json
        {
            "title": "SEO-optimized title",
            "meta_description": "Compelling meta description",
            "excerpt": "2-3 sentence excerpt",
            "content": "Full blog post content in markdown format"
        }
        ```
        """
        
        try:
            response, provider, cost = await self.ai_provider.generate(
                user_prompt,
                temperature=0.7,
                max_tokens=3000
            )
            
            # Log AI usage
            await self._log_ai_usage('blog_generation', cost)
            
            # Parse JSON response
            content_data = json.loads(response)
            
            return content_data
            
        except json.JSONDecodeError:
            logger.error("Failed to parse AI response as JSON")
            # Fallback: treat entire response as content
            return {
                'title': f"The Ultimate Guide to {product['name']}",
                'meta_description': f"Discover everything about {product['name']} - benefits, uses, and sustainability in the hemp industry.",
                'excerpt': product['description'][:200],
                'content': response
            }
    
    @rate_limited(calls=10, period=60)
    async def generate_social_media(self, params: Dict) -> Dict[str, Any]:
        """Generate social media content for multiple platforms."""
        product_id = params.get('product_id')
        platforms = params.get('platforms', ['twitter', 'linkedin', 'instagram'])
        variations = params.get('variations', 3)
        
        if not product_id:
            raise ValueError("product_id is required")
        
        logger.info(f"Generating social media content for product {product_id}")
        
        # Fetch product data
        product = await self._fetch_product_data(product_id)
        if not product:
            raise ValueError(f"Product {product_id} not found")
        
        # Generate content for each platform
        all_content = {}
        
        for platform in platforms:
            platform_content = await self._generate_platform_content(
                product, platform, variations
            )
            all_content[platform] = platform_content
        
        # Save generated content
        saved_items = []
        for platform, posts in all_content.items():
            for i, post in enumerate(posts):
                saved = await self._save_generated_content({
                    'content_type': 'social_media',
                    'title': f"{product['name']} - {platform} post {i+1}",
                    'content': post['content'],
                    'product_id': product_id,
                    'metadata': {
                        'platform': platform,
                        'hashtags': post.get('hashtags', []),
                        'character_count': len(post['content'])
                    },
                    'status': 'draft'
                })
                saved_items.append(saved['id'])
        
        return {
            'status': 'completed',
            'content_generated': len(saved_items),
            'platforms': list(all_content.keys()),
            'content_ids': saved_items,
            'sample_content': {
                platform: posts[0] if posts else None 
                for platform, posts in all_content.items()
            }
        }
    
    async def _generate_platform_content(self, product: Dict, platform: str, 
                                       variations: int) -> List[Dict]:
        """Generate content for a specific social media platform."""
        platform_prompts = self.prompts.get('social_media_templates', {}).get(platform, {})
        
        if platform == 'twitter':
            return await self._generate_twitter_posts(product, variations)
        elif platform == 'linkedin':
            return await self._generate_linkedin_posts(product, variations)
        elif platform == 'instagram':
            return await self._generate_instagram_posts(product, variations)
        else:
            logger.warning(f"Unknown platform: {platform}")
            return []
    
    async def _generate_twitter_posts(self, product: Dict, variations: int) -> List[Dict]:
        """Generate Twitter/X posts."""
        posts = []
        
        prompt = f"""
        Create {variations} Twitter posts about {product['name']}.
        
        Product highlights:
        - {product['description'][:100]}
        - Key benefits: {', '.join(product.get('benefits_advantages', [])[:2])}
        
        Requirements for each post:
        - Maximum 280 characters (including hashtags)
        - Engaging and shareable
        - Include 2-3 relevant hashtags
        - Vary the angle/focus for each variation
        - Include a call-to-action when appropriate
        
        Output as JSON array:
        ```json
        [
            {{
                "content": "Post text with hashtags",
                "hashtags": ["hemp", "sustainability"],
                "focus": "benefit or angle highlighted"
            }}
        ]
        ```
        """
        
        try:
            response, provider, cost = await self.ai_provider.generate(prompt, temperature=0.8)
            await self._log_ai_usage('social_media_twitter', cost)
            
            posts_data = json.loads(response)
            
            for post_data in posts_data:
                posts.append({
                    'content': post_data['content'],
                    'hashtags': post_data.get('hashtags', []),
                    'character_count': len(post_data['content']),
                    'platform': 'twitter'
                })
                
        except Exception as e:
            logger.error(f"Error generating Twitter posts: {e}")
            
        return posts
    
    async def _generate_linkedin_posts(self, product: Dict, variations: int) -> List[Dict]:
        """Generate LinkedIn posts."""
        posts = []
        
        prompt = f"""
        Create {variations} LinkedIn posts about {product['name']} for a B2B audience.
        
        Product details:
        - {product['description']}
        - Industry: {product['industry']}
        - Benefits: {', '.join(product.get('benefits_advantages', []))}
        
        Requirements for each post:
        - 150-300 words
        - Professional tone
        - Include relevant statistics or data points
        - Focus on business benefits and ROI
        - End with thought-provoking question
        - Suggest 3-5 relevant hashtags
        
        Vary the angle: sustainability impact, cost savings, innovation, market trends
        
        Output as JSON array with structure similar to Twitter posts.
        """
        
        try:
            response, provider, cost = await self.ai_provider.generate(prompt, temperature=0.7)
            await self._log_ai_usage('social_media_linkedin', cost)
            
            posts_data = json.loads(response)
            
            for post_data in posts_data:
                posts.append({
                    'content': post_data['content'],
                    'hashtags': post_data.get('hashtags', []),
                    'word_count': len(post_data['content'].split()),
                    'platform': 'linkedin'
                })
                
        except Exception as e:
            logger.error(f"Error generating LinkedIn posts: {e}")
            
        return posts
    
    async def _generate_instagram_posts(self, product: Dict, variations: int) -> List[Dict]:
        """Generate Instagram captions."""
        # Implementation similar to other platforms
        # Would include emoji usage, story-telling approach, etc.
        return []
    
    async def generate_product_description(self, params: Dict) -> Dict[str, Any]:
        """Generate product description for e-commerce."""
        product_id = params.get('product_id')
        
        if not product_id:
            raise ValueError("product_id is required")
        
        # Fetch product and generate description
        product = await self._fetch_product_data(product_id)
        if not product:
            raise ValueError(f"Product {product_id} not found")
        
        # Use template to generate
        template = self.templates['product_description']
        description = await template.generate(product, self.ai_provider)
        
        # Save and return
        saved = await self._save_generated_content({
            'content_type': 'product_description',
            'title': f"{product['name']} - Product Description",
            'content': description['content'],
            'product_id': product_id,
            'metadata': description.get('metadata', {}),
            'status': 'draft'
        })
        
        return {
            'status': 'completed',
            'content_id': saved['id'],
            'description_length': len(description['content']),
            'key_features_highlighted': description.get('features_count', 0)
        }
    
    async def generate_email_content(self, params: Dict) -> Dict[str, Any]:
        """Generate email newsletter content."""
        # Placeholder for email generation
        return {
            'status': 'completed',
            'message': 'Email content generation not yet implemented'
        }
    
    async def optimize_existing_content(self, params: Dict) -> Dict[str, Any]:
        """Optimize existing content for better SEO."""
        content_id = params.get('content_id')
        
        if not content_id:
            raise ValueError("content_id is required")
        
        # Fetch existing content
        existing = await self.supabase.table('agent_generated_content')\
            .select('*')\
            .eq('id', content_id)\
            .single()\
            .execute()
        
        if not existing.data:
            raise ValueError(f"Content {content_id} not found")
        
        # Optimize with SEO optimizer
        optimized = await self.seo_optimizer.optimize_content(
            existing.data['content'],
            existing.data.get('seo_keywords', [None])[0]
        )
        
        # Update in database
        await self.supabase.table('agent_generated_content')\
            .update({
                'content': optimized['content'],
                'seo_score': optimized.get('seo_score', 0),
                'updated_at': datetime.now().isoformat()
            })\
            .eq('id', content_id)\
            .execute()
        
        return {
            'status': 'completed',
            'content_id': content_id,
            'improvements_made': optimized.get('improvements', []),
            'new_seo_score': optimized.get('seo_score', 0)
        }
    
    async def generate_content_batch(self, params: Dict) -> Dict[str, Any]:
        """Generate multiple pieces of content in batch."""
        product_ids = params.get('product_ids', [])
        content_types = params.get('content_types', ['blog_post', 'social_media'])
        
        logger.info(f"Generating batch content for {len(product_ids)} products")
        
        results = []
        
        for product_id in product_ids:
            for content_type in content_types:
                try:
                    if content_type == 'blog_post':
                        result = await self.generate_blog_post({'product_id': product_id})
                    elif content_type == 'social_media':
                        result = await self.generate_social_media({
                            'product_id': product_id,
                            'platforms': ['twitter', 'linkedin']
                        })
                    else:
                        continue
                    
                    results.append({
                        'product_id': product_id,
                        'content_type': content_type,
                        'status': 'success',
                        'result': result
                    })
                    
                except Exception as e:
                    logger.error(f"Error generating {content_type} for product {product_id}: {e}")
                    results.append({
                        'product_id': product_id,
                        'content_type': content_type,
                        'status': 'failed',
                        'error': str(e)
                    })
        
        success_count = sum(1 for r in results if r['status'] == 'success')
        
        return {
            'status': 'completed',
            'total_requested': len(product_ids) * len(content_types),
            'success_count': success_count,
            'failed_count': len(results) - success_count,
            'results': results
        }
    
    async def _save_generated_content(self, content_data: Dict) -> Dict:
        """Save generated content to database."""
        # Add agent task ID if available
        content_data['agent_task_id'] = self.current_task_id if hasattr(self, 'current_task_id') else None
        content_data['created_at'] = datetime.now().isoformat()
        
        result = await self.supabase.table('agent_generated_content')\
            .insert(content_data)\
            .execute()
        
        return result.data[0]
    
    async def _log_ai_usage(self, operation: str, cost: float):
        """Log AI usage and costs."""
        await self.supabase.table('agent_performance_metrics').upsert({
            'agent_name': 'content_agent',
            'metric_date': datetime.now().date().isoformat(),
            'total_cost_usd': cost,
            'metadata': {'operation': operation}
        }).execute()