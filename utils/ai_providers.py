"""Multi-provider AI management with fallback support."""

import os
from typing import Dict, Any, Optional, List
from abc import ABC, abstractmethod
import asyncio
from openai import AsyncOpenAI
from anthropic import AsyncAnthropic
import logging

logger = logging.getLogger(__name__)


class AIProvider(ABC):
    """Abstract base class for AI providers."""
    
    @abstractmethod
    async def generate(self, prompt: str, **kwargs) -> str:
        """Generate text from prompt."""
        pass
    
    @abstractmethod
    async def embed(self, text: str) -> List[float]:
        """Generate embeddings for text."""
        pass
    
    @abstractmethod
    def get_cost(self, tokens: int, operation: str = 'generation') -> float:
        """Calculate cost for token usage."""
        pass


class OpenAIProvider(AIProvider):
    """OpenAI API provider."""
    
    def __init__(self, api_key: Optional[str] = None, model: str = "gpt-4o"):
        self.client = AsyncOpenAI(api_key=api_key or os.getenv("OPENAI_API_KEY"))
        self.model = model
        self.embedding_model = "text-embedding-3-small"
        
    async def generate(self, prompt: str, **kwargs) -> str:
        """Generate text using OpenAI."""
        try:
            response = await self.client.chat.completions.create(
                model=kwargs.get('model', self.model),
                messages=[{"role": "user", "content": prompt}],
                temperature=kwargs.get('temperature', 0.7),
                max_tokens=kwargs.get('max_tokens', 2000)
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"OpenAI generation error: {e}")
            raise
            
    async def embed(self, text: str) -> List[float]:
        """Generate embeddings using OpenAI."""
        response = await self.client.embeddings.create(
            model=self.embedding_model,
            input=text
        )
        return response.data[0].embedding
        
    def get_cost(self, tokens: int, operation: str = 'generation') -> float:
        """Calculate OpenAI costs."""
        costs = {
            'gpt-4o': {'input': 0.005, 'output': 0.015},
            'gpt-4o-mini': {'input': 0.00015, 'output': 0.0006},
            'embedding': 0.00002
        }
        
        if operation == 'embedding':
            return tokens * costs['embedding']
        
        # Rough estimate: 75% input, 25% output
        model_costs = costs.get(self.model, costs['gpt-4o'])
        input_cost = tokens * 0.75 * model_costs['input'] / 1000
        output_cost = tokens * 0.25 * model_costs['output'] / 1000
        return input_cost + output_cost


class AnthropicProvider(AIProvider):
    """Anthropic Claude API provider."""
    
    def __init__(self, api_key: Optional[str] = None, model: str = "claude-3-opus-20240229"):
        self.client = AsyncAnthropic(api_key=api_key or os.getenv("ANTHROPIC_API_KEY"))
        self.model = model
        
    async def generate(self, prompt: str, **kwargs) -> str:
        """Generate text using Claude."""
        try:
            response = await self.client.messages.create(
                model=kwargs.get('model', self.model),
                messages=[{"role": "user", "content": prompt}],
                max_tokens=kwargs.get('max_tokens', 2000),
                temperature=kwargs.get('temperature', 0.7)
            )
            return response.content[0].text
        except Exception as e:
            logger.error(f"Anthropic generation error: {e}")
            raise
            
    async def embed(self, text: str) -> List[float]:
        """Claude doesn't have embeddings, fallback to OpenAI."""
        raise NotImplementedError("Use OpenAI for embeddings")
        
    def get_cost(self, tokens: int, operation: str = 'generation') -> float:
        """Calculate Anthropic costs."""
        costs = {
            'claude-3-opus-20240229': {'input': 0.015, 'output': 0.075},
            'claude-3-sonnet-20240229': {'input': 0.003, 'output': 0.015},
            'claude-3-haiku-20240307': {'input': 0.00025, 'output': 0.00125}
        }
        
        model_costs = costs.get(self.model, costs['claude-3-opus-20240229'])
        input_cost = tokens * 0.75 * model_costs['input'] / 1000
        output_cost = tokens * 0.25 * model_costs['output'] / 1000
        return input_cost + output_cost


class MultiProviderAI:
    """AI provider with automatic fallback."""
    
    def __init__(self, primary_provider: str = "anthropic", fallback_providers: List[str] = ["openai"]):
        self.providers = self._initialize_providers(primary_provider, fallback_providers)
        self.current_provider = 0
        
    def _initialize_providers(self, primary: str, fallbacks: List[str]) -> List[AIProvider]:
        """Initialize AI providers."""
        provider_map = {
            'anthropic': AnthropicProvider,
            'openai': OpenAIProvider
        }
        
        providers = []
        
        # Add primary provider
        if primary in provider_map:
            providers.append(provider_map[primary]())
            
        # Add fallback providers
        for fallback in fallbacks:
            if fallback in provider_map and fallback != primary:
                providers.append(provider_map[fallback]())
                
        if not providers:
            raise ValueError("No valid AI providers configured")
            
        return providers
    
    async def generate(self, prompt: str, **kwargs) -> tuple[str, str, float]:
        """Generate text with automatic fallback."""
        for i, provider in enumerate(self.providers):
            try:
                # Skip Anthropic for embeddings
                if kwargs.get('operation') == 'embedding' and isinstance(provider, AnthropicProvider):
                    continue
                    
                result = await provider.generate(prompt, **kwargs)
                
                # Estimate tokens (rough: 4 chars = 1 token)
                tokens = len(prompt + result) // 4
                cost = provider.get_cost(tokens)
                
                provider_name = provider.__class__.__name__
                logger.info(f"Successfully used {provider_name} for generation")
                
                return result, provider_name, cost
                
            except Exception as e:
                logger.warning(f"Provider {i} failed: {e}")
                if i == len(self.providers) - 1:
                    raise Exception("All AI providers failed")
                continue
    
    async def embed(self, text: str) -> tuple[List[float], float]:
        """Generate embeddings with fallback to OpenAI."""
        # Always use OpenAI for embeddings
        for provider in self.providers:
            if isinstance(provider, OpenAIProvider):
                embeddings = await provider.embed(text)
                cost = provider.get_cost(len(text) // 4, 'embedding')
                return embeddings, cost
                
        # Fallback: create OpenAI provider just for embeddings
        openai_provider = OpenAIProvider()
        embeddings = await openai_provider.embed(text)
        cost = openai_provider.get_cost(len(text) // 4, 'embedding')
        return embeddings, cost