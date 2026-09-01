import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Api } from '../../service/api';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  // Atributos
  credencial = {login:"", senha:""};
  constructor (private api: Api, private router: Router){}

  entrar(){
    this.api.login(this.credencial).subscribe({
      next: (usuario) =>{
        // Armazenar no LocalStorage (cache do navegador)
        localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
        // Navegar para a página nome
        this.router.navigate(["/home"]);
      },
      // Verifica o erro
      error: () => {
        alert(`Falha de autenticação. Usuário ou Senha incorretos`);
      }
    });
  }
}