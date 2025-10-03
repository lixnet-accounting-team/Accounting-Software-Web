<?php
// backend/api/invoices.php
require_once __DIR__ . "/helpers.php";
require_once __DIR__ . "/utils.php";

// Authenticate first (like customers.php does)
$user = requireAuth();
$pdo = getDb();

// Handle request method
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? null;

switch($method) {
    
    // ---------------- CREATE INVOICE (POST) ----------------
    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (empty($input['items']) || !is_array($input['items'])) {
            jsonResponse(['error' => 'No items provided'], 400);
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
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($row) {
                    $customer_id = $row['id'];
                }
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
            $stmt = $pdo->prepare("INSERT INTO invoices (customer_id, invoice_number, date, due_date, subtotal, tax, total, notes) VALUES (?,?,?,?,?,?,?,?)");
            $stmt->execute([$customer_id, $temp_inv, $date, $due_date, $subtotal, $tax, $total, $notes]);
            $invoice_id = $pdo->lastInsertId();

            $invoice_number = 'INV' . str_pad($invoice_id, 6, '0', STR_PAD_LEFT);
            $stmt = $pdo->prepare("UPDATE invoices SET invoice_number = ? WHERE id = ?");
            $stmt->execute([$invoice_number, $invoice_id]);

            // Insert items
            $stmtItem = $pdo->prepare("INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total) VALUES (?,?,?,?,?)");
            foreach ($input['items'] as $it) {
                $desc = $it['description'] ?? '';
                $qty = max(1, intval($it['quantity'] ?? 1));
                $unit = floatval($it['unit_price'] ?? 0);
                $lineTotal = round($qty * $unit, 2);
                $stmtItem->execute([$invoice_id, $desc, $qty, $unit, $lineTotal]);
            }

            $pdo->commit();

            jsonResponse([
                'success' => true,
                'invoice_id' => (int)$invoice_id,
                'invoice_number' => $invoice_number,
                'total' => $total
            ]);

        } catch (Exception $e) {
            $pdo->rollBack();
            jsonResponse(['error' => 'Failed to create invoice', 'message' => $e->getMessage()], 500);
        }
        break;

    // ---------------- LIST INVOICES (GET) ----------------
    case 'GET':
        // View single invoice by ID
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            
            $stmt = $pdo->prepare("
                SELECT i.*, 
                       c.name as customer_name, 
                       c.email as customer_email, 
                       c.phone as customer_phone, 
                       c.address as customer_address
                FROM invoices i 
                JOIN customers c ON c.id = i.customer_id 
                WHERE i.id = ?
            ");
            $stmt->execute([$id]);
            $invoice = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$invoice) {
                jsonResponse(['error' => 'Invoice not found'], 404);
            }

            // Get invoice items
            $stmt = $pdo->prepare("SELECT * FROM invoice_items WHERE invoice_id = ?");
            $stmt->execute([$id]);
            $invoice['items'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            jsonResponse($invoice);
        } 
        // List all invoices
        else {
            $stmt = $pdo->query("
                SELECT i.id, i.invoice_number, i.date, i.due_date, i.total, i.created_at,
                       c.name as customer_name, c.email as customer_email
                FROM invoices i
                JOIN customers c ON c.id = i.customer_id
                ORDER BY i.created_at DESC
                LIMIT 200
            ");
            $invoices = $stmt->fetchAll(PDO::FETCH_ASSOC);
            jsonResponse($invoices);
        }
        break;

    // ---------------- UPDATE INVOICE (PUT) ----------------
    case 'PUT':
        if (!isset($_GET['id'])) {
            jsonResponse(['error' => 'Invoice ID is required'], 400);
        }

        $id = intval($_GET['id']);
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!$data) {
            jsonResponse(['error' => 'No data provided'], 400);
        }

        $fields = [];
        $values = [];
        
        foreach(['date', 'due_date', 'notes'] as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = ?";
                $values[] = $data[$field];
            }
        }

        if (empty($fields)) {
            jsonResponse(['error' => 'No valid fields to update'], 400);
        }

        $values[] = $id;
        $stmt = $pdo->prepare("UPDATE invoices SET " . implode(", ", $fields) . " WHERE id = ?");
        $stmt->execute($values);

        jsonResponse(['success' => true, 'message' => 'Invoice updated successfully']);
        break;

    // ---------------- DELETE INVOICE (DELETE) ----------------
    case 'DELETE':
        if (!isset($_GET['id'])) {
            jsonResponse(['error' => 'Invoice ID is required'], 400);
        }

        $stmt = $pdo->prepare("DELETE FROM invoices WHERE id = ?");
        $stmt->execute([intval($_GET['id'])]);

        jsonResponse(['success' => true, 'message' => 'Invoice deleted successfully']);
        break;

    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}
