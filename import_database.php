<?php
/**
 * Database Import Script
 * Run this once after setting up environment variables on Railway
 * Access via: https://your-app.railway.app/import_database.php
 */

header('Content-Type: text/html; charset=utf-8');

// Security: Only allow in development or with a secret key
$secret_key = $_ENV['IMPORT_SECRET_KEY'] ?? getenv('IMPORT_SECRET_KEY') ?: 'change-this-secret-key';
if (!isset($_GET['key']) || $_GET['key'] !== $secret_key) {
    die('Access denied. Add ?key=your-secret-key to the URL');
}

require_once 'config.php';

echo '<html><head><title>Database Import</title>';
echo '<style>body{font-family:Arial;max-width:800px;margin:50px auto;padding:20px;}';
echo '.success{background:#d4edda;color:#155724;padding:15px;border-radius:5px;margin:10px 0;}';
echo '.error{background:#f8d7da;color:#721c24;padding:15px;border-radius:5px;margin:10px 0;}';
echo '.info{background:#cce5ff;color:#004085;padding:15px;border-radius:5px;margin:10px 0;}';
echo 'pre{background:#f8f9fa;padding:10px;border-radius:5px;overflow-x:auto;}</style></head><body>';
echo '<h1>Database Import Tool</h1>';

try {
    $conn = getDBConnection();
    echo '<div class="success">✓ Connected to database successfully!</div>';
    
    // Read database.sql file - try multiple locations
    $sql_file = __DIR__ . '/database.sql';
    if (!file_exists($sql_file)) {
        // Try alternative paths
        $sql_file = dirname(__DIR__) . '/database.sql';
        if (!file_exists($sql_file)) {
            // If file not found, use embedded SQL
            $sql = "-- Create events table
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
('Art & Design Expo', '2026-05-20', 'Explore the latest trends in art and design from renowned artists and designers.', 'Art Gallery');";
            echo '<div class="info">⚠ database.sql file not found, using embedded SQL instead</div>';
        } else {
            $sql = file_get_contents($sql_file);
        }
    } else {
        $sql = file_get_contents($sql_file);
    }
    
    // Remove CREATE DATABASE and USE statements (we're already connected)
    $sql = preg_replace('/CREATE DATABASE.*?;/i', '', $sql);
    $sql = preg_replace('/USE.*?;/i', '', $sql);
    
    // Remove single-line comments
    $sql = preg_replace('/--.*$/m', '', $sql);
    
    // Split into individual queries by semicolon, but preserve multi-line queries
    $queries = [];
    $current_query = '';
    $lines = explode("\n", $sql);
    
    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line)) continue;
        
        $current_query .= $line . "\n";
        
        // If line ends with semicolon, it's a complete query
        if (substr(rtrim($line), -1) === ';') {
            $query = trim($current_query);
            $query = rtrim($query, ';'); // Remove trailing semicolon
            if (!empty($query) && strlen($query) > 5) { // Minimum query length
                $queries[] = $query;
            }
            $current_query = '';
        }
    }
    
    // Add any remaining query
    if (!empty(trim($current_query))) {
        $queries[] = trim($current_query);
    }
    
    echo '<div class="info">Found ' . count($queries) . ' SQL queries to execute</div>';
    
    $success_count = 0;
    $error_count = 0;
    
    foreach ($queries as $index => $query) {
        $query = trim($query);
        if (empty($query) || strlen($query) < 5) {
            continue; // Skip empty queries
        }
        
        // Show what we're executing
        $query_preview = substr($query, 0, 80);
        echo '<div class="info">Executing query ' . ($index + 1) . ': ' . htmlspecialchars($query_preview) . '...</div>';
        
        if ($conn->query($query)) {
            $success_count++;
            echo '<div class="success">✓ Success: ' . htmlspecialchars($query_preview) . '...</div>';
        } else {
            $error_count++;
            $error_msg = $conn->error;
            // Check if error is because table already exists
            if (strpos($error_msg, 'already exists') !== false || strpos($error_msg, 'Duplicate') !== false) {
                echo '<div class="info">⚠ Skipped (already exists): ' . htmlspecialchars($query_preview) . '...</div>';
                $success_count++; // Count as success since it's just a duplicate
            } else {
                echo '<div class="error">✗ Error: ' . htmlspecialchars($error_msg) . '</div>';
                echo '<div class="error">Full Query: <pre>' . htmlspecialchars($query) . '</pre></div>';
            }
        }
    }
    
    echo '<div class="success"><h2>Import Complete!</h2>';
    echo '<p>Successful queries: ' . $success_count . '</p>';
    echo '<p>Errors: ' . $error_count . '</p></div>';
    
    // Verify tables exist
    $result = $conn->query("SHOW TABLES LIKE 'events'");
    if ($result->num_rows > 0) {
        echo '<div class="success">✓ Events table exists!</div>';
        
        // Count events
        $count_result = $conn->query("SELECT COUNT(*) as count FROM events");
        $count = $count_result->fetch_assoc()['count'];
        echo '<div class="info">Total events in database: ' . $count . '</div>';
    } else {
        echo '<div class="error">✗ Events table not found!</div>';
    }
    
    $conn->close();
    
} catch (Exception $e) {
    echo '<div class="error"><h2>Error:</h2><p>' . htmlspecialchars($e->getMessage()) . '</p></div>';
    echo '<div class="info"><h3>Debug Info:</h3>';
    echo '<pre>DB_HOST: ' . DB_HOST . "\n";
    echo 'DB_USER: ' . DB_USER . "\n";
    echo 'DB_NAME: ' . DB_NAME . "\n";
    echo 'DB_PASS: ' . (DB_PASS ? '***' : '(empty)') . "\n\n";
    echo 'Environment Variables Check:' . "\n";
    echo '$_ENV[DB_HOST]: ' . ($_ENV['DB_HOST'] ?? 'NOT SET') . "\n";
    echo 'getenv(DB_HOST): ' . (getenv('DB_HOST') ?: 'NOT SET') . "\n";
    echo '$_ENV[DB_USER]: ' . ($_ENV['DB_USER'] ?? 'NOT SET') . "\n";
    echo 'getenv(DB_USER): ' . (getenv('DB_USER') ?: 'NOT SET') . "\n";
    echo '$_ENV[DB_NAME]: ' . ($_ENV['DB_NAME'] ?? 'NOT SET') . "\n";
    echo 'getenv(DB_NAME): ' . (getenv('DB_NAME') ?: 'NOT SET') . '</pre></div>';
}

echo '<p><a href="index.html">← Back to Website</a></p>';
echo '</body></html>';
?>

