# agents/core/orchestrator.py
"""
HempQuarterz Core Agent Orchestrator
Main coordinator for all AI agents using LangGraph
"""

import os
import json
import asyncio
from datetime import datetime
from typing import Dict, List, Any, Optional
from uuid import uuid4
from enum import Enum

from langgraph.graph import Graph, END
from langgraph.prebuilt import ToolExecutor, ToolInvocation
from langchain.schema import BaseMessage, HumanMessage, SystemMessage
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class TaskPriority(Enum):
    CRITICAL = 1
    HIGH = 3
    MEDIUM = 5
    LOW = 7
    BACKGROUND = 9


class TaskStatus(Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class AgentType(Enum):
    RESEARCH = "research_agent"
    CONTENT = "content_agent"
    SEO = "seo_agent"
    OUTREACH = "outreach_agent"
    MONETIZATION = "monetization_agent"
    COMPLIANCE = "compliance_agent"


class HQzOrchestrator:
    """Main orchestrator for coordinating all HempQuarterz AI agents"""
    
    def __init__(self):
        # Initialize Supabase client
        self.supabase: Client = create_client(
            os.environ['SUPABASE_URL'],
            os.environ['SUPABASE_ANON_KEY']
        )
        
        # Initialize agents registry
        self.agents = {}
        self._initialize_agents()
        
        # Build LangGraph workflow
        self.graph = self._build_graph()
        
        # Task queue
        self.task_queue = asyncio.Queue()
        self.active_tasks = {}
        
    def _initialize_agents(self):
        """Initialize all available agents"""
        # Import agents dynamically to avoid circular imports
        try:
            from agents.research.research_agent import HempResearchAgent
            from agents.content.content_agent import HempContentAgent
            from agents.seo.seo_agent import HempSEOAgent
            from agents.outreach.outreach_agent import HempOutreachAgent
            from agents.monetization.monetization_agent import HempMonetizationAgent
            from agents.compliance.compliance_agent import HempComplianceAgent
            
            # Initialize each agent
            self.agents[AgentType.RESEARCH] = HempResearchAgent(self.supabase)
            self.agents[AgentType.CONTENT] = HempContentAgent(self.supabase)
            self.agents[AgentType.SEO] = HempSEOAgent(self.supabase)
            self.agents[AgentType.OUTREACH] = HempOutreachAgent(self.supabase)
            self.agents[AgentType.MONETIZATION] = HempMonetizationAgent(self.supabase)
            self.agents[AgentType.COMPLIANCE] = HempComplianceAgent(self.supabase)
            
        except ImportError as e:
            print(f"Warning: Some agents not yet implemented: {e}")
    
    def _build_graph(self) -> Graph:
        """Build the LangGraph workflow for agent coordination"""
        # Create a new graph
        workflow = Graph()
        
        # Add nodes for each stage of processing
        workflow.add_node("intake", self._intake_request)
        workflow.add_node("analyze", self._analyze_request)
        workflow.add_node("prioritize", self._prioritize_tasks)
        workflow.add_node("dispatch", self._dispatch_to_agents)
        workflow.add_node("monitor", self._monitor_progress)
        workflow.add_node("aggregate", self._aggregate_results)
        workflow.add_node("report", self._generate_report)
        
        # Define the workflow edges
        workflow.add_edge("intake", "analyze")
        workflow.add_edge("analyze", "prioritize")
        workflow.add_edge("prioritize", "dispatch")
        workflow.add_edge("dispatch", "monitor")
        workflow.add_edge("monitor", "aggregate")
        workflow.add_edge("aggregate", "report")
        workflow.add_edge("report", END)
        
        # Set entry point
        workflow.set_entry_point("intake")
        
        return workflow.compile()
    
    async def process_request(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main entry point for processing any request through the agent system
        
        Args:
            request: Dictionary containing:
                - type: Type of request (research, content, seo, etc.)
                - action: Specific action to perform
                - params: Parameters for the action
                - priority: Optional priority level
                
        Returns:
            Dictionary containing results and metadata
        """
        # Generate request ID
        request_id = str(uuid4())
        request['request_id'] = request_id
        
        # Log the request
        await self._log_orchestration(
            request_id=request_id,
            request_type=request.get('type', 'unknown'),
            status='initiated',
            metadata=request
        )
        
        try:
            # Execute the workflow
            result = await self.graph.ainvoke(request)
            
            # Log completion
            await self._log_orchestration(
                request_id=request_id,
                request_type=request.get('type', 'unknown'),
                status='completed',
                result=result
            )
            
            return result
            
        except Exception as e:
            # Log error
            await self._log_orchestration(
                request_id=request_id,
                request_type=request.get('type', 'unknown'),
                status='failed',
                error_message=str(e)
            )
            raise
    
    async def _intake_request(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Intake and validate incoming requests"""
        # Validate required fields
        required_fields = ['type', 'action']
        for field in required_fields:
            if field not in state:
                raise ValueError(f"Missing required field: {field}")
        
        # Set default priority if not provided
        if 'priority' not in state:
            state['priority'] = TaskPriority.MEDIUM.value
            
        # Add timestamp
        state['received_at'] = datetime.utcnow().isoformat()
        
        return state
    
    async def _analyze_request(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze request to determine required agents and tasks"""
        request_type = state['type']
        action = state['action']
        
        # Determine which agents are needed
        required_agents = []
        
        # Map request types to agents
        agent_mapping = {
            'research': [AgentType.RESEARCH],
            'content': [AgentType.CONTENT, AgentType.SEO],
            'full_automation': [
                AgentType.RESEARCH,
                AgentType.CONTENT,
                AgentType.SEO,
                AgentType.OUTREACH
            ],
            'compliance_check': [AgentType.COMPLIANCE],
            'market_analysis': [AgentType.MONETIZATION, AgentType.RESEARCH],
        }
        
        required_agents = agent_mapping.get(request_type, [AgentType.RESEARCH])
        
        # Create task breakdown
        tasks = []
        for agent_type in required_agents:
            task = {
                'task_id': str(uuid4()),
                'agent_type': agent_type.value,
                'action': action,
                'params': state.get('params', {}),
                'priority': state['priority'],
                'dependencies': []  # Will be set in prioritize phase
            }
            tasks.append(task)
        
        state['tasks'] = tasks
        state['required_agents'] = [a.value for a in required_agents]
        
        return state
    
    async def _prioritize_tasks(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Prioritize and order tasks based on dependencies"""
        tasks = state['tasks']
        
        # Define task dependencies
        dependency_rules = {
            AgentType.CONTENT.value: [AgentType.RESEARCH.value],
            AgentType.SEO.value: [AgentType.CONTENT.value],
            AgentType.OUTREACH.value: [AgentType.CONTENT.value, AgentType.SEO.value],
        }
        
        # Apply dependencies
        for task in tasks:
            agent_type = task['agent_type']
            if agent_type in dependency_rules:
                deps = dependency_rules[agent_type]
                task['dependencies'] = [
                    t['task_id'] for t in tasks 
                    if t['agent_type'] in deps
                ]
        
        # Sort tasks by priority and dependencies
        state['tasks'] = self._topological_sort(tasks)
        
        return state
    
    async def _dispatch_to_agents(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Dispatch tasks to appropriate agents"""
        tasks = state['tasks']
        state['dispatched_tasks'] = []
        
        for task in tasks:
            # Queue task for execution
            await self._queue_task(task)
            
            # Update task status
            task['status'] = TaskStatus.PENDING.value
            task['queued_at'] = datetime.utcnow().isoformat()
            
            state['dispatched_tasks'].append(task)
        
        # Start task execution
        asyncio.create_task(self._process_task_queue())
        
        return state
    
    async def _monitor_progress(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Monitor the progress of dispatched tasks"""
        tasks = state['dispatched_tasks']
        max_wait_time = 300  # 5 minutes max wait
        start_time = datetime.utcnow()
        
        while True:
            # Check all tasks
            all_completed = True
            for task in tasks:
                task_status = await self._get_task_status(task['task_id'])
                task['status'] = task_status
                
                if task_status not in [TaskStatus.COMPLETED.value, TaskStatus.FAILED.value]:
                    all_completed = False
            
            # Check if all tasks are done
            if all_completed:
                break
                
            # Check timeout
            elapsed = (datetime.utcnow() - start_time).total_seconds()
            if elapsed > max_wait_time:
                state['timeout'] = True
                break
                
            # Wait before next check
            await asyncio.sleep(2)
        
        state['monitored_tasks'] = tasks
        return state
    
    async def _aggregate_results(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Aggregate results from all completed tasks"""
        tasks = state['monitored_tasks']
        results = {}
        
        for task in tasks:
            if task['status'] == TaskStatus.COMPLETED.value:
                # Fetch task result
                result = await self._get_task_result(task['task_id'])
                results[task['agent_type']] = result
        
        state['aggregated_results'] = results
        return state
    
    async def _generate_report(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Generate final report from aggregated results"""
        results = state['aggregated_results']
        tasks = state['monitored_tasks']
        
        # Calculate summary statistics
        total_tasks = len(tasks)
        completed_tasks = len([t for t in tasks if t['status'] == TaskStatus.COMPLETED.value])
        failed_tasks = len([t for t in tasks if t['status'] == TaskStatus.FAILED.value])
        
        report = {
            'request_id': state['request_id'],
            'summary': {
                'total_tasks': total_tasks,
                'completed': completed_tasks,
                'failed': failed_tasks,
                'success_rate': completed_tasks / total_tasks if total_tasks > 0 else 0
            },
            'results': results,
            'tasks': tasks,
            'completed_at': datetime.utcnow().isoformat()
        }
        
        state['final_report'] = report
        return state
    
    # Helper methods
    
    async def _log_orchestration(self, **kwargs):
        """Log orchestration events to database"""
        try:
            await self.supabase.table('agent_orchestration_logs').insert(kwargs).execute()
        except Exception as e:
            print(f"Error logging orchestration: {e}")
    
    async def _queue_task(self, task: Dict[str, Any]):
        """Add task to the execution queue"""
        await self.supabase.table('agent_task_queue').insert({
            'task_id': task['task_id'],
            'agent_type': task['agent_type'],
            'action': task['action'],
            'priority': task['priority'],
            'payload': task['params'],
            'status': TaskStatus.PENDING.value
        }).execute()
    
    async def _process_task_queue(self):
        """Process tasks from the queue"""
        # This would be implemented to actually execute tasks
        # For now, it's a placeholder
        pass
    
    async def _get_task_status(self, task_id: str) -> str:
        """Get the current status of a task"""
        result = await self.supabase.table('agent_task_queue').select('status').eq('task_id', task_id).single().execute()
        return result.data['status'] if result.data else TaskStatus.PENDING.value
    
    async def _get_task_result(self, task_id: str) -> Dict[str, Any]:
        """Get the result of a completed task"""
        result = await self.supabase.table('agent_task_queue').select('result').eq('task_id', task_id).single().execute()
        return result.data['result'] if result.data else {}
    
    def _topological_sort(self, tasks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Sort tasks based on dependencies"""
        # Simple implementation - can be enhanced
        sorted_tasks = []
        task_map = {t['task_id']: t for t in tasks}
        visited = set()
        
        def visit(task_id):
            if task_id in visited:
                return
            visited.add(task_id)
            task = task_map[task_id]
            for dep_id in task.get('dependencies', []):
                if dep_id in task_map:
                    visit(dep_id)
            sorted_tasks.append(task)
        
        for task in tasks:
            visit(task['task_id'])
            
        return sorted_tasks


# Example workflows
class HQzWorkflows:
    """Pre-defined workflows for common operations"""
    
    @staticmethod
    def daily_automation_workflow():
        """Daily automation workflow configuration"""
        return {
            'type': 'full_automation',
            'action': 'daily_update',
            'params': {
                'research_limit': 20,
                'content_types': ['blog', 'social'],
                'seo_optimization': True,
                'outreach_enabled': True
            },
            'priority': TaskPriority.MEDIUM.value
        }
    
    @staticmethod
    def new_product_workflow(plant_part: str, industry: str):
        """Workflow for researching and adding new products"""
        return {
            'type': 'research',
            'action': 'discover_products',
            'params': {
                'plant_part': plant_part,
                'industry': industry,
                'limit': 10,
                'generate_content': True
            },
            'priority': TaskPriority.HIGH.value
        }
    
    @staticmethod
    def compliance_check_workflow():
        """Workflow for compliance monitoring"""
        return {
            'type': 'compliance_check',
            'action': 'full_scan',
            'params': {
                'check_regulations': True,
                'check_platforms': True,
                'generate_report': True
            },
            'priority': TaskPriority.CRITICAL.value
        }


# Main execution
async def main():
    """Example usage of the orchestrator"""
    orchestrator = HQzOrchestrator()
    
    # Example 1: Run daily automation
    daily_workflow = HQzWorkflows.daily_automation_workflow()
    result = await orchestrator.process_request(daily_workflow)
    print(f"Daily automation result: {json.dumps(result, indent=2)}")
    
    # Example 2: Research new products
    product_workflow = HQzWorkflows.new_product_workflow('seeds', 'food_beverage')
    result = await orchestrator.process_request(product_workflow)
    print(f"Product research result: {json.dumps(result, indent=2)}")
    
    # Example 3: Compliance check
    compliance_workflow = HQzWorkflows.compliance_check_workflow()
    result = await orchestrator.process_request(compliance_workflow)
    print(f"Compliance check result: {json.dumps(result, indent=2)}")


if __name__ == "__main__":
    asyncio.run(main())