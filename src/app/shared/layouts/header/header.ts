import { Component, EventEmitter, Input, Output, signal, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/application';
import { NotificationsMenu } from '../notifications-menu/notifications-menu';
import { SettingsDtsIcon } from "../../icons";

@Component({
  selector: 'foxcode-header',
  standalone: true,
  templateUrl: './header.html',
  styles: [],
  imports: [NotificationsMenu, SettingsDtsIcon],
})
export class Header implements OnInit {
  @Input() user: any;
  @Input() supportSidebarOpen = false;
  @Input() sidebarCollapsed = false;
  @Input() isDarkMode = false;
  @Input() businessUnit = 'MICROSOFT';
  @Input() showUATBanner = false;

  @Output() onToggleSidebar = new EventEmitter<void>();
  @Output() onToggleSupportSidebar = new EventEmitter<void>();
  @Output() onLogout = new EventEmitter<void>();
  @Output() onToggleTheme = new EventEmitter<void>();

  notificationsOpen = signal(false);
  appVersion = signal<string>('v2.38.0');

  private http = inject(HttpClient);
  private authService = inject(AuthService);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadVersion();
  }

  private loadVersion(): void {
    this.http.get<{ version: string; buildDate: string }>('assets/version.json').subscribe({
      next: (data) => {
        this.appVersion.set(data.version);
      },
      error: (error) => {
        console.error('Error loading version:', error);
      },
    });
  }

  notifications = [
    {
      id: 1,
      title: 'Tiempo muerto detectado',
      description: 'Se emitio un paro en la linea de produccion 3...',
      type: 'SYSTEM',
      user: 'DTS',
      time: '09:40 - 23/01/2026',
      status: 'HIGH',
      isRead: false,
    },
    {
      id: 2,
      title: 'Nuevo comentario en el reporte de soporte',
      description: 'Se agregó un nuevo comentario al reporte de soporte FC00-128...',
      type: 'SYSTEM',
      user: 'DTS',
      time: '09:40 - 23/01/2026',
      status: 'LOW',
      isRead: false,
    }
  ];

  toggleSidebar(): void {
    this.onToggleSidebar.emit();
  }

  toggleNotifications(): void {
    this.notificationsOpen.update((value) => !value);
  }

  closeNotifications(): void {
    this.notificationsOpen.set(false);
  }

  toggleSupportSidebar(): void {
    this.onToggleSupportSidebar.emit();
  }

  logout(): void {
    this.onLogout.emit();
  }

  toggleTheme(): void {
    this.onToggleTheme.emit();
  }

  goHome(): void {
    this.authService.refreshUserData();
    this.router.navigate(['/foxcode', 'home']);
  }
}
