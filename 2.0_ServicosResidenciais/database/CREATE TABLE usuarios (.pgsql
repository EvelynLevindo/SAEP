CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    documento VARCHAR(20) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(100),
    endereco TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recursos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    especialidade VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'Ativo'
);

CREATE TABLE agendamentos (
    id SERIAL PRIMARY KEY,
    cliente_id INT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    recurso_id INT NOT NULL REFERENCES recursos(id) ON DELETE CASCADE,
    data_agendamento DATE NOT NULL,
    hora_agendamento TIME NOT NULL,
    servico VARCHAR(255),
    observacao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unq_agendamento_recurso UNIQUE (recurso_id, data_agendamento, hora_agendamento)
);

-- Inserindo usuário de teste (senha: 123456)
INSERT INTO usuarios (nome, email, senha) VALUES 
('Administrador', 'admin@admin.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Inserindo clientes
INSERT INTO clientes (nome, documento, telefone, email, endereco) VALUES 
('João Silva', '11122233344', '11999999999', 'joao@email.com', 'Rua A, 123'),
('Maria Oliveira', '22233344455', '11888888888', 'maria@email.com', 'Rua B, 456'),
('Carlos Souza', '33344455566', '11777777777', 'carlos@email.com', 'Av C, 789'),
('Ana Paula', '44455566677', '11666666666', 'ana@email.com', 'Rua D, 101'),
('Pedro Santos', '55566677788', '11555555555', 'pedro@email.com', 'Rua E, 202');

-- Inserindo especialistas (recursos)
INSERT INTO recursos (nome, especialidade, status) VALUES 
('Roberto Carlos', 'Eletricista', 'Ativo'),
('Marcos Almeida', 'Eletricista', 'Ativo'),
('Paulo Silva', 'Encanador', 'Ativo'),
('José Ferreira', 'Encanador', 'Ativo'),
('Fernando Mendes', 'Técnico de Ar-condicionado', 'Ativo');

ALTER TABLE agendamentos RENAME COLUMN data_agendamento TO data_hora;

ALTER TABLE agendamentos ADD COLUMN IF NOT EXISTS data_hora TIMESTAMP;