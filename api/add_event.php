<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $conn = getDBConnection();
        
        // Check if events table exists
        $table_check = $conn->query("SHOW TABLES LIKE 'events'");
        if ($table_check->num_rows == 0) {
            http_response_code(500);
            echo json_encode(array(
                'error' => 'Database table does not exist',
                'message' => 'The "events" table was not found. Please import database.sql file in phpMyAdmin.'
            ));
            $conn->close();
            exit;
        }
        
        // Get JSON input
        $raw_input = file_get_contents('php://input');
        $data = json_decode($raw_input, true);
        
        // Check if JSON decode failed
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(array(
                'error' => 'Invalid JSON',
                'message' => 'Could not parse request data: ' . json_last_error_msg(),
                'raw_input' => substr($raw_input, 0, 100)
            ));
            $conn->close();
            exit;
        }
        
        // Validate input
        if (!isset($data['title']) || empty(trim($data['title']))) {
            http_response_code(400);
            echo json_encode(array('error' => 'Missing required field: title'));
            $conn->close();
            exit;
        }
        
        if (!isset($data['date']) || empty(trim($data['date']))) {
            http_response_code(400);
            echo json_encode(array('error' => 'Missing required field: date'));
            $conn->close();
            exit;
        }
        
        if (!isset($data['description']) || empty(trim($data['description']))) {
            http_response_code(400);
            echo json_encode(array('error' => 'Missing required field: description'));
            $conn->close();
            exit;
        }
        
        $title = trim($data['title']);
        $date = trim($data['date']);
        $description = trim($data['description']);
        $location = isset($data['location']) ? trim($data['location']) : '';
        
        // Insert event using prepared statement
        $stmt = $conn->prepare("INSERT INTO events (title, date, description, location) VALUES (?, ?, ?, ?)");
        
        if ($stmt) {
            $stmt->bind_param("ssss", $title, $date, $description, $location);
            
            if ($stmt->execute()) {
                $eventId = $conn->insert_id;
                echo json_encode(array(
                    'success' => true,
                    'message' => 'Event added successfully',
                    'id' => $eventId
                ));
            } else {
                http_response_code(500);
                echo json_encode(array(
                    'error' => 'Failed to add event',
                    'message' => $stmt->error,
                    'sql_error' => $conn->error
                ));
            }
            
            $stmt->close();
        } else {
            http_response_code(500);
            echo json_encode(array(
                'error' => 'Database query failed',
                'message' => $conn->error,
                'error_code' => $conn->errno
            ));
        }
        
        $conn->close();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array(
            'error' => 'Database error',
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ));
    }
} else {
    http_response_code(405);
    echo json_encode(array('error' => 'Method not allowed'));
}
?>

