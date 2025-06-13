"""Tests for base agent functionality."""

import pytest
import asyncio
from unittest.mock import Mock, AsyncMock, patch
from datetime import datetime

from agents.core.base_agent import BaseAgent, RateLimiter, rate_limited


class TestAgent(BaseAgent):
    """Test implementation of BaseAgent."""
    
    async def execute(self, task):
        """Simple test execution."""
        return {"status": "completed", "result": task.get("action")}


class TestRateLimiter:
    """Test rate limiting functionality."""
    
    def test_rate_limiter_initialization(self):
        """Test rate limiter creates with correct parameters."""
        limiter = RateLimiter(calls=10, period=60)
        assert limiter.calls == 10
        assert limiter.period == 60
        assert len(limiter.call_times) == 0
    
    def test_rate_limiter_allows_calls_within_limit(self):
        """Test rate limiter allows calls within limit."""
        limiter = RateLimiter(calls=3, period=60)
        
        # Should allow 3 calls
        for _ in range(3):
            assert limiter.is_allowed() is True
            
    def test_rate_limiter_blocks_calls_over_limit(self):
        """Test rate limiter blocks calls over limit."""
        limiter = RateLimiter(calls=2, period=1)
        
        # Allow 2 calls
        assert limiter.is_allowed() is True
        assert limiter.is_allowed() is True
        
        # Block 3rd call
        assert limiter.is_allowed() is False
        
        # Wait for period to pass
        import time
        time.sleep(1.1)
        
        # Should allow call again
        assert limiter.is_allowed() is True


class TestBaseAgent:
    """Test base agent functionality."""
    
    @pytest.fixture
    async def agent(self):
        """Create test agent instance."""
        mock_supabase = Mock()
        agent = TestAgent(supabase_client=mock_supabase)
        return agent
    
    @pytest.mark.asyncio
    async def test_agent_initialization(self, agent):
        """Test agent initializes correctly."""
        assert agent.supabase is not None
        assert agent.ai_provider is not None
        assert agent.rate_limiter is not None
        
    @pytest.mark.asyncio
    async def test_execute_task(self, agent):
        """Test task execution."""
        task = {
            "task_id": "test-123",
            "action": "test_action",
            "params": {"test": True}
        }
        
        result = await agent.execute_task(task)
        
        assert result["status"] == "completed"
        assert result["result"] == "test_action"
        
    @pytest.mark.asyncio
    async def test_rate_limited_decorator(self):
        """Test rate limited decorator."""
        call_count = 0
        
        @rate_limited(calls=2, period=1)
        async def limited_function():
            nonlocal call_count
            call_count += 1
            return call_count
            
        # Should allow 2 calls
        assert await limited_function() == 1
        assert await limited_function() == 2
        
        # Should raise exception on 3rd call
        with pytest.raises(Exception, match="Rate limit exceeded"):
            await limited_function()
            
    @pytest.mark.asyncio
    async def test_error_handling(self, agent):
        """Test error handling in task execution."""
        # Mock execute to raise an error
        with patch.object(agent, 'execute', side_effect=Exception("Test error")):
            task = {"task_id": "test-123", "action": "failing_action"}
            
            result = await agent.execute_task(task)
            
            assert result["status"] == "failed"
            assert "Test error" in result["error"]
            
    @pytest.mark.asyncio
    async def test_performance_tracking(self, agent):
        """Test performance tracking decorator."""
        agent.supabase.table.return_value.insert.return_value.execute = AsyncMock()
        
        # Execute a task
        task = {"task_id": "test-123", "action": "tracked_action"}
        await agent.execute_task(task)
        
        # Verify performance was tracked
        agent.supabase.table.assert_called_with('agent_performance_logs')


if __name__ == "__main__":
    pytest.main([__file__])