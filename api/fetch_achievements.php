    <?php
    require_once 'db.php';
    header('Content-Type: application/json');
    try {
        $sql = "SELECT 
                    a.department_id,
                    d.name AS department_name,
                    a.year,
                    a.placements,
                    a.avg_package,
                    a.awards_won
                FROM achievements a
                LEFT JOIN departments d ON a.department_id = d.id
                ORDER BY a.year, a.department_id";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $data_by_year = [];
        foreach ($results as $row) {
            $year = $row['year'];
            if (!isset($data_by_year[$year])) {
                $data_by_year[$year] = [];
            }
            $data_by_year[$year][] = [
                'department_name' => $row['department_name'],
                'placements' => (int)$row['placements'],
                'avg_package' => (float)$row['avg_package'],
                'awards_won' => (int)$row['awards_won']
            ];
        }
        echo json_encode([
            'status' => 'success',
            'data' => $data_by_year
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'status' => 'error',
            'message' => $e->getMessage()
        ]);
    }
    ?>  