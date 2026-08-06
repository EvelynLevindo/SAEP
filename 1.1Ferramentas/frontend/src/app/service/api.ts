import { HttpClient } from '@angular/common/http';
import { Service } from '@angular/core';
import { Observable } from 'rxjs';

// Classe de conexão com a API

@Service()
export class Api {

    // Atributo
    private baseUrl = "http://localhost:8080/api"

    // Construtor, habilita a conexão HTTP --> HttpClient
    constructor(private http: HttpClient) {};

    // Métodos da API

    // Login
    login(dados:any): Observable<any> {// Observable --> Conexão assíncrona com API
        return this.http.post(`${this.baseUrl}/auth/login`, dados); // Estabelece conexão com API passando a URL e Body (dados)
    }

    // GetProdutos
    getProdutos():Observable<any> {
        return this.http.get(`${this.baseUrl}/produtos`);
    }

    // BuscarProdutos (por parte do nome)
    buscarProdutos(termo:String):Observable<any>{
        return this.http.get(`${this.baseUrl}/produtos/busca?termo=?{termo}`);
    }

    // PostProdutos
    postProduto(produto:any):Observable<any>{
        return this.http.post(`${this.baseUrl}/produtos`,produto);
    }

    // PutProduto
    updateProduto(produto:any, id:number): Observable<any>{
        return this.http.put(`${this.baseUrl}/produtos/${id}`, produto)
    }

    // DeleteProdutos
    deleteProduto(id:number):Observable<any> {
        return this.http.delete(`${this.baseUrl}/produtos/${id}`)
    }

    // PostMovimentacao
    postMovimentacao(movimentacao:any):Observable<any>{
        return this.http.post(`${this.baseUrl}/movimentacao`,movimentacao);
    }

    // GetMovimentacao
    getMovimentacao():Observable<any>{
        return this.http.get(`${this.baseUrl}/movimentacao`);
    }

}
