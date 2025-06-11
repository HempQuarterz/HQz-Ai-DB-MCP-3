"""
Regulation Checker - Core regulation logic for compliance monitoring
"""

import re
from typing import Dict, List, Optional, Tuple
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class RegulationChecker:
    """Handles core regulation checking logic"""
    
    # THC limits by jurisdiction (in percentage)
    THC_LIMITS = {
        'US_FEDERAL': 0.3,
        'EU': 0.2,  # Most EU countries
        'UK': 0.2,
        'CANADA': 0.3,
        'SWITZERLAND': 1.0,
        'US_CA': 0.3,
        'US_TX': 0.3,
        'US_NY': 0.3,
        'US_FL': 0.3
    }
    
    # Novel Food deadlines
    NOVEL_FOOD_DEADLINES = {
        'EU': datetime(2025, 3, 31),
        'UK': datetime(2025, 3, 31)
    }
    
    # Restricted marketing terms by jurisdiction
    RESTRICTED_TERMS = {
        'FDA': [
            'cure', 'treat', 'prevent', 'diagnose', 'medical', 'prescription',
            'disease', 'condition', 'symptom', 'therapy', 'healing'
        ],
        'EU': [
            'medicinal', 'therapeutic', 'pharmaceutical', 'drug', 'medicine'
        ],
        'PAYMENT_PROCESSORS': [
            'cure', 'treat', 'medical', 'prescription', 'FDA', 'disease'
        ]
    }
    
    @staticmethod
    def check_thc_limit(thc_percentage: float, jurisdiction: str) -> Tuple[bool, str]:
        """Check if THC content meets jurisdiction limits"""
        limit = RegulationChecker.THC_LIMITS.get(jurisdiction)
        if limit is None:
            return True, f"No THC limit defined for {jurisdiction}"
            
        if thc_percentage <= limit:
            return True, f"Compliant: {thc_percentage}% THC is within {jurisdiction} limit of {limit}%"
        else:
            return False, f"Non-compliant: {thc_percentage}% THC exceeds {jurisdiction} limit of {limit}%"
            
    @staticmethod
    def check_marketing_claims(text: str, jurisdiction: str = 'FDA') -> List[str]:
        """Check for restricted marketing terms"""
        violations = []
        restricted = RegulationChecker.RESTRICTED_TERMS.get(jurisdiction, [])
        
        text_lower = text.lower()
        for term in restricted:
            if re.search(r'\b' + re.escape(term) + r'\b', text_lower):
                violations.append(term)
                
        return violations
        
    @staticmethod
    def check_novel_food_status(jurisdiction: str) -> Tuple[bool, Optional[datetime], str]:
        """Check Novel Food registration requirements"""
        deadline = RegulationChecker.NOVEL_FOOD_DEADLINES.get(jurisdiction)
        
        if deadline is None:
            return True, None, f"No Novel Food requirements for {jurisdiction}"
            
        if datetime.utcnow() < deadline:
            days_remaining = (deadline - datetime.utcnow()).days
            return False, deadline, f"Novel Food registration required by {deadline.strftime('%Y-%m-%d')} ({days_remaining} days remaining)"
        else:
            return False, deadline, f"Novel Food registration deadline passed on {deadline.strftime('%Y-%m-%d')}"
            
    @staticmethod
    def check_labeling_requirements(product_data: Dict) -> Dict[str, bool]:
        """Check if product meets labeling requirements"""
        requirements = {
            'thc_content_displayed': False,
            'cbd_content_displayed': False,
            'batch_number': False,
            'expiry_date': False,
            'manufacturer_info': False,
            'usage_instructions': False,
            'warning_labels': False,
            'ingredients_list': False
        }
        
        # Check product data for required fields
        if product_data.get('thc_percentage') is not None:
            requirements['thc_content_displayed'] = True
            
        if product_data.get('cbd_percentage') is not None:
            requirements['cbd_content_displayed'] = True
            
        if product_data.get('batch_number'):
            requirements['batch_number'] = True
            
        if product_data.get('expiry_date'):
            requirements['expiry_date'] = True
            
        if product_data.get('manufacturer'):
            requirements['manufacturer_info'] = True
            
        if product_data.get('usage_instructions'):
            requirements['usage_instructions'] = True
            
        if product_data.get('warnings'):
            requirements['warning_labels'] = True
            
        if product_data.get('ingredients'):
            requirements['ingredients_list'] = True
            
        return requirements
        
    @staticmethod
    def check_age_restrictions(jurisdiction: str) -> int:
        """Get minimum age requirement by jurisdiction"""
        age_limits = {
            'US_FEDERAL': 21,
            'US_CA': 21,
            'US_CO': 21,
            'US_TX': 21,
            'EU': 18,
            'UK': 18,
            'CANADA': 19
        }
        
        return age_limits.get(jurisdiction, 18)
        
    @staticmethod
    def check_import_export_requirements(origin: str, destination: str) -> Dict[str, Any]:
        """Check import/export requirements between jurisdictions"""
        requirements = {
            'allowed': True,
            'permits_required': [],
            'restrictions': [],
            'documentation': []
        }
        
        # International shipments
        if origin != destination:
            requirements['documentation'].append('Certificate of Analysis (COA)')
            requirements['documentation'].append('Phytosanitary Certificate')
            
            # US to EU
            if origin.startswith('US') and destination in ['EU', 'UK']:
                requirements['permits_required'].append('Novel Food Authorization')
                requirements['restrictions'].append('THC limit 0.2% (EU/UK) vs 0.3% (US)')
                
            # Check for banned routes
            banned_routes = [
                ('US', 'CHINA'),
                ('EU', 'RUSSIA')
            ]
            
            for banned_origin, banned_dest in banned_routes:
                if origin.startswith(banned_origin) and destination.startswith(banned_dest):
                    requirements['allowed'] = False
                    requirements['restrictions'].append(f"Hemp/CBD products banned from {banned_origin} to {banned_dest}")
                    
        return requirements
        
    @staticmethod
    def generate_compliance_checklist(product_type: str, jurisdictions: List[str]) -> Dict[str, List[str]]:
        """Generate compliance checklist for product type and jurisdictions"""
        checklist = {
            'testing': [],
            'labeling': [],
            'marketing': [],
            'documentation': []
        }
        
        # Common requirements
        checklist['testing'].extend([
            'THC content analysis (accredited lab)',
            'CBD content verification',
            'Heavy metals testing',
            'Pesticide residue testing',
            'Microbial contamination testing'
        ])
        
        checklist['labeling'].extend([
            'THC/CBD content clearly displayed',
            'Batch/lot number',
            'Expiration date',
            'Manufacturer information',
            'Net weight/volume',
            'Ingredients list',
            'Usage instructions',
            'Warning labels'
        ])
        
        checklist['marketing'].extend([
            'No medical/health claims',
            'No disease treatment claims',
            'Age restriction notice',
            'Not for pregnant/nursing women disclaimer'
        ])
        
        checklist['documentation'].extend([
            'Certificate of Analysis (COA)',
            'Good Manufacturing Practices (GMP) certification',
            'Product liability insurance',
            'Business licenses'
        ])
        
        # Jurisdiction-specific requirements
        for jurisdiction in jurisdictions:
            if jurisdiction == 'EU':
                checklist['documentation'].append('Novel Food authorization')
                checklist['labeling'].append('EU compliant labeling format')
                
            elif jurisdiction == 'US_CA':
                checklist['documentation'].append('California Prop 65 compliance')
                checklist['labeling'].append('California-specific warnings')
                
        return checklist