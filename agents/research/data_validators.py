"""Data validation utilities for research agent."""

import re
from typing import Dict, List, Optional, Any
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class ProductDataValidator:
    """Validates hemp product data before database insertion."""
    
    # Valid values for enum fields
    VALID_PLANT_PARTS = {
        'seeds', 'fiber', 'oil', 'flower', 
        'hurds', 'roots', 'leaves', 'biomass'
    }
    
    VALID_COMMERCIALIZATION_STAGES = {
        'R&D', 'Pilot', 'Niche', 'Growing', 'Established'
    }
    
    VALID_INDUSTRIES = {
        'textiles', 'food_beverage', 'construction', 'automotive',
        'cosmetics', 'pharmaceuticals', 'paper', 'bioplastics',
        'biofuel', 'animal_feed', 'agriculture', 'supplements'
    }
    
    def validate_product(self, product: Dict[str, Any]) -> tuple[bool, List[str]]:
        """
        Validate a product dictionary.
        
        Returns:
            tuple: (is_valid, list_of_errors)
        """
        errors = []
        
        # Required fields
        required_fields = ['name', 'description', 'plant_part', 'industry']
        for field in required_fields:
            if not product.get(field):
                errors.append(f"Missing required field: {field}")
        
        # Validate name
        if product.get('name'):
            if len(product['name']) < 3:
                errors.append("Product name too short (min 3 characters)")
            if len(product['name']) > 200:
                errors.append("Product name too long (max 200 characters)")
        
        # Validate description
        if product.get('description'):
            if len(product['description']) < 20:
                errors.append("Description too short (min 20 characters)")
            if len(product['description']) > 2000:
                errors.append("Description too long (max 2000 characters)")
        
        # Validate plant part
        if product.get('plant_part'):
            if product['plant_part'] not in self.VALID_PLANT_PARTS:
                errors.append(f"Invalid plant part: {product['plant_part']}")
        
        # Validate industry
        if product.get('industry'):
            if product['industry'] not in self.VALID_INDUSTRIES:
                errors.append(f"Invalid industry: {product['industry']}")
        
        # Validate commercialization stage
        if product.get('commercialization_stage'):
            if product['commercialization_stage'] not in self.VALID_COMMERCIALIZATION_STAGES:
                errors.append(f"Invalid commercialization stage: {product['commercialization_stage']}")
        
        # Validate arrays
        array_fields = ['benefits_advantages', 'sustainability_aspects', 'source_urls']
        for field in array_fields:
            if field in product and not isinstance(product[field], list):
                errors.append(f"{field} must be an array")
        
        # Validate technical specifications
        if 'technical_specifications' in product:
            if not isinstance(product['technical_specifications'], dict):
                errors.append("technical_specifications must be an object")
        
        return len(errors) == 0, errors
    
    def sanitize_product(self, product: Dict[str, Any]) -> Dict[str, Any]:
        """
        Sanitize product data for safe storage.
        
        - Strips whitespace
        - Removes HTML tags
        - Normalizes data types
        """
        sanitized = product.copy()
        
        # Strip whitespace from strings
        string_fields = ['name', 'description', 'sub_industry', 'market_potential']
        for field in string_fields:
            if field in sanitized and sanitized[field]:
                sanitized[field] = self._clean_text(str(sanitized[field]))
        
        # Clean array fields
        array_fields = ['benefits_advantages', 'sustainability_aspects', 'source_urls']
        for field in array_fields:
            if field in sanitized and isinstance(sanitized[field], list):
                sanitized[field] = [self._clean_text(str(item)) for item in sanitized[field] if item]
        
        # Ensure technical_specifications is a dict
        if 'technical_specifications' not in sanitized:
            sanitized['technical_specifications'] = {}
        elif not isinstance(sanitized['technical_specifications'], dict):
            sanitized['technical_specifications'] = {}
        
        # Add metadata
        if 'created_at' not in sanitized:
            sanitized['created_at'] = datetime.now().isoformat()
        
        return sanitized
    
    def _clean_text(self, text: str) -> str:
        """Remove HTML tags and normalize whitespace."""
        # Remove HTML tags
        text = re.sub(r'<[^>]+>', '', text)
        
        # Normalize whitespace
        text = ' '.join(text.split())
        
        # Trim
        return text.strip()


