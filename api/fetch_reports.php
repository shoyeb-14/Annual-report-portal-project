<?php
require_once 'db.php';
require_once __DIR__ . '/vendor/autoload.php';

$departmentId = filter_input(INPUT_GET, 'department_id', FILTER_VALIDATE_INT);

if ($departmentId) {
    $stmt = $conn->prepare("SELECT a.*, d.name AS department_name FROM academics a JOIN departments d ON a.department_id = d.id WHERE a.department_id = :dept_id");
    $stmt->bindParam(':dept_id', $departmentId, PDO::PARAM_INT);
    $stmt->execute();
    $departmentData = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($departmentData) {
        
        $pdf = new TCPDF();
        $pdf->SetCreator(PDF_CREATOR);
        $pdf->SetAuthor('Annual Report System');
        $pdf->SetTitle('Academic Report - ' . $departmentData['department_name']);
        $pdf->SetMargins(20, 20, 20);
        $pdf->AddPage();

        
        $html = '
            <h2>Academic Report - ' . $departmentData['department_name'] . '</h2>
            <table border="1" cellpadding="5">
                <tr><th>Total Students</th><td>' . $departmentData['total_students'] . '</td></tr>
                <tr><th>Passed</th><td>' . $departmentData['passed'] . '</td></tr>
                <tr><th>Failed</th><td>' . $departmentData['failed'] . '</td></tr>
                <tr><th>Backlogs</th><td>' . $departmentData['backlogs'] . '</td></tr>
                <tr><th>Semester</th><td>' . $departmentData['semester'] . '</td></tr>
                <tr><th>GPA</th><td>' . $departmentData['gpa'] . '</td></tr>
                <tr><th>GPA Range</th><td>' . $departmentData['gpa_range'] . '</td></tr>
                <tr><th>Is HAU</th><td>' . ($departmentData['is_hau'] ? 'Yes' : 'No') . '</td></tr>
                <tr><th>Academic Year</th><td>' . $departmentData['academic_year'] . '</td></tr>
            </table>
        ';

        $pdf->writeHTML($html, true, false, true, false, '');

        
        $fileName = 'Academic_Report_' . $departmentData['department_name'] . '.pdf';
        $pdf->Output($fileName, 'D'); // 'D' forces download

    } else {
        http_response_code(404);
        echo "Department not found.";
    }

} else {
    http_response_code(400);
    echo "Invalid department ID.";
}

$conn = null;
?>
