<?php
// reports.php

// ---------- CORS HEADERS ----------
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

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
    // Get date range from query parameters (optional)
    $start_date = $_GET['start_date'] ?? null;
    $end_date = $_GET['end_date'] ?? null;
    
    $report = [];
    
    // Date filter conditions for SQL
    $date_condition_expenses = "";
    $date_condition_invoices = "";
    $params_expenses = [];
    $params_invoices = [];
    
    if ($start_date && $end_date) {
        $date_condition_expenses = " WHERE date BETWEEN ? AND ?";
        $date_condition_invoices = " WHERE date BETWEEN ? AND ?";
        $params_expenses = [$start_date, $end_date];
        $params_invoices = [$start_date, $end_date];
    }

    // 1️⃣ Users summary
    $stmt = $pdo->query("SELECT COUNT(*) AS total_users FROM users");
    $report['users'] = $stmt->fetch(PDO::FETCH_ASSOC);

    // 2️⃣ Customers summary
    $stmt = $pdo->query("SELECT COUNT(*) AS total_customers FROM customers");
    $report['customers'] = $stmt->fetch(PDO::FETCH_ASSOC);

    // 3️⃣ Expenses summary
    $stmt = $pdo->prepare("SELECT COUNT(*) AS total_expenses, COALESCE(SUM(amount),0) AS total_amount FROM expenses" . $date_condition_expenses);
    $stmt->execute($params_expenses);
    $report['expenses'] = $stmt->fetch(PDO::FETCH_ASSOC);

    // 4️⃣ Expenses by category
    $stmt = $pdo->prepare("SELECT category, COALESCE(SUM(amount),0) AS total_amount 
                         FROM expenses" . $date_condition_expenses . " 
                         GROUP BY category 
                         ORDER BY total_amount DESC");
    $stmt->execute($params_expenses);
    $report['expenses_by_category'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 5️⃣ Invoices/Revenue summary (NEW)
    $stmt = $pdo->prepare("SELECT COUNT(*) AS total_invoices, COALESCE(SUM(total),0) AS total_revenue FROM invoices" . $date_condition_invoices);
    $stmt->execute($params_invoices);
    $report['invoices'] = $stmt->fetch(PDO::FETCH_ASSOC);

    // 6️⃣ Profit & Loss calculation (NEW)
    $total_revenue = floatval($report['invoices']['total_revenue'] ?? 0);
    $total_expenses = floatval($report['expenses']['total_amount'] ?? 0);
    $net_profit = $total_revenue - $total_expenses;
    
    $report['profit_loss'] = [
        'total_revenue' => $total_revenue,
        'total_expenses' => $total_expenses,
        'net_profit' => $net_profit,
        'profit_margin' => $total_revenue > 0 ? round(($net_profit / $total_revenue) * 100, 2) : 0
    ];

    // 7️⃣ Monthly Revenue Trend (Last 6 months) (NEW)
    $stmt = $pdo->query("
        SELECT 
            DATE_FORMAT(date, '%Y-%m') AS month,
            COALESCE(SUM(total), 0) AS revenue
        FROM invoices
        WHERE date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(date, '%Y-%m')
        ORDER BY month ASC
    ");
    $report['monthly_revenue'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 8️⃣ Monthly Expenses Trend (Last 6 months) (NEW)
    $stmt = $pdo->query("
        SELECT 
            DATE_FORMAT(date, '%Y-%m') AS month,
            COALESCE(SUM(amount), 0) AS expenses
        FROM expenses
        WHERE date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(date, '%Y-%m')
        ORDER BY month ASC
    ");
    $report['monthly_expenses'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 9️⃣ Combined Monthly Trend (Revenue vs Expenses) (NEW)
    // Merge revenue and expenses by month
    $monthly_data = [];
    
    foreach ($report['monthly_revenue'] as $row) {
        $month = $row['month'];
        if (!isset($monthly_data[$month])) {
            $monthly_data[$month] = ['month' => $month, 'revenue' => 0, 'expenses' => 0];
        }
        $monthly_data[$month]['revenue'] = floatval($row['revenue']);
    }
    
    foreach ($report['monthly_expenses'] as $row) {
        $month = $row['month'];
        if (!isset($monthly_data[$month])) {
            $monthly_data[$month] = ['month' => $month, 'revenue' => 0, 'expenses' => 0];
        }
        $monthly_data[$month]['expenses'] = floatval($row['expenses']);
    }
    
    // Calculate profit for each month
    foreach ($monthly_data as &$data) {
        $data['profit'] = $data['revenue'] - $data['expenses'];
    }
    
    $report['monthly_trend'] = array_values($monthly_data);

    // 🔟 Top Customers by Revenue (NEW)
    $stmt = $pdo->query("
        SELECT 
            c.name,
            COUNT(i.id) AS invoice_count,
            COALESCE(SUM(i.total), 0) AS total_spent
        FROM customers c
        LEFT JOIN invoices i ON c.id = i.customer_id
        GROUP BY c.id, c.name
        HAVING total_spent > 0
        ORDER BY total_spent DESC
        LIMIT 5
    ");
    $report['top_customers'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return response
    jsonResponse([
        "success" => true,
        "report" => $report,
        "date_range" => [
            "start_date" => $start_date,
            "end_date" => $end_date
        ]
    ]);
}