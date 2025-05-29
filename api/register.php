<?php
ob_start();
session_start();
header('Content-Type: application/json');
require_once 'db.php'; // Assumes PDO connection in root directory
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $role = $_POST['role'] ?? '';
    if (empty($name) || empty($email) || empty($password) || empty($role)) {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
        ob_end_flush();
        exit;}
    if (!preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]+$/', $email)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid email address.']);
        ob_end_flush();
        exit;}
    if (strlen($password) < 6) {
        echo json_encode(['status' => 'error', 'message' => 'Password must be at least 6 characters.']);
        ob_end_flush();
        exit;}
    if (!in_array($role, ['hod', 'admin'])) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid role selected.']);
        ob_end_flush();
        exit;}
    try {
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = :email");
        $stmt->execute(['email' => $email]);
        if ($stmt->rowCount() > 0) {
            echo json_encode(['status' => 'error', 'message' => 'Email already registered.']);
            ob_end_flush();
            exit;}
        $hashed_password = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $conn->prepare("INSERT INTO users (name, email, password, role) VALUES (:name, :email, :password, :role)");
        $stmt->execute([
            'name' => $name,
            'email' => $email,
            'password' => $hashed_password,
            'role' => $role]);
        echo json_encode([
            'status' => 'success',
            'message' => 'Registered successfully.',
            'user' => [
                'name' => $name,
                'email' => $email,
                'role' => $role
            ]
        ]);
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage()); // Debug log
        echo json_encode(['status' => 'error', 'message' => 'Database error']);
    }
    ob_end_flush();
    exit;
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request.']);
    ob_end_flush();
    exit;
}
?>