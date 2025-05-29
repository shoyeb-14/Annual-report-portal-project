<?php
require_once 'db.php';
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $sql = "SELECT
                    id,
                    name,
                    total_students,
                    passed,
                    failed,
                    backlogs
                FROM departments;";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['status' => 'success', 'data' => $results]);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $department_id = isset($_POST['department_id']) ? intval($_POST['department_id']) : null;
    $total_students = isset($_POST['total_students']) ? intval($_POST['total_students']) : null;
    $passed = isset($_POST['passed']) ? intval($_POST['passed']) : null;
    $failed = isset($_POST['failed']) ? intval($_POST['failed']) : null;
    $backlogs = isset($_POST['backlogs']) ? intval($_POST['backlogs']) : null;
    if ($department_id !== null && $total_students !== null && $passed !== null && $failed !== null && $backlogs !== null) {
        try {
            $sql = "UPDATE departments
                    SET total_students = :total_students,
                        passed = :passed,
                        failed = :failed,
                        backlogs = :backlogs
                    WHERE id = :department_id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':department_id', $department_id, PDO::PARAM_INT);
            $stmt->bindParam(':total_students', $total_students, PDO::PARAM_INT);
            $stmt->bindParam(':passed', $passed, PDO::PARAM_INT);
            $stmt->bindParam(':failed', $failed, PDO::PARAM_INT);
            $stmt->bindParam(':backlogs', $backlogs, PDO::PARAM_INT);

            if ($stmt->execute()) {
                echo json_encode(['status' => 'success', 'message' => 'Department details updated successfully']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to update department details']);
            }
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Missing required parameters for update']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>