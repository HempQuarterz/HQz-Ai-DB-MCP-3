#!/usr/bin/env python3
"""
AI Provider Manager for HempQuarterz Image Generation
Manages provider configuration and triggers image generation
"""

import os
import json
import requests
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import argparse
from supabase import create_client, Client

class AIProviderManager:
    def __init__(self, supabase_url: str, supabase_key: str, project_id: str):
        self.supabase: Client = create_client(supabase_url, supabase_key)
        self.supabase_url = supabase_url
        self.supabase_key = supabase_key
        self.project_id = project_id
        self.edge_function_url = f"{supabase_url}/functions/v1/hemp-image-generator"
        
    def get_providers(self) -> List[Dict]:
        """Get all configured AI providers"""
        response = self.supabase.table('ai_provider_config').select("*").execute()
        return response.data
    
    def activate_provider(self, provider_name: str, api_key: Optional[str] = None) -> Dict:
        """Activate a specific AI provider"""
        # Get provider info
        provider = self.supabase.table('ai_provider_config').select("*").eq('provider_name', provider_name).single().execute()
        
        if not provider.data:
            raise ValueError(f"Provider {provider_name} not found")
        
        # For providers that need API keys, just show instructions
        if provider.data['api_key_name'] and provider_name != 'placeholder':
            print(f"\n📌 Note: {provider_name} requires an API key in Supabase Edge Functions")
            print(f"   Run: supabase secrets set {provider.data['api_key_name']}=your_key")
            print(f"\n   Activating anyway - make sure to add the key before generating!")
        
        # Update provider status
        update_data = {
            'is_active': True,
            'updated_at': datetime.now().isoformat()
        }
        
        response = self.supabase.table('ai_provider_config').update(update_data).eq('provider_name', provider_name).execute()
        
        print(f"✅ Activated provider: {provider_name}")
        return response.data[0]
    
    def deactivate_provider(self, provider_name: str) -> Dict:
        """Deactivate a specific AI provider"""
        update_data = {
            'is_active': False,
            'updated_at': datetime.now().isoformat()
        }
        
        response = self.supabase.table('ai_provider_config').update(update_data).eq('provider_name', provider_name).execute()
        print(f"⏸️ Deactivated provider: {provider_name}")
        return response.data[0]
    
    def update_provider_config(self, provider_name: str, config: Dict) -> Dict:
        """Update provider configuration"""
        current = self.supabase.table('ai_provider_config').select("config").eq('provider_name', provider_name).single().execute()
        
        merged_config = {**current.data['config'], **config}
        
        update_data = {
            'config': merged_config,
            'updated_at': datetime.now().isoformat()
        }
        
        response = self.supabase.table('ai_provider_config').update(update_data).eq('provider_name', provider_name).execute()
        print(f"⚙️ Updated config for {provider_name}")
        return response.data[0]
    
    def get_queue_status(self) -> Dict:
        """Get current image generation queue status"""
        # Get queue counts by status
        statuses = ['pending', 'processing', 'completed', 'failed', 'retry']
        status_counts = {}
        
        for status in statuses:
            count = self.supabase.table('image_generation_queue').select("id", count='exact').eq('status', status).execute()
            status_counts[status] = count.count
        
        # Get products without images
        products_without_images = self.supabase.table('uses_products').select("id", count='exact').is_('image_url', 'null').execute()
        
        return {
            'queue_status': status_counts,
            'products_without_images': products_without_images.count,
            'total_in_queue': sum(status_counts.values())
        }
    
    def queue_products_for_generation(self, limit: Optional[int] = None, priority: int = 5) -> int:
        """Queue products that don't have images yet"""
        # Get products without images
        query = self.supabase.table('uses_products').select("id, name, description").is_('image_url', 'null')
        
        if limit:
            query = query.limit(limit)
        
        products = query.execute()
        
        # Create queue entries
        queue_entries = []
        for product in products.data:
            # Generate smart prompt based on product info
            prompt = f"Professional product photography of {product['name']}"
            if product.get('description'):
                prompt += f", {product['description'][:100]}"
            
            queue_entries.append({
                'product_id': product['id'],
                'prompt': prompt,
                'priority': priority,
                'status': 'pending'
            })
        
        if queue_entries:
            self.supabase.table('image_generation_queue').insert(queue_entries).execute()
            print(f"📝 Queued {len(queue_entries)} products for image generation")
        
        return len(queue_entries)
    
    def trigger_generation(self, batch_size: int = 10, force_provider: Optional[str] = None) -> Dict:
        """Trigger the Edge Function to process queued items"""
        headers = {
            'Authorization': f'Bearer {self.supabase_key}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'batchSize': batch_size
        }
        
        if force_provider:
            payload['forceProvider'] = force_provider
        
        response = requests.post(
            self.edge_function_url,
            json=payload,
            headers=headers
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"🚀 Generation triggered successfully!")
            print(f"   Processed: {result['results']['processed']}")
            print(f"   Success: {result['results']['success']}")
            print(f"   Failed: {result['results']['failed']}")
            print(f"   Total Cost: ${result['results']['totalCost']:.4f}")
            return result
        else:
            print(f"❌ Error triggering generation: {response.text}")
            return {'error': response.text}
    
    def get_cost_report(self, days: int = 30) -> Dict:
        """Get cost report for the specified period"""
        from_date = datetime.now() - timedelta(days=days)
        
        # Get costs by provider
        costs = self.supabase.table('ai_generation_costs').select("*").gte('created_at', from_date.isoformat()).execute()
        
        provider_costs = {}
        total_cost = 0
        
        for cost in costs.data:
            provider = cost['provider_name']
            if provider not in provider_costs:
                provider_costs[provider] = {
                    'count': 0,
                    'total_cost': 0,
                    'success_count': 0,
                    'failed_count': 0
                }
            
            provider_costs[provider]['count'] += 1
            provider_costs[provider]['total_cost'] += cost['cost']
            total_cost += cost['cost']
            
            if cost['success']:
                provider_costs[provider]['success_count'] += 1
            else:
                provider_costs[provider]['failed_count'] += 1
        
        return {
            'period_days': days,
            'total_cost': total_cost,
            'provider_breakdown': provider_costs,
            'total_images': sum(p['count'] for p in provider_costs.values())
        }
    
    def display_dashboard(self):
        """Display a text-based dashboard"""
        print("\n" + "="*60)
        print("🌿 HempQuarterz AI Image Generation Dashboard")
        print("="*60)
        
        # Get and display providers
        providers = self.get_providers()
        print("\n📊 Provider Status:")
        print("-"*40)
        for provider in providers:
            status = "✅ Active" if provider['is_active'] else "⏸️ Inactive"
            print(f"{provider['provider_name']:20} {status:15} Cost: ${provider['cost_per_image']:.4f}")
        
        # Get and display queue status
        queue_status = self.get_queue_status()
        print("\n📸 Queue Status:")
        print("-"*40)
        for status, count in queue_status['queue_status'].items():
            print(f"{status.capitalize():15} {count:10}")
        print(f"\nProducts without images: {queue_status['products_without_images']}")
        
        # Get and display cost report
        cost_report = self.get_cost_report(30)
        print("\n💰 Cost Report (Last 30 days):")
        print("-"*40)
        print(f"Total Cost: ${cost_report['total_cost']:.4f}")
        print(f"Total Images: {cost_report['total_images']}")
        
        if cost_report['provider_breakdown']:
            print("\nProvider Breakdown:")
            for provider, data in cost_report['provider_breakdown'].items():
                print(f"  {provider}: {data['count']} images, ${data['total_cost']:.4f}")

