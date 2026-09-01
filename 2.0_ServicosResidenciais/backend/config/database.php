<?php
function getDB() {
    $host = 'localhost';
    $db   = 'saep_agendamento_db';
    $user = 'postgres';
    $pass = 'postgres';

    $dsn = "pgsql:host=$host;port=5432;dbname=$db;";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    try {
        return new PDO($dsn, $user, $pass, $options);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Erro de conexão: " . $e->getMessage()]);
        exit;
    }
}