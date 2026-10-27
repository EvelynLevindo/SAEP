import React from 'react';
import { Boxes, RefreshCw, Server } from 'lucide-react';

export default function Header({ apiOnline, recarregando, onRecarregar }) {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand-wrapper">
          <div className="brand-icon">
            <Boxes size={24} />
          </div>
          <div>
            <h1 className="brand-title">SG Almoxarifado</h1>
            <p className="brand-subtitle">Gestão Integrada de Estoque e Suprimentos</p>
          </div>
        </div>

        <div className="header-actions">
          {/* Indicador de Status da API JSON-Server */}
          <div className={`api-status-badge ${apiOnline ? 'online' : 'offline'}`} title="Status da conexão com o json-server (porta 3001)">
            <span className={`status-dot ${apiOnline ? 'online' : 'offline'}`}></span>
            <Server size={14} />
            <span>API Mock: {apiOnline ? 'Online (3001)' : 'Desconectada'}</span>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={onRecarregar}
            disabled={recarregando}
            title="Atualizar dados do servidor"
          >
            <RefreshCw size={14} className={recarregando ? 'spin-icon' : ''} />
            <span>{recarregando ? 'Atualizando...' : 'Recarregar'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
