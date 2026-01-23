import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { AuthService } from '../../../core/application/services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'foxcode-layout-template',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './layout-template.html',
  styleUrl: './layout-template.css',
})
export class LayoutTemplate implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  sidebarCollapsed = signal(false);
  isNavigating = signal(false);
  user = this.authService.user;

  ngOnInit(): void {
    // Escuchar eventos de navegación
    this.router.events.pipe(
      filter(event => 
        event instanceof NavigationStart || 
        event instanceof NavigationEnd || 
        event instanceof NavigationCancel || 
        event instanceof NavigationError
      )
    ).subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isNavigating.set(true);
      } else {
        // Pequeño delay para mejor UX
        setTimeout(() => {
          this.isNavigating.set(false);
        }, 300);
      }
    });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update(value => !value);
  }

  onLogout(): void {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.authService.logout();
    }
  }
}
