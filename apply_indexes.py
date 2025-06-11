#!/usr/bin/env python3
"""
Apply performance indexes to the Supabase database.
Run this script to improve query performance.
"""

import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get Supabase credentials
url = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_ANON_KEY") or os.getenv("VITE_SUPABASE_ANON_KEY")

if not url or not key:
    print("Error: Missing Supabase credentials in environment variables")
    exit(1)

# Create Supabase client
supabase: Client = create_client(url, key)

# Read the indexes SQL file
index_sql_path = os.path.join(os.path.dirname(__file__), "HempResourceHub/supabase/migrations/20250110_add_performance_indexes.sql")

try:
    with open(index_sql_path, 'r') as f:
        sql_content = f.read()
    
    print("Applying performance indexes to Supabase database...")
    
    # Note: Direct SQL execution requires service role key
    # For now, we'll print the SQL that needs to be run
    print("\nPlease run the following SQL in your Supabase SQL editor:")
    print("-" * 60)
    print(sql_content)
    print("-" * 60)
    
    print("\nTo apply these indexes:")
    print("1. Go to your Supabase dashboard")
    print("2. Navigate to the SQL editor")
    print("3. Copy and paste the SQL above")
    print("4. Click 'Run' to execute")
    print("\nThese indexes will significantly improve query performance.")
    
except FileNotFoundError:
    print(f"Error: Could not find index SQL file at {index_sql_path}")
except Exception as e:
    print(f"Error: {e}")