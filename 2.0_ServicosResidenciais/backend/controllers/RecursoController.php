<?php
class RecursoController {
    public function listar($pdo) {
        $stmt = $pdo->query("SELECT * FROM recursos WHERE status = 'Ativo' ORDER BY nome");
        echo json_encode($stmt->fetchAll());
    }
}