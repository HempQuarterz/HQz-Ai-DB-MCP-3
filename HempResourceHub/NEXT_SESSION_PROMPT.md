# Next Session Prompt for HempQuarterz AI Agent Infrastructure

## Context for Next Session
You are continuing work on the HempQuarterz Industrial Hemp Database with integrated AI Agent Infrastructure. The project has evolved from a basic database to a sophisticated AI-powered platform.

## Current State Summary
- **Database**: Fully functional Supabase integration with 6 plant types
- **Frontend**: React + TypeScript + Vite web app at http://localhost:3000
- **AI Agents**: 4/6 agents implemented (Research, Content, SEO, Compliance)
- **Admin Dashboard**: Working with AI Agent monitoring tab (needs debugging)
- **Documentation**: See PROJECT_PROGRESS_SUMMARY_JAN12.md for full details

## Immediate Tasks for Next Session

### 1. Fix AI Agents Dashboard Tab
The AI Agents tab in admin dashboard isn't rendering content. Check:
- `/HempResourceHub/client/src/components/admin/agent-monitoring-dashboard.tsx`
- `/HempResourceHub/client/src/pages/admin.tsx` 
- Verify lazy loading is working with proper Suspense boundaries
- Add error boundaries and loading states

### 2. Complete Remaining Agents
Implement these two agents following patterns from existing agents:

#### Outreach Agent (`agents/outreach/outreach_agent.py`)
Methods to implement:
- `find_contacts()` - Discover relevant industry contacts
- `personalize_outreach()` - Create personalized messages
- `track_responses()` - Monitor engagement metrics
- `score_leads()` - Prioritize contacts by relevance

#### Monetization Agent (`agents/monetization/monetization_agent.py`)
Methods to implement:
- `analyze_opportunities()` - Identify market gaps
- `calculate_roi()` - Project revenue potential
- `track_revenue()` - Monitor monetization metrics
- `suggest_partnerships()` - Find collaboration opportunities

### 3. Implement Core Infrastructure
Create these essential components:

#### Orchestrator (`agents/core/orchestrator.py`)
```python
class AgentOrchestrator:
    async def coordinate_workflow(self, workflow_config: Dict) -> Dict
    async def distribute_tasks(self, tasks: List[Dict]) -> None
    async def monitor_progress(self, workflow_id: str) -> Dict
```

#### Message Queue (`agents/core/message_queue.py`)
```python
class MessageQueue:
    async def publish(self, topic: str, message: Dict) -> None
    async def subscribe(self, topic: str, callback: Callable) -> None
    async def process_messages(self) -> None
```

#### State Manager (`agents/core/state_manager.py`)
```python
class StateManager:
    async def save_state(self, agent_id: str, state: Dict) -> None
    async def load_state(self, agent_id: str) -> Dict
    async def get_workflow_state(self, workflow_id: str) -> Dict
```

### 4. Create API Endpoints
Add to `/HempResourceHub/server/routes.ts`:
```typescript
// Agent endpoints
app.post("/api/agents/trigger", authenticateRequest, async (req, res) => {
  // Trigger agent tasks
});

app.get("/api/agents/status", authenticateRequest, async (req, res) => {
  // Get agent status
});

app.get("/api/agents/metrics", authenticateRequest, async (req, res) => {
  // Get performance metrics
});
```

### 5. High Priority UI Fixes
Based on UI analysis, implement these fixes:

1. **Hero Section** (`/HempResourceHub/client/src/pages/home.tsx`):
   - Add dark overlay to background for text contrast
   - Add labels to statistics ("40+ Applications")
   - Reduce height to show content above fold

2. **Search Bar** (`/HempResourceHub/client/src/components/layout/navbar.tsx`):
   - Make search more prominent
   - Add placeholder text "Search products, industries, research..."
   - Implement actual search functionality

3. **Admin Link**:
   - Add admin link to navbar (with auth check)
   - Or add floating admin button for authorized users

## Environment Setup Reminder
Ensure these environment variables are set:
```bash
VITE_SUPABASE_URL=https://ktoqznqmlnxrtvubewyz.supabase.co
VITE_SUPABASE_ANON_KEY=[get from Supabase dashboard]
OPENAI_API_KEY=[your key]
ANTHROPIC_API_KEY=[your key]
```

## Testing Checklist
After implementing:
1. Test each new agent individually
2. Verify admin dashboard AI Agents tab loads
3. Test agent task creation via API
4. Check real-time updates in dashboard
5. Validate UI improvements on mobile

## Key Files to Review First
1. `AI_AGENT_PROGRESS_JAN12.md` - Detailed implementation status
2. `PROJECT_PROGRESS_SUMMARY_JAN12.md` - Full project evolution
3. `agents/core/base_agent.py` - Pattern for new agents
4. `agents/seo/seo_agent.py` - Most recent agent implementation

## Success Criteria
- All 6 agents operational
- Admin dashboard fully functional
- API endpoints tested
- UI improvements implemented
- Ready for production deployment

Remember: Follow existing patterns, use decorators (@rate_limited, @track_performance), and maintain comprehensive error handling.