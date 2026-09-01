<?php
class ClienteController {
    public function listar($pdo) {
        $stmt = $pdo->query("SELECT * FROM clientes ORDER BY id DESC");
        echo json_encode($stmt->fetchAll());
    }

    public function criar($pdo, $data) {
        // Validação dos campos obrigatórios no backend
        if (!$data || empty(trim($data->nome ?? '')) || empty(trim($data->documento ?? ''))) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Nome e Documento/CPF são obrigatórios."]);
            return;
        }

        $sql = "INSERT INTO clientes (nome, documento, telefone, email, endereco) VALUES (?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);

        try {
            $stmt->execute([
                trim($data->nome),
                trim($data->documento),
                trim($data->telefone ?? ''),
                trim($data->email ?? ''),
                trim($data->endereco ?? '')
            ]);

            http_response_code(201);
            echo json_encode(["success" => true, "message" => "Cliente cadastrado com sucesso!"]);
        } catch (PDOException $e) {
            http_response_code(400);
            // Erro 23505 = Restrição UNIQUE violada no PostgreSQL (CPF/Documento duplicado)
            if ($e->getCode() == '23505') {
                echo json_encode(["success" => false, "message" => "Este CPF/Documento já está cadastrado."]);
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Erro ao salvar cliente no banco de dados."]);
            }
        }
    }

    public function excluir($pdo, $id) {
        try {
            $stmt = $pdo->prepare("DELETE FROM clientes WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(["success" => true, "message" => "Cliente removido com sucesso."]);
        } catch (PDOException $e) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Não é possível excluir clientes com agendamentos vinculados."]);
        }
    }
}