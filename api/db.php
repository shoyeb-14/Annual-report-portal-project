<?php
$host = 'localhost';
$dbname = "annual_report_portal";
$user = 'postgres';
$pass = 'shoyeb14';  // replace with actual password

try {
    $conn = new PDO("pgsql:host=$host;dbname=$dbname", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("DB Connection Failed: " . $e->getMessage());
}
?>




