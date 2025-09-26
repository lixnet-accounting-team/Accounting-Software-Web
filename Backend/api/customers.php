<?php
require_once __DIR__ . "/helpers.php";
require_once __DIR__ . "/utils.php";

// Authenticate first
$user = requireAuth();
$pdo = getDb();

// Handle request method
$method = $_SERVER['REQUEST_METHOD'];

switch($method){
    case 'POST':
        $data=json_decode(file_get_contents("php://input"),true);
        if(!$data || !isset($data['name'],$data['email'],$data['phone'],$data['address'])){
            jsonResponse(["error"=>"Missing required fields"],400);
        }
        $stmt=$pdo->prepare("INSERT INTO customers (name,email,phone,address,created_at) VALUES (?,?,?,?,NOW())");
        $stmt->execute([$data['name'],$data['email'],$data['phone'],$data['address']]);
        jsonResponse(["success"=>true,"message"=>"Customer created successfully"]);
        break;

    case 'GET':
        if(isset($_GET['id'])){
            $stmt=$pdo->prepare("SELECT * FROM customers WHERE id=?");
            $stmt->execute([$_GET['id']]);
            $customer=$stmt->fetch(PDO::FETCH_ASSOC);
            if($customer) jsonResponse($customer);
            else jsonResponse(["error"=>"Customer not found"],404);
        } else {
            $stmt=$pdo->query("SELECT * FROM customers ORDER BY id DESC");
            jsonResponse($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
        break;

    case 'PUT':
        if(!isset($_GET['id'])) jsonResponse(["error"=>"Customer ID is required"],400);
        $data=json_decode(file_get_contents("php://input"),true);
        if(!$data) jsonResponse(["error"=>"No data provided"],400);
        $fields=[];$values=[];
        foreach(['name','email','phone','address'] as $field){
            if(isset($data[$field])){$fields[]="$field=?";$values[]=$data[$field];}
        }
        if(empty($fields)) jsonResponse(["error"=>"No valid fields to update"],400);
        $values[]=$_GET['id'];
        $stmt=$pdo->prepare("UPDATE customers SET ".implode(", ",$fields)." WHERE id=?");
        $stmt->execute($values);
        jsonResponse(["success"=>true,"message"=>"Customer updated successfully"]);
        break;

    case 'DELETE':
        if(!isset($_GET['id'])) jsonResponse(["error"=>"Customer ID is required"],400);
        $stmt=$pdo->prepare("DELETE FROM customers WHERE id=?");
        $stmt->execute([$_GET['id']]);
        jsonResponse(["success"=>true,"message"=>"Customer deleted successfully"]);
        break;

    default:
        jsonResponse(["error"=>"Method not allowed"],405);
}
