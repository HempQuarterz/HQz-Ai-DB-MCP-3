# agents/core/base_agent.py
"""
Base Agent Class for HempQuarterz AI Agents
Provides common functionality for all specialized agents
"""

import os
import json
import asyncio
from abc import ABC, abstractmethod
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
from functools import wraps
import traceback

from openai import AsyncOpenAI
from anthropic import AsyncAnthropic
from supabase import Client
import aiohttp
from tenacity import retry, stop_after_attempt, wait_exponential

# Rate limiting
from collections import defaultdict
import time


class RateLimiter:
    """Simple rate limiter for API calls"""
    def __init__(self):
        self.calls = defaultdict(list)
        
    async def check_rate_limit(self, key: str, max_calls: int, window_seconds: int) -> bool:
        """Check if action is within rate limits"""
        now = time.time()
        
        # Clean old entries
        self.calls[key] = [t for t in self.calls[key] if now - t < window_seconds]
        
        # Check limit
        if len(self.calls[key]) >= max_calls:
            return False
            
        # Record call
        self.calls[key].append(now)
        return True


class AIProvider:
    """Manages multiple AI providers with fallback"""
    def __init__(self, primary='claude', fallback='openai'):
        self.primary = primary
        self.fallback = fallback
        
        # Initialize clients
        self.openai = AsyncOpenAI(api_key=os.environ.get('OPENAI_API_KEY'))
        self.anthropic = AsyncAnthropic(api_key=os.environ.get('ANTHROPIC_API_KEY'))
        
    async def generate(self, prompt: str, model: Optional[str] = None, **kwargs) -> Tuple[str, int, float]:
        """
        Generate text using AI with fallback support
        Returns: (response_text, tokens_used, cost)
        """
        try:
            if self.primary == 'claude':
                return await self._generate_claude(prompt, model or 'claude-3-opus-20240229', **kwargs)
            else:
                return await self._generate_openai(prompt, model or 'gpt-4o', **kwargs)
        except Exception as e:
            print(f"Primary AI failed ({self.primary}): {e}, trying fallback...")
            if self.fallback == 'openai':
                return await self._generate_openai(prompt, 'gpt-4o-mini', **kwargs)
            else:
                return await self._generate_claude(prompt, 'claude-3-haiku-20240307', **kwargs)
    
    async def _generate_claude(self, prompt: str, model: str, **kwargs) -> Tuple[str, int, float]:
        """Generate using Claude"""
        response = await self.anthropic.messages.create(
            model=model,
            max_tokens=kwargs.get('max_tokens', 2000),
            messages=[{"role": "user", "content": prompt}],
            temperature=kwargs.get('temperature', 0.7)
        )
        
        tokens = response.usage.input_tokens + response.usage.output_tokens
        
        # Cost calculation (approximate)
        cost_per_1k = {
            'claude-3-opus-20240229': 0.03,
            'claude-3-sonnet-20240229': 0.003,
            'claude-3-haiku-20240307': 0.0008
        }
        cost = (tokens / 1000) * cost_per_1k.get(model, 0.01)
        
        return response.content[0].text, tokens, cost
    
    async def _generate_openai(self, prompt: str, model: str, **kwargs) -> Tuple[str, int, float]:
        """Generate using OpenAI"""
        response = await self.openai.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "You are a hemp industry expert assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=kwargs.get('max_tokens', 2000),
            temperature=kwargs.get('temperature', 0.7)
        )
        
        tokens = response.usage.total_tokens
        
        # Cost calculation
        cost_per_1k = {
            'gpt-4o': 0.01,
            'gpt-4o-mini': 0.0002,
            'gpt-3.5-turbo': 0.0015
        }
        cost = (tokens / 1000) * cost_per_1k.get(model, 0.002)
        
        return response.choices[0].message.content, tokens, cost


def rate_limited(max_calls: int = 10, window_seconds: int = 60):
    """Decorator for rate limiting agent methods"""
    def decorator(func):
        @wraps(func)
        async def wrapper(self, *args, **kwargs):
            key = f"{self.__class__.__name__}.{func.__name__}"
            
            if not await self.rate_limiter.check_rate_limit(key, max_calls, window_seconds):
                wait_time = window_seconds
                self.logger.warning(f"Rate limit exceeded for {key}. Waiting {wait_time}s...")
                await asyncio.sleep(wait_time)
                
            return await func(self, *args, **kwargs)
        return wrapper
    return decorator


