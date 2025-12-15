# Event Management System

This project is an Event Management System web application built using HTML, CSS, JavaScript, and PHP with MySQL database. It provides a user-friendly interface for managing events, showcasing services, and facilitating user inquiries.

## Project Structure

The project consists of the following files and directories:

- **index.html**: Main entry point of the application (Home page).
- **pages/**: Contains HTML pages for different sections.
  - **home.html**: Home page displaying upcoming events.
  - **about.html**: Information about the event management system.
  - **services.html**: Outlines the services or features offered.
  - **contact.html**: Contact form and information for user inquiries.
  - **event.html**: Dynamic page displaying details about specific events.
  - **admin.html**: Admin page for adding new events to the database.
- **components/**: Contains reusable HTML components.
  - **header.html**: Header structure for consistency across pages.
  - **footer.html**: Footer structure for consistency across pages.
- **css/**: Contains stylesheets for the application.
  - **styles.css**: Main styles for the application with modern, professional design.
  - **responsive.css**: Styles for responsive design across different devices.
- **js/**: Contains JavaScript files for application logic.
  - **main.js**: Main JavaScript logic for event listeners and navigation.
  - **events.js**: Handles fetching and displaying individual event data from database.
  - **events-list.js**: Handles fetching and displaying list of events from database.
- **api/**: Contains PHP API endpoints.
  - **get_events.php**: Fetches all events from database.
  - **get_event.php**: Fetches a single event by ID.
  - **add_event.php**: Adds a new event to the database.
- **config.php**: Database configuration file.
- **database.sql**: SQL script to create the database and tables.

## Setup Instructions

### Prerequisites
- PHP 7.4 or higher
- MySQL 5.7 or higher (or MariaDB)
- phpMyAdmin (optional, for database management)
- Web server (Apache/Nginx) or PHP built-in server

### Database Setup

1. **Create the database:**
   - Open phpMyAdmin in your browser (usually at `http://localhost/phpmyadmin`)
   - Import the `database.sql` file, or
   - Run the SQL commands manually:
     ```sql
     CREATE DATABASE event_management;
     USE event_management;
     -- Then run the CREATE TABLE and INSERT statements from database.sql
     ```

2. **Configure database connection:**
   - Open `config.php`
   - Update the database credentials if needed:
     ```php
     define('DB_HOST', 'localhost');
     define('DB_USER', 'root');
     define('DB_PASS', '');  // Your MySQL password
     define('DB_NAME', 'event_management');
     ```

### Running the Application

#### Option 1: Using PHP Built-in Server
```bash
php -S localhost:8000
```
Then open `http://localhost:8000` in your browser.

#### Option 2: Using XAMPP/WAMP/MAMP
1. Place the project folder in your web server directory:
   - XAMPP: `C:\xampp\htdocs\`
   - WAMP: `C:\wamp\www\`
   - MAMP: `/Applications/MAMP/htdocs/`
2. Start Apache and MySQL services
3. Open `http://localhost/Project Phase 1` in your browser

#### Option 3: Using npm (for development server)
```bash
npm install
npm start
```

## Features

- **Modern, Professional Design**: Beautiful gradient backgrounds, smooth animations, and responsive layout
- **Database Integration**: Events stored in MySQL database instead of JSON files
- **Admin Panel**: Easy-to-use admin page for adding new events
- **Dynamic Event Display**: Events fetched from database and displayed on home page
- **Event Details Page**: View detailed information about individual events
- **Responsive Design**: Optimized for optimal viewing on various devices (desktop, tablet, mobile)
- **User-friendly Interface**: Clean navigation and intuitive user experience

## Admin Access

To add events:
1. Navigate to the "Admin" link in the navigation menu
2. Fill out the event form with:
   - Event Title (required)
   - Event Date (required)
   - Location (optional)
   - Description (required)
3. Click "Add Event" to save to the database
4. The event will immediately appear on the home page

## Technologies Used

- HTML5
- CSS3 (with modern gradients and animations)
- JavaScript (ES6+)
- PHP 7.4+
- MySQL
- Fetch API for AJAX requests

## Database Schema

### Events Table
- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `title` (VARCHAR(255), NOT NULL)
- `date` (DATE, NOT NULL)
- `description` (TEXT, NOT NULL)
- `location` (VARCHAR(255), NULL)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Notes

- Make sure your web server has PHP enabled
- Ensure MySQL service is running
- The application uses modern JavaScript features (Fetch API, ES6+)
- All API endpoints return JSON responses
- CORS headers are included for cross-origin requests

## Troubleshooting

**Database connection errors:**
- Verify MySQL service is running
- Check database credentials in `config.php`
- Ensure database `event_management` exists

**Events not displaying:**
- Check browser console for JavaScript errors
- Verify API endpoints are accessible
- Ensure database has events data

**Admin page not working:**
- Check PHP error logs
- Verify database connection
- Ensure proper file permissions

## Deployment

⚠️ **Important:** This PHP/MySQL application **cannot be deployed to Vercel** without significant changes. Vercel does not natively support PHP.

### Recommended Hosting Options:

1. **Railway** (Recommended) - Easy PHP + MySQL deployment
2. **Render** - Free tier with PHP support
3. **Heroku** - PHP support via buildpacks
4. **Traditional cPanel hosting** - Bluehost, HostGator, etc.

### Quick Deploy Steps:

1. **Set up cloud database:**
   - Use Railway MySQL, PlanetScale, or any MySQL hosting
   - Import `database.sql` to create tables

2. **Configure environment variables:**
   ```
   DB_HOST=your-db-host
   DB_USER=your-db-user
   DB_PASS=your-db-password
   DB_NAME=event_management
   ```

3. **Deploy:**
   - Push to GitHub
   - Connect to Railway/Render
   - Set environment variables
   - Deploy!

See `DEPLOYMENT.md` for detailed deployment instructions.

Feel free to explore the code and modify it as needed for your own event management needs!
