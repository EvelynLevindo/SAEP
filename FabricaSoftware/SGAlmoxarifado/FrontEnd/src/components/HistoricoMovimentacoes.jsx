import React, { useState, useMemo } from 'react';
import { History, ArrowDownLeft, ArrowUpRight, Filter, Calendar } from 'lucide-react';

export default function HistoricoMovimentacoes({
  movimentacoes = [],
  produtos = [],
  usuarios = [],
}) {
  const [filtroTipo, setFiltroTipo] = useState('todos'); // 'todos', 'entrada', 'saida'

  // Mapas rápidos para resolver nomes por ID
  const mapProdutos = useMemo(() => {
    return produtos.reduce((acc, p) => {
      acc[String(p.id)] = p;
      return acc;
    }, {});
  }, [produtos]);

  const mapUsuarios = useMemo(() => {
    return usuarios.reduce((acc, u) => {
      acc[String(u.id)] = u;
      return acc;
    }, {});
  }, [usuarios]);

  // Ordena por data decrescente e aplica o filtro
  const movimentacoesTratadas = useMemo(() => {
    return [...movimentacoes]
      .sort((a, b) => new Date(b.data || 0) - new Date(a.data || 0))
      .filter((m) => {
        if (filtroTipo === 'todos') return true;
        return m.tipo === filtroTipo;
      });
  }, [movimentacoes, filtroTipo]);

  // Formata data e hora para o padrão pt-BR
  const formatarData = (isoString) => {
    if (!isoString) return '-';
    try {
      const data = new Date(isoString);
      return data.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="content-panel">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">
            <History size={20} color="var(--primary)" />
            Histórico e Auditoria de Movimentações
          </h2>
          <p className="panel-subtitle">
            Registro cronológico de todas as operações de entrada e saída realizadas no sistema.
          </p>
        </div>

        <div className="search-filter-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="var(--text-secondary)" />
            <select
              className="form-control"
              style={{ width: 'auto', padding: '8px 12px' }}
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="todos">Todas as Operações</option>
              <option value="entrada">Apenas Entradas (+)</option>
              <option value="saida">Apenas Saídas (-)</option>
            </select>
          </div>
        </div>
      </div>

      {movimentacoesTratadas.length === 0 ? (
        <div className="empty-state">
          <History size={48} />
          <h3>Nenhuma movimentação registrada</h3>
          <p>Quando entradas e saídas forem efetuadas, elas aparecerão listadas aqui.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Data e Hora</th>
                <th>Tipo de Operação</th>
                <th>Produto</th>
                <th>SKU</th>
                <th>Operador / Usuário</th>
                <th style={{ textAlign: 'right' }}>Quantidade</th>
              </tr>
            </thead>
            <tbody>
              {movimentacoesTratadas.map((mov) => {
                const prod = mapProdutos[String(mov.produto_id)];
                const user = mapUsuarios[String(mov.usuario_id)];
                const isEntrada = mov.tipo === 'entrada';

                return (
                  <tr key={mov.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        <Calendar size={14} />
                        {formatarData(mov.data)}
                      </div>
                    </td>

                    <td>
                      {isEntrada ? (
                        <span className="badge badge-success">
                          <ArrowDownLeft size={12} /> Entrada
                        </span>
                      ) : (
                        <span className="badge badge-danger">
                          <ArrowUpRight size={12} /> Saída
                        </span>
                      )}
                    </td>

                    <td style={{ fontWeight: 600 }}>
                      {prod ? prod.nome : `Produto #${mov.produto_id}`}
                    </td>

                    <td>
                      <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem' }}>
                        {prod ? prod.sku : '-'}
                      </code>
                    </td>

                    <td>
                      <span style={{ fontWeight: 500 }}>
                        {user ? user.nome : `Usuário #${mov.usuario_id}`}
                      </span>
                      {user && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '6px' }}>
                          ({user.cargo})
                        </span>
                      )}
                    </td>

                    <td
                      style={{
                        textAlign: 'right',
                        fontWeight: 700,
                        color: isEntrada ? 'var(--success-text)' : 'var(--danger-text)',
                        fontSize: '0.95rem',
                      }}
                    >
                      {isEntrada ? `+${mov.quantidade_movimentada}` : `-${mov.quantidade_movimentada}`} un
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
