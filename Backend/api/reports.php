<?php
require_once __DIR__ . "/helpers.php";
require_once __DIR__ . "/utils.php";

// Authenticate user first
$user = requireAuth();
$pdo = getDb();

// Handle the request
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        generateReport($pdo);
        break;

    default:
        jsonResponse(["error" => "Method not allowed"], 405);
}

// Generate report summary
function generateReport($pdo) {
    $report = [];

    // 1️⃣ Users summary
    $stmt = $pdo->query("SELECT COUNT(*) AS total_users FROM users");
    $report['users'] = $stmt->fetch(PDO::FETCH_ASSOC);

    // 2️⃣ Customers summary
    $stmt = $pdo->query("SELECT COUNT(*) AS total_customers FROM customers");
    $report['customers'] = $stmt->fetch(PDO::FETCH_ASSOC);

    // 3️⃣ Expenses summary
    $stmt = $pdo->query("SELECT COUNT(*) AS total_expenses, COALESCE(SUM(amount),0) AS total_amount FROM expenses");
    $report['expenses'] = $stmt->fetch(PDO::FETCH_ASSOC);

    // 4️⃣ Expenses by category
    $stmt = $pdo->query("SELECT category, COALESCE(SUM(amount),0) AS total_amount 
                         FROM expenses 
                         GROUP BY category 
                         ORDER BY total_amount DESC");
    $report['expenses_by_category'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    jsonResponse([
        "success" => true,
        "report" => $report
    ]);
}
