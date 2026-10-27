import axios from 'axios';

// Criação da instância Axios apontando para a porta do json-server
const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

/* ==========================================================================
   SERVIÇO DE PRODUTOS
   ========================================================================== */

/**
 * Busca todos os produtos cadastrados
 */
export const getProdutos = async () => {
  const response = await api.get('/produtos');
  return response.data;
};

/**
 * Busca um produto específico pelo ID
 * @param {string|number} id
 */
export const getProdutoById = async (id) => {
  const response = await api.get(`/produtos/${id}`);
  return response.data;
};

/**
 * Atualiza campos específicos de um produto (usado para ajustar o saldo de estoque)
 * @param {string|number} id
 * @param {object} dados - Ex: { quantidade_estoque: 30 }
 */
export const patchProduto = async (id, dados) => {
  const response = await api.patch(`/produtos/${id}`, dados);
  return response.data;
};

/**
 * Cadastra um novo produto no almoxarifado
 * @param {object} produto - { nome, sku, quantidade_estoque }
 */
export const postProduto = async (produto) => {
  const response = await api.post('/produtos', produto);
  return response.data;
};

/**
 * Remove um produto pelo ID
 * @param {string|number} id
 */
export const deleteProduto = async (id) => {
  const response = await api.delete(`/produtos/${id}`);
  return response.data;
};

/* ==========================================================================
   SERVIÇO DE USUÁRIOS
   ========================================================================== */

/**
 * Busca a lista de usuários/operadores do almoxarifado
 */
export const getUsuarios = async () => {
  const response = await api.get('/usuarios');
  return response.data;
};

/* ==========================================================================
   SERVIÇO DE MOVIMENTAÇÕES
   ========================================================================== */

/**
 * Busca todas as movimentações registradas
 */
export const getMovimentacoes = async () => {
  const response = await api.get('/movimentacoes');
  return response.data;
};

/**
 * Registra uma nova movimentação no histórico
 * @param {object} movimentacao - { produto_id, usuario_id, tipo, quantidade_movimentada, data }
 */
export const postMovimentacao = async (movimentacao) => {
  const response = await api.post('/movimentacoes', movimentacao);
  return response.data;
};

/* ==========================================================================
   DIAGNÓSTICO E SAÚDE DA API
   ========================================================================== */

/**
 * Verifica se o json-server está respondendo
 */
export const checkApiHealth = async () => {
  try {
    await api.get('/produtos');
    return true;
  } catch {
    return false;
  }
};

export default api;
