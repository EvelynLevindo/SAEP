import React, { useState } from 'react';
import { X, PlusCircle, Package } from 'lucide-react';
import { postProduto } from '../services/api';

export default function ModalNovoProduto({ aberto, onFechar, onSucesso, adicionarToast }) {
  const [nome, setNome] = useState('');
  const [sku, setSku] = useState('');
  const [quantidade, setQuantidade] = useState('0');
  const [salvando, setSalvando] = useState(false);

  if (!aberto) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome.trim() || !sku.trim()) {
      if (adicionarToast) adicionarToast('Preencha o nome e o código SKU do produto.', 'erro');
      return;
    }

    const qtdNum = Math.max(0, parseInt(quantidade, 10) || 0);

    setSalvando(true);
    try {
      await postProduto({
        nome: nome.trim(),
        sku: sku.trim().toUpperCase(),
        quantidade_estoque: qtdNum,
      });

      if (adicionarToast) {
        adicionarToast(`Produto "${nome}" cadastrado com sucesso!`, 'sucesso');
      }

      setNome('');
      setSku('');
      setQuantidade('0');
      onSucesso();
      onFechar();
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      if (adicionarToast) {
        adicionarToast('Erro ao cadastrar novo produto no servidor.', 'erro');
      }
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={22} color="var(--primary)" />
            <h3 className="modal-title">Cadastrar Novo Produto</h3>
          </div>
          <button className="modal-close-btn" onClick={onFechar}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nome / Descrição do Produto</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ex: Headset Gamer USB"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Código SKU</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ex: HED-GAM-005"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Estoque Inicial (Unidades)</label>
            <input
              type="number"
              min="0"
              className="form-control"
              placeholder="0"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onFechar} disabled={salvando}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={salvando}>
              <PlusCircle size={16} />
              <span>{salvando ? 'Salvando...' : 'Salvar Produto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
