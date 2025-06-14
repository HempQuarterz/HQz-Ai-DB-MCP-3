import dns from 'dns';
import { promisify } from 'util';
const lookup = promisify(dns.lookup);

async function getIPv4Address(hostname) {
  try {
    const result = await lookup(hostname, { family: 4 });
    console.log(`IPv4 address for ${hostname}: ${result.address}`);
    return result.address;
  } catch (error) {
    console.error(`Failed to resolve ${hostname}:`, error.message);
    return null;
  }
}

// Test Supabase hostname resolution
(async () => {
  const hostname = 'db.ktoqznqmlnxrtvubewyz.supabase.co';
  const ipv4 = await getIPv4Address(hostname);
  
  if (ipv4) {
    console.log('\nTo use IPv4 directly, update your DATABASE_URL:');
    console.log(`DATABASE_URL=postgresql://postgres:%234HQZgasswo@${ipv4}:5432/postgres?sslmode=require`);
    console.log('\nOr add this to /etc/hosts:');
    console.log(`${ipv4} ${hostname}`);
  }
})();