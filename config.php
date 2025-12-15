<?php
// Database configuration
// Uses environment variables if available (for production), otherwise uses defaults (for local development)

// Check if we're in production (environment variables set)
// Railway uses $_ENV, but we check multiple methods for compatibility
$db_host = $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?: 'localhost';
$db_user = $_ENV['DB_USER'] ?? getenv('DB_USER') ?: 'root';
$db_pass = $_ENV['DB_PASS'] ?? getenv('DB_PASS') ?: '';
$db_name = $_ENV['DB_NAME'] ?? getenv('DB_NAME') ?: 'event_management';

define('DB_HOST', $db_host);
define('DB_USER', $db_user);
define('DB_PASS', $db_pass);
define('DB_NAME', $db_name);

// Create database connection
function getDBConnection() {
    // First, try to connect to MySQL server (without selecting database)
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS);
    
    if ($conn->connect_error) {
        die(json_encode(array(
            'error' => 'Database connection failed',
            'message' => $conn->connect_error,
            'host' => DB_HOST,
            'user' => DB_USER
        )));
    }
    
    // Check if database exists, if not create it
    $db_check = $conn->query("SHOW DATABASES LIKE '" . DB_NAME . "'");
    if ($db_check->num_rows == 0) {
        $conn->query("CREATE DATABASE IF NOT EXISTS " . DB_NAME);
    }
    
    // Select the database
    $conn->select_db(DB_NAME);
    
    // Set charset to utf8mb4 for proper character encoding
    $conn->set_charset("utf8mb4");
    
    return $conn;
}
?>

