# Supabase Connection Troubleshooting Guide

If you're experiencing connection issues with Supabase, try the following steps:

## 1. Check Credentials

Make sure your credentials in the `.env` file are correct:

```
DB_HOST=db.lnclfnomfnoaqpatmqhj.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD="YourPasswordHere"
```

## 2. Password Format

If your password contains special characters (like #, $, *, etc.), make sure it's enclosed in quotes:

```
DB_PASSWORD="complex#password"
```

## 3. Connection String Format

Try using a connection string instead of individual parameters:

```
DATABASE_URL=postgresql://postgres:YourPasswordHere@db.lnclfnomfnoaqpatmqhj.supabase.co:5432/postgres?sslmode=require
```

## 4. SSL Configuration

Make sure SSL is properly configured:

```javascript
const pool = new Pool({
  // ... other parameters
  ssl: {
    rejectUnauthorized: false,
    sslmode: 'require'
  }
});
```

## 5. Check Supabase Dashboard

1. Log in to Supabase Dashboard
2. Verify that your project is active
3. Check database settings under Project Settings > Database
4. Verify that your IP address is allowed in the connection restrictions

## 6. Test with Direct Connection

Try connecting directly using the Supabase UI tools:

1. Go to your Supabase project
2. Navigate to the SQL Editor
3. Run a simple query like `SELECT NOW()`

## 7. Common Error Messages

- **ENOTFOUND** - Check your DB_HOST value
- **Connection refused** - Check your DB_PORT and ensure the database is accepting connections
- **Password authentication failed** - Double-check your DB_PASSWORD
- **no pg_hba.conf entry for host** - Add your IP address to the allowed list in Supabase

## 8. Debug Environment Variable Loading

Add this code to verify environment variables are loading:

```javascript
console.log('Database connection parameters:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD present:', !!process.env.DB_PASSWORD);
```

## 9. Update Supabase JS Client

If using the JavaScript client, make sure it's updated:

```bash
npm install @supabase/supabase-js@latest
```

## 10. Contact Supabase Support

If none of these steps work, you may need to contact Supabase support:
https://supabase.com/support