"""
Platform Policies - Platform-specific compliance rules for e-commerce/payment platforms
"""

from typing import Dict, List, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class PlatformPolicyChecker:
    """Handles platform-specific policy compliance"""
    
    # Platform-specific policies
    PLATFORM_POLICIES = {
        'stripe': {
            'restricted_businesses': ['marijuana', 'cannabis_dispensaries'],
            'allowed_with_restrictions': ['cbd_products', 'hemp_products'],
            'requirements': [
                'Products must be derived from hemp',
                'THC content must be below 0.3%',
                'No medical claims',
                'Age verification required',
                'Clear product descriptions',
                'Compliant with local laws'
            ],
            'prohibited_terms': [
                'cure', 'treat', 'medical', 'prescription', 'FDA approved',
                'disease', 'condition', 'therapy', 'medicinal'
            ],
            'required_pages': [
                'terms_of_service',
                'privacy_policy',
                'refund_policy',
                'shipping_policy'
            ]
        },
        'shopify': {
            'allowed_products': ['hemp_derived_cbd', 'topical_cbd', 'pet_cbd'],
            'requirements': [
                'Hemp-derived only',
                'THC < 0.3%',
                'No ingestible CBD (US merchants)',
                'Age gate required',
                'Lab reports available',
                'Compliance with Shopify Payments terms'
            ],
            'restrictions_by_region': {
                'US': 'No ingestible CBD products',
                'EU': 'Novel Food compliance required',
                'UK': 'FSA compliance required'
            },
            'required_disclaimers': [
                'Not evaluated by FDA',
                'Not intended to diagnose, treat, cure, or prevent disease',
                'Keep out of reach of children',
                'Consult physician before use'
            ]
        },
        'amazon': {
            'prohibited': True,
            'reason': 'Amazon prohibits all CBD and hemp products',
            'alternatives': ['Amazon Handmade for hemp accessories', 'Non-CBD hemp products']
        },
        'paypal': {
            'status': 'restricted',
            'requirements': [
                'Pre-approval required',
                'US-based merchants only',
                'Topical products only',
                'No ingestibles',
                'Detailed product documentation'
            ]
        },
        'square': {
            'allowed': True,
            'requirements': [
                'CBD products must be hemp-derived',
                'THC content < 0.3%',
                'Compliance with local laws',
                'No medical claims',
                'Clear labeling'
            ]
        }
    }
    
    @staticmethod
    def check_platform_eligibility(platform: str, product_type: str, region: str) -> Dict[str, Any]:
        """Check if product type is eligible for platform"""
        policy = PlatformPolicyChecker.PLATFORM_POLICIES.get(platform, {})
        
        result = {
            'platform': platform,
            'eligible': False,
            'requirements': [],
            'restrictions': [],
            'action_items': []
        }
        
        if platform == 'amazon':
            result['eligible'] = False
            result['restrictions'].append(policy['reason'])
            result['action_items'].append('Consider alternative marketplaces')
            
        elif platform == 'stripe':
            if product_type in ['hemp_cbd', 'hemp_products']:
                result['eligible'] = True
                result['requirements'] = policy['requirements']
                result['action_items'].append('Ensure all product descriptions avoid prohibited terms')
                result['action_items'].append('Implement age verification')
                
        elif platform == 'shopify':
            if region == 'US' and 'ingestible' in product_type:
                result['eligible'] = False
                result['restrictions'].append('Ingestible CBD not allowed for US merchants')
            else:
                result['eligible'] = True
                result['requirements'] = policy['requirements']
                result['restrictions'] = [policy['restrictions_by_region'].get(region, '')]
                
        elif platform == 'paypal':
            result['eligible'] = 'conditional'
            result['requirements'] = policy['requirements']
            result['action_items'].append('Apply for PayPal pre-approval')
            
        elif platform == 'square':
            result['eligible'] = True
            result['requirements'] = policy['requirements']
            
        return result
        
    @staticmethod
    def check_listing_compliance(platform: str, listing_data: Dict) -> List[Dict[str, Any]]:
        """Check if product listing meets platform requirements"""
        violations = []
        policy = PlatformPolicyChecker.PLATFORM_POLICIES.get(platform, {})
        
        if platform == 'stripe':
            # Check for prohibited terms
            description = listing_data.get('description', '').lower()
            title = listing_data.get('title', '').lower()
            
            for term in policy.get('prohibited_terms', []):
                if term in description or term in title:
                    violations.append({
                        'type': 'prohibited_term',
                        'severity': 'high',
                        'detail': f'Prohibited term "{term}" found in listing',
                        'field': 'description' if term in description else 'title',
                        'action': f'Remove term "{term}" from listing'
                    })
                    
        elif platform == 'shopify':
            # Check for required disclaimers
            description = listing_data.get('description', '')
            
            for disclaimer in policy.get('required_disclaimers', []):
                if disclaimer.lower() not in description.lower():
                    violations.append({
                        'type': 'missing_disclaimer',
                        'severity': 'medium',
                        'detail': f'Required disclaimer missing: {disclaimer}',
                        'field': 'description',
                        'action': f'Add disclaimer: {disclaimer}'
                    })
                    
        return violations
        
    @staticmethod
    def get_platform_requirements_checklist(platform: str) -> Dict[str, List[str]]:
        """Get comprehensive requirements checklist for platform"""
        policy = PlatformPolicyChecker.PLATFORM_POLICIES.get(platform, {})
        
        checklist = {
            'documentation': [],
            'website_requirements': [],
            'product_requirements': [],
            'operational_requirements': []
        }
        
        if platform == 'stripe':
            checklist['documentation'] = [
                'Business license',
                'Lab reports for all products',
                'Terms of service',
                'Privacy policy',
                'Refund policy'
            ]
            
            checklist['website_requirements'] = [
                'Age verification system',
                'SSL certificate',
                'Clear product descriptions',
                'Contact information',
                'Required policy pages'
            ]
            
            checklist['product_requirements'] = [
                'Hemp-derived only',
                'THC < 0.3%',
                'No medical claims',
                'Proper labeling'
            ]
            
            checklist['operational_requirements'] = [
                'Compliance monitoring',
                'Regular policy updates',
                'Customer support',
                'Dispute handling process'
            ]
            
        elif platform == 'shopify':
            checklist['documentation'] = [
                'COA for each product',
                'Business registration',
                'Compliance documentation'
            ]
            
            checklist['website_requirements'] = [
                'Age gate implementation',
                'Lab report accessibility',
                'Required disclaimers',
                'Shipping restrictions by state'
            ]
            
            checklist['product_requirements'] = policy.get('requirements', [])
            
        return checklist
        
    @staticmethod
    def check_payment_processor_stacking(processors: List[str]) -> Dict[str, Any]:
        """Check compatibility of multiple payment processors"""
        result = {
            'compatible': True,
            'conflicts': [],
            'recommendations': []
        }
        
        # Check for conflicts
        if 'stripe' in processors and 'paypal' in processors:
            result['recommendations'].append(
                'Using both Stripe and PayPal may require separate compliance for each'
            )
            
        if 'amazon_pay' in processors:
            result['compatible'] = False
            result['conflicts'].append('Amazon Pay not available for CBD/hemp products')
            
        return result
        
    @staticmethod
    def get_platform_risk_score(platform: str, product_data: Dict) -> Dict[str, Any]:
        """Calculate risk score for platform compliance"""
        risk_factors = {
            'product_type': 0,
            'claims': 0,
            'thc_content': 0,
            'documentation': 0,
            'region': 0
        }
        
        risk_score = 0
        max_score = 100
        
        # Product type risk
        if 'ingestible' in product_data.get('type', ''):
            risk_factors['product_type'] = 25
            risk_score += 25
            
        # Claims risk
        description = product_data.get('description', '').lower()
        medical_terms = ['cure', 'treat', 'heal', 'medical']
        if any(term in description for term in medical_terms):
            risk_factors['claims'] = 30
            risk_score += 30
            
        # THC content risk
        thc = product_data.get('thc_percentage', 0)
        if thc > 0.3:
            risk_factors['thc_content'] = 40
            risk_score += 40
        elif thc > 0.2:
            risk_factors['thc_content'] = 20
            risk_score += 20
            
        # Documentation risk
        if not product_data.get('lab_reports'):
            risk_factors['documentation'] = 15
            risk_score += 15
            
        return {
            'platform': platform,
            'risk_score': min(risk_score, max_score),
            'risk_level': 'high' if risk_score > 60 else 'medium' if risk_score > 30 else 'low',
            'risk_factors': risk_factors,
            'recommendations': PlatformPolicyChecker._get_risk_recommendations(risk_factors)
        }
        
    @staticmethod
    def _get_risk_recommendations(risk_factors: Dict[str, int]) -> List[str]:
        """Generate recommendations based on risk factors"""
        recommendations = []
        
        if risk_factors['product_type'] > 0:
            recommendations.append('Consider focusing on topical products for easier compliance')
            
        if risk_factors['claims'] > 0:
            recommendations.append('Review and update product descriptions to remove medical claims')
            
        if risk_factors['thc_content'] > 0:
            recommendations.append('Source products with THC content below 0.2% for international compliance')
            
        if risk_factors['documentation'] > 0:
            recommendations.append('Obtain and maintain current lab reports for all products')
            
        return recommendations