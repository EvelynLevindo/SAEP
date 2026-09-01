<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'config/database.php';
require 'controllers/AuthController.php';
require 'controllers/ClienteController.php';
require 'controllers/RecursoController.php';
require 'controllers/AgendamentoController.php';

$pdo = getDB();
$uri = rtrim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"));

// Rota raiz para teste
if ($uri === '' || $uri === '/index.php') {
    echo json_encode(["status" => "API Online", "mensagem" => "Backend rodando com sucesso!"]);
    exit;
}

// Roteamento de APIs
if (strpos($uri, '/api/login') !== false && $method == 'POST') {
    (new AuthController())->login($pdo, $data);
} 
elseif (strpos($uri, '/api/clientes') !== false) {
    $ctrl = new ClienteController();
    if ($method == 'GET') $ctrl->listar($pdo);
    if ($method == 'POST') $ctrl->criar($pdo, $data);
    if ($method == 'DELETE') {
        $id = basename($uri);
        $ctrl->excluir($pdo, $id);
    }
}
elseif (strpos($uri, '/api/recursos') !== false && $method == 'GET') {
    (new RecursoController())->listar($pdo);
}
elseif (strpos($uri, '/api/agendamentos') !== false) {
    $ctrl = new AgendamentoController();
    if ($method == 'GET') $ctrl->listar($pdo);
    if ($method == 'POST') $ctrl->criar($pdo, $data);
}
else {
    http_response_code(404);
    echo json_encode(["message" => "Rota não encontrada"]);
}