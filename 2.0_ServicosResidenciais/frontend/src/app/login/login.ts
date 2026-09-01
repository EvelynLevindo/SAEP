import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  template: `
    <div class="card" style="max-width: 400px; margin: 50px auto;">
      <h2>Login</h2>
      <div *ngIf="erro" class="alert alert-error">{{ erro }}</div>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <label>E-mail:</label>
        <input type="email" formControlName="email">
        <label>Senha:</label>
        <input type="password" formControlName="senha">
        <button type="submit" class="btn" [disabled]="loginForm.invalid">Entrar</button>
      </form>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  erro = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });
  }

onSubmit() {
  this.http.post<any>('http://localhost:8000/api/login', this.loginForm.value)
    .subscribe({
      next: (res) => {
        // Salva a sessão primeiro
        localStorage.setItem('user', JSON.stringify(res.user));
        // Depois navega para o dashboard
        this.router.navigate(['/dashboard']);
      },
      error: () => this.erro = 'E-mail ou senha inválidos.'
    });
  }
}