def track_performance(action_type: str):
    """Decorator to track agent performance metrics"""
    def decorator(func):
        @wraps(func)
        async def wrapper(self, *args, **kwargs):
            start_time = datetime.utcnow()
            success = False
            error_message = None
            
            try:
                result = await func(self, *args, **kwargs)
                success = True
                return result
            except Exception as e:
                error_message = str(e)
                raise
            finally:
                # Track performance
                elapsed = (datetime.utcnow() - start_time).total_seconds()
                await self._track_performance(
                    action_type=action_type,
                    success=success,
                    duration=elapsed,
                    error_message=error_message
                )
        return wrapper
    return decorator


class BaseAgent(ABC):
    """Base class for all HempQuarterz AI agents"""
    
    def __init__(self, supabase_client: Client, agent_name: str):
        self.supabase = supabase_client
        self.agent_name = agent_name
        self.rate_limiter = RateLimiter()
        self.ai_provider = AIProvider()
        
        # Logger placeholder (can be replaced with actual logging)
        self.logger = self._setup_logger()
        
        # Agent configuration
        self.config = self._load_config()
        
    def _setup_logger(self):
        """Setup logging for the agent"""
        # Simple console logger for now
        class Logger:
            def info(self, msg): print(f"[{datetime.utcnow()}] INFO: {msg}")
            def warning(self, msg): print(f"[{datetime.utcnow()}] WARN: {msg}")
            def error(self, msg): print(f"[{datetime.utcnow()}] ERROR: {msg}")
        return Logger()
    
    def _load_config(self) -> Dict[str, Any]:
        """Load agent-specific configuration"""
        # Default configuration
        config = {
            'rate_limits': {
                'per_minute': 10,
                'per_hour': 100,
                'per_day': 1000
            },
            'ai_model': 'gpt-4o-mini',
            'max_retries': 3,
            'timeout_seconds': 30
        }
        
        # Override with agent-specific config if exists
        # This could load from database or config file
        return config
    
    @abstractmethod
    async def execute(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute the main task for this agent
        Must be implemented by each specialized agent
        """
        pass
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def _make_api_request(self, url: str, method: str = 'GET', **kwargs) -> Dict[str, Any]:
        """Make HTTP API request with retry logic"""
        async with aiohttp.ClientSession() as session:
            timeout = aiohttp.ClientTimeout(total=self.config['timeout_seconds'])
            
            async with session.request(method, url, timeout=timeout, **kwargs) as response:
                if response.status >= 400:
                    text = await response.text()
                    raise Exception(f"API request failed: {response.status} - {text}")
                    
                return await response.json()
    
    async def _generate_with_ai(self, prompt: str, **kwargs) -> str:
        """Generate text using AI with cost tracking"""
        try:
            response, tokens, cost = await self.ai_provider.generate(
                prompt=prompt,
                model=kwargs.get('model', self.config['ai_model']),
                **kwargs
            )
            
            # Track costs
            await self._track_ai_usage(
                model=kwargs.get('model', self.config['ai_model']),
                tokens=tokens,
                cost=cost,
                purpose=kwargs.get('purpose', 'general')
            )
            
            return response
            
        except Exception as e:
            self.logger.error(f"AI generation failed: {e}")
            raise
    
    async def _save_to_database(self, table: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Save data to Supabase with error handling"""
        try:
            result = await self.supabase.table(table).insert(data).execute()
            return result.data[0] if result.data else {}
        except Exception as e:
            self.logger.error(f"Database save failed for {table}: {e}")
            raise
    
    async def _update_task_status(self, task_id: str, status: str, result: Optional[Dict] = None, error: Optional[str] = None):
        """Update task status in the queue"""
        update_data = {
            'status': status,
            'updated_at': datetime.utcnow().isoformat()
        }
        
        if status == 'in_progress':
            update_data['started_at'] = datetime.utcnow().isoformat()
        elif status == 'completed':
            update_data['completed_at'] = datetime.utcnow().isoformat()
            if result:
                update_data['result'] = result
        elif status == 'failed':
            update_data['completed_at'] = datetime.utcnow().isoformat()
            if error:
                update_data['error_log'] = [error]
                
        await self.supabase.table('agent_task_queue').update(update_data).eq('task_id', task_id).execute()
    
    async def _track_performance(self, action_type: str, success: bool, duration: float, error_message: Optional[str] = None):
        """Track agent performance metrics"""
        try:
            # Update daily metrics
            metric_data = {
                'agent_type': self.agent_name,
                'metric_date': datetime.utcnow().date().isoformat(),
                'tasks_completed': 1 if success else 0,
                'tasks_failed': 0 if success else 1,
                'average_completion_time': int(duration)
            }
            
            # Use upsert to update existing metrics
            await self.supabase.table('agent_performance_metrics').upsert(
                metric_data,
                on_conflict='agent_type,metric_date'
            ).execute()
            
        except Exception as e:
            self.logger.error(f"Failed to track performance: {e}")
    
    async def _track_ai_usage(self, model: str, tokens: int, cost: float, purpose: str):
        """Track AI usage and costs"""
        try:
            cost_data = {
                'provider_name': model,
                'generation_type': f'agent_{purpose}',
                'total_tokens': tokens,
                'cost': cost,
                'metadata': {
                    'agent': self.agent_name,
                    'purpose': purpose
                }
            }
            
            await self.supabase.table('ai_generation_costs').insert(cost_data).execute()
            
        except Exception as e:
            self.logger.error(f"Failed to track AI usage: {e}")
    
    async def _log_activity(self, activity_type: str, details: Dict[str, Any]):
        """Log agent activity for monitoring"""
        log_entry = {
            'agent_name': self.agent_name,
            'activity_type': activity_type,
            'details': details,
            'timestamp': datetime.utcnow().isoformat()
        }
        
        # This could write to a specific activity log table
        self.logger.info(f"Activity: {activity_type} - {json.dumps(details)}")
    
    async def handle_error(self, error: Exception, context: Dict[str, Any]) -> Dict[str, Any]:
        """Standard error handling for agents"""
        error_details = {
            'error_type': type(error).__name__,
            'error_message': str(error),
            'traceback': traceback.format_exc(),
            'context': context,
            'agent': self.agent_name,
            'timestamp': datetime.utcnow().isoformat()
        }
        
        # Log error
        self.logger.error(f"Agent error: {json.dumps(error_details)}")
        
        # Save to error log table if critical
        if context.get('critical', False):
            await self._save_to_database('agent_error_logs', error_details)
        
        return error_details
    
    def validate_task_params(self, task: Dict[str, Any], required_fields: List[str]) -> bool:
        """Validate that task has required parameters"""
        params = task.get('params', {})
        missing_fields = [field for field in required_fields if field not in params]
        
        if missing_fields:
            raise ValueError(f"Missing required parameters: {missing_fields}")
            
        return True
    
    async def process_batch(self, items: List[Any], process_func, batch_size: int = 10) -> List[Any]:
        """Process items in batches to avoid overwhelming resources"""
        results = []
        
        for i in range(0, len(items), batch_size):
            batch = items[i:i + batch_size]
            
            # Process batch concurrently
            batch_tasks = [process_func(item) for item in batch]
            batch_results = await asyncio.gather(*batch_tasks, return_exceptions=True)
            
            # Handle results and errors
            for idx, result in enumerate(batch_results):
                if isinstance(result, Exception):
                    self.logger.error(f"Batch item {i + idx} failed: {result}")
                    results.append(None)
                else:
                    results.append(result)
                    
            # Small delay between batches
            await asyncio.sleep(1)
            
        return results


# Example specialized agent using the base class
class ExampleSpecializedAgent(BaseAgent):
    """Example of how to implement a specialized agent"""
    
    def __init__(self, supabase_client: Client):
        super().__init__(supabase_client, "example_agent")
        
    @track_performance("example_action")
    @rate_limited(max_calls=5, window_seconds=60)
    async def execute(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute example task"""
        # Validate parameters
        self.validate_task_params(task, ['action', 'target'])
        
        # Update task status
        task_id = task.get('task_id')
        if task_id:
            await self._update_task_status(task_id, 'in_progress')
        
        try:
            # Do the actual work
            result = await self._do_work(task['params'])
            
            # Update task status
            if task_id:
                await self._update_task_status(task_id, 'completed', result)
                
            return result
            
        except Exception as e:
            # Handle error
            error_details = await self.handle_error(e, task)
            
            # Update task status
            if task_id:
                await self._update_task_status(task_id, 'failed', error=str(e))
                
            raise
    
    async def _do_work(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Actual work implementation"""
        # Use AI to generate something
        response = await self._generate_with_ai(
            prompt=f"Generate example content for: {params.get('target')}",
            purpose="example_generation"
        )
        
        # Save results
        result = await self._save_to_database('example_results', {
            'content': response,
            'params': params
        })
        
        return result