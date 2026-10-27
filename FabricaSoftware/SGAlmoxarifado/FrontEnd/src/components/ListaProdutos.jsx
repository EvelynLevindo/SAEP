import React, { useState, useMemo } from 'react';
import { Search, Plus, Package, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function ListaProdutos({
  produtos = [],
  onAbrirModalNovo,
  onSelecionarParaMovimentar,
}) {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos'); // 'todos', 'critico', 'baixo', 'normal'

  // Filtra os produtos com base na busca e no status de estoque
  const produtosFiltrados = useMemo(() => {
    return produtos.filter((produto) => {
      const nomeMatch = produto.nome.toLowerCase().includes(busca.toLowerCase());
      const skuMatch = produto.sku.toLowerCase().includes(busca.toLowerCase());
      const matchesSearch = nomeMatch || skuMatch;

      const qtd = Number(produto.quantidade_estoque) || 0;

      if (!matchesSearch) return false;

      if (filtroStatus === 'critico') return qtd <= 5;
      if (filtroStatus === 'baixo') return qtd > 5 && qtd <= 15;
      if (filtroStatus === 'normal') return qtd > 15;

      return true;
    });
  }, [produtos, busca, filtroStatus]);

  // Função auxiliar para renderizar a tag de nível de estoque
  const renderBadgeEstoque = (qtd) => {
    const qtdNum = Number(qtd) || 0;
    if (qtdNum <= 5) {
      return (
        <span className="badge badge-danger">
          <AlertCircle size={12} /> Crítico ({qtdNum} un)
        </span>
      );
    }
    if (qtdNum <= 15) {
      return (
        <span className="badge badge-warning">
          <Clock size={12} /> Atenção ({qtdNum} un)
        </span>
      );
    }
    return (
      <span className="badge badge-success">
        <CheckCircle size={12} /> Normal ({qtdNum} un)
      </span>
    );
  };

  return (
    <div className="content-panel">
      {/* Cabeçalho da Lista com Busca e Ações */}
      <div className="panel-header">
        <div>
          <h2 className="panel-title">
            <Package size={20} color="var(--primary)" />
            Inventário de Produtos
          </h2>
          <p className="panel-subtitle">
            Catálogo completo de materiais e saldo em tempo real no almoxarifado.
          </p>
        </div>

        <div className="search-filter-bar">
          {/* Campo de Busca */}
          <div className="search-input-wrapper">
            <Search size={16} />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por nome ou SKU..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          {/* Filtro por Nível */}
          <select
            className="form-control"
            style={{ width: 'auto', padding: '8px 12px' }}
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="todos">Todos os Níveis</option>
            <option value="critico">🔴 Crítico (≤ 5)</option>
            <option value="baixo">🟡 Atenção (6 - 15)</option>
            <option value="normal">🟢 Normal (&gt; 15)</option>
          </select>

          {/* Botão Novo Produto */}
          <button className="btn btn-primary" onClick={onAbrirModalNovo}>
            <Plus size={16} />
            <span>Novo Produto</span>
          </button>
        </div>
      </div>

      {/* Tabela de Produtos */}
      {produtosFiltrados.length === 0 ? (
        <div className="empty-state">
          <Package size={48} />
          <h3>Nenhum produto encontrado</h3>
          <p>Tente alterar os termos de busca ou cadastre um novo item.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Código / SKU</th>
                <th>Descrição do Produto</th>
                <th>Status do Nível</th>
                <th style={{ textAlign: 'right' }}>Estoque Atual</th>
                <th style={{ textAlign: 'center' }}>Ações Rápidas</th>
              </tr>
            </thead>
            <tbody>
              {produtosFiltrados.map((prod) => (
                <tr key={prod.id}>
                  <td>
                    <code style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600 }}>
                      {prod.sku}
                    </code>
                  </td>
                  <td style={{ fontWeight: 600 }}>{prod.nome}</td>
                  <td>{renderBadgeEstoque(prod.quantidade_estoque)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700, fontSize: '1rem' }}>
                    {prod.quantidade_estoque}{' '}
                    <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-secondary)' }}>un</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onSelecionarParaMovimentar(prod.id)}
                      title="Registrar entrada ou saída deste item"
                    >
                      Movimentar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
