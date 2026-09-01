import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  template: `
    <h2>Gestão de Clientes</h2>

    <!-- Alertas visuais de retorno da API -->
    <div *ngIf="mensagemSucesso" class="alert" style="background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;">
      {{ mensagemSucesso }}
    </div>

    <div *ngIf="mensagemErro" class="alert alert-error">
      {{ mensagemErro }}
    </div>
    
    <div class="card">
      <h3>Novo Cliente</h3>
      <form [formGroup]="form" (ngSubmit)="salvar()">
        <label>Nome Completo *</label>
        <input type="text" formControlName="nome" placeholder="Ex: Maria Silva">
        <span class="error-msg" *ngIf="form.get('nome')?.touched && form.get('nome')?.invalid">O nome é obrigatório.</span>
        
        <label>CPF / Documento *</label>
        <input type="text" formControlName="documento" placeholder="Ex: 12345678900">
        <span class="error-msg" *ngIf="form.get('documento')?.touched && form.get('documento')?.invalid">O documento é obrigatório.</span>
        
        <label>Telefone</label>
        <input type="text" formControlName="telefone" placeholder="Ex: 11999998888">
        
        <label>E-mail</label>
        <input type="email" formControlName="email" placeholder="Ex: maria@email.com">
        <span class="error-msg" *ngIf="form.get('email')?.touched && form.get('email')?.invalid">Insira um e-mail válido.</span>
        
        <label>Endereço</label>
        <input type="text" formControlName="endereco" placeholder="Ex: Av. Brasil, 500">
        
        <button type="submit" class="btn" [disabled]="form.invalid">Cadastrar Cliente</button>
      </form>
    </div>

    <div class="card">
      <h3>Lista de Clientes Cadastrados</h3>
      <input type="text" placeholder="🔍 Buscar por nome ou documento..." (input)="filtrar($event)" style="max-width: 300px;">
      
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Documento</th>
            <th>Telefone</th>
            <th>E-mail</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let c of clientesFiltrados">
            <td>{{c.id}}</td>
            <td>{{c.nome}}</td>
            <td>{{c.documento}}</td>
            <td>{{c.telefone || '-'}}</td>
            <td>{{c.email || '-'}}</td>
            <td>
              <button class="btn btn-danger" (click)="excluir(c.id)">Excluir</button>
            </td>
          </tr>
          <tr *ngIf="clientesFiltrados.length === 0">
            <td colspan="6" style="text-align: center;">Nenhum cliente cadastrado.</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class ClientesComponent implements OnInit {
  form: FormGroup;
  clientes: any[] = [];
  clientesFiltrados: any[] = [];
  mensagemSucesso = '';
  mensagemErro = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      documento: ['', Validators.required],
      telefone: [''],
      email: ['', [Validators.email]],
      endereco: ['']
    });
  }

  ngOnInit() {
    this.carregarClientes();
  }

  carregarClientes() {
    this.http.get<any[]>('http://localhost:8000/api/clientes').subscribe({
      next: (res) => {
        this.clientes = res;
        this.clientesFiltrados = res;
      },
      error: () => this.exibirErro('Erro ao carregar a lista de clientes.')
    });
  }

  filtrar(event: any) {
    const termo = event.target.value.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(c => 
      c.nome.toLowerCase().includes(termo) || 
      c.documento.includes(termo)
    );
  }

  salvar() {
    this.limparMensagens();

    if (this.form.invalid) {
      this.exibirErro('Preencha os campos obrigatórios corretamente.');
      return;
    }

    this.http.post<any>('http://localhost:8000/api/clientes', this.form.value).subscribe({
      next: (res) => {
        this.mensagemSucesso = res.message || 'Cliente cadastrado com sucesso!';
        this.form.reset();
        this.carregarClientes();
      },
      error: (err) => {
        this.exibirErro(err.error?.message || 'Erro ao cadastrar cliente.');
      }
    });
  }

  excluir(id: number) {
    this.limparMensagens();
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      this.http.delete<any>(`http://localhost:8000/api/clientes/${id}`).subscribe({
        next: (res) => {
          this.mensagemSucesso = res.message || 'Cliente excluído com sucesso.';
          this.carregarClientes();
        },
        error: (err) => {
          this.exibirErro(err.error?.message || 'Erro ao excluir cliente.');
        }
      });
    }
  }

  private exibirErro(msg: string) {
    this.mensagemErro = msg;
    setTimeout(() => this.mensagemErro = '', 5000);
  }

  private limparMensagens() {
    this.mensagemSucesso = '';
    this.mensagemErro = '';
  }
}