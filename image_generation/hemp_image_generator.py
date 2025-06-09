#!/usr/bin/env python3
"""
Hemp Image Generator - Automated image generation for hemp products

This script manages the image generation queue and processes products
that need images using various providers (placeholder, AI services, etc.)
"""

import os
import sys
import json
import time
import logging
import requests
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Image generation providers
PROVIDERS = {
    'placeholder': 'Placeholder Images',
    'stable_diffusion': 'Stable Diffusion (Stability AI)',
    'dall_e': 'DALL-E (OpenAI)',
    'midjourney': 'Midjourney (Coming Soon)'
}

class HempImageGenerator:
    """Manages automated image generation for hemp products"""
    
    def __init__(self):
        """Initialize the image generator"""
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_ANON_KEY')
        
        if not self.supabase_url or not self.supabase_key:
            raise ValueError("Missing Supabase credentials in environment")
        
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
        self.provider = os.getenv('IMAGE_GENERATION_PROVIDER', 'placeholder')
        
        # API keys for various providers
        self.stability_key = os.getenv('STABILITY_API_KEY')
        self.openai_key = os.getenv('OPENAI_API_KEY')
        
    def get_queue_stats(self) -> Dict:
        """Get current queue statistics"""
        try:
            response = self.supabase.rpc('get_queue_stats').execute()
            return response.data
        except Exception as e:
            logger.error(f"Error getting queue stats: {e}")
            # Fallback to direct query
            pending = self.supabase.table('image_generation_queue').select('id').eq('status', 'pending').execute()
            processing = self.supabase.table('image_generation_queue').select('id').eq('status', 'processing').execute()
            completed = self.supabase.table('image_generation_queue').select('id').eq('status', 'completed').execute()
            
            return {
                'pending': len(pending.data),
                'processing': len(processing.data),
                'completed': len(completed.data),
                'total_products': self._get_total_products()
            }
    
    def _get_total_products(self) -> int:
        """Get total number of products"""
        try:
            response = self.supabase.table('uses_products').select('id', count='exact').execute()
            return response.count
        except:
            return 0
    
    def queue_products_without_images(self, batch_size: int = 100) -> int:
        """Queue all products that don't have images"""
        logger.info("Queuing products without images...")
        
        try:
            # Get products without images
            response = self.supabase.table('uses_products').select(
                'id'
            ).or_('image_url.is.null,image_url.eq.').limit(batch_size).execute()
            
            products = response.data
            queued_count = 0
            
            for product in products:
                # Check if already in queue
                existing = self.supabase.table('image_generation_queue').select(
                    'id'
                ).eq('product_id', product['id']).in_('status', ['pending', 'processing']).execute()
                
                if not existing.data:
                    # Add to queue
                    queue_response = self.supabase.rpc(
                        'queue_image_generation',
                        {'p_product_id': product['id']}
                    ).execute()
                    
                    if queue_response.data:
                        queued_count += 1
            
            logger.info(f"Queued {queued_count} products for image generation")
            return queued_count
            
        except Exception as e:
            logger.error(f"Error queuing products: {e}")
            return 0
    
    def process_queue(self, batch_size: int = 10) -> Dict:
        """Process the image generation queue"""
        logger.info(f"Processing queue with batch size {batch_size}...")
        
        try:
            # Call the database function to process queue
            response = self.supabase.rpc(
                'process_image_generation_queue',
                {'p_batch_size': batch_size}
            ).execute()
            
            result = response.data[0] if response.data else {}
            
            logger.info(
                f"Processed {result.get('processed_count', 0)} items: "
                f"{result.get('success_count', 0)} success, "
                f"{result.get('failed_count', 0)} failed, "
                f"{result.get('retry_count', 0)} retries"
            )
            
            return result
            
        except Exception as e:
            logger.error(f"Error processing queue: {e}")
            return {
                'processed_count': 0,
                'success_count': 0,
                'failed_count': 0,
                'retry_count': 0
            }
    
    def generate_image_stable_diffusion(self, prompt: str) -> Optional[str]:
        """Generate image using Stable Diffusion API"""
        if not self.stability_key:
            logger.error("Stability API key not found")
            return None
        
        try:
            response = requests.post(
                "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
                headers={
                    "Authorization": f"Bearer {self.stability_key}",
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                json={
                    "text_prompts": [{"text": prompt}],
                    "cfg_scale": 7,
                    "height": 1024,
                    "width": 1024,
                    "samples": 1,
                    "steps": 30
                }
            )
            
            if response.status_code == 200:
                # In production, you would save the image and return the URL
                # For now, return a placeholder
                return f"https://generated-images.com/stable-diffusion/{int(time.time())}.png"
            else:
                logger.error(f"Stable Diffusion API error: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"Error generating with Stable Diffusion: {e}")
            return None
    
    def generate_image_dall_e(self, prompt: str) -> Optional[str]:
        """Generate image using DALL-E API"""
        if not self.openai_key:
            logger.error("OpenAI API key not found")
            return None
        
        try:
            response = requests.post(
                "https://api.openai.com/v1/images/generations",
                headers={
                    "Authorization": f"Bearer {self.openai_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "dall-e-3",
                    "prompt": prompt,
                    "n": 1,
                    "size": "1024x1024",
                    "quality": "standard"
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                return data['data'][0]['url']
            else:
                logger.error(f"DALL-E API error: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"Error generating with DALL-E: {e}")
            return None
    
    def monitor_progress(self) -> None:
        """Display current progress and statistics"""
        try:
            # Get dashboard data
            response = self.supabase.table('image_generation_dashboard').select('*').execute()
            
            if response.data:
                stats = response.data[0]
                
                print("\n" + "="*60)
                print("HEMP IMAGE GENERATION PROGRESS")
                print("="*60)
                print(f"Total Products: {stats.get('total_products', 0)}")
                print(f"With Images: {stats.get('products_with_images', 0)}")
                print(f"Without Images: {stats.get('products_without_images', 0)}")
                print(f"Completion: {stats.get('completion_percentage', 0)}%")
                print("\nQueue Status:")
                print(f"  Pending: {stats.get('pending_count', 0)}")
                print(f"  Processing: {stats.get('processing_count', 0)}")
                print(f"  Completed: {stats.get('completed_count', 0)}")
                print(f"  Failed: {stats.get('failed_count', 0)}")
                print(f"\nEstimated Completion: {stats.get('estimated_completion', 'Calculating...')}")
                print(f"Last Run: {stats.get('last_run', 'Never')}")
                print(f"Next Run: {stats.get('next_run', 'N/A')}")
                print("="*60 + "\n")
                
        except Exception as e:
            logger.error(f"Error monitoring progress: {e}")
    
    def run_scheduled_generation(self) -> None:
        """Run scheduled image generation"""
        logger.info("Starting scheduled image generation...")
        
        # Check if scheduled run is due
        try:
            response = self.supabase.rpc('check_and_run_image_generation').execute()
            
            if response.data:
                logger.info(response.data)
            
        except Exception as e:
            logger.error(f"Error running scheduled generation: {e}")
    
    def continuous_run(self, interval_minutes: int = 15, max_runs: int = None) -> None:
        """Run continuously with specified interval"""
        run_count = 0
        
        while max_runs is None or run_count < max_runs:
            logger.info(f"Starting run {run_count + 1}...")
            
            # Monitor current progress
            self.monitor_progress()
            
            # Queue products without images
            self.queue_products_without_images()
            
            # Process the queue
            result = self.process_queue(batch_size=50)
            
            # Log to agent runs
            self._log_agent_run(result)
            
            run_count += 1
            
            # Check if all done
            stats = self.get_queue_stats()
            if stats.get('pending', 0) == 0:
                logger.info("All products have been processed!")
                break
            
            if max_runs is None or run_count < max_runs:
                logger.info(f"Waiting {interval_minutes} minutes before next run...")
                time.sleep(interval_minutes * 60)
    
    def _log_agent_run(self, result: Dict) -> None:
        """Log agent run to database"""
        try:
            self.supabase.table('hemp_agent_runs').insert({
                'agent_name': 'hemp_image_generator_py',
                'products_found': result.get('processed_count', 0),
                'products_saved': result.get('success_count', 0),
                'companies_saved': 0,
                'status': 'completed',
                'error_message': None if result.get('failed_count', 0) == 0 else f"Failed: {result.get('failed_count', 0)}"
            }).execute()
        except Exception as e:
            logger.error(f"Error logging agent run: {e}")


def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Hemp Image Generator')
    parser.add_argument('--mode', choices=['once', 'continuous', 'monitor', 'queue'],
                        default='once', help='Execution mode')
    parser.add_argument('--batch-size', type=int, default=10,
                        help='Batch size for processing')
    parser.add_argument('--interval', type=int, default=15,
                        help='Interval between runs in continuous mode (minutes)')
    parser.add_argument('--max-runs', type=int,
                        help='Maximum number of runs in continuous mode')
    parser.add_argument('--provider', choices=list(PROVIDERS.keys()),
                        help='Image generation provider')
    
    args = parser.parse_args()
    
    # Override provider if specified
    if args.provider:
        os.environ['IMAGE_GENERATION_PROVIDER'] = args.provider
    
    # Create generator instance
    generator = HempImageGenerator()
    
    # Execute based on mode
    if args.mode == 'monitor':
        generator.monitor_progress()
    elif args.mode == 'queue':
        count = generator.queue_products_without_images()
        print(f"Queued {count} products for image generation")
    elif args.mode == 'continuous':
        generator.continuous_run(
            interval_minutes=args.interval,
            max_runs=args.max_runs
        )
    else:  # once
        generator.monitor_progress()
        generator.queue_products_without_images()
        generator.process_queue(batch_size=args.batch_size)
        generator.monitor_progress()


if __name__ == '__main__':
    main()