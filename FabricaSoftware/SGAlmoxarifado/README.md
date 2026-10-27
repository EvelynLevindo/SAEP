# SG Almoxarifado — Sistema de Gestão de Almoxarifado

Sistema completo para controle de estoque, inventário e auditoria de movimentações (entradas e saídas de materiais).

---

## 🏗️ Arquitetura do Projeto

- **Front-end:** React (Functional Components & Hooks: `useState`, `useEffect`, `useCallback`, `useMemo`), Vite, Axios e Lucide React para ícones modernos.
- **Back-end (Mock):** `json-server` simulando uma API RESTful persistente em arquivo JSON.
- **Estilização:** CSS Moderno com Design System responsivo, variáveis CSS, badges de estoque, alertas e sistema de notificações flutuantes (*toast*).

---

## 📋 Regras de Negócio e Funcionalidades

1. **Entrada de Estoque (+):**
   - Registra o log em `POST /movimentacoes`.
   - Atualiza o estoque do produto somando a quantidade via `PATCH /produtos/:id`.
2. **Saída de Estoque (-):**
   - **Validação de Saldo:** O sistema valida em tempo real se a quantidade requisitada é maior do que o estoque disponível. Caso seja maior, a ação é **bloqueada** com mensagem de erro impeditiva.
   - Se houver saldo suficiente, registra o log em `POST /movimentacoes` e subtrai o saldo via `PATCH /produtos/:id`.
3. **Indicadores e Dashboard (KPIs):**
   - Total de tipos de produtos cadastrados.
   - Unidades físicas totais em estoque.
   - Alertas de itens em nível crítico ($\le$ 5 unidades).
   - Total de movimentações auditadas.
4. **Inventário & Busca:**
   - Filtro em tempo real por nome e código SKU.
   - Filtros por nível de estoque (Crítico, Atenção e Normal).
   - Cadastro ágil de novos produtos via modal.
5. **Histórico e Auditoria:**
   - Log completo com data/hora em formato pt-BR, identificação do operador, produto, SKU e variação de quantidade.

---

## 🚀 Como Executar o Projeto

Abra dois terminais na pasta raiz do projeto:

### 1. Iniciar o Mock da API (json-server)
```bash
npx json-server --watch BackEnd/db.json --port 3001
```
> A API estará disponível em: `http://localhost:3001`

### 2. Iniciar a Aplicação React
```bash
cd frontend
npm install
npm run dev
```
> O Frontend estará disponível em: `http://localhost:5173`
