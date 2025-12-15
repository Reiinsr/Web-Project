# How to Import SQL on Railway MySQL

## Method 1: Using Railway's MySQL Dashboard (If Available)

1. Go to your Railway project
2. Click on your **MySQL service**
3. Look for tabs: **"Query"**, **"Data"**, **"SQL"**, or **"Console"**
4. If you see a query interface:
   - Copy the SQL from `database.sql`
   - Paste into the query box
   - Click **"Run"** or **"Execute"**

## Method 2: Using MySQL Command Line (Recommended)

### Step 1: Get Connection Details from Railway

1. Click on your **MySQL service** in Railway
2. Go to **"Variables"** tab
3. Note these values:
   - `MYSQLHOST` (e.g., `containers-us-west-xxx.railway.app`)
   - `MYSQLPORT` (usually `3306`)
   - `MYSQLUSER` (e.g., `root`)
   - `MYSQLPASSWORD` (your password)
   - `MYSQLDATABASE` (e.g., `railway`)

### Step 2: Connect Using MySQL Client

**Option A: Using MySQL Command Line (if installed locally)**

```bash
mysql -h <MYSQLHOST> -P <MYSQLPORT> -u <MYSQLUSER> -p<MYSQLPASSWORD> <MYSQLDATABASE>
```

Then paste the SQL commands from `database.sql`

**Option B: Using MySQL Workbench (GUI)**

1. Download MySQL Workbench: https://dev.mysql.com/downloads/workbench/
2. Create new connection:
   - Host: `<MYSQLHOST>`
   - Port: `<MYSQLPORT>`
   - Username: `<MYSQLUSER>`
   - Password: `<MYSQLPASSWORD>`
   - Default Schema: `<MYSQLDATABASE>`
3. Connect, then paste and execute SQL

**Option C: Using phpMyAdmin Online**

1. Use online phpMyAdmin: https://www.phpmyadmin.co/
2. Enter Railway connection details
3. Import `database.sql` file

## Method 3: Using the Import Script (Easiest!)

I've created `import_database.php` for you. Here's how to use it:

1. **Set a secret key** in Railway environment variables:
   - Variable: `IMPORT_SECRET_KEY`
   - Value: `your-secret-password-123`

2. **After Railway redeploys**, visit:
   ```
   https://your-app.railway.app/import_database.php?key=your-secret-password-123
   ```

3. The script will automatically import your database!

4. **Remove the secret key** after importing for security

## Method 4: Using Railway CLI

If you have Railway CLI installed:

```bash
railway connect mysql
mysql -u $MYSQLUSER -p$MYSQLPASSWORD -h $MYSQLHOST $MYSQLDATABASE < database.sql
```

## Quick SQL to Copy (from database.sql)

If Railway has a query interface, paste this:

```sql
-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample events
INSERT INTO events (title, date, description, location) VALUES
('Tech Conference 2023', '2025-11-15', 'Join us for the annual Tech Conference featuring industry leaders and cutting-edge technology demonstrations.', 'Convention Center'),
('Music Festival', '2025-12-01', 'Experience live music from top artists in an unforgettable outdoor setting.', 'City Park'),
('Startup Pitch Night', '2026-04-15', 'Watch startups pitch their ideas to top investors and industry experts.', 'Innovation Hub'),
('Art & Design Expo', '2026-05-20', 'Explore the latest trends in art and design from renowned artists and designers.', 'Art Gallery');
```

## Recommended: Use the Import Script!

The easiest method is using `import_database.php` - just set the secret key and visit the URL!

