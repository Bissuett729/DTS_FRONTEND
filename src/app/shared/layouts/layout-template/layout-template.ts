import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { AuthService } from '../../../core/application/services/auth.service';
import { LoaderPage } from "../../components/loader-page/loader-page";
import { SupportSidebar } from '../support-sidebar/support-sidebar';
import { Header } from "../header/header";
import { Sidebar } from "../sidebar/sidebar";
import { environment } from '../../../../environments/environment';
import { StorageUseCase } from '../../../core/application';
import { UserSocketsManagerService } from '../..';
import { InitSidebarSockets } from './core/sockets/init-sockets.socket';

@Component({
  selector: 'foxcode-layout-template',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LoaderPage, SupportSidebar, Header, Sidebar],
  templateUrl: './layout-template.html'
})
export class LayoutTemplate implements OnInit, OnDestroy {
  private userSocketsManagerService = inject(UserSocketsManagerService);
  private initSidebarSockets = inject(InitSidebarSockets);
  private authService = inject(AuthService);
  private storageRepository = inject(StorageUseCase);
  private router = inject(Router);

  sidebarCollapsed = signal(true);
  isLoadingPage = signal(true);
  isRouting = signal(false);
  loaderMessage = signal('Loading...');
  supportSidebarOpen = signal(false);
  isDarkMode = signal(false);
  businessUnit = signal(environment.BUSINESS_UNIT);
  showUATBanner = signal(environment.mode === 'UAT');
  user = this.authService.user;
  private routerSub?: any;

  ngOnInit(): void {
    this.userSocketsManagerService.connect();
    this.initSidebarSockets.InitSockets();
    // Load theme from localStorage
    const savedTheme = this.storageRepository.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode.set(true);
      document.documentElement.classList.add('dark');
    }

    setTimeout(() => {
      this.isLoadingPage.set(false);
    }, 800);

    // Show overlay strictly during navigation (start -> end/cancel/error)
    this.routerSub = this.router.events.subscribe(evt => {
      if (evt instanceof NavigationStart) {
        this.loaderMessage.set('Loading...');
        this.isRouting.set(true);
      }
      if (evt instanceof NavigationEnd || evt instanceof NavigationCancel || evt instanceof NavigationError) {
        this.isRouting.set(false);
      }
    });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update(value => !value);
  }

  toggleSupportSidebar(): void {
    this.supportSidebarOpen.update(value => !value);
  }

  closeSupportSidebar(): void {
    this.supportSidebarOpen.set(false);
  }

  toggleTheme(): void {
    this.isDarkMode.update(value => !value);

    if (this.isDarkMode()) {
      document.documentElement.classList.add('dark');
      this.storageRepository.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      this.storageRepository.setItem('theme', 'light');
    }
  }

  onLogout(): void {
    this.loaderMessage.set('Goodbye, see you soon');
    this.isLoadingPage.set(true);

    setTimeout(() => {
      const currentToken = this.storageRepository.getItem('accessToken');
      this.authService.logout(currentToken!);
    }, 1500);
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe?.();
    this.userSocketsManagerService.disconnect();
  }
}
