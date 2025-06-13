#!/usr/bin/env python3
"""
Agent Orchestrator - Continuously processes agent tasks from the database
Run this in the background to have agents automatically process queued tasks
"""

import os
import sys
import asyncio
import logging
from datetime import datetime
import signal

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from agents.core.orchestrator import AgentOrchestrator
from supabase import create_client

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Global flag for graceful shutdown
shutdown_flag = False

def signal_handler(signum, frame):
    """Handle shutdown signals gracefully"""
    global shutdown_flag
    logger.info("Received shutdown signal. Stopping orchestrator...")
    shutdown_flag = True

async def run_orchestrator():
    """Run the agent orchestrator continuously"""
    # Configuration
    config = {
        'supabase_url': os.environ.get('SUPABASE_URL'),
        'supabase_key': os.environ.get('SUPABASE_ANON_KEY'),
        'openai_api_key': os.environ.get('OPENAI_API_KEY'),
        'anthropic_api_key': os.environ.get('ANTHROPIC_API_KEY'),
    }
    
    # Validate configuration
    if not config['supabase_url'] or not config['supabase_key']:
        logger.error("Supabase credentials not found. Please set SUPABASE_URL and SUPABASE_ANON_KEY")
        return
    
    # Initialize orchestrator
    orchestrator = AgentOrchestrator(config)
    
    logger.info("🚀 Agent Orchestrator started")
    logger.info("Monitoring agent_task_queue for new tasks...")
    
    # Process tasks continuously
    while not shutdown_flag:
        try:
            # Check for pending tasks
            supabase = create_client(config['supabase_url'], config['supabase_key'])
            
            # Get next pending task
            result = supabase.table('agent_task_queue')\
                .select('*')\
                .eq('status', 'pending')\
                .order('priority', desc=True)\
                .order('created_at')\
                .limit(1)\
                .execute()
            
            if result.data:
                task = result.data[0]
                logger.info(f"Processing task {task['task_id']} for {task['agent_type']}")
                
                # Update task status to in_progress
                supabase.table('agent_task_queue')\
                    .update({
                        'status': 'in_progress',
                        'started_at': datetime.utcnow().isoformat()
                    })\
                    .eq('task_id', task['task_id'])\
                    .execute()
                
                try:
                    # Execute task through orchestrator
                    result = await orchestrator.execute_task(task)
                    
                    # Update task as completed
                    supabase.table('agent_task_queue')\
                        .update({
                            'status': 'completed',
                            'completed_at': datetime.utcnow().isoformat(),
                            'result': result
                        })\
                        .eq('task_id', task['task_id'])\
                        .execute()
                    
                    logger.info(f"✅ Task {task['task_id']} completed successfully")
                    
                except Exception as e:
                    # Update task as failed
                    logger.error(f"❌ Task {task['task_id']} failed: {str(e)}")
                    
                    supabase.table('agent_task_queue')\
                        .update({
                            'status': 'failed',
                            'completed_at': datetime.utcnow().isoformat(),
                            'error_log': [str(e)]
                        })\
                        .eq('task_id', task['task_id'])\
                        .execute()
            
            else:
                # No pending tasks, wait before checking again
                await asyncio.sleep(5)
                
        except Exception as e:
            logger.error(f"Orchestrator error: {e}")
            await asyncio.sleep(10)  # Wait longer on error
    
    logger.info("Orchestrator stopped")

async def create_sample_tasks():
    """Create some sample tasks for testing"""
    config = {
        'supabase_url': os.environ.get('SUPABASE_URL'),
        'supabase_key': os.environ.get('SUPABASE_ANON_KEY'),
    }
    
    if not config['supabase_url']:
        print("Supabase not configured")
        return
    
    supabase = create_client(config['supabase_url'], config['supabase_key'])
    
    sample_tasks = [
        {
            'agent_type': 'research_agent',
            'task_type': 'discover_products',
            'status': 'pending',
            'priority': 'high',
            'params': {
                'sources': ['https://www.hempindustrydaily.com'],
                'limit': 5
            }
        },
        {
            'agent_type': 'content_agent',
            'task_type': 'generate_blog_post',
            'status': 'pending',
            'priority': 'medium',
            'params': {
                'topic': 'Benefits of Hemp in Modern Agriculture',
                'keywords': ['sustainable farming', 'hemp cultivation', 'soil health'],
                'word_count': 1000
            }
        },
        {
            'agent_type': 'seo_agent',
            'task_type': 'research_keywords',
            'status': 'pending',
            'priority': 'medium',
            'params': {
                'seed_keywords': ['industrial hemp', 'hemp products', 'hemp farming'],
                'product_focus': 'agriculture'
            }
        },
        {
            'agent_type': 'outreach_agent',
            'task_type': 'find_partnerships',
            'status': 'pending',
            'priority': 'low',
            'params': {
                'industry': 'Hemp Textiles',
                'opportunity_type': 'partnership',
                'limit': 10
            }
        },
        {
            'agent_type': 'monetization_agent',
            'task_type': 'analyze_opportunities',
            'status': 'pending',
            'priority': 'high',
            'params': {
                'focus_areas': ['Hemp Foods', 'Hemp Cosmetics']
            }
        }
    ]
    
    for task in sample_tasks:
        task['created_at'] = datetime.utcnow().isoformat()
        result = supabase.table('agent_task_queue').insert(task).execute()
        print(f"Created task: {task['agent_type']} - {task['task_type']}")
    
    print(f"\n✅ Created {len(sample_tasks)} sample tasks")

def main():
    """Main entry point"""
    print("=== Hemp AI Agent Orchestrator ===\n")
    
    # Check environment variables
    missing_vars = []
    
    if not os.environ.get('SUPABASE_URL'):
        missing_vars.append('SUPABASE_URL')
    if not os.environ.get('SUPABASE_ANON_KEY'):
        missing_vars.append('SUPABASE_ANON_KEY')
    
    if missing_vars:
        print("❌ Missing required environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\nPlease set these environment variables and try again.")
        print("Example: export SUPABASE_URL='https://your-project.supabase.co'")
        return
    
    # Optional AI keys
    if not os.environ.get('OPENAI_API_KEY') and not os.environ.get('ANTHROPIC_API_KEY'):
        print("⚠️  Warning: No AI API keys found (OPENAI_API_KEY or ANTHROPIC_API_KEY)")
        print("   Agents will have limited AI capabilities")
        print()
    
    # Menu
    print("1. Run orchestrator (processes tasks continuously)")
    print("2. Create sample tasks")
    print("3. Both (create tasks then run orchestrator)")
    
    choice = input("\nEnter your choice (1-3): ")
    
    # Set up signal handlers for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    if choice == '1':
        asyncio.run(run_orchestrator())
    elif choice == '2':
        asyncio.run(create_sample_tasks())
    elif choice == '3':
        asyncio.run(create_sample_tasks())
        asyncio.run(run_orchestrator())
    else:
        print("Invalid choice")

if __name__ == "__main__":
    main()