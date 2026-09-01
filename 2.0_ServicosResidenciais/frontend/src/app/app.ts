import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  exibirHeader = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      this.exibirHeader = !url.includes('/login') && url !== '/';
    });
  }

  // Método chamado pelo botão (click)="logout()" do HTML
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user');
      localStorage.clear();
    }
    this.exibirHeader = false;
    this.router.navigate(['/login']);
  }
}