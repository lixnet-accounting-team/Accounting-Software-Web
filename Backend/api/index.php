<?php
require_once __DIR__ . "/helpers.php";
require_once __DIR__ . "/utils.php";

$route = $_GET['route'] ?? null;
if(!$route) jsonResponse(["error"=>"No route specified"],400);

$parts=explode('/',$route);
$module=$parts[0];
$action=$parts[1]??null;

switch($module){
    case "auth": require __DIR__."/auth.php"; break;
    case "customers": require __DIR__."/customers.php"; break;
    case "reports": require __DIR__."/reports.php"; break;
    default: jsonResponse(["error"=>"Unknown module '$module'"],404);
}
