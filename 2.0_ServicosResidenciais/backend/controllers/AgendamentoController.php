<?php
class AgendamentoController {

    public function listar($pdo) {
        try {
            $sql = "SELECT a.id, a.cliente_id, a.recurso_id, a.data_hora, a.observacao,
                           c.nome AS cliente_nome, r.nome AS recurso_nome
                    FROM agendamentos a
                    LEFT JOIN clientes c ON a.cliente_id = c.id
                    LEFT JOIN recursos r ON a.recurso_id = r.id
                    ORDER BY a.id DESC";
            
            $stmt = $pdo->query($sql);
            $dados = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Converte espaço em 'T' para o Angular reconhecer como data válida
            foreach ($dados as &$item) {
                if (!empty($item['data_hora'])) {
                    $item['data_hora'] = str_replace(' ', 'T', $item['data_hora']);
                }
            }

            echo json_encode($dados);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Erro na busca: " . $e->getMessage()]);
        }
    }

    public function criar($pdo, $data) {
        if (!$data || empty($data->cliente_id) || empty($data->recurso_id) || empty($data->data_hora)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Preencha todos os campos obrigatórios."]);
            return;
        }

        $dataHoraFormatada = str_replace('T', ' ', $data->data_hora);

        $sql = "INSERT INTO agendamentos (cliente_id, recurso_id, data_hora, observacao) VALUES (?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);

        try {
            $stmt->execute([
                (int)$data->cliente_id,
                (int)$data->recurso_id,
                $dataHoraFormatada,
                trim($data->observacao ?? '')
            ]);

            http_response_code(201);
            echo json_encode(["success" => true, "message" => "Agendamento cadastrado com sucesso!"]);
        } catch (PDOException $e) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Erro ao salvar: " . $e->getMessage()]);
        }
    }

    public function excluir($pdo, $id) {
        try {
            $stmt = $pdo->prepare("DELETE FROM agendamentos WHERE id = ?");
            $stmt->execute([(int)$id]);
            echo json_encode(["success" => true, "message" => "Agendamento excluído com sucesso."]);
        } catch (PDOException $e) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Erro ao excluir agendamento."]);
        }
    }
}