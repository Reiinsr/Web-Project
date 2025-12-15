# Database Setup Guide

## Quick Setup Instructions

### Step 1: Install Required Software

1. **XAMPP** (Recommended for Windows)
   - Download from: https://www.apachefriends.org/
   - Install XAMPP (includes Apache, MySQL, PHP, phpMyAdmin)
   - Start Apache and MySQL from XAMPP Control Panel

2. **WAMP** (Alternative for Windows)
   - Download from: https://www.wampserver.com/
   - Install and start services

3. **MAMP** (For Mac)
   - Download from: https://www.mamp.info/
   - Install and start services

### Step 2: Setup Database

1. **Open phpMyAdmin**
   - Open your browser and go to: `http://localhost/phpmyadmin`
   - Default login: Username: `root`, Password: (leave empty)

2. **Create Database**
   - Click on "New" in the left sidebar
   - Database name: `event_management`
   - Collation: `utf8mb4_general_ci`
   - Click "Create"

3. **Import SQL File**
   - Select the `event_management` database
   - Click on "Import" tab
   - Click "Choose File" and select `database.sql`
   - Click "Go" to import

   **OR** manually run the SQL commands:
   - Click on "SQL" tab
   - Copy and paste the contents of `database.sql`
   - Click "Go"

### Step 3: Configure Database Connection

1. Open `config.php` file
2. Update these lines if your MySQL settings are different:

```php
define('DB_HOST', 'localhost');  // Usually 'localhost'
define('DB_USER', 'root');       // Your MySQL username
define('DB_PASS', '');           // Your MySQL password (empty for XAMPP default)
define('DB_NAME', 'event_management');
```

### Step 4: Place Project Files

**For XAMPP:**
- Copy the entire project folder to: `C:\xampp\htdocs\`
- Or create a folder: `C:\xampp\htdocs\event-management\`

**For WAMP:**
- Copy to: `C:\wamp\www\`

**For MAMP:**
- Copy to: `/Applications/MAMP/htdocs/`

### Step 5: Access Your Website

1. **Using XAMPP/WAMP/MAMP:**
   - Open browser: `http://localhost/event-management/`
   - Or: `http://localhost/Project Phase 1/` (if you kept the original folder name)

2. **Using PHP Built-in Server:**
   ```bash
   cd "C:\xampp\htdocs\Project Phase 1"
   php -S localhost:8000
   ```
   - Open browser: `http://localhost:8000`

### Step 6: Test the Application

1. **Home Page:** Should display events from database
2. **Admin Page:** Click "Admin" in navigation, add a test event
3. **Event Details:** Click "View Details" on any event

## Troubleshooting

### Database Connection Error
- **Error:** "Connection failed"
- **Solution:** 
  - Make sure MySQL is running in XAMPP/WAMP/MAMP
  - Check `config.php` credentials
  - Verify database name is `event_management`

### Events Not Showing
- **Check:** Browser console (F12) for JavaScript errors
- **Verify:** API endpoint `api/get_events.php` is accessible
- **Test:** Open `http://localhost/Project Phase 1/api/get_events.php` directly

### Admin Page Not Working
- **Check:** PHP error logs (usually in XAMPP/WAMP logs folder)
- **Verify:** Database table `events` exists
- **Test:** Try adding an event and check browser console

### Permission Errors
- **Windows:** Right-click project folder → Properties → Security → Give full control
- **Mac/Linux:** `chmod -R 755` on project folder

## Database Structure

After setup, you should have:

**Database:** `event_management`
**Table:** `events`

**Table Columns:**
- `id` (Primary Key, Auto Increment)
- `title` (VARCHAR 255)
- `date` (DATE)
- `description` (TEXT)
- `location` (VARCHAR 255, nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Sample Data

The `database.sql` file includes 4 sample events. You can add more through:
1. Admin page (recommended)
2. phpMyAdmin directly
3. SQL INSERT statements

## Next Steps

1. ✅ Database is set up
2. ✅ Website is running
3. ✅ Test adding events via Admin page
4. ✅ Customize styling if needed
5. ✅ Add more features as required

## Security Notes

⚠️ **Important:** This is a development setup. For production:
- Change database password
- Use prepared statements (already implemented)
- Add authentication for admin page
- Use HTTPS
- Validate and sanitize all inputs

