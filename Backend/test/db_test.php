<?php
require_once __DIR__ . '/../config/db.php';

echo "<h1>✅ Database connection successful!</h1>";

$stmt = $pdo->query("SHOW TABLES");
$tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

echo "<p>Tables found in database:</p>";
echo "<ul>";
foreach ($tables as $t) {
    echo "<li>$t</li>";
}
echo "</ul>";
