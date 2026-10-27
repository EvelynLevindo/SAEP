import React, { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, CheckCircle2, AlertCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { postMovimentacao, patchProduto } from '../services/api';

/**
 * Componente do Formulário de Movimentação de Estoque
 * Responsável por orquestrar a regra de negócio de Entrada e Saída
 * e garantir a consistência transacional do estoque no Front-end.
 */
export default function FormularioMovimentacao({
  produtos = [],
  usuarios = [],
  onMovimentacaoSucesso,
  adicionarToast,
}) {
  // Estados do formulário
  const [produtoId, setProdutoId] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [tipo, setTipo] = useState('entrada'); // 'entrada' ou 'saida'
  const [quantidade, setQuantidade] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erroLocal, setErroLocal] = useState('');

  // Localiza o produto atualmente selecionado para inspeção em tempo real
  const produtoSelecionado = produtos.find((p) => String(p.id) === String(produtoId));

  // Converte a quantidade informada para valor numérico inteiro
  const qtdNumero = Math.floor(Number(quantidade)) || 0;
  const estoqueAtual = produtoSelecionado ? Number(produtoSelecionado.quantidade_estoque) : 0;

  // Cálculo da projeção de estoque resultante
  const novoEstoqueCalculado =
    tipo === 'entrada'
      ? estoqueAtual + qtdNumero
      : estoqueAtual - qtdNumero;

  // Flag que indica se a saída ultrapassa a quantidade disponível
  const saldoInsuficiente = tipo === 'saida' && produtoSelecionado && qtdNumero > estoqueAtual;

  /**
   * Processa a submissão do formulário e aplica as regras de negócio
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroLocal('');

    // Validação 1: Campos obrigatórios
    if (!produtoId) {
      setErroLocal('Selecione um produto para movimentar.');
      return;
    }

    if (!usuarioId) {
      setErroLocal('Selecione o operador responsável.');
      return;
    }

    if (!qtdNumero || qtdNumero <= 0) {
      setErroLocal('A quantidade deve ser um número maior que zero.');
      return;
    }

    /* =========================================================================
       REGRA DE NEGÓCIO PRINCIPAL: Bloqueio de Saída com Saldo Insuficiente
       =========================================================================
       Se a quantidade de saída solicitada for superior ao saldo atual do produto,
       o Front-end aborta a operação e emite um alerta de erro impeditivo.
    */
    if (saldoInsuficiente) {
      const msg = `Saldo insuficiente! Estoque disponível: ${estoqueAtual} un. Tentativa de retirada: ${qtdNumero} un.`;
      setErroLocal(msg);
      if (adicionarToast) {
        adicionarToast(msg, 'erro');
      }
      return;
    }

    setCarregando(true);

    try {
      /* =========================================================================
         REGRA DE NEGÓCIO DE PERSISTÊNCIA (Front-end Transactional Mock)
         Como o json-server é estático, o React orquestra a sequência:
         
         Etapa 1: Gravação do Log de Auditoria (POST /movimentacoes)
         Registra quem fez, qual produto, tipo de operação, quantidade e data/hora.
      */
      const payloadMovimentacao = {
        produto_id: String(produtoId),
        usuario_id: String(usuarioId),
        tipo,
        quantidade_movimentada: qtdNumero,
        data: new Date().toISOString(),
      };

      await postMovimentacao(payloadMovimentacao);

      /* 
         Etapa 2: Atualização do Saldo do Produto (PATCH /produtos/:id)
         Atualiza atomicamente a coluna 'quantidade_estoque' com o novo saldo calculado.
      */
      await patchProduto(produtoId, {
        quantidade_estoque: novoEstoqueCalculado,
      });

      // Feedback de sucesso
      const feedbackMsg = `Sucesso: ${tipo === 'entrada' ? 'Entrada' : 'Saída'} de ${qtdNumero} un de "${produtoSelecionado.nome}" registrada! Novo saldo: ${novoEstoqueCalculado} un.`;
      
      if (adicionarToast) {
        adicionarToast(feedbackMsg, 'sucesso');
      }

      // Limpa os campos do formulário após gravação
      setQuantidade('');
      setErroLocal('');

      // Notifica o componente pai para atualizar a listagem e os KPIs
      if (onMovimentacaoSucesso) {
        onMovimentacaoSucesso();
      }
    } catch (error) {
      console.error('Erro ao processar movimentação:', error);
      const erroMsg = 'Erro de comunicação ao salvar a movimentação no servidor.';
      setErroLocal(erroMsg);
      if (adicionarToast) {
        adicionarToast(erroMsg, 'erro');
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="content-panel" style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div className="panel-header">
        <div>
          <h2 className="panel-title">
            <ArrowLeftRight size={20} color="var(--primary)" />
            Registrar Movimentação de Estoque
          </h2>
          <p className="panel-subtitle">
            Entradas somam ao saldo existente; Saídas debitam com validação automática de estoque mínimo.
          </p>
        </div>
      </div>

      {/* Alerta de Erro / Bloqueio */}
      {erroLocal && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'var(--danger-light)',
            color: 'var(--danger-text)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            fontSize: '0.9rem',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          }}
        >
          <AlertCircle size={18} />
          <span>{erroLocal}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Seletor Visual: Entrada vs Saída */}
        <div className="form-group">
          <label className="form-label">Tipo de Movimentação</label>
          <div className="type-selector-grid">
            <div
              className={`type-option-card ${tipo === 'entrada' ? 'active entrada' : ''}`}
              onClick={() => {
                setTipo('entrada');
                setErroLocal('');
              }}
            >
              <ArrowDownLeft size={22} color={tipo === 'entrada' ? 'var(--primary)' : 'var(--text-secondary)'} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>Entrada de Estoque</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Reposição / Compra (+ Soma)</span>
              </div>
            </div>

            <div
              className={`type-option-card ${tipo === 'saida' ? 'active saida' : ''}`}
              onClick={() => {
                setTipo('saida');
                setErroLocal('');
              }}
            >
              <ArrowUpRight size={22} color={tipo === 'saida' ? 'var(--danger)' : 'var(--text-secondary)'} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>Saída de Estoque</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Consumo / Retirada (- Subtrai)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seleção do Produto */}
        <div className="form-group">
          <label className="form-label">
            <span>Produto</span>
            {produtoSelecionado && (
              <span className="form-label-hint">
                SKU: {produtoSelecionado.sku} | Estoque Atual: <strong>{produtoSelecionado.quantidade_estoque} un</strong>
              </span>
            )}
          </label>
          <select
            className="form-control"
            value={produtoId}
            onChange={(e) => {
              setProdutoId(e.target.value);
              setErroLocal('');
            }}
            required
          >
            <option value="">Selecione o produto...</option>
            {produtos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} (Saldo atual: {p.quantidade_estoque} un)
              </option>
            ))}
          </select>
        </div>

        {/* Seleção do Usuário Operador */}
        <div className="form-group">
          <label className="form-label">Operador Responsável</label>
          <select
            className="form-control"
            value={usuarioId}
            onChange={(e) => setUsuarioId(e.target.value)}
            required
          >
            <option value="">Selecione quem está realizando a operação...</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nome} — Cargo: {u.cargo}
              </option>
            ))}
          </select>
        </div>

        {/* Quantidade a Movimentar */}
        <div className="form-group">
          <label className="form-label">Quantidade de Unidades</label>
          <input
            type="number"
            className="form-control"
            placeholder="Ex: 5"
            min="1"
            value={quantidade}
            onChange={(e) => {
              setQuantidade(e.target.value);
              setErroLocal('');
            }}
            required
          />
        </div>

        {/* Prévia de Simulação do Saldo */}
        {produtoSelecionado && qtdNumero > 0 && (
          <div
            className="stock-preview-box"
            style={{
              borderColor: saldoInsuficiente ? 'var(--danger)' : 'var(--primary)',
              background: saldoInsuficiente ? 'var(--danger-light)' : '#f8fafc',
            }}
          >
            <div className="preview-col">
              <span className="preview-label">Saldo Atual</span>
              <span className="preview-value">{estoqueAtual} un</span>
            </div>

            <div style={{ color: 'var(--text-muted)' }}>
              {tipo === 'entrada' ? '+' : '-'} {qtdNumero} un
            </div>

            <div className="preview-col" style={{ textAlign: 'right' }}>
              <span className="preview-label">Novo Saldo Projetado</span>
              <span
                className="preview-value"
                style={{
                  color: saldoInsuficiente
                    ? 'var(--danger)'
                    : novoEstoqueCalculado <= 5
                    ? 'var(--warning)'
                    : 'var(--success)',
                }}
              >
                {saldoInsuficiente ? 'Estoque Insuficiente' : `${novoEstoqueCalculado} un`}
              </span>
            </div>
          </div>
        )}

        {/* Botão de Gravação */}
        <button
          type="submit"
          disabled={carregando || saldoInsuficiente || !produtoId || !usuarioId || qtdNumero <= 0}
          className={`btn ${tipo === 'entrada' ? 'btn-primary' : 'btn-danger'}`}
          style={{ width: '100%', padding: '12px', marginTop: '12px', fontSize: '1rem' }}
        >
          {carregando ? (
            'Processando atualização...'
          ) : saldoInsuficiente ? (
            <>
              <AlertTriangle size={18} /> Saldo Insuficiente para Saída
            </>
          ) : tipo === 'entrada' ? (
            <>
              <ArrowDownLeft size={18} /> Confirmar Entrada de Estoque
            </>
          ) : (
            <>
              <ArrowUpRight size={18} /> Confirmar Saída de Estoque
            </>
          )}
        </button>
      </form>
    </div>
  );
}
