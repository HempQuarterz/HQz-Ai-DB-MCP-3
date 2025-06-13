"""Product description template for hemp products."""

from typing import Dict, Any


class ProductDescriptionTemplate:
    """Template for generating product descriptions."""
    
    async def generate(self, product: Dict[str, Any], ai_provider) -> Dict[str, Any]:
        """Generate a product description."""
        
        prompt = f"""
        Write a compelling product description for {product['name']}.
        
        Product details:
        - Description: {product['description']}
        - Benefits: {', '.join(product.get('benefits_advantages', []))}
        - Plant part: {product['plant_part']}
        - Industry: {product['industry']}
        
        Requirements:
        - 200-250 words
        - Highlight top 3-4 benefits
        - Include technical specifications
        - Clear value proposition
        - SEO-optimized
        
        Format:
        - Attention-grabbing headline
        - Brief overview
        - Key benefits (bulleted)
        - Technical details
        - Use cases
        - Call-to-action
        """
        
        response, provider, cost = await ai_provider.generate(prompt, temperature=0.7)
        
        return {
            'content': response,
            'metadata': {
                'template': 'product_description',
                'product_id': product.get('id'),
                'ai_cost': cost
            }
        }