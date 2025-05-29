<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require_once 'db.php';
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$type = $_POST['type'] ?? null;
$year = $_POST['year'] ?? date('Y');
$data = json_decode($_POST['data'], true);

try {
    if (!$type || !$year || !$data) {
        throw new Exception('Missing required parameters');
    }

    $deptStmt = $conn->prepare("SELECT id FROM departments WHERE name = :name");
    $deptStmt->bindParam(':name', $data['department']);
    $deptStmt->execute();
    $dept = $deptStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$dept) {
        throw new Exception('Department not found');
    }
    
    $dept_id = $dept['id'];

    if ($type === 'faculty') {
        // Check if record exists
        $checkStmt = $conn->prepare("SELECT id FROM research_faculty WHERE department_id = :dept_id AND year = :year");
        $checkStmt->bindParam(':dept_id', $dept_id);
        $checkStmt->bindParam(':year', $year);
        $checkStmt->execute();
        $exists = $checkStmt->fetch(PDO::FETCH_ASSOC);
        
        if ($exists) {
            // Update existing record
            $query = "UPDATE research_faculty SET 
                     total_projects = :total_projects,
                     ongoing_projects = :ongoing_projects,
                     completed_projects = :completed_projects,
                     total_papers = :total_papers,
                     international_papers = :international_papers,
                     national_papers = :national_papers,
                     funding_received = :total_funding,
                     faculty_count = :faculty_count,
                     performance_score = :performance_score
                     WHERE department_id = :dept_id AND year = :year";
        } else {
            // Insert new record
            $query = "INSERT INTO research_faculty (
                     department_id, year, total_projects, ongoing_projects,
                     completed_projects, total_papers, international_papers,
                     national_papers, funding_received, faculty_count, performance_score
                     ) VALUES (
                     :dept_id, :year, :total_projects, :ongoing_projects,
                     :completed_projects, :total_papers, :international_papers,
                     :national_papers, :total_funding, :faculty_count, :performance_score
                     )";
        }
        
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':dept_id', $dept_id);
        $stmt->bindParam(':year', $year);
        $stmt->bindParam(':total_projects', $data['total_projects']);
        $stmt->bindParam(':ongoing_projects', $data['ongoing_projects']);
        $stmt->bindParam(':completed_projects', $data['completed_projects']);
        $stmt->bindParam(':total_papers', $data['total_papers']);
        $stmt->bindParam(':international_papers', $data['international_papers']);
        $stmt->bindParam(':national_papers', $data['national_papers']);
        $stmt->bindParam(':total_funding', $data['total_funding']);
        $stmt->bindParam(':faculty_count', $data['faculty_count']);
        $stmt->bindParam(':performance_score', $data['performance_score']);
    } else {
        // Student research
        $checkStmt = $conn->prepare("SELECT id FROM research_students WHERE department_id = :dept_id AND year = :year");
        $checkStmt->bindParam(':dept_id', $dept_id);
        $checkStmt->bindParam(':year', $year);
        $checkStmt->execute();
        $exists = $checkStmt->fetch(PDO::FETCH_ASSOC);
        
        if ($exists) {
            // Update existing record
            $query = "UPDATE research_students SET 
                     papers_presented = :total_papers,
                     international_papers = :international_papers,
                     national_papers = :national_papers,
                     patents_filed = :total_patents,
                     performance_score = :performance_score
                     WHERE department_id = :dept_id AND year = :year";
        } else {
            // Insert new record
            $query = "INSERT INTO research_students (
                     department_id, year, papers_presented,
                     international_papers, national_papers,
                     patents_filed, performance_score
                     ) VALUES (
                     :dept_id, :year, :total_papers,
                     :international_papers, :national_papers,
                     :total_patents, :performance_score
                     )";
        }
        
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':dept_id', $dept_id);
        $stmt->bindParam(':year', $year);
        $stmt->bindParam(':total_papers', $data['total_papers']);
        $stmt->bindParam(':international_papers', $data['international_papers']);
        $stmt->bindParam(':national_papers', $data['national_papers']);
        $stmt->bindParam(':total_patents', $data['total_patents']);
        $stmt->bindParam(':performance_score', $data['performance_score']);
    }
    
    $stmt->execute();
    
    echo json_encode(['status' => 'success', 'message' => 'Data updated successfully']);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}