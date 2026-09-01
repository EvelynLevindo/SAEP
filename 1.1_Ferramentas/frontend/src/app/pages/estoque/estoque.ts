import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Api } from '../../service/api';

@Component({
  selector: 'app-estoque',
  imports: [FormsModule, RouterLink],
  templateUrl: './estoque.html',
  styleUrl: './estoque.css',
})
export class Estoque {
  produtos: any[] = []; // Vetor para armazenar os produtos
  movimentacao: any[] = []; // Vetor para armazenar as movimentações
  novaMovimentacao = {produto:{id:null}, usuario:{id:null}, tipo: "", quantidade: 0, dataMovimentacao: ""};
  constructor(private api: Api) {}

  // Carregar
  carregar() {
    this.api.getMovimentacao().subscribe(res => this.movimentacao = res);
    this.api.getProdutos().subscribe(res => this.produtos = res);
    this.ordenarProdutos();
  }

  // Ordenar as movimentações por produto e em ordem alfabética
  ordenarProdutos() { // CSR
    this.movimentacao.sort((a, b) => a.produto.nome.localCompare (b.produto.nome)); // Ordena a lista de movimentações em ordem alfabética 
    this.produtos.sort((a, b) => a.nome.localCompare (b.nome)); // Ordena a lista de produtos em ordem alfabética do nome do produto
  }

  // Registra a movimentação
  registrarMovimentacao() {
    // Validar se a quantidade é maior que a solicitada
    const produtoSel = this.produtos.find(p => p.id === this.novaMovimentacao.produto.id) // Procurando se o produto existe
    if(this.novaMovimentacao.tipo === "saida" && this.novaMovimentacao.quantidade >= produtoSel.estoqueAtual) {
      alert("Erro, quantidade de daída maior que a quantidade em estoque")
    }

    // Atualiza a quantidade de produtos 
    produtoSel.estoqueAtual = this.novaMovimentacao.tipo === "saida" 
      ? produtoSel.estoqueAtual - this.novaMovimentacao.quantidade
      :produtoSel.estoqueAtual + this.novaMovimentacao.quantidade;
    // Registro da movimentação
    this.api.postMovimentacao(this.novaMovimentacao).subscribe(()=>{
      next: () => {
        alert(`Movimentacao ${this.novaMovimentacao.tipo} registrada com sucesso`);
        //atualizar Produto
        this.api.updateProduto(produtoSel.id,produtoSel);
        this.carregar()
        this.novaMovimentacao = {produto:{id:null}, usuario:{id:null}, tipo: "", quantidade: 0, dataMovimentacao: ""};
      }
      error: (e:any) => {
        alert(`Erro: ${e.message}`);
      }
    })
  }
}