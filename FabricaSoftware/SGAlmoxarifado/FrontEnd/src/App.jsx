import React, { useState, useEffect, useCallback } from 'react';
import { Package, ArrowLeftRight, History, CheckCircle, AlertCircle, Info, Sparkles } from 'lucide-react';
import { getProdutos, getUsuarios, getMovimentacoes, checkApiHealth } from './services/api';
import Header from './components/Header';
import KpiCards from './components/KpiCards';
import ListaProdutos from './components/ListaProdutos';
import FormularioMovimentacao from './components/FormularioMovimentacao';
import HistoricoMovimentacoes from './components/HistoricoMovimentacoes';
import ModalNovoProduto from './components/ModalNovoProduto';

export default function App() {
  // Estados principais
  const [produtos, setProdutos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [apiOnline, setApiOnline] = useState(false);
  const [recarregando, setRecarregando] = useState(false);

  // Navegação por abas
  const [abaAtiva, setAbaAtiva] = useState('estoque'); // 'estoque', 'movimentar', 'historico'
  
  // Controle de Modais
  const [modalNovoAberto, setModalNovoAberto] = useState(false);

  // Sistema de Notificações Toast
  const [toasts, setToasts] = useState([]);

  const adicionarToast = useCallback((texto, tipo = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, texto, tipo }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // Busca todos os dados da API
  const carregarDados = useCallback(async () => {
    setRecarregando(true);
    try {
      const isOnline = await checkApiHealth();
      setApiOnline(isOnline);

      if (isOnline) {
        const [listaProdutos, listaUsuarios, listaMovimentacoes] = await Promise.all([
          getProdutos(),
          getUsuarios(),
          getMovimentacoes(),
        ]);
        setProdutos(listaProdutos);
        setUsuarios(listaUsuarios);
        setMovimentacoes(listaMovimentacoes);
      } else {
        adicionarToast(
          'Aviso: O mock json-server não foi detectado em http://localhost:3001. Inicie-o para salvar dados.',
          'erro'
        );
      }
    } catch (error) {
      console.error('Erro ao sincronizar com o json-server:', error);
      setApiOnline(false);
      adicionarToast('Erro de conexão ao carregar dados do almoxarifado.', 'erro');
    } finally {
      setRecarregando(false);
    }
  }, [adicionarToast]);

  // Carregamento inicial
  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // Handler de atalho ao clicar em "Movimentar" na lista
  const handleSelecionarParaMovimentar = (id) => {
    setAbaAtiva('movimentar');
  };

  return (
    <div className="app-layout">
      {/* Cabeçalho */}
      <Header
        apiOnline={apiOnline}
        recarregando={recarregando}
        onRecarregar={carregarDados}
      />

      <main className="main-content">
        {/* Banner informativo quando offline */}
        {!apiOnline && !recarregando && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#991b1b',
            }}
          >
            <AlertCircle size={24} />
            <div>
              <strong style={{ display: 'block' }}>Servidor Mock Desconectado</strong>
              <span style={{ fontSize: '0.85rem' }}>
                Certifique-se de executar no terminal:{' '}
                <code>npx json-server --watch BackEnd/db.json --port 3001</code>
              </span>
            </div>
          </div>
        )}

        {/* Painel de Indicadores / KPIs */}
        <KpiCards produtos={produtos} movimentacoes={movimentacoes} />

        {/* Navegação por Abas */}
        <nav className="tabs-nav">
          <button
            className={`tab-btn ${abaAtiva === 'estoque' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('estoque')}
          >
            <Package size={18} />
            <span>Inventário de Produtos ({produtos.length})</span>
          </button>

          <button
            className={`tab-btn ${abaAtiva === 'movimentar' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('movimentar')}
          >
            <ArrowLeftRight size={18} />
            <span>Registrar Movimentação</span>
          </button>

          <button
            className={`tab-btn ${abaAtiva === 'historico' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('historico')}
          >
            <History size={18} />
            <span>Histórico de Operações ({movimentacoes.length})</span>
          </button>
        </nav>

        {/* Conteúdo Dinâmico por Aba */}
        {abaAtiva === 'estoque' && (
          <ListaProdutos
            produtos={produtos}
            onAbrirModalNovo={() => setModalNovoAberto(true)}
            onSelecionarParaMovimentar={handleSelecionarParaMovimentar}
          />
        )}

        {abaAtiva === 'movimentar' && (
          <FormularioMovimentacao
            produtos={produtos}
            usuarios={usuarios}
            onMovimentacaoSucesso={() => {
              carregarDados();
            }}
            adicionarToast={adicionarToast}
          />
        )}

        {abaAtiva === 'historico' && (
          <HistoricoMovimentacoes
            movimentacoes={movimentacoes}
            produtos={produtos}
            usuarios={usuarios}
          />
        )}
      </main>

      {/* Modal de Cadastro de Novo Produto */}
      <ModalNovoProduto
        aberto={modalNovoAberto}
        onFechar={() => setModalNovoAberto(false)}
        onSucesso={() => carregarDados()}
        adicionarToast={adicionarToast}
      />

      {/* Container de Toasts / Notificações Flutuantes */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.tipo}`}>
            {toast.tipo === 'sucesso' && <CheckCircle size={18} />}
            {toast.tipo === 'erro' && <AlertCircle size={18} />}
            {toast.tipo === 'info' && <Info size={18} />}
            <span>{toast.texto}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
