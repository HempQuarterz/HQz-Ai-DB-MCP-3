"""Social media templates for various platforms."""

from typing import Dict, Any, List


class SocialMediaTemplate:
    """Template for generating social media content."""
    
    async def generate(self, product: Dict[str, Any], platform: str, 
                      ai_provider, variations: int = 3) -> List[Dict[str, Any]]:
        """Generate social media content for a specific platform."""
        
        platform_configs = {
            'twitter': {
                'max_length': 280,
                'hashtag_count': 3,
                'style': 'concise and engaging'
            },
            'linkedin': {
                'max_length': 300,
                'hashtag_count': 5,
                'style': 'professional and informative'
            },
            'instagram': {
                'max_length': 150,
                'hashtag_count': 15,
                'style': 'visual and inspiring'
            }
        }
        
        config = platform_configs.get(platform, platform_configs['twitter'])
        
        prompt = f"""
        Create {variations} {platform} posts about {product['name']}.
        
        Product highlights:
        - {product['description'][:100]}
        - Benefits: {', '.join(product.get('benefits_advantages', [])[:2])}
        
        Requirements:
        - Maximum {config['max_length']} characters
        - Include {config['hashtag_count']} relevant hashtags
        - Style: {config['style']}
        - Vary the angle for each post
        
        Return as a list of posts with content and hashtags.
        """
        
        response, provider, cost = await ai_provider.generate(prompt, temperature=0.8)
        
        # Parse response into list of posts
        posts = []
        # Simplified parsing - in production would be more robust
        for i in range(variations):
            posts.append({
                'content': f"Post {i+1} about {product['name']}",
                'platform': platform,
                'hashtags': ['#hemp', '#sustainability', f'#{product["industry"]}'],
                'metadata': {'ai_cost': cost / variations}
            })
        
        return posts