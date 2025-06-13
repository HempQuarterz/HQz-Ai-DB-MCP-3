# Prompt for Next Claude Code Session

## Context
I'm continuing implementation of the HempQuarterz AI Agent Infrastructure. In the previous session, I completed the database migration, file structure, and implemented 2 of 6 specialized agents. Please review AI_AGENT_PROGRESS_JAN12.md for detailed progress.

## Current Status
- ✅ Database: All 11 agent tables created in Supabase
- ✅ File Structure: 100% complete matching blueprint
- ✅ Research Agent: Fully implemented with web scraping
- ✅ Content Agent: Fully implemented with SEO optimization
- ✅ Compliance Agent: Already existed (fully implemented)
- ❌ SEO Agent: Empty file, needs implementation
- ❌ Outreach Agent: Empty file, needs implementation  
- ❌ Monetization Agent: Empty file, needs implementation

## Primary Task
Please implement the SEO Agent (`agents/seo/seo_agent.py`) following the established patterns from the Research and Content agents. The SEO Agent should include:

1. **Core Methods** (from blueprint):
   - `analyze_site_performance()` - Analyze site SEO performance
   - `research_keywords()` - Keyword research for products
   - `analyze_competitors()` - Competitor SEO analysis
   - `monitor_rankings()` - Track keyword rankings
   - `generate_seo_recommendations()` - Actionable SEO improvements

2. **Database Integration**:
   - Store results in `agent_seo_analysis` table
   - Track keywords in `agent_seo_keywords` table
   - Log performance to `agent_performance_metrics`

3. **Follow Patterns**:
   - Inherit from `BaseAgent` 
   - Use decorators: `@rate_limited`, `@track_performance`
   - Include proper error handling
   - Implement AI cost tracking

## Reference Files
- Base implementation: `agents/core/base_agent.py`
- Pattern example: `agents/research/research_agent.py`
- Content integration: `agents/content/content_agent.py`
- Database schema: `migrations/004_agent_infrastructure.sql`

## Secondary Tasks (if time permits)
1. Implement Outreach Agent (`agents/outreach/outreach_agent.py`)
2. Implement Monetization Agent (`agents/monetization/monetization_agent.py`)
3. Complete utility implementations (rate_limiter.py, cost_tracker.py)

## Testing Approach
After implementing each agent method:
1. Verify it follows the established patterns
2. Ensure proper database integration
3. Check error handling
4. Validate AI provider integration

## Important Notes
- The Supabase project ID is: `ktoqznqmlnxrtvubewyz`
- Multi-provider AI is already set up (Claude primary, OpenAI fallback)
- All database tables exist and are ready to use
- Follow the exact structure from the AI Agent Blueprint

Please start by implementing the SEO Agent's `analyze_site_performance()` method and we'll build from there.