class URLValidator:
    """Validates and normalizes URLs."""
    
    @staticmethod
    def is_valid_url(url: str) -> bool:
        """Check if URL is valid."""
        url_pattern = re.compile(
            r'^https?://'  # http:// or https://
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
            r'localhost|'  # localhost...
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
            r'(?::\d+)?'  # optional port
            r'(?:/?|[/?]\S+)$', re.IGNORECASE)
        
        return url_pattern.match(url) is not None
    
    @staticmethod
    def normalize_url(url: str) -> str:
        """Normalize URL for consistency."""
        # Remove trailing slashes
        url = url.rstrip('/')
        
        # Ensure protocol
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
        
        return url


class ComplianceValidator:
    """Validates content for compliance with regulations."""
    
    # Prohibited medical claims
    PROHIBITED_CLAIMS = [
        'cure', 'treat', 'prevent', 'diagnose', 'heal',
        'therapy', 'therapeutic', 'medicine', 'medical',
        'prescription', 'doctor', 'physician'
    ]
    
    # THC-related terms that need careful handling
    THC_TERMS = ['thc', 'delta-8', 'delta-9', 'psychoactive']
    
    def validate_content(self, content: str) -> tuple[bool, List[str]]:
        """
        Validate content for compliance issues.
        
        Returns:
            tuple: (is_compliant, list_of_issues)
        """
        issues = []
        content_lower = content.lower()
        
        # Check for prohibited medical claims
        for claim in self.PROHIBITED_CLAIMS:
            if claim in content_lower:
                issues.append(f"Contains prohibited medical claim: '{claim}'")
        
        # Check for THC-related content
        for term in self.THC_TERMS:
            if term in content_lower:
                issues.append(f"Contains THC-related term: '{term}' - ensure compliance with local laws")
        
        # Check for unsubstantiated claims
        if 'fda approved' in content_lower and 'not' not in content_lower:
            issues.append("Contains potentially false FDA approval claim")
        
        return len(issues) == 0, issues
    
    def suggest_alternatives(self, text: str) -> Dict[str, str]:
        """Suggest compliant alternatives for problematic text."""
        alternatives = {}
        
        # Medical claim alternatives
        claim_alternatives = {
            'cure': 'support',
            'treat': 'may help with',
            'prevent': 'support healthy',
            'therapeutic': 'beneficial',
            'medicine': 'supplement'
        }
        
        for claim, alternative in claim_alternatives.items():
            if claim in text.lower():
                alternatives[claim] = alternative
        
        return alternatives


class DataQualityScorer:
    """Scores data quality for prioritization."""
    
    def score_product_data(self, product: Dict[str, Any]) -> float:
        """
        Score product data quality from 0-1.
        
        Higher scores indicate more complete, high-quality data.
        """
        score = 0.0
        max_score = 0.0
        
        # Required fields (40% of score)
        required_fields = ['name', 'description', 'plant_part', 'industry']
        for field in required_fields:
            max_score += 0.1
            if product.get(field):
                score += 0.1
        
        # Optional valuable fields (30% of score)
        valuable_fields = [
            'sub_industry', 'benefits_advantages', 'sustainability_aspects',
            'technical_specifications', 'commercialization_stage', 'market_potential'
        ]
        for field in valuable_fields:
            max_score += 0.05
            if product.get(field):
                score += 0.05
        
        # Data richness (30% of score)
        # Description length
        max_score += 0.1
        if product.get('description'):
            desc_length = len(product['description'])
            if desc_length >= 100:
                score += 0.1
            elif desc_length >= 50:
                score += 0.05
        
        # Benefits count
        max_score += 0.1
        if product.get('benefits_advantages'):
            benefits_count = len(product['benefits_advantages'])
            if benefits_count >= 3:
                score += 0.1
            elif benefits_count >= 2:
                score += 0.05
        
        # Technical specs
        max_score += 0.1
        if product.get('technical_specifications'):
            specs_count = len(product['technical_specifications'])
            if specs_count >= 3:
                score += 0.1
            elif specs_count >= 1:
                score += 0.05
        
        return score / max_score if max_score > 0 else 0