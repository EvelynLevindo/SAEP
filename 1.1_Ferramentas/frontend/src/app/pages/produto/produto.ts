import { Component, OnInit } from '@angular/core';
import { Api } from '../../service/api';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-produto',
  imports: [FormsModule, RouterLink],
  templateUrl: './produto.html',
  styleUrl: './produto.css',
})
export class Produto implements OnInit{
  // Atributos
  produtos: any[] = []; // Lista com os produtos
  termoBusca: string = ""; // termo para fazer a busca SSR
  produtoAtual = {nome: "", descricao: "", estoqueMinimo: null} // Refere-se aos compos do formulário
  constructor(private api: Api) {}

  // Carregar a lista de produtos
  carregar(){
    this.api.getProdutos().subscribe(res => this.produtos = res); // Preenchendo o vetor de produtos com a API
  }

  // Busca produtos pelo termo
  buscar() { // SSR --> Renderização ao lado do servidor
    this.api.buscarProdutos(this.termoBusca).subscribe(res => this.produtos = res);
  }

  // Busca de produtos pelo termo, ou CSR (Cliente Side Render)
  buscar2() {
    let produtosFiltrados: any[] = [];
    produtosFiltrados = this.produtos.filter((e) => e.contains (this.termoBusca));
    this.produtos = produtosFiltrados;
  }

  // Salvar o produto na API
  salvar() {
    this.api.postProduto(this.produtoAtual).subscribe(() => {
      alert("Produto Cadastrado com Sucesso!");
      this.produtoAtual = {nome: "", descricao: "", estoqueMinimo: null};
      this.carregar();
    });
  }

  // Excluir produto da API
  excluir(id: number) {
    if(confirm("Tem Certeza?")) {
      this.api.deleteProduto(id).subscribe(() => this.carregar());
    }
  }

  // Método ao iniciar
  ngOnInit() {
    this.carregar();
  }
}
