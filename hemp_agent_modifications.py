# hemp_agent_args.py
"""
Modified hemp_agent.py to support command-line arguments for GitHub Actions
Add this to the beginning of your hemp_agent.py file after the imports
"""

import argparse

# Add this function at the beginning of the main section
def parse_arguments():
    parser = argparse.ArgumentParser(description='Hemp Product Research Agent')
    parser.add_argument('agent_type', nargs='?', help='Agent type to run')
    parser.add_argument('--type', dest='agent_type_flag', help='Agent type (alternative syntax)')
    parser.add_argument('--limit', type=int, default=10, help='Maximum products to research per run')
    
    args = parser.parse_args()
    
    # Handle both positional and flag-based agent type
    agent_type = args.agent_type or args.agent_type_flag
    
    return agent_type, args.limit

# Then modify your main section to use these arguments:
# Replace the existing "if __name__ == '__main__':" section with:

"""
if __name__ == '__main__':
    import sys
    
    # Check environment variables
    required_env = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'OPENAI_API_KEY']
    missing = [var for var in required_env if not os.environ.get(var)]
    
    if missing:
        print("❌ Missing environment variables:", ', '.join(missing))
        print("\n📝 Setup instructions:")
        print("   1. Create a .env file with your credentials")
        print("   2. Get OpenAI API key from: https://platform.openai.com/api-keys")
        exit(1)
    
    # Parse arguments
    agent_type, limit = parse_arguments()
    
    # Define available agents
    agents = {
        'seeds-food': ('seeds', 'food_beverage'),
        # ... rest of your agents ...
    }
    
    if agent_type:
        if agent_type == 'all':
            # Run all agents with limit
            print(f"🌿 Running ALL hemp research agents (limit: {limit} products each)...")
            for name, (plant_part, industry) in agents.items():
                agent = HempResearchAgent(plant_part, industry)
                # You'll need to modify the run() method to accept a limit parameter
                agent.run(limit=limit)
                time.sleep(2)
        elif agent_type in agents:
            # Run specific agent
            plant_part, industry = agents[agent_type]
            agent = HempResearchAgent(plant_part, industry)
            agent.run(limit=limit)
        else:
            print(f"❌ Unknown agent type: {agent_type}")
            # ... rest of error handling ...
    else:
        # Show help
        print("🌿 Hemp Research Agent")
        # ... rest of help text ...
"""