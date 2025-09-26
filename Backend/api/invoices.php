<?php
// invoices.php
require 'db.php';

$action = $_GET['action'] ?? 'list';

switch ($action) {

    // ---------------- CREATE INVOICE ----------------
    case 'create':
        header('Content-Type: application/json');
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            $input = $_POST;
        }

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

    // ---------------- LIST INVOICES ----------------
    case 'list':
        $fmt = $_GET['format'] ?? 'html';
        $stmt = $pdo->query("
          SELECT i.id, i.invoice_number, i.date, i.total, c.name as customer_name
          FROM invoices i
          JOIN customers c ON c.id = i.customer_id
          ORDER BY i.created_at DESC
          LIMIT 200
        ");
        $invoices = $stmt->fetchAll();

        if ($fmt === 'json' || strpos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false) {
            header('Content-Type: application/json');
            echo json_encode($invoices);
            exit;
        }

        // HTML output
        ?>
        <!doctype html>
        <html>
        <head><meta charset="utf-8"><title>Invoice list</title>
        <style>
        body{font-family:system-ui, Arial; padding:20px}
        table{border-collapse:collapse; width:100%}
        td,th{border:1px solid #ddd; padding:8px}
        th{background:#f2f2f2}
        a{color:blue}
        </style>
        </head>
        <body>
        <h1>Invoices</h1>
        <table>
          <thead><tr><th>Invoice #</th><th>Date</th><th>Customer</th><th>Total</th><th>View</th></tr></thead>
          <tbody>
            <?php foreach($invoices as $inv): ?>
              <tr>
                <td><?=htmlspecialchars($inv['invoice_number'])?></td>
                <td><?=htmlspecialchars($inv['date'])?></td>
                <td><?=htmlspecialchars($inv['customer_name'])?></td>
                <td><?=number_format($inv['total'],2)?></td>
                <td><a href="?action=view&id=<?=urlencode($inv['id'])?>" target="_blank">View</a></td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
        </body>
        </html>
        <?php
        break;

    // ---------------- VIEW INVOICE ----------------
    case 'view':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        if (!$id) {
            echo "Missing id";
            exit;
        }

        $stmt = $pdo->prepare("SELECT i.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone, c.address as customer_address
                               FROM invoices i JOIN customers c ON c.id = i.customer_id WHERE i.id = ?");
        $stmt->execute([$id]);
        $invoice = $stmt->fetch();
        if (!$invoice) {
            echo "Invoice not found";
            exit;
        }

        $stmt = $pdo->prepare("SELECT * FROM invoice_items WHERE invoice_id = ?");
        $stmt->execute([$id]);
        $items = $stmt->fetchAll();
        ?>
        <!doctype html>
        <html>
        <head>
        <meta charset="utf-8">
        <title><?=htmlspecialchars($invoice['invoice_number'])?></title>
        <style>
        body{font-family:system-ui,Arial; max-width:800px; margin:0 auto; padding:20px}
        .header{display:flex; justify-content:space-between; align-items:flex-start}
        h1{margin:0}
        .table{width:100%; border-collapse:collapse; margin-top:20px}
        .table th, .table td{border:1px solid #ddd; padding:8px}
        .total-row td{font-weight:bold}
        .right{text-align:right}
        .small{font-size:0.9em; color:#666}
        .print-btn{margin-top:15px}
        @media print {
          .print-btn { display:none }
        }
        </style>
        </head>
        <body>
        <div class="header">
          <div>
            <h1>My Company</h1>
            <div class="small">Address line 1<br>Phone: 000-000-000</div>
          </div>
          <div>
            <strong>Invoice</strong><br>
            <?=htmlspecialchars($invoice['invoice_number'])?><br>
            Date: <?=htmlspecialchars($invoice['date'])?><br>
            Due: <?=htmlspecialchars($invoice['due_date'])?>
          </div>
        </div>

        <hr>
        <div>
          <strong>Bill to:</strong><br>
          <?=htmlspecialchars($invoice['customer_name'])?><br>
          <?=nl2br(htmlspecialchars($invoice['customer_address']))?><br>
          <?=htmlspecialchars($invoice['customer_email'])?><br>
          <?=htmlspecialchars($invoice['customer_phone'])?>
        </div>

        <table class="table">
          <thead><tr><th>Description</th><th class="right">Qty</th><th class="right">Unit</th><th class="right">Total</th></tr></thead>
          <tbody>
            <?php foreach($items as $it): ?>
              <tr>
                <td><?=htmlspecialchars($it['description'])?></td>
                <td class="right"><?=intval($it['quantity'])?></td>
                <td class="right"><?=number_format($it['unit_price'],2)?></td>
                <td class="right"><?=number_format($it['total'],2)?></td>
              </tr>
            <?php endforeach; ?>
            <tr class="total-row"><td colspan="3" class="right">Subtotal</td><td class="right"><?=number_format($invoice['subtotal'],2)?></td></tr>
            <tr class="total-row"><td colspan="3" class="right">Tax</td><td class="right"><?=number_format($invoice['tax'],2)?></td></tr>
            <tr class="total-row"><td colspan="3" class="right">Total</td><td class="right"><?=number_format($invoice['total'],2)?></td></tr>
          </tbody>
        </table>

        <?php if (!empty($invoice['notes'])): ?>
          <p><strong>Notes:</strong><br><?=nl2br(htmlspecialchars($invoice['notes']))?></p>
        <?php endif; ?>

        <button class="print-btn" onclick="window.print()">Print / Save PDF</button>
        </body>
        </html>
        <?php
        break;

    default:
        echo "Invalid action";
}
