#!/usr/bin/env python3
"""
Setup Image Generation System

This script initializes the image generation system by:
1. Creating necessary database tables
2. Queuing all products without images
3. Setting up initial configuration
"""

import os
import sys
import logging
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


class ImageGenerationSetup:
    """Setup the image generation system"""
    
    def __init__(self):
        """Initialize setup"""
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_ANON_KEY')
        
        if not self.supabase_url or not self.supabase_key:
            raise ValueError("Missing Supabase credentials in environment")
        
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
    
    def verify_tables_exist(self) -> bool:
        """Verify that required tables exist"""
        required_tables = [
            'image_generation_queue',
            'image_generation_history',
            'image_generation_schedule'
        ]
        
        try:
            for table in required_tables:
                response = self.supabase.table(table).select('id').limit(1).execute()
                logger.info(f"✓ Table '{table}' exists")
            
            return True
            
        except Exception as e:
            logger.error(f"Error verifying tables: {e}")
            logger.error("Please run the schema_image_generation.sql migration first")
            return False
    
    def get_products_without_images(self) -> int:
        """Count products without images"""
        try:
            response = self.supabase.table('uses_products').select(
                'id', count='exact'
            ).or_('image_url.is.null,image_url.eq.').execute()
            
            return response.count
            
        except Exception as e:
            logger.error(f"Error counting products: {e}")
            return 0
    
    def queue_all_products(self) -> dict:
        """Queue all products without images"""
        logger.info("Queuing all products without images...")
        
        try:
            # Call the database function
            response = self.supabase.rpc('queue_all_products_for_images').execute()
            
            if response.data:
                result = response.data[0]
                logger.info(f"✓ Queued {result.get('queued_count', 0)} products")
                logger.info(f"✓ {result.get('already_has_image', 0)} products already have images")
                logger.info(f"✓ {result.get('already_in_queue', 0)} products already in queue")
                
                return result
            
            return {'queued_count': 0}
            
        except Exception as e:
            logger.error(f"Error queuing products: {e}")
            return {'queued_count': 0, 'error': str(e)}
    
    def setup_default_schedule(self) -> bool:
        """Ensure default schedule exists"""
        try:
            # Check if schedule exists
            response = self.supabase.table('image_generation_schedule').select(
                'id'
            ).eq('schedule_name', 'default_image_generation_schedule').execute()
            
            if not response.data:
                # Create default schedule
                self.supabase.table('image_generation_schedule').insert({
                    'schedule_name': 'default_image_generation_schedule',
                    'cron_expression': '*/15 * * * *',
                    'is_active': True
                }).execute()
                
                logger.info("✓ Created default schedule (every 15 minutes)")
            else:
                logger.info("✓ Default schedule already exists")
            
            return True
            
        except Exception as e:
            logger.error(f"Error setting up schedule: {e}")
            return False
    
    def display_statistics(self) -> None:
        """Display current statistics"""
        try:
            # Get product counts
            total_products = self.supabase.table('uses_products').select(
                'id', count='exact'
            ).execute().count
            
            products_with_images = self.supabase.table('uses_products').select(
                'id', count='exact'
            ).not_('image_url', 'is', 'null').not_('image_url', 'eq', '').execute().count
            
            # Get queue counts
            queue_stats = {
                'pending': self.supabase.table('image_generation_queue').select(
                    'id', count='exact'
                ).eq('status', 'pending').execute().count,
                'processing': self.supabase.table('image_generation_queue').select(
                    'id', count='exact'
                ).eq('status', 'processing').execute().count,
                'completed': self.supabase.table('image_generation_queue').select(
                    'id', count='exact'
                ).eq('status', 'completed').execute().count,
                'failed': self.supabase.table('image_generation_queue').select(
                    'id', count='exact'
                ).eq('status', 'failed').execute().count
            }
            
            print("\n" + "="*60)
            print("IMAGE GENERATION SYSTEM STATISTICS")
            print("="*60)
            print(f"Total Products: {total_products}")
            print(f"Products with Images: {products_with_images} ({products_with_images/total_products*100:.1f}%)")
            print(f"Products without Images: {total_products - products_with_images}")
            print("\nQueue Status:")
            print(f"  Pending: {queue_stats['pending']}")
            print(f"  Processing: {queue_stats['processing']}")
            print(f"  Completed: {queue_stats['completed']}")
            print(f"  Failed: {queue_stats['failed']}")
            print("="*60 + "\n")
            
        except Exception as e:
            logger.error(f"Error displaying statistics: {e}")
    
    def run_setup(self) -> bool:
        """Run the complete setup process"""
        logger.info("Starting Image Generation System Setup...")
        
        # Step 1: Verify tables
        if not self.verify_tables_exist():
            return False
        
        # Step 2: Display initial statistics
        print("\nInitial State:")
        self.display_statistics()
        
        # Step 3: Count products without images
        products_without_images = self.get_products_without_images()
        logger.info(f"Found {products_without_images} products without images")
        
        # Step 4: Queue all products
        if products_without_images > 0:
            result = self.queue_all_products()
            if 'error' in result:
                logger.error("Failed to queue products")
                return False
        else:
            logger.info("All products already have images!")
        
        # Step 5: Setup schedule
        if not self.setup_default_schedule():
            logger.warning("Failed to setup schedule, but continuing...")
        
        # Step 6: Display final statistics
        print("\nFinal State:")
        self.display_statistics()
        
        # Success message
        print("\n" + "="*60)
        print("✓ IMAGE GENERATION SYSTEM SETUP COMPLETE!")
        print("="*60)
        print("\nNext Steps:")
        print("1. Run the image generator:")
        print("   python image_generation/hemp_image_generator.py")
        print("\n2. Or run continuously:")
        print("   python image_generation/hemp_image_generator.py --mode continuous")
        print("\n3. Monitor progress:")
        print("   python image_generation/hemp_image_generator.py --mode monitor")
        print("="*60 + "\n")
        
        return True


def main():
    """Main entry point"""
    try:
        setup = ImageGenerationSetup()
        success = setup.run_setup()
        
        if not success:
            logger.error("Setup failed!")
            sys.exit(1)
        
    except Exception as e:
        logger.error(f"Setup error: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()