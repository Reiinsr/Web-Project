<?php
/**
 * Database Import Script
 * Run this once after setting up environment variables on Railway
 * Access via: https://your-app.railway.app/import_database.php
 */

header('Content-Type: text/html; charset=utf-8');

// Security: Only allow in development or with a secret key
$secret_key = getenv('IMPORT_SECRET_KEY') ?: 'change-this-secret-key';
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
    
    // Read database.sql file
    $sql_file = __DIR__ . '/database.sql';
    if (!file_exists($sql_file)) {
        throw new Exception('database.sql file not found!');
    }
    
    $sql = file_get_contents($sql_file);
    
    // Remove CREATE DATABASE and USE statements (we're already connected)
    $sql = preg_replace('/CREATE DATABASE.*?;/i', '', $sql);
    $sql = preg_replace('/USE.*?;/i', '', $sql);
    
    // Split into individual queries
    $queries = array_filter(array_map('trim', explode(';', $sql)));
    
    $success_count = 0;
    $error_count = 0;
    
    foreach ($queries as $query) {
        if (empty($query) || strpos($query, '--') === 0) {
            continue; // Skip empty queries and comments
        }
        
        if ($conn->query($query)) {
            $success_count++;
            echo '<div class="info">✓ Executed: ' . substr($query, 0, 50) . '...</div>';
        } else {
            $error_count++;
            // Check if error is because table already exists
            if (strpos($conn->error, 'already exists') !== false) {
                echo '<div class="info">⚠ Skipped (already exists): ' . substr($query, 0, 50) . '...</div>';
            } else {
                echo '<div class="error">✗ Error: ' . $conn->error . '</div>';
                echo '<div class="error">Query: ' . htmlspecialchars(substr($query, 0, 200)) . '</div>';
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
    echo 'DB_PASS: ' . (DB_PASS ? '***' : '(empty)') . '</pre></div>';
}

echo '<p><a href="index.html">← Back to Website</a></p>';
echo '</body></html>';
?>

