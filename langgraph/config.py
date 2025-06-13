"""LangGraph configuration and setup."""

import os
from typing import Dict, Any, Optional
from langgraph.graph import Graph, StateGraph
from langgraph.checkpoint.sqlite import SqliteSaver
import yaml


class LangGraphConfig:
    """Configuration for LangGraph workflows."""
    
    def __init__(self, config_path: Optional[str] = None):
        self.config_path = config_path or os.path.join(
            os.path.dirname(__file__), '..', 'config', 'langgraph_config.yaml'
        )
        self.config = self._load_config()
        self.memory = SqliteSaver.from_conn_string(".langgraph_checkpoints.db")
        
    def _load_config(self) -> Dict[str, Any]:
        """Load configuration from YAML file."""
        if os.path.exists(self.config_path):
            with open(self.config_path, 'r') as f:
                return yaml.safe_load(f)
        return self._default_config()
    
    def _default_config(self) -> Dict[str, Any]:
        """Return default configuration."""
        return {
            'graphs': {
                'daily_automation': {
                    'name': 'Daily Hemp Automation Workflow',
                    'schedule': '0 9 * * *',
                    'timeout': 3600,
                    'retry_policy': {
                        'max_attempts': 3,
                        'backoff_factor': 2
                    }
                },
                'compliance_monitoring': {
                    'name': 'Compliance Monitoring',
                    'schedule': '0 */6 * * *',
                    'timeout': 1800
                }
            },
            'checkpointing': {
                'enabled': True,
                'cleanup_after_days': 30
            },
            'monitoring': {
                'log_level': 'INFO',
                'metrics_enabled': True
            }
        }
    
    def get_graph_config(self, graph_name: str) -> Dict[str, Any]:
        """Get configuration for a specific graph."""
        return self.config.get('graphs', {}).get(graph_name, {})
    
    def create_graph(self, name: str) -> StateGraph:
        """Create a new StateGraph with configuration."""
        config = self.get_graph_config(name)
        graph = StateGraph()
        
        # Apply configuration
        if config.get('timeout'):
            graph.timeout = config['timeout']
            
        return graph