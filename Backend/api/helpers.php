<?php
// backend/api/helpers.php

// Allow cross-origin requests from React frontend
header("Access-Control-Allow-Origin: http://localhost:3000"); 
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// Handle preflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// JSON response helper
function jsonResponse($data, $status = 200) {
    http_response_code($status);
    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode($data);
    exit();
}

// Database connection
function getDb() {
    $DB_HOST = '127.0.0.1';
    $DB_NAME = 'accounting';
    $DB_USER = 'root';
    $DB_PASS = '';

    try {
        $pdo = new PDO(
            "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4",
            $DB_USER,
            $DB_PASS,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
        return $pdo;
    } catch (PDOException $e) {
        jsonResponse(["error" => "Database connection failed: " . $e->getMessage()], 500);
    }
}

// Extract Bearer token
function getBearerToken() {
    $headers = null;

    if (isset($_SERVER['Authorization'])) {
        $headers = trim($_SERVER["Authorization"]);
    } elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
    } elseif (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        if (isset($requestHeaders['Authorization'])) {
            $headers = trim($requestHeaders['Authorization']);
        }
    }

    if (!empty($headers) && preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
        return $matches[1];
    }

    return null;
}

// Validate token and return user
function requireAuth() {
    $pdo = getDb();
    $token = getBearerToken();

    if (!$token) {
        jsonResponse(["error" => "No token provided"], 401);
    }

    $stmt = $pdo->prepare("SELECT t.*, u.id AS user_id, u.name, u.email 
                           FROM api_tokens t
                           JOIN users u ON t.user_id = u.id
                           WHERE t.token = ? AND t.expires_at > NOW()");
    $stmt->execute([$token]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        jsonResponse(["error" => "Invalid or expired token"], 401);
    }

    return $row;
}
