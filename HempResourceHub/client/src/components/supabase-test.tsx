import { useState, useEffect } from 'react';
import supabase from '../lib/supabase-client';

export default function SupabaseTest() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    async function testConnection() {
      try {
        // Test connection with the industries table since it already exists
        const { data, error } = await supabase
          .from('industries')
          .select('*')
          .limit(5);
        
        if (error) {
          throw error;
        }
        
        setStatus('connected');
        setData(data || []);
      } catch (err: any) {
        console.error('Supabase connection error:', err);
        setStatus('error');
        setError(err.message || 'Failed to connect to Supabase');
      }
    }
    
    testConnection();
  }, []);

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md flex flex-col space-y-4">
      <h2 className="text-xl font-bold text-center">Supabase Connection Test</h2>
      
      <div className="text-center">
        {status === 'loading' && (
          <div className="text-yellow-500">Testing connection to Supabase...</div>
        )}
        
        {status === 'connected' && (
          <div className="text-green-500">
            ✅ Successfully connected to Supabase!
            <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
        
        {status === 'error' && (
          <div className="text-red-500">
            ❌ Failed to connect to Supabase
            <div className="mt-2 p-2 bg-red-50 rounded text-sm">
              {error}
            </div>
          </div>
        )}
      </div>
      
      <div className="text-sm text-gray-500">
        <div>SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL ? '✓ Set' : '✗ Missing'}</div>
        <div>SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing'}</div>
      </div>
    </div>
  );
}