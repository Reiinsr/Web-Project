<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config.php';

try {
    $conn = getDBConnection();
    
    // Get all events ordered by date
    $sql = "SELECT id, title, date, description, location FROM events ORDER BY date ASC";
    $result = $conn->query($sql);
    
    $events = array();
    
    if ($result && $result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $events[] = $row;
        }
    }
    
    $conn->close();
    
    echo json_encode($events);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        'error' => 'Database error',
        'message' => $e->getMessage()
    ));
}
?>

