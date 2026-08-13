import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  // Atributos
  nomeUsuario: string = "";
  constructor(private router: Router) {}

  // Método que será executado antes da execução da página
  ngOnInit() {
    // Pegar as informações do LocalStorage
    const user = JSON.parse(localStorage.getItem("usuarioLogado") ?? "{}");
    this.nomeUsuario = user.nome ?? "Visitante";
    // || --> ??
    // || --> Se caso for algum valor nulo, 0 ou "" ele preenche com o valor após o operador
    // ?? --> Se caso for nulo ou indefinido, ele preenche com o valor após o operador
  }

  logout() {
    localStorage.removeItem("usuarioLogado");
    this.router.navigate(["/login"]);
  }
}