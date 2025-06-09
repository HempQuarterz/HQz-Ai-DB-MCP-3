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
import base64
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
            # Direct query instead of RPC
            pending = self.supabase.table('image_generation_queue').select('id').eq('status', 'pending').execute()
            processing = self.supabase.table('image_generation_queue').select('id').eq('status', 'processing').execute()
            completed = self.supabase.table('image_generation_queue').select('id').eq('status', 'completed').execute()
            failed = self.supabase.table('image_generation_queue').select('id').eq('status', 'failed').execute()
            
            return {
                'pending': len(pending.data) if pending.data else 0,
                'processing': len(processing.data) if processing.data else 0,
                'completed': len(completed.data) if completed.data else 0,
                'failed': len(failed.data) if failed.data else 0,
                'total_products': self._get_total_products()
            }
        except Exception as e:
            logger.error(f"Error getting queue stats: {e}")
            return {
                'pending': 0,
                'processing': 0,
                'completed': 0,
                'failed': 0,
                'total_products': 0
            }
    
    def _get_total_products(self) -> int:
        """Get total number of products"""
        try:
            response = self.supabase.table('uses_products').select('id', count='exact').execute()
            return response.count if response.count else 0
        except:
            return 0
    
    def select_best_provider(self) -> str:
        """Select the best available provider based on config and API key availability"""
        
        # Check which providers have API keys
        available_providers = []
        
        if self.stability_key:
            available_providers.append('stable_diffusion')
            logger.info("Stability AI API key found")
        if self.openai_key:
            available_providers.append('dall_e')
            logger.info("OpenAI API key found")
        
        if not available_providers:
            logger.warning("No AI provider API keys found, using placeholder")
            return 'placeholder'
        
        # Get provider configs from database
        try:
            response = self.supabase.table('ai_provider_config').select('*').in_('provider_name', available_providers).eq('is_active', True).order('quality_score', desc=True).limit(1).execute()
            
            if response.data:
                selected = response.data[0]['provider_name']
                logger.info(f"Selected provider from config: {selected}")
                return selected
        except Exception as e:
            logger.error(f"Error selecting provider: {e}")
        
        # Default to first available
        selected = available_providers[0]
        logger.info(f"Using default provider: {selected}")
        return selected
    
    def queue_products_without_images(self, batch_size: int = 100) -> int:
        """Queue all products that don't have images"""
        logger.info("Queuing products without images...")
        
        try:
            # Get products without images or with placeholder images
            response = self.supabase.table('uses_products').select(
                'id'
            ).or_('image_url.is.null,image_url.eq.,image_url.like.%placeholder.com%').limit(batch_size).execute()
            
            products = response.data if response.data else []
            queued_count = 0
            
            for product in products:
                # Check if already in queue
                existing = self.supabase.table('image_generation_queue').select(
                    'id'
                ).eq('product_id', product['id']).in_('status', ['pending', 'processing']).execute()
                
                if not existing.data:
                    # Add to queue using direct insert instead of RPC
                    try:
                        # Generate prompt
                        product_details = self.supabase.table('uses_products').select(
                            'name, plant_parts!inner(name), industry_sub_categories!inner(industries!inner(name))'
                        ).eq('id', product['id']).single().execute()
                        
                        if product_details.data:
                            prompt = self._generate_prompt(product_details.data)
                            
                            queue_entry = {
                                'product_id': product['id'],
                                'prompt': prompt,
                                'negative_prompt': 'low quality, blurry, distorted, amateur, watermark, text, logo',
                                'priority': 5,
                                'status': 'pending',
                                'generation_provider': self.select_best_provider()
                            }
                            
                            self.supabase.table('image_generation_queue').insert(queue_entry).execute()
                            queued_count += 1
                    except Exception as e:
                        logger.error(f"Error queuing product {product['id']}: {e}")
            
            logger.info(f"Queued {queued_count} products for image generation")
            return queued_count
            
        except Exception as e:
            logger.error(f"Error queuing products: {e}")
            return 0
    
    def _generate_prompt(self, product_data: Dict) -> str:
        """Generate image prompt based on product data"""
        name = product_data.get('name', 'Hemp Product')
        plant_part = product_data.get('plant_parts', {}).get('name', '')
        industry = product_data.get('industry_sub_categories', {}).get('industries', {}).get('name', '')
        
        prompt = f"Professional product photography of {name}. "
        
        # Industry-specific styling
        if 'Food' in industry:
            prompt += "Clean, bright, appetizing food photography style. Natural lighting. "
        elif 'Cosmetics' in industry:
            prompt += "Elegant beauty product photography. Soft lighting, luxurious presentation. "
        elif 'Textile' in industry:
            prompt += "Fashion photography style showing texture and quality. Professional studio lighting. "
        elif 'Construction' in industry:
            prompt += "Industrial product photography. Clear, detailed view showing material properties. "
        else:
            prompt += "Professional commercial product photography. Studio lighting. "
        
        # Plant part specific details
        if 'Seed' in plant_part:
            prompt += "Show hemp seeds in an appealing arrangement. "
        elif 'Fiber' in plant_part:
            prompt += "Highlight the texture and quality of hemp fibers. "
        elif 'Oil' in plant_part:
            prompt += "Show oil in elegant glass containers with hemp plants. "
        elif 'Hurd' in plant_part:
            prompt += "Show hemp hurds/shivs material in industrial context. "
        elif 'Flower' in plant_part:
            prompt += "Beautiful close-up of hemp flowers with visible trichomes. "
        
        prompt += "High resolution, white background, professional product shot, commercial quality, sustainable and eco-friendly aesthetic."
        
        return prompt
    
    def upload_to_supabase_storage(self, image_data: bytes, filename: str) -> str:
        """Upload image to Supabase Storage and return public URL"""
        try:
            # First check if file already exists and delete it
            try:
                self.supabase.storage.from_('hemp-product-images').remove([filename])
            except:
                pass  # File might not exist
            
            # Upload the new file
            response = self.supabase.storage.from_('hemp-product-images').upload(
                filename,
                image_data,
                {'content-type': 'image/png', 'upsert': 'true'}
            )
            
            # Get public URL
            url_data = self.supabase.storage.from_('hemp-product-images').get_public_url(filename)
            return url_data
            
        except Exception as e:
            logger.error(f"Error uploading to storage: {e}")
            raise
    
    def process_queue(self, batch_size: int = 10) -> Dict:
        """Process the image generation queue using actual AI APIs"""
        logger.info(f"Processing queue with batch size {batch_size}...")
        
        result = {
            'processed_count': 0,
            'success_count': 0,
            'failed_count': 0,
            'retry_count': 0
        }
        
        try:
            # Get pending items from queue - fetch with joins properly
            response = self.supabase.table('image_generation_queue').select(
                '*, uses_products!inner(name, plant_parts!inner(name))'
            ).in_('status', ['pending', 'retry']).order('priority', desc=True).order('created_at').limit(batch_size).execute()
            
            queue_items = response.data if response.data else []
            
            if not queue_items:
                logger.info("No pending items in queue")
                return result
            
            # Select provider for this batch
            provider = self.select_best_provider()
            logger.info(f"Using provider: {provider}")
            
            for item in queue_items:
                start_time = time.time()
                
                try:
                    # Update status to processing
                    self.supabase.table('image_generation_queue').update({
                        'status': 'processing',
                        'updated_at': datetime.now().isoformat()
                    }).eq('id', item['id']).execute()
                    
                    # Generate image based on provider
                    image_url = None
                    actual_provider = provider
                    
                    logger.info(f"Generating image for product {item['product_id']}: {item['uses_products']['name']}")
                    
                    try:
                        if provider == 'stable_diffusion' and self.stability_key:
                            logger.info("Using Stable Diffusion API...")
                            image_url = self.generate_image_stable_diffusion(
                                item['prompt'],
                                item.get('negative_prompt')
                            )
                        elif provider == 'dall_e' and self.openai_key:
                            logger.info("Using DALL-E API...")
                            image_url = self.generate_image_dall_e(item['prompt'])
                        else:
                            logger.info("Using placeholder generator...")
                            image_url = self.generate_placeholder_url(
                                item['uses_products']['name'],
                                item['uses_products']['plant_parts']['name']
                            )
                            actual_provider = 'placeholder'
                    except Exception as api_error:
                        logger.error(f"API error: {api_error}")
                        # Fallback to placeholder
                        image_url = self.generate_placeholder_url(
                            item['uses_products']['name'],
                            item['uses_products']['plant_parts']['name']
                        )
                        actual_provider = 'placeholder'
                    
                    if image_url:
                        logger.info(f"Generated image URL: {image_url}")
                        
                        # Update product with image
                        self.supabase.table('uses_products').update({
                            'image_url': image_url,
                            'updated_at': datetime.now().isoformat()
                        }).eq('id', item['product_id']).execute()
                        
                        # Update queue status
                        self.supabase.table('image_generation_queue').update({
                            'status': 'completed',
                            'generated_image_url': image_url,
                            'generation_provider': actual_provider,
                            'completed_at': datetime.now().isoformat(),
                            'updated_at': datetime.now().isoformat()
                        }).eq('id', item['id']).execute()
                        
                        # Log to history
                        self.supabase.table('image_generation_history').insert({
                            'queue_id': item['id'],
                            'product_id': item['product_id'],
                            'action': 'completed',
                            'details': {
                                'image_url': image_url,
                                'provider': actual_provider,
                                'generation_time_ms': int((time.time() - start_time) * 1000)
                            }
                        }).execute()
                        
                        # Log cost if not placeholder
                        if actual_provider != 'placeholder':
                            self._log_generation_cost(
                                actual_provider,
                                item['product_id'],
                                item['id'],
                                int((time.time() - start_time) * 1000),
                                True
                            )
                        
                        result['success_count'] += 1
                    else:
                        raise Exception("Failed to generate image")
                        
                except Exception as e:
                    logger.error(f"Error processing item {item['id']}: {e}")
                    
                    # Update queue status to failed
                    self.supabase.table('image_generation_queue').update({
                        'status': 'failed',
                        'error_message': str(e),
                        'attempt_count': item.get('attempt_count', 0) + 1,
                        'updated_at': datetime.now().isoformat()
                    }).eq('id', item['id']).execute()
                    
                    # Log to history
                    self.supabase.table('image_generation_history').insert({
                        'queue_id': item['id'],
                        'product_id': item['product_id'],
                        'action': 'failed',
                        'details': {
                            'error': str(e),
                            'provider': provider,
                            'attempt': item.get('attempt_count', 0) + 1
                        }
                    }).execute()
                    
                    # Log failed cost
                    self._log_generation_cost(
                        provider,
                        item['product_id'],
                        item['id'],
                        int((time.time() - start_time) * 1000),
                        False,
                        str(e)
                    )
                    
                    result['failed_count'] += 1
                
                result['processed_count'] += 1
            
            logger.info(
                f"Processed {result['processed_count']} items: "
                f"{result['success_count']} success, "
                f"{result['failed_count']} failed"
            )
            
            return result
            
        except Exception as e:
            logger.error(f"Error processing queue: {e}")
            return result
    
    def generate_placeholder_url(self, product_name: str, plant_part: str) -> str:
        """Generate placeholder URL"""
        color_map = {
            'Seed': '8B4513',
            'Fiber': '228B22',
            'Flower': '9370DB',
            'Hurd': 'D2691E',
            'Root': '8B4513',
            'Leaves': '32CD32'
        }
        
        color = '2E8B57'  # Default
        for key, value in color_map.items():
            if key in plant_part:
                color = value
                break
        
        formatted_name = product_name.replace(' ', '+').replace('/', '-')
        return f"https://via.placeholder.com/1024x1024/{color}/FFFFFF?text={formatted_name}"
    
    def generate_image_stable_diffusion(self, prompt: str, negative_prompt: Optional[str] = None) -> Optional[str]:
        """Generate image using Stable Diffusion API"""
        if not self.stability_key:
            logger.error("Stability API key not found")
            raise Exception("Stability API key not configured")
        
        logger.info("Calling Stable Diffusion API...")
        
        try:
            headers = {
                "Authorization": f"Bearer {self.stability_key}",
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
            
            body = {
                "text_prompts": [
                    {"text": prompt, "weight": 1}
                ],
                "cfg_scale": 7,
                "height": 1024,
                "width": 1024,
                "samples": 1,
                "steps": 30
            }
            
            if negative_prompt:
                body["text_prompts"].append({"text": negative_prompt, "weight": -1})
            
            response = requests.post(
                "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
                headers=headers,
                json=body,
                timeout=60
            )
            
            if response.status_code == 200:
                data = response.json()
                # Get the base64 image
                image_base64 = data['artifacts'][0]['base64']
                # Decode base64 to bytes
                image_bytes = base64.b64decode(image_base64)
                # Upload to Supabase Storage
                filename = f"hemp-product-sd-{int(time.time())}-{os.urandom(4).hex()}.png"
                image_url = self.upload_to_supabase_storage(image_bytes, filename)
                logger.info(f"Successfully generated and uploaded image: {image_url}")
                return image_url
            else:
                error_msg = f"Stable Diffusion API error: {response.status_code} - {response.text}"
                logger.error(error_msg)
                raise Exception(error_msg)
                
        except Exception as e:
            logger.error(f"Error generating with Stable Diffusion: {e}")
            raise
    
    def generate_image_dall_e(self, prompt: str) -> Optional[str]:
        """Generate image using DALL-E API"""
        if not self.openai_key:
            logger.error("OpenAI API key not found")
            raise Exception("OpenAI API key not configured")
        
        logger.info("Calling DALL-E API...")
        
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
                },
                timeout=60
            )
            
            if response.status_code == 200:
                data = response.json()
                remote_url = data['data'][0]['url']
                
                # Download the image
                img_response = requests.get(remote_url, timeout=30)
                if img_response.status_code == 200:
                    # Upload to Supabase Storage
                    filename = f"hemp-product-dalle-{int(time.time())}-{os.urandom(4).hex()}.png"
                    image_url = self.upload_to_supabase_storage(img_response.content, filename)
                    logger.info(f"Successfully generated and uploaded image: {image_url}")
                    return image_url
                else:
                    raise Exception(f"Failed to download DALL-E image: {img_response.status_code}")
            else:
                error_msg = f"DALL-E API error: {response.status_code} - {response.text}"
                logger.error(error_msg)
                raise Exception(error_msg)
                
        except Exception as e:
            logger.error(f"Error generating with DALL-E: {e}")
            raise
    
    def _log_generation_cost(self, provider: str, product_id: int, queue_id: str, 
                           generation_time_ms: int, success: bool, error_message: str = None):
        """Log generation cost to database"""
        try:
            # Get provider config for cost
            provider_config = self.supabase.table('ai_provider_config').select(
                'cost_per_image'
            ).eq('provider_name', provider).single().execute()
            
            cost = float(provider_config.data['cost_per_image']) if success and provider_config.data else 0
            
            self.supabase.table('ai_generation_costs').insert({
                'provider_name': provider,
                'product_id': product_id,
                'queue_id': queue_id,
                'cost': cost,
                'generation_time_ms': generation_time_ms,
                'image_size': '1024x1024',
                'success': success,
                'error_message': error_message,
                'metadata': {
                    'python_script': True,
                    'timestamp': datetime.now().isoformat()
                }
            }).execute()
        except Exception as e:
            logger.error(f"Error logging cost: {e}")
    
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
