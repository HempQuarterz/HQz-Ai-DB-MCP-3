"""
HempQuarterz AI Agents
Complete autonomous agent system for hemp business automation
"""

from .core.base_agent import BaseAgent, rate_limited, track_performance
from .core.orchestrator import Orchestrator
from .research.research_agent import ResearchAgent
from .content.content_agent import ContentAgent
from .seo.seo_agent import SEOAgent
from .outreach.outreach_agent import OutreachAgent
from .monetization.monetization_agent import MonetizationAgent
from .compliance.compliance_agent import ComplianceAgent

__version__ = "1.0.0"

__all__ = [
    "BaseAgent",
    "Orchestrator",
    "ResearchAgent", 
    "ContentAgent",
    "SEOAgent",
    "OutreachAgent",
    "MonetizationAgent",
    "ComplianceAgent",
    "rate_limited",
    "track_performance"
]

# Agent registry for dynamic loading
AGENT_REGISTRY = {
    "orchestrator": Orchestrator,
    "research": ResearchAgent,
    "content": ContentAgent,
    "seo": SEOAgent,
    "outreach": OutreachAgent,
    "monetization": MonetizationAgent,
    "compliance": ComplianceAgent
}

def get_agent(agent_name: str, config: dict):
    """
    Factory function to get an agent instance by name
    
    Args:
        agent_name: Name of the agent to instantiate
        config: Configuration dictionary for the agent
        
    Returns:
        Agent instance
        
    Raises:
        ValueError: If agent_name is not found in registry
    """
    agent_class = AGENT_REGISTRY.get(agent_name.lower())
    if not agent_class:
        raise ValueError(f"Unknown agent: {agent_name}. Available agents: {list(AGENT_REGISTRY.keys())}")
    
    return agent_class(config)