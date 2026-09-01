import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <h2>Dashboard</h2>
    <div class="card" style="background-color: #e9ecef; border-left: 4px solid #007bff;">
      <p style="margin: 0; font-size: 18px;">
        Bem-vindo(a), <strong>{{ usuarioNome }}</strong>!
      </p>
    </div>
    
    <div style="display: flex; gap: 20px; margin-top: 20px; flex-wrap: wrap;">
      <div class="card" style="flex: 1; min-width: 200px; text-align: center; border-top: 4px solid #007bff;">
        <h3>Total de Clientes</h3>
        <h1 style="color: #007bff; font-size: 40px; margin: 10px 0;">{{ totalClientes }}</h1>
      </div>
      
      <div class="card" style="flex: 1; min-width: 200px; text-align: center; border-top: 4px solid #28a745;">
        <h3>Especialistas Ativos</h3>
        <h1 style="color: #28a745; font-size: 40px; margin: 10px 0;">{{ totalEspecialistas }}</h1>
      </div>
      
      <div class="card" style="flex: 1; min-width: 200px; text-align: center; border-top: 4px solid #ffc107;">
        <h3>Agendamentos</h3>
        <h1 style="color: #ffc107; font-size: 40px; margin: 10px 0;">{{ totalAgendamentos }}</h1>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  usuarioNome = 'Usuário';
  totalClientes = 0;
  totalEspecialistas = 0;
  totalAgendamentos = 0;

  constructor(
    private http: HttpClient, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Valida se está executando no navegador antes de acessar o localStorage
    if (isPlatformBrowser(this.platformId)) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          this.usuarioNome = JSON.parse(userStr).nome;
        } catch (e) {
          this.usuarioNome = 'Usuário';
        }
      } else {
        this.router.navigate(['/login']);
        return;
      }
    }

    // Requisições para preencher o resumo do Dashboard
    this.http.get<any[]>('http://localhost:8000/api/clientes').subscribe({
      next: res => this.totalClientes = res.length,
      error: () => this.totalClientes = 0
    });

    this.http.get<any[]>('http://localhost:8000/api/recursos').subscribe({
      next: res => this.totalEspecialistas = res.length,
      error: () => this.totalEspecialistas = 0
    });

    this.http.get<any[]>('http://localhost:8000/api/agendamentos').subscribe({
      next: res => this.totalAgendamentos = res.length,
      error: () => this.totalAgendamentos = 0
    });
  }
}