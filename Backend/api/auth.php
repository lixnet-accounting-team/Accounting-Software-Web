<?php
require_once __DIR__ . "/helpers.php";
require_once __DIR__ . "/utils.php";

// Handle auth actions
$action = $_GET['action'] ?? '';
handleAuth($action);

function handleAuth($action) {
    switch ($action) {
        case "register": registerUser(); break;
        case "login": loginUser(); break;
        case "logout": logoutUser(); break;
        default: jsonResponse(["error" => "Unknown auth action"], 400);
    }
}

// Register user
function registerUser() {
    $pdo = getDb();
    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input['name'], $input['email'], $input['password'])) {
        jsonResponse(["error" => "Missing fields"], 400);
    }

    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$input['email']]);
    if ($stmt->fetch()) {
        jsonResponse(["error" => "Email already registered"], 400);
    }

    $hash = password_hash($input['password'], PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (name,email,password_hash,created_at) VALUES (?,?,?,NOW())");
    $stmt->execute([$input['name'],$input['email'],$hash]);

    jsonResponse(["success"=>true,"message"=>"User registered"]);
}

// Login user
function loginUser() {
    $pdo = getDb();
    $input = json_decode(file_get_contents("php://input"), true);

    if (!$input || !isset($input['email'], $input['password'])) {
        jsonResponse(["error"=>"Missing fields"],400);
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email=?");
    $stmt->execute([$input['email']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($input['password'], $user['password_hash'])) {
        jsonResponse(["error"=>"Invalid credentials"],401);
    }

    $token = bin2hex(random_bytes(32));
    $expires = date("Y-m-d H:i:s", strtotime("+1 day"));
    $stmt = $pdo->prepare("INSERT INTO api_tokens (user_id, token, expires_at) VALUES (?,?,?)");
    $stmt->execute([$user['id'],$token,$expires]);

    jsonResponse([
        "success"=>true,
        "token"=>$token,
        "expires_at"=>$expires,
        "user"=>[
            "id"=>$user['id'],
            "name"=>$user['name'],
            "email"=>$user['email']
        ]
    ]);
}

// Logout user
function logoutUser() {
    $pdo = getDb();
    $token = getBearerToken();

    if(!$token) jsonResponse(["error"=>"No token provided"],401);

    $stmt=$pdo->prepare("DELETE FROM api_tokens WHERE token=?");
    $stmt->execute([$token]);

    jsonResponse(["success"=>true,"message"=>"Logged out"]);
}
