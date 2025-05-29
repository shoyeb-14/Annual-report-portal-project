<?php
ob_start();
session_start();
header('Content-Type: application/json');

require_once '../db.php';

// Check user role
$user = isset($_SESSION['user']) ? $_SESSION['user'] : null;
if (!$user || !in_array($user['role'], ['admin', 'hod'])) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized access']);
    ob_end_flush();
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $year = trim($_POST['year'] ?? '');
    $department_id = trim($_POST['department_id'] ?? '');
    $metric = trim($_POST['metric'] ?? '');
    $value = floatval($_POST['value'] ?? 0);
    $action = trim($_POST['action'] ?? '');

    // Validate inputs
    if (empty($year) || empty($department_id) || empty($metric) || empty($action)) {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
        ob_end_flush();
        exit;
    }

    if (!in_array($year, ['2023', '2024', '2025'])) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid year']);
        ob_end_flush();
        exit;
    }

    if (!in_array($metric, ['placements', 'avg_package', 'awards_won'])) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid metric']);
        ob_end_flush();
        exit;
    }

    if ($value < 0 || ($metric === 'avg_package' && $value > 100000000)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid value']);
        ob_end_flush();
        exit;
    }

    if (!in_array($action, ['add', 'update'])) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
        ob_end_flush();
        exit;
    }

    try {
        // Check if department exists
        $stmt = $conn->prepare("SELECT id FROM departments WHERE id = :id");
        $stmt->execute(['id' => $department_id]);
        if ($stmt->rowCount() === 0) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid department']);
            ob_end_flush();
            exit;
        }

        // Check if record exists
        $stmt = $conn->prepare("SELECT * FROM achievements WHERE department_id = :department_id AND year = :year");
        $stmt->execute(['department_id' => $department_id, 'year' => $year]);
        $existing = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($action === 'add' && $existing) {
            echo json_encode(['status' => 'error', 'message' => 'Record already exists. Use update instead.']);
            ob_end_flush();
            exit;
        }

        if ($action === 'update' && !$existing) {
            echo json_encode(['status' => 'error', 'message' => 'No record found to update. Use add instead.']);
            ob_end_flush();
            exit;
        }

        // Prepare data
        $data = [
            'department_id' => $department_id,
            'year' => $year,
            'placements' => $existing ? $existing['placements'] : 0,
            'avg_package' => $existing ? $existing['avg_package'] : 0,
            'awards_won' => $existing ? $existing['awards_won'] : 0
        ];
        $data[$metric] = $metric === 'avg_package' ? $value * 100000 : $value;

        if ($existing) {
            // Update existing record
            $stmt = $conn->prepare("UPDATE achievements SET $metric = :value WHERE department_id = :department_id AND year = :year");
            $stmt->execute([
                'value' => $data[$metric],
                'department_id' => $department_id,
                'year' => $year
            ]);
        } else {
            // Insert new record
            $stmt = $conn->prepare("INSERT INTO achievements (department_id, year, placements, avg_package, awards_won) VALUES (:department_id, :year, :placements, :avg_package, :awards_won)");
            $stmt->execute($data);
        }

        echo json_encode(['status' => 'success', 'message' => 'Data ' . ($action === 'add' ? 'added' : 'updated') . ' successfully']);
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        echo json_encode(['status' => 'error', 'message' => 'Database error']);
    }

    ob_end_flush();
    exit;
}

echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
ob_end_flush();
exit;
?>