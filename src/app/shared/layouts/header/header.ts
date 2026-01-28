import { Component, EventEmitter, Input, Output, signal, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NotificationsMenu } from "../notifications-menu/notifications-menu";

@Component({
  selector: 'foxcode-header',
  standalone: true,
  templateUrl: './header.html',
  styles: [],
  imports: [NotificationsMenu]
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
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadVersion();
  }

  private loadVersion(): void {
    this.http.get<{ version: string; buildDate: string }>('assets/version.json')
      .subscribe({
        next: (data) => {
          this.appVersion.set(data.version);
        },
        error: (error) => {
          console.error('Error loading version:', error);
        }
      });
  }

  notifications = [
    {
      id: 1,
      title: 'Change the support status',
      description: 'Code FC00-128, support status changed to ...',
      type: 'SYSTEM',
      user: 'FOXCODE',
      time: '09:40 - 23/01/2026',
      status: 'LOW',
      isRead: false
    },
    {
      id: 2,
      title: 'New comment on support r...',
      description: 'Code FC00-128, a new comment was adde...',
      type: 'SYSTEM',
      user: 'FOXCODE',
      time: '09:40 - 23/01/2026',
      status: 'LOW',
      isRead: false
    },
    {
      id: 3,
      title: 'Support report created',
      description: 'Code FC00-128, a new support report was...',
      type: 'SYSTEM',
      user: 'FOXCODE',
      time: '09:40 - 23/01/2026',
      status: 'PRIORITY',
      isRead: false
    },
    {
      id: 4,
      title: 'Support report created',
      description: 'Code FC00-128, a new support report was...',
      type: 'SYSTEM',
      user: 'FOXCODE',
      time: '09:40 - 23/01/2026',
      status: 'PRIORITY',
      isRead: false
    },
    {
      id: 5,
      title: 'Support report created',
      description: 'Code FC00-128, a new support report was...',
      type: 'SYSTEM',
      user: 'FOXCODE',
      time: '09:40 - 23/01/2026',
      status: 'PRIORITY',
      isRead: false
    },
    {
      id: 6,
      title: 'Support report created',
      description: 'Code FC00-128, a new support report was...',
      type: 'SYSTEM',
      user: 'FOXCODE',
      time: '09:40 - 23/01/2026',
      status: 'PRIORITY',
      isRead: false
    },
    {
      id: 7,
      title: 'Support report created',
      description: 'Code FC00-128, a new support report was...',
      type: 'SYSTEM',
      user: 'FOXCODE',
      time: '09:40 - 23/01/2026',
      status: 'PRIORITY',
      isRead: false
    },
    {
      id: 8,
      title: 'Support report created',
      description: 'Code FC00-128, a new support report was...',
      type: 'SYSTEM',
      user: 'FOXCODE',
      time: '09:40 - 23/01/2026',
      status: 'PRIORITY',
      isRead: false
    },
    {
      id: 9,
      title: 'Support report created',
      description: 'Code FC00-128, a new support report was...',
      type: 'WIRING CHECK TOOL KIT',
      user: 'FOXCODE',
      time: '09:40 - 23/01/2026',
      status: 'PRIORITY',
      isRead: false
    },
  ];

  toggleSidebar(): void {
    this.onToggleSidebar.emit();
  }

  toggleNotifications(): void {
    this.notificationsOpen.update(value => !value);
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
    this.router.navigate(['/foxcode', 'home']);
  }
}
