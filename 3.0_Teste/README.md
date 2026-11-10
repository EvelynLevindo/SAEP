# Resolção do Desafio SAEP: Sistema de Gestão para Clínica Veterinária

**Avaliação Prática de Desempenho dos Estudantes - SAEP**

**Tecnologias**: PHP 8.5, PostgreSQL, PDO (Prepared Statements).

**Arquitetura**: MVC Artesanal, Autoload PSR-4 via composer.

---

## Apresentação do Projeto e Visão Geral

- Segurança LGPD.
- Sessão com tempo de expiração.
- Código limpo e princípio SOLID.
- Uso de credenciais.
- Prevenção anti-vulnerabilidade (XSS, SQL, Injection, CSRF).

## Entregas

### Identificação do Projeto

- **Nome do Sistema:** SisVet - Sistema de Gestão Veterinária.
- **Público-Alvo:** Veterinários, recepcionista e gestores da clínica.
- **Problema:** Eliminação dos controles manuais, duplicidade de registro, perda de agendamentos, risco de vazamento de dados (LGPD).

### Requisitos Funcionais (RF)

- **RF-01:** Autenticação do usuário com sessão e expiração --> O sistema deve autenticar o usuário com email e senha (hash de criptografia). Exibir alerta em caso de erro. Sessão deve expirar automaticamente após 15 minutos de inatividade.
- **RF-02:** Logout --> Encerramento da sessão, destruindo os dados do usuário (cookies).
- **RF-03:** Painel principal (Dashboard) --> Tela inicial após fazer o login, deve exibir o nome do usuário logado.
- **RF-04:** Cadastro de Tutores (LGPD) --> Cadastrar infomações dos tutores criptografando dados sensíveis (CPF).
- **RF-05:** Busca e Listegem de Tutores --> Campo de pesquisa por termo e listagem dos resultados.
- **RF-06:** Edição dos Tutores --> Permitir a alteração dos dados dos tutores.
- **RF-07:** Cadastro do Pets com Vìnculo em Tutor --> Cadastro de novo pet associado a um tutor.
- **RF-08:** Listagem dos Pets --> Exibir a lista de pets cadastrados.
- **RF-09:** Agendamento e Listagem de Agendamento --> O sistema deve permitir cadastrar u agendamento e listar ordenadas por data de todos os agendamentos.
- **RF-10:** Atualização de Agendamento --> Permitir alterar as informações do agendamento.

### Requisitos Não Funcionais (RNF)

- **RNF-01:** Arquitetura MVC.
- **RNF-02:** Mapeamento via PSR-04.
- **RNF-03:** Proteção e criptografia.
- **RNF-04:** Armazenamento em banco de dados relacional.

### Diagrama de Entidade Relacionais (DER)

```mermaid

erDiagram
    title "DER - Sistema de Gestão de Clínica Veterinária"

    usuarios {
        int id PK
        varchar nome
        varchar email UNIQUE
        varchar senha_hash
        varchar perfil
        timestamp criado_em
    }

    tutores {
        int id PK
        varchar nome
        varchar cpf_criptografado
        varchar telefone
        varchar email
        timestamp criado_em
    }

    pets {
        int id PK
        int tutor_id FK
        varchar nome
        varchar especie
        varchar raca
        date data_nascimento
        timestamp cadastrado_em
    }

    agendamentos {
        int id PK
        int tutor_id FK
        int pet_id FK
        date data_agendamento
        time hora_agendamento
        varchar servico
        varchar status
        text observacao
        timestamp criado_em
    }

    usuarios ||--o{ agendamento : "agenda/gerencia"
    tutores ||--o{ pets : "possui (1:N)"
    tutores ||--o{ agendamentos : "responsavel (1:N)"
    pets ||--o{ agendamentos : "paciente (1:N)"

```

## Banco de Dados - Script de Criação e População

criação do arquivo schema.sql

## Construção da Aplicação (`sistema/`)

### Composer.json

Configuraçoes so AutoLoad -  PSR-4