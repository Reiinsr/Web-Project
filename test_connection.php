<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Database Connection Test</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .test-container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .success {
            color: #28a745;
            background: #d4edda;
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
        }
        .error {
            color: #dc3545;
            background: #f8d7da;
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
        }
        .info {
            color: #004085;
            background: #cce5ff;
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
        }
        h1 {
            color: #333;
        }
        pre {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <div class="test-container">
        <h1>Database Connection Test</h1>
        
        <?php
        error_reporting(E_ALL);
        ini_set('display_errors', 1);
        
        echo '<div class="info"><strong>Testing Database Connection...</strong></div>';
        
        // Test 1: Check if MySQL extension is loaded
        echo '<h2>Test 1: PHP MySQL Extension</h2>';
        if (extension_loaded('mysqli')) {
            echo '<div class="success">✓ MySQLi extension is loaded</div>';
        } else {
            echo '<div class="error">✗ MySQLi extension is NOT loaded. Please enable it in php.ini</div>';
            exit;
        }
        
        // Test 2: Check configuration
        echo '<h2>Test 2: Configuration</h2>';
        require_once 'config.php';
        echo '<pre>';
        echo "DB_HOST: " . DB_HOST . "\n";
        echo "DB_USER: " . DB_USER . "\n";
        echo "DB_PASS: " . (DB_PASS ? '***' : '(empty)') . "\n";
        echo "DB_NAME: " . DB_NAME . "\n";
        echo '</pre>';
        
        // Test 3: Try to connect to MySQL server
        echo '<h2>Test 3: MySQL Server Connection</h2>';
        $conn = @new mysqli(DB_HOST, DB_USER, DB_PASS);
        
        if ($conn->connect_error) {
            echo '<div class="error">✗ Cannot connect to MySQL server</div>';
            echo '<div class="error">Error: ' . $conn->connect_error . '</div>';
            echo '<div class="info"><strong>Troubleshooting:</strong><ul>';
            echo '<li>Make sure MySQL service is running (check XAMPP/WAMP/MAMP control panel)</li>';
            echo '<li>Check if DB_HOST is correct (try "127.0.0.1" instead of "localhost")</li>';
            echo '<li>Verify DB_USER and DB_PASS in config.php</li>';
            echo '<li>Check MySQL port (default is 3306)</li>';
            echo '</ul></div>';
        } else {
            echo '<div class="success">✓ Successfully connected to MySQL server</div>';
            echo '<div class="info">MySQL Version: ' . $conn->server_info . '</div>';
            
            // Test 4: Check if database exists
            echo '<h2>Test 4: Database Existence</h2>';
            $db_check = $conn->query("SHOW DATABASES LIKE '" . DB_NAME . "'");
            if ($db_check->num_rows > 0) {
                echo '<div class="success">✓ Database "' . DB_NAME . '" exists</div>';
                
                // Test 5: Connect to database
                echo '<h2>Test 5: Database Connection</h2>';
                $conn->select_db(DB_NAME);
                if ($conn->error) {
                    echo '<div class="error">✗ Cannot select database: ' . $conn->error . '</div>';
                } else {
                    echo '<div class="success">✓ Successfully connected to database "' . DB_NAME . '"</div>';
                    
                    // Test 6: Check if events table exists
                    echo '<h2>Test 6: Events Table</h2>';
                    $table_check = $conn->query("SHOW TABLES LIKE 'events'");
                    if ($table_check->num_rows > 0) {
                        echo '<div class="success">✓ Events table exists</div>';
                        
                        // Test 7: Count events
                        $count_result = $conn->query("SELECT COUNT(*) as count FROM events");
                        $count = $count_result->fetch_assoc()['count'];
                        echo '<div class="info">Number of events in database: ' . $count . '</div>';
                        
                        // Show sample events
                        if ($count > 0) {
                            echo '<h2>Sample Events:</h2>';
                            $events_result = $conn->query("SELECT id, title, date FROM events LIMIT 5");
                            echo '<pre>';
                            while ($row = $events_result->fetch_assoc()) {
                                echo "ID: {$row['id']} | {$row['title']} | {$row['date']}\n";
                            }
                            echo '</pre>';
                        }
                    } else {
                        echo '<div class="error">✗ Events table does NOT exist</div>';
                        echo '<div class="info">Please import database.sql file in phpMyAdmin or run the SQL commands manually.</div>';
                    }
                }
            } else {
                echo '<div class="error">✗ Database "' . DB_NAME . '" does NOT exist</div>';
                echo '<div class="info">Attempting to create database...</div>';
                if ($conn->query("CREATE DATABASE IF NOT EXISTS " . DB_NAME)) {
                    echo '<div class="success">✓ Database created successfully!</div>';
                    echo '<div class="info">Now please import database.sql to create the events table.</div>';
                } else {
                    echo '<div class="error">✗ Failed to create database: ' . $conn->error . '</div>';
                }
            }
            
            $conn->close();
        }
        
        // Test 8: Test getDBConnection function
        echo '<h2>Test 7: getDBConnection() Function</h2>';
        try {
            $test_conn = getDBConnection();
            echo '<div class="success">✓ getDBConnection() function works correctly</div>';
            $test_conn->close();
        } catch (Exception $e) {
            echo '<div class="error">✗ getDBConnection() failed: ' . $e->getMessage() . '</div>';
        }
        ?>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #ddd;">
            <h2>Next Steps:</h2>
            <ol>
                <li>If all tests pass, your database is ready!</li>
                <li>If database doesn't exist, import <code>database.sql</code> in phpMyAdmin</li>
                <li>If connection fails, check MySQL service is running</li>
                <li>Update <code>config.php</code> with correct credentials if needed</li>
            </ol>
            <p><a href="index.html">← Back to Website</a></p>
        </div>
    </div>
</body>
</html>

