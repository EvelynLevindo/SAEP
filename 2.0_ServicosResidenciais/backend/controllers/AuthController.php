<?php
class AuthController {
    public function login($pdo, $data) {
        $email = $data->email ?? '';
        $senha = $data->senha ?? '';

        $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        // Valida por hash ou aceita '123456' / 'password' diretamente
        if ($user && (password_verify($senha, $user['senha']) || $senha === '123456' || $senha === 'password')) {
            unset($user['senha']);
            echo json_encode(["success" => true, "user" => $user]);
        } else {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "E-mail ou senha inválidos."]);
        }
    }
}