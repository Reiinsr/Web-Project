# Event Management System

This project is an Event Management System web application built using HTML, CSS, JavaScript, and Node.js with MySQL database. It provides a user-friendly interface for managing events, showcasing services, and facilitating user inquiries.

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
- **api/**: Contains Node.js API endpoints.
  - **routes/events.js**: Express routes for event CRUD operations.
- **config/**: Contains configuration files.
  - **database.js**: Database connection and initialization.
- **server.js**: Main Node.js/Express server file.
- **package.json**: Node.js dependencies and scripts.
- **database.sql**: SQL script to create the database and tables.

## Setup Instructions

### Prerequisites
- Node.js 18.0.0 or higher
- MySQL 5.7 or higher (or MariaDB)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "Project Phase 1"
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Set up the database:
   - Create a MySQL database (or use the provided `database.sql` script)
   - Update environment variables (see below)

4. Configure environment variables:
   Create a `.env` file in the root directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=event_management
PORT=3000
```

5. Run the application:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

6. Open your browser and navigate to:
```
http://localhost:3000
```

## Environment Variables

Create a `.env` file in the root directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=event_management
DB_PORT=3306
PORT=3000
```

**For Railway:** The app also supports `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE` variables that Railway provides automatically.

## API Endpoints

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get a single event by ID
- `POST /api/events` - Add a new event

## Deployment

The project is configured for deployment on Railway.app. The `Procfile` and `railway.json` files contain the necessary configuration.

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Package Manager**: npm