def main():
    parser = argparse.ArgumentParser(description='AI Provider Manager for HempQuarterz')
    parser.add_argument('--supabase-url', required=True, help='Supabase project URL')
    parser.add_argument('--supabase-key', required=True, help='Supabase service role key')
    parser.add_argument('--project-id', default='ktoqznqmlnxrtvubewyz', help='Project ID')
    
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Dashboard command
    subparsers.add_parser('dashboard', help='Display dashboard')
    
    # Provider commands
    provider_parser = subparsers.add_parser('provider', help='Manage providers')
    provider_subparsers = provider_parser.add_subparsers(dest='provider_command')
    
    activate_parser = provider_subparsers.add_parser('activate', help='Activate a provider')
    activate_parser.add_argument('name', help='Provider name')
    activate_parser.add_argument('--api-key', help='API key for the provider')
    
    deactivate_parser = provider_subparsers.add_parser('deactivate', help='Deactivate a provider')
    deactivate_parser.add_argument('name', help='Provider name')
    
    # Queue commands
    queue_parser = subparsers.add_parser('queue', help='Manage queue')
    queue_parser.add_argument('--limit', type=int, help='Number of products to queue')
    queue_parser.add_argument('--priority', type=int, default=5, help='Priority (1-10)')
    
    # Generate command
    generate_parser = subparsers.add_parser('generate', help='Trigger generation')
    generate_parser.add_argument('--batch-size', type=int, default=10, help='Batch size')
    generate_parser.add_argument('--provider', help='Force specific provider')
    
    args = parser.parse_args()
    
    # Initialize manager
    manager = AIProviderManager(
        args.supabase_url,
        args.supabase_key,
        args.project_id
    )
    
    # Execute commands
    if args.command == 'dashboard':
        manager.display_dashboard()
    
    elif args.command == 'provider':
        if args.provider_command == 'activate':
            manager.activate_provider(args.name, args.api_key)
        elif args.provider_command == 'deactivate':
            manager.deactivate_provider(args.name)
    
    elif args.command == 'queue':
        count = manager.queue_products_for_generation(args.limit, args.priority)
        print(f"Queued {count} products")
    
    elif args.command == 'generate':
        manager.trigger_generation(args.batch_size, args.provider)
    
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
