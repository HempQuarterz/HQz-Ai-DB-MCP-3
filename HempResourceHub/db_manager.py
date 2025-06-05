import psycopg2
import psycopg2.extras # For dictionary cursor
import os
from dotenv import load_dotenv # To load environment variables from .env file

# --- Configuration ---
# Load environment variables from a .env file for security
# Create a .env file in your Replit project with your database credentials:
# DATABASE_URL="postgresql://username:password@hostname.neon.tech/databasename?sslmode=require"
#
# Or, set these as Replit Secrets.
# If using Replit Secrets, os.environ.get() will fetch them directly.
load_dotenv()

# It's highly recommended to store your full database connection string
# as a single environment variable (e.g., DATABASE_URL).
# Neon provides this connection string in your dashboard.
DATABASE_URL = os.environ.get("DATABASE_URL")

if not DATABASE_URL:
    print("Error: DATABASE_URL environment variable not set.")
    print("Please create a .env file or set Replit Secrets with your Neon PostgreSQL connection string.")
    print("Example: DATABASE_URL=\"postgresql://user:password@host.neon.tech/dbname?sslmode=require\"")
    exit()

# --- Database Connection ---
def get_db_connection():
    """Establishes a connection to the PostgreSQL database."""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        print("Successfully connected to the database.")
        return conn
    except psycopg2.Error as e:
        print(f"Error connecting to PostgreSQL Database: {e}")
        return None

# --- Database Operations ---
def list_tables(conn):
    """Lists all user-created tables in the public schema of the database."""
    if not conn:
        return []

    tables = []
    try:
        with conn.cursor() as cur:
            # Query to get table names from the information_schema
            # This typically lists tables in the 'public' schema unless specified otherwise
            cur.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_type = 'BASE TABLE';
            """)
            tables_result = cur.fetchall()
            tables = [table[0] for table in tables_result]
            if tables:
                print("\n--- Tables in the database ---")
                for table_name in tables:
                    print(f"- {table_name}")
            else:
                print("\nNo tables found in the public schema.")
    except psycopg2.Error as e:
        print(f"Error listing tables: {e}")
    return tables

def create_sample_tables(conn):
    """Creates a couple of sample tables if they don't already exist."""
    if not conn:
        return

    commands = (
        """
        CREATE TABLE IF NOT EXISTS users (
            user_id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS products (
            product_id SERIAL PRIMARY KEY,
            product_name VARCHAR(255) NOT NULL,
            price NUMERIC(10, 2) NOT NULL,
            stock INTEGER DEFAULT 0,
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
    )
    try:
        with conn.cursor() as cur:
            for command in commands:
                cur.execute(command)
        conn.commit()
        print("\nSample tables 'users' and 'products' checked/created successfully.")
    except psycopg2.Error as e:
        print(f"Error creating sample tables: {e}")
        conn.rollback() # Rollback changes if an error occurs

def populate_users_table(conn, user_data):
    """Populates the 'users' table with a list of user dictionaries."""
    if not conn or not user_data:
        return

    sql = """
        INSERT INTO users (username, email) 
        VALUES (%(username)s, %(email)s)
        ON CONFLICT (username) DO NOTHING; 
        -- ON CONFLICT (email) DO NOTHING; -- Or handle conflict as needed
    """
    try:
        with conn.cursor() as cur:
            # psycopg2.extras.execute_batch is efficient for many inserts
            psycopg2.extras.execute_batch(cur, sql, user_data)
        conn.commit()
        print(f"\nSuccessfully populated 'users' table with {len(user_data)} entries (or updated existing).")
    except psycopg2.Error as e:
        print(f"Error populating users table: {e}")
        conn.rollback()

def populate_products_table(conn, product_data):
    """Populates the 'products' table with a list of product dictionaries."""
    if not conn or not product_data:
        return

    sql = """
        INSERT INTO products (product_name, price, stock) 
        VALUES (%(product_name)s, %(price)s, %(stock)s)
        ON CONFLICT (product_name) DO UPDATE SET
            price = EXCLUDED.price,
            stock = EXCLUDED.stock;
        -- Example: Update price and stock if product_name already exists
    """
    try:
        with conn.cursor() as cur:
            psycopg2.extras.execute_batch(cur, sql, product_data)
        conn.commit()
        print(f"\nSuccessfully populated 'products' table with {len(product_data)} entries (or updated existing).")
    except psycopg2.Error as e:
        print(f"Error populating products table: {e}")
        conn.rollback()

def view_table_data(conn, table_name, limit=5):
    """Fetches and prints a few rows from a specified table."""
    if not conn:
        return

    try:
        with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur: # Use DictCursor for dictionary-like rows
            cur.execute(f"SELECT * FROM {psycopg2.extensions.quote_ident(table_name, cur)} LIMIT %s;", (limit,))
            rows = cur.fetchall()

            if not rows:
                print(f"\nNo data found in table '{table_name}'.")
                return

            print(f"\n--- First {limit} rows from '{table_name}' ---")
            column_names = [desc[0] for desc in cur.description]
            print(" | ".join(column_names))
            print("-" * (sum(len(name) for name in column_names) + 3 * (len(column_names) -1))) # Separator line
            for row in rows:
                print(" | ".join(str(row[col]) for col in column_names))

    except psycopg2.Error as e:
        print(f"Error viewing table {table_name}: {e}")


# --- Main Execution ---
if __name__ == "__main__":
    # Ensure psycopg2 is installed: pip install psycopg2-binary python-dotenv
    # In Replit, you can add `psycopg2-binary` and `python-dotenv` to your pyproject.toml or use the package manager.

    db_conn = get_db_connection()

    if db_conn:
        # 1. List existing tables
        current_tables = list_tables(db_conn)

        # 2. Create sample tables (idempotent - won't fail if they exist)
        create_sample_tables(db_conn)

        # Refresh table list if new tables were created
        if not current_tables or "users" not in current_tables or "products" not in current_tables:
             list_tables(db_conn)


        # 3. Automate populating tables with entries
        # Sample data for users
        sample_users = [
            {"username": "alice_k", "email": "alice.k@example.com"},
            {"username": "bob_the_builder", "email": "bob.builder@example.com"},
            {"username": "charlie_brown", "email": "charlie.b@example.com"},
            {"username": "diana_prince", "email": "diana.p@example.com"}
        ]
        populate_users_table(db_conn, sample_users)

        # Sample data for products
        sample_products = [
            {"product_name": "Laptop Pro X", "price": 1299.99, "stock": 50},
            {"product_name": "Wireless Mouse", "price": 25.50, "stock": 200},
            {"product_name": "Mechanical Keyboard", "price": 75.00, "stock": 120},
            {"product_name": "4K Monitor", "price": 349.95, "stock": 30}
        ]
        populate_products_table(db_conn, sample_products)

        # 4. View some data from the populated tables
        view_table_data(db_conn, "users", limit=5)
        view_table_data(db_conn, "products", limit=5)

        # Close the connection when done
        db_conn.close()
        print("\nDatabase connection closed.")
