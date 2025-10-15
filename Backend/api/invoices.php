<?php
// invoices.php

// ---------- CORS HEADERS ----------
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ---------- MAIN LOGIC ----------
require_once __DIR__ . '/../config/db.php';

$action = $_GET['action'] ?? 'list';

switch ($action) {

    // ---------------- CREATE INVOICE ----------------
    case 'create':
        header('Content-Type: application/json');
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;

        if (empty($input['items']) || !is_array($input['items'])) {
            http_response_code(400);
            echo json_encode(['error' => 'No items provided']);
            exit;
        }

        $customer = $input['customer'] ?? [];
        $customer_name = trim($customer['name'] ?? '');
        $customer_email = trim($customer['email'] ?? '');
        $customer_phone = trim($customer['phone'] ?? '');
        $customer_address = trim($customer['address'] ?? '');

        try {
            $pdo->beginTransaction();

            // Find existing customer by email
            $customer_id = null;
            if ($customer_email !== '') {
                $stmt = $pdo->prepare("SELECT id FROM customers WHERE email = ? LIMIT 1");
                $stmt->execute([$customer_email]);
                $row = $stmt->fetch();
                if ($row) $customer_id = $row['id'];
            }

            // Insert customer if not found
            if (!$customer_id) {
                $stmt = $pdo->prepare("INSERT INTO customers (name, email, phone, address) VALUES (?,?,?,?)");
                $stmt->execute([$customer_name, $customer_email, $customer_phone, $customer_address]);
                $customer_id = $pdo->lastInsertId();
            }

            // Compute totals
            $subtotal = 0.0;
            foreach ($input['items'] as $it) {
                $qty = max(1, intval($it['quantity'] ?? 1));
                $unit = floatval($it['unit_price'] ?? 0);
                $subtotal += $qty * $unit;
            }

            $tax = 0.0;
            if (isset($input['tax_percent'])) {
                $tax = round($subtotal * floatval($input['tax_percent']) / 100.0, 2);
            } elseif (isset($input['tax'])) {
                $tax = floatval($input['tax']);
            }

            $total = round($subtotal + $tax, 2);
            $date = $input['date'] ?? date('Y-m-d');
            $due_date = $input['due_date'] ?? null;
            $notes = $input['notes'] ?? null;

            // Insert invoice
            $temp_inv = 'TEMP';
            $stmt = $pdo->prepare("INSERT INTO invoices (customer_id, invoice_number, date, due_date, total, notes) VALUES (?,?,?,?,?,?)");
            $stmt->execute([$customer_id, $temp_inv, $date, $due_date, $total, $notes]);
            $invoice_id = $pdo->lastInsertId();

            $invoice_number = 'INV' . str_pad($invoice_id, 6, '0', STR_PAD_LEFT);
            $stmt = $pdo->prepare("UPDATE invoices SET invoice_number = ? WHERE id = ?");
            $stmt->execute([$invoice_number, $invoice_id]);

            // Insert items
            $stmtItem = $pdo->prepare("INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, line_total) VALUES (?,?,?,?,?)");
            foreach ($input['items'] as $it) {
                $desc = $it['description'] ?? '';
                $qty = max(1, intval($it['quantity'] ?? 1));
                $unit = floatval($it['unit_price'] ?? 0);
                $lineTotal = round($qty * $unit, 2);
                $stmtItem->execute([$invoice_id, $desc, $qty, $unit, $lineTotal]);
            }

            $pdo->commit();

            echo json_encode([
                'success' => true,
                'invoice_id' => (int)$invoice_id,
                'invoice_number' => $invoice_number,
                'total' => $total
            ]);

        } catch (Exception $e) {
            $pdo->rollBack();
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create invoice', 'message' => $e->getMessage()]);
        }
        break;

    // ---------------- UPDATE INVOICE ----------------
    case 'update':
        header('Content-Type: application/json');
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing invoice ID']);
            exit;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;
        if (empty($input['items']) || !is_array($input['items'])) {
            http_response_code(400);
            echo json_encode(['error' => 'No items provided']);
            exit;
        }

        $customer = $input['customer'] ?? [];
        $customer_name = trim($customer['name'] ?? '');
        $customer_email = trim($customer['email'] ?? '');
        $customer_phone = trim($customer['phone'] ?? '');
        $customer_address = trim($customer['address'] ?? '');

        try {
            $pdo->beginTransaction();

            // Find existing invoice
            $stmt = $pdo->prepare("SELECT * FROM invoices WHERE id = ?");
            $stmt->execute([$id]);
            $invoice = $stmt->fetch();
            if (!$invoice) throw new Exception("Invoice not found");

            // Find existing customer by email
            $customer_id = $invoice['customer_id'];
            if ($customer_email !== '') {
                $stmt = $pdo->prepare("SELECT id FROM customers WHERE email = ? LIMIT 1");
                $stmt->execute([$customer_email]);
                $row = $stmt->fetch();
                if ($row) {
                    $customer_id = $row['id'];
                    // Update existing customer info
                    $stmt = $pdo->prepare("UPDATE customers SET name=?, phone=?, address=? WHERE id=?");
                    $stmt->execute([$customer_name, $customer_phone, $customer_address, $customer_id]);
                } else {
                    // create new customer
                    $stmt = $pdo->prepare("INSERT INTO customers (name, email, phone, address) VALUES (?,?,?,?)");
                    $stmt->execute([$customer_name, $customer_email, $customer_phone, $customer_address]);
                    $customer_id = $pdo->lastInsertId();
                }
            }

            // Compute totals
            $subtotal = 0.0;
            foreach ($input['items'] as $it) {
                $qty = max(1, intval($it['quantity'] ?? 1));
                $unit = floatval($it['unit_price'] ?? 0);
                $subtotal += $qty * $unit;
            }

            $tax = 0.0;
            if (isset($input['tax_percent'])) $tax = round($subtotal * floatval($input['tax_percent']) / 100.0, 2);
            elseif (isset($input['tax'])) $tax = floatval($input['tax']);
            $total = round($subtotal + $tax, 2);

            $date = $input['date'] ?? $invoice['date'];
            $due_date = $input['due_date'] ?? $invoice['due_date'];
            $notes = $input['notes'] ?? $invoice['notes'];

            // Update invoice
            $stmt = $pdo->prepare("UPDATE invoices SET customer_id=?, date=?, due_date=?, total=?, notes=? WHERE id=?");
            $stmt->execute([$customer_id, $date, $due_date, $total, $notes, $id]);

            // Delete existing items
            $stmt = $pdo->prepare("DELETE FROM invoice_items WHERE invoice_id=?");
            $stmt->execute([$id]);

            // Insert new items
            $stmtItem = $pdo->prepare("INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, line_total) VALUES (?,?,?,?,?)");
            foreach ($input['items'] as $it) {
                $desc = $it['description'] ?? '';
                $qty = max(1, intval($it['quantity'] ?? 1));
                $unit = floatval($it['unit_price'] ?? 0);
                $lineTotal = round($qty * $unit, 2);
                $stmtItem->execute([$id, $desc, $qty, $unit, $lineTotal]);
            }

            $pdo->commit();
            echo json_encode(['success' => true, 'invoice_id' => $id, 'total' => $total]);
        } catch (Exception $e) {
            $pdo->rollBack();
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update invoice', 'message' => $e->getMessage()]);
        }
        break;

    // ---------------- DELETE INVOICE ----------------
    case 'delete':
    case 'remove':
        header('Content-Type: application/json');
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing id']);
            exit;
        }
        try {
            $stmt = $pdo->prepare("DELETE FROM invoices WHERE id=?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete invoice', 'message' => $e->getMessage()]);
        }
        break;

    // ---------------- LIST INVOICES ----------------
    case 'list':
        header('Content-Type: application/json');
        $stmt = $pdo->query("
          SELECT i.id, i.invoice_number, i.date, i.total, c.name as customer_name
          FROM invoices i
          JOIN customers c ON c.id = i.customer_id
          ORDER BY i.created_at DESC
          LIMIT 200
        ");
        $invoices = $stmt->fetchAll();
        echo json_encode($invoices);
        break;

    // ---------------- VIEW INVOICE ----------------
    case 'view':
        header('Content-Type: application/json');
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing id']);
            exit;
        }

        $stmt = $pdo->prepare("
            SELECT i.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone, c.address as customer_address
            FROM invoices i
            JOIN customers c ON c.id = i.customer_id
            WHERE i.id = ?
        ");
        $stmt->execute([$id]);
        $invoice = $stmt->fetch();
        if (!$invoice) {
            http_response_code(404);
            echo json_encode(['error' => 'Invoice not found']);
            exit;
        }

        $stmt = $pdo->prepare("SELECT id, description, quantity, unit_price, line_total FROM invoice_items WHERE invoice_id=?");
        $stmt->execute([$id]);
        $items = $stmt->fetchAll();

        // Calculate subtotal and tax for display
        $subtotal = 0.0;
        foreach ($items as $item) {
            $subtotal += floatval($item['line_total']);
        }
        $tax = floatval($invoice['total']) - $subtotal;

        $invoice['items'] = $items;
        $invoice['subtotal'] = round($subtotal, 2);
        $invoice['tax'] = round($tax, 2);

        echo json_encode($invoice);
        break;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Unknown action']);
}