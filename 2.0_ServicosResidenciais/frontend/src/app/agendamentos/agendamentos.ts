import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agendamentos',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  template: `
    <h2>Novo Agendamento</h2>

    <!-- Alertas -->
    <div *ngIf="mensagemSucesso" class="alert" style="background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;">
      {{ mensagemSucesso }}
    </div>
    <div *ngIf="mensagemErro" class="alert alert-error">
      {{ mensagemErro }}
    </div>

    <div class="card">
      <form [formGroup]="form" (ngSubmit)="salvar()">
        
        <!-- Dropdown de Clientes -->
        <label>Cliente *</label>
        <select formControlName="cliente_id">
          <option value="">-- Selecione o Cliente --</option>
          <option *ngFor="let cliente of clientes" [value]="cliente.id">
            {{ cliente.nome }} (CPF: {{ cliente.documento }})
          </option>
        </select>
        <span class="error-msg" *ngIf="form.get('cliente_id')?.touched && form.get('cliente_id')?.invalid">
          Selecione um cliente.
        </span>

        <!-- Dropdown de Especialistas / Recursos -->
        <label>Especialista *</label>
        <select formControlName="recurso_id">
          <option value="">-- Selecione o Especialista --</option>
          <option *ngFor="let recurso of recursos" [value]="recurso.id">
            {{ recurso.nome }} - {{ recurso.especialidade }}
          </option>
        </select>
        <span class="error-msg" *ngIf="form.get('recurso_id')?.touched && form.get('recurso_id')?.invalid">
          Selecione um especialista.
        </span>

        <!-- Data e Hora -->
        <label>Data e Horário *</label>
        <input type="datetime-local" formControlName="data_hora">
        <span class="error-msg" *ngIf="form.get('data_hora')?.touched && form.get('data_hora')?.invalid">
          A data e horário são obrigatórios.
        </span>

        <!-- Observações -->
        <label>Observação / Serviço</label>
        <input type="text" formControlName="observacao" placeholder="Ex: Manutenção na rede elétrica">

        <button type="submit" class="btn" [disabled]="form.invalid" style="margin-top: 10px;">
          Confirmar Agendamento
        </button>
      </form>
    </div>

    <!-- Tabela de Agendamentos Criados -->
    <div class="card">
      <h3>Agendamentos Marcados</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Especialista</th>
            <th>Data e Hora</th>
            <th>Observação</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let a of agendamentos">
            <td>{{ a.id }}</td>
            <td>{{ a.cliente_nome || 'Cliente #' + a.cliente_id }}</td>
            <td>{{ a.recurso_nome || 'Especialista #' + a.recurso_id }}</td>
            <td>{{ a.data_hora ? (a.data_hora | date:'dd/MM/yyyy HH:mm') : '-' }}</td>
            <td>{{ a.observacao || '-' }}</td>
            <td>
              <button class="btn btn-danger" (click)="cancelar(a.id)">Cancelar</button>
            </td>
          </tr>
          <tr *ngIf="agendamentos.length === 0">
            <td colspan="6" style="text-align: center; color: #666;">Nenhum agendamento cadastrado.</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class AgendamentosComponent implements OnInit {
  form: FormGroup;
  clientes: any[] = [];
  recursos: any[] = [];
  agendamentos: any[] = [];
  mensagemSucesso = '';
  mensagemErro = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      cliente_id: ['', Validators.required],
      recurso_id: ['', Validators.required],
      data_hora: ['', Validators.required],
      observacao: ['']
    });
  }

  ngOnInit() {
    this.carregarClientes();
    this.carregarRecursos();
    this.carregarAgendamentos();
  }

  carregarClientes() {
    this.http.get<any[]>('http://localhost:8000/api/clientes').subscribe({
      next: (res) => this.clientes = res,
      error: () => this.exibirErro('Não foi possível carregar a lista de clientes.')
    });
  }

  carregarRecursos() {
    this.http.get<any[]>('http://localhost:8000/api/recursos').subscribe({
      next: (res) => this.recursos = res,
      error: () => this.exibirErro('Não foi possível carregar os especialistas.')
    });
  }

  carregarAgendamentos() {
    this.http.get<any[]>('http://localhost:8000/api/agendamentos').subscribe({
      next: (res) => this.agendamentos = res,
      error: () => this.exibirErro('Erro ao carregar lista de agendamentos.')
    });
  }

  salvar() {
    this.mensagemSucesso = '';
    this.mensagemErro = '';

    if (this.form.invalid) return;

    this.http.post<any>('http://localhost:8000/api/agendamentos', this.form.value).subscribe({
      next: (res) => {
        this.mensagemSucesso = res.message || 'Agendamento realizado com sucesso!';
        this.form.reset();
        this.carregarAgendamentos();
      },
      error: (err) => {
        this.exibirErro(err.error?.message || 'Erro ao realizar agendamento.');
      }
    });
  }

  cancelar(id: number) {
    if (confirm('Deseja realmente cancelar este agendamento?')) {
      this.http.delete<any>(`http://localhost:8000/api/agendamentos/${id}`).subscribe({
        next: () => {
          this.mensagemSucesso = 'Agendamento cancelado com sucesso.';
          this.carregarAgendamentos();
        },
        error: () => this.exibirErro('Erro ao cancelar agendamento.')
      });
    }
  }

  private exibirErro(msg: string) {
    this.mensagemErro = msg;
    setTimeout(() => this.mensagemErro = '', 5000);
  }
}