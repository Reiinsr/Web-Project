# Deployment Guide

## ⚠️ Important: Vercel Limitations

**Vercel does NOT natively support PHP applications.** Your current PHP/MySQL app will NOT work on Vercel without significant changes.

## Deployment Options

### Option 1: PHP-Friendly Hosting (Recommended) ✅

These platforms support PHP and MySQL out of the box:

#### **1. Heroku** (Free tier available)
- Supports PHP via buildpacks
- Add-on databases (ClearDB MySQL, JawsDB)
- **Steps:**
  1. Create `composer.json` (if needed)
  2. Add `Procfile`: `web: vendor/bin/heroku-php-apache2 .`
  3. Use environment variables for database config
  4. Deploy via Git

#### **2. Railway** (Free tier available)
- Supports PHP and MySQL
- Easy database setup
- **Steps:**
  1. Connect GitHub repo
  2. Add MySQL service
  3. Set environment variables
  4. Deploy

#### **3. Render** (Free tier available)
- PHP support
- MySQL database service
- **Steps:**
  1. Connect GitHub repo
  2. Create MySQL database
  3. Set environment variables
  4. Deploy

#### **4. InfinityFree / 000webhost** (Free)
- Free PHP hosting
- MySQL included
- Good for small projects

#### **5. Traditional Hosting** (Paid)
- **cPanel hosting** (Bluehost, HostGator, etc.)
- **DigitalOcean** droplet with LAMP stack
- **AWS EC2** with LAMP stack

### Option 2: Convert to Node.js/Express (For Vercel) 🔄

If you want to use Vercel, you'd need to:
1. Convert PHP API to Node.js/Express
2. Use Vercel serverless functions
3. Use a cloud database (PlanetScale, Supabase, MongoDB)

This requires rewriting your backend.

### Option 3: Hybrid Approach 🌐

- Frontend (HTML/CSS/JS) → Vercel/Netlify
- Backend API (PHP) → Separate PHP hosting
- Database → Cloud MySQL (PlanetScale, AWS RDS, etc.)

## Recommended: Deploy to Railway (Easiest)

### Step 1: Prepare Your Code

1. **Update `config.php`** to use environment variables (already done)
2. **Create `.gitignore`** to exclude sensitive files
3. **Export your database** using `database.sql`

### Step 2: Set Up Cloud Database

**Option A: Railway MySQL**
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add MySQL service
4. Copy connection details

**Option B: PlanetScale** (MySQL-compatible, free tier)
1. Go to [planetscale.com](https://planetscale.com)
2. Create database
3. Import `database.sql`
4. Get connection string

**Option C: Free MySQL Hosting**
- [FreeMySQLHosting.com](https://www.freemysqlhosting.net/)
- [db4free.net](https://www.db4free.net/)

### Step 3: Deploy to Railway

1. **Connect GitHub:**
   - Push your code to GitHub
   - Connect Railway to your repo

2. **Configure Environment Variables:**
   ```
   DB_HOST=your-db-host
   DB_USER=your-db-user
   DB_PASS=your-db-password
   DB_NAME=your-db-name
   ```

3. **Deploy:**
   - Railway auto-detects PHP
   - Your app will be live!

### Step 4: Update Database Connection

The `config.php` file now uses environment variables, so it will automatically use your cloud database credentials.

## GitHub Setup

### Create `.gitignore`

```gitignore
# Environment files
.env
.env.local

# XAMPP/WAMP files
.htaccess.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
```

### Important: Never Commit Secrets!

- ✅ Commit `config.php` (uses environment variables)
- ❌ Never commit `.env` file with real credentials
- ✅ Use environment variables in production

## Database Migration Steps

1. **Export from phpMyAdmin:**
   - Select `event_management` database
   - Click "Export" → "Go"
   - Save `database.sql`

2. **Import to Cloud Database:**
   - Use phpMyAdmin (if provided)
   - Or use MySQL command line
   - Or use database import tool

3. **Update Connection:**
   - Set environment variables on hosting platform
   - `config.php` will automatically use them

## Testing After Deployment

1. Test API endpoints:
   - `https://your-app.railway.app/api/get_events.php`
   - Should return JSON

2. Test admin page:
   - Try adding an event
   - Check if it saves to database

3. Test connection:
   - `https://your-app.railway.app/test_connection.php`

## Quick Comparison

| Platform | PHP Support | MySQL | Free Tier | Difficulty |
|----------|-------------|-------|-----------|------------|
| **Vercel** | ❌ No | ❌ No | ✅ Yes | ⚠️ Requires rewrite |
| **Railway** | ✅ Yes | ✅ Yes | ✅ Yes | ⭐ Easy |
| **Render** | ✅ Yes | ✅ Yes | ✅ Yes | ⭐ Easy |
| **Heroku** | ✅ Yes | ✅ Add-on | ✅ Limited | ⭐⭐ Medium |
| **InfinityFree** | ✅ Yes | ✅ Yes | ✅ Yes | ⭐ Easy |

## Recommendation

**For your PHP/MySQL app, use Railway or Render** - they're the easiest and support your stack perfectly!


