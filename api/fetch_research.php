<?php
header('Content-Type: application/json');
ini_set('display_errors', 0);
error_reporting(E_ALL);
require_once 'db.php';
try {
    $dept_id = isset($_GET['department_id']) && $_GET['department_id'] !== '' 
        ? (int)$_GET['department_id'] 
        : null;
    $year = isset($_GET['year']) && $_GET['year'] !== '' 
        ? (int)$_GET['year'] 
        : (int)date('Y');
    $facultyQuery = "SELECT d.name AS department, 
                    rf.total_projects, 
                    rf.ongoing_projects, 
                    rf.completed_projects, 
                    rf.total_papers,
                    rf.international_papers,
                    rf.national_papers,
                    rf.funding_received AS total_funding,
                    rf.performance_score,
                    rf.faculty_count
                    FROM research_faculty rf
                    JOIN departments d ON rf.department_id = d.id
                    WHERE rf.year = :year";
    if ($dept_id !== null) {
        $facultyQuery .= " AND rf.department_id = :dept_id";}
    $facultyQuery .= " ORDER BY d.name";
    $facultyStmt = $conn->prepare($facultyQuery);
    $facultyStmt->bindValue(':year', $year, PDO::PARAM_INT);
    if ($dept_id !== null) {
        $facultyStmt->bindValue(':dept_id', $dept_id, PDO::PARAM_INT);}
    if (!$facultyStmt->execute()) {
        throw new Exception('Faculty query failed');}
    $facultyData = $facultyStmt->fetchAll(PDO::FETCH_ASSOC);
    $studentQuery = "SELECT d.name AS department, 
                    rs.papers_presented AS total_papers,
                    rs.international_papers,
                    rs.national_papers,
                    rs.patents_filed AS total_patents,
                    rs.performance_score
                    FROM research_students rs
                    JOIN departments d ON rs.department_id = d.id
                    WHERE rs.year = :year";
    if ($dept_id !== null) {
        $studentQuery .= " AND rs.department_id = :dept_id";}
    $studentQuery .= " ORDER BY d.name";
    $studentStmt = $conn->prepare($studentQuery);
    $studentStmt->bindValue(':year', $year, PDO::PARAM_INT);
    if ($dept_id !== null) {
        $studentStmt->bindValue(':dept_id', $dept_id, PDO::PARAM_INT);}
    if (!$studentStmt->execute()) {
        throw new Exception('Student query failed');}
    $studentData = $studentStmt->fetchAll(PDO::FETCH_ASSOC);
    $trendStmt = $conn->prepare("
        SELECT year, total_projects, total_papers, total_patents, total_funding 
        FROM research_yearly_trends 
        ORDER BY year");
    if (!$trendStmt->execute()) {
        throw new Exception('Trend data query failed');}
    $trendData = $trendStmt->fetchAll(PDO::FETCH_ASSOC);
    $response = [
        'status' => 'success',
        'year' => $year,
        'faculty_research' => $facultyData,
        'student_research' => $studentData,
        'trend_data' => [
            'years' => array_column($trendData, 'year'),
            'projects' => array_column($trendData, 'total_projects'),
            'papers' => array_column($trendData, 'total_papers'),
            'patents' => array_column($trendData, 'total_patents'),
            'funding' => array_column($trendData, 'total_funding')
        ]
    ];
    echo json_encode($response);
} catch (PDOException $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage(),
        'code' => $e->getCode()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}