<?php
// backend/api/expenses.php
require_once __DIR__ . "/helpers.php";
require_once __DIR__ . "/utils.php";

$pdo = getDb();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        // Create new expense
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || !isset($data['title'], $data['amount'], $data['date'])) {
            jsonResponse(["error" => "Missing required fields"], 400);
        }

        $stmt = $pdo->prepare("INSERT INTO expenses (title, amount, category, date, notes, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
        $stmt->execute([
            $data['title'],
            $data['amount'],
            $data['category'] ?? null,
            $data['date'],
            $data['notes'] ?? null
        ]);

        jsonResponse([
            "success" => true,
            "message" => "Expense created successfully",
            "id" => $pdo->lastInsertId()
        ]);
        break;

    case 'GET':
        // Fetch all or single expense
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM expenses WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $expense = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($expense) {
                jsonResponse($expense);
            } else {
                jsonResponse(["error" => "Expense not found"], 404);
            }
        } else {
            $stmt = $pdo->query("SELECT * FROM expenses ORDER BY date DESC");
            jsonResponse($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
        break;

    case 'PUT':
        // Update expense
        if (!isset($_GET['id'])) {
            jsonResponse(["error" => "Expense ID is required"], 400);
        }
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data) {
            jsonResponse(["error" => "No data provided"], 400);
        }

        $fields = [];
        $values = [];
        foreach (['title', 'amount', 'category', 'date', 'notes'] as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field=?";
                $values[] = $data[$field];
            }
        }

        if (empty($fields)) {
            jsonResponse(["error" => "No valid fields to update"], 400);
        }

        $values[] = $_GET['id'];
        $stmt = $pdo->prepare("UPDATE expenses SET " . implode(", ", $fields) . " WHERE id=?");
        $stmt->execute($values);

        jsonResponse(["success" => true, "message" => "Expense updated successfully"]);
        break;

    case 'DELETE':
        // Delete expense
        if (!isset($_GET['id'])) {
            jsonResponse(["error" => "Expense ID is required"], 400);
        }
        $stmt = $pdo->prepare("DELETE FROM expenses WHERE id = ?");
        $stmt->execute([$_GET['id']]);

        jsonResponse(["success" => true, "message" => "Expense deleted successfully"]);
        break;

    default:
        jsonResponse(["error" => "Method not allowed"], 405);
}
