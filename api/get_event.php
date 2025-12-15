<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config.php';

try {
    $conn = getDBConnection();
    
    $eventId = isset($_GET['id']) ? intval($_GET['id']) : 0;
    
    if ($eventId > 0) {
        $stmt = $conn->prepare("SELECT id, title, date, description, location FROM events WHERE id = ?");
        if ($stmt) {
            $stmt->bind_param("i", $eventId);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                $event = $result->fetch_assoc();
                echo json_encode($event);
            } else {
                http_response_code(404);
                echo json_encode(array('error' => 'Event not found'));
            }
            
            $stmt->close();
        } else {
            http_response_code(500);
            echo json_encode(array('error' => 'Database query failed', 'message' => $conn->error));
        }
    } else {
        http_response_code(400);
        echo json_encode(array('error' => 'Invalid event ID'));
    }
    
    $conn->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        'error' => 'Database error',
        'message' => $e->getMessage()
    ));
}
?>

