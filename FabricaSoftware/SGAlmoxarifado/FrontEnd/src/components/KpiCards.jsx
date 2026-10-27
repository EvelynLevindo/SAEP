import React from 'react';
import { Package, Layers, AlertTriangle, ArrowLeftRight } from 'lucide-react';

export default function KpiCards({ produtos = [], movimentacoes = [] }) {
  // Total de tipos de produtos distintos
  const totalProdutos = produtos.length;

  // Soma de todas as unidades físicas em estoque
  const totalUnidades = produtos.reduce((acc, p) => acc + (Number(p.quantidade_estoque) || 0), 0);

  // Produtos em situação crítica (estoque menor ou igual a 5 unidades)
  const produtosCriticos = produtos.filter((p) => Number(p.quantidade_estoque) <= 5).length;

  // Total de transações registradas
  const totalMovimentacoes = movimentacoes.length;

  return (
    <div className="kpi-grid">
      {/* Card 1: Tipos de Produtos */}
      <div className="kpi-card">
        <div className="kpi-info">
          <h4>Produtos Cadastrados</h4>
          <div className="kpi-value">{totalProdutos}</div>
        </div>
        <div className="kpi-icon-box blue">
          <Package size={24} />
        </div>
      </div>

      {/* Card 2: Saldo Físico Total */}
      <div className="kpi-card">
        <div className="kpi-info">
          <h4>Unidades em Estoque</h4>
          <div className="kpi-value">{totalUnidades} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>un</span></div>
        </div>
        <div className="kpi-icon-box emerald">
          <Layers size={24} />
        </div>
      </div>

      {/* Card 3: Alertas de Estoque Crítico */}
      <div className="kpi-card">
        <div className="kpi-info">
          <h4>Estoque Crítico (≤ 5 un)</h4>
          <div className="kpi-value" style={{ color: produtosCriticos > 0 ? 'var(--danger)' : 'var(--text-primary)' }}>
            {produtosCriticos}
          </div>
        </div>
        <div className="kpi-icon-box amber">
          <AlertTriangle size={24} />
        </div>
      </div>

      {/* Card 4: Total de Movimentações */}
      <div className="kpi-card">
        <div className="kpi-info">
          <h4>Movimentações Totais</h4>
          <div className="kpi-value">{totalMovimentacoes}</div>
        </div>
        <div className="kpi-icon-box purple">
          <ArrowLeftRight size={24} />
        </div>
      </div>
    </div>
  );
}
