import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  RouterOutlet,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from '@angular/router';
import { AuthService, GlobalStateService } from '../../../core/application';
import { LoaderPage } from '../../components/loader-page/loader-page';
import { SupportSidebar } from '../support-sidebar/support-sidebar';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { environment } from '../../../../environments/environment';
import { InitSidebarSockets } from './core/sockets/init-sockets.socket';
import { UsersSocketManager, ToolsSocketManager } from '../..';

@Component({
  selector: 'foxcode-layout-template',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LoaderPage, SupportSidebar, Header, Sidebar],
  templateUrl: './layout-template.html',
})
export class LayoutTemplate implements OnInit, OnDestroy {
  private usersSocketManager = inject(UsersSocketManager);
  private toolsSocketManager = inject(ToolsSocketManager);
  private initSidebarSockets = inject(InitSidebarSockets);
  private authService = inject(AuthService);
  private globalState = inject(GlobalStateService);
  private router = inject(Router);

  // Use global state instead of local signals
  sidebarCollapsed = this.globalState.sidebarCollapsed;
  isLoadingPage = this.globalState.isLoadingPage;
  isRouting = this.globalState.isRouting;
  isDarkMode = this.globalState.isDarkMode;
  user = this.globalState.currentUser;

  // Local UI state
  loaderMessage = signal('Loading...');
  supportSidebarOpen = signal(false);
  businessUnit = signal(environment.BUSINESS_UNIT);
  showUATBanner = signal(environment.mode === 'UAT');
  private routerSub?: any;

  ngOnInit(): void {
    this.usersSocketManager.connect();
    this.toolsSocketManager.connect();
    this.initSidebarSockets.InitSockets();

    // Initial loading
    this.globalState.setLoadingPage(true);
    setTimeout(() => {
      this.globalState.setLoadingPage(false);
    }, 800);

    // Show overlay strictly during navigation (start -> end/cancel/error)
    this.routerSub = this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationStart) {
        this.loaderMessage.set('Loading...');
        this.globalState.setRouting(true);
      }
      if (
        evt instanceof NavigationEnd ||
        evt instanceof NavigationCancel ||
        evt instanceof NavigationError
      ) {
        this.globalState.setRouting(false);
      }
    });
  }

  toggleSidebar(): void {
    this.globalState.toggleSidebar();
  }

  toggleSupportSidebar(): void {
    this.supportSidebarOpen.update((value) => !value);
  }

  closeSupportSidebar(): void {
    this.supportSidebarOpen.set(false);
  }

  toggleTheme(): void {
    this.globalState.toggleTheme();
  }

  onLogout(): void {
    this.loaderMessage.set('Goodbye, see you soon');
    this.globalState.setLoadingPage(true);

    setTimeout(() => {
      const currentToken = this.globalState.accessToken();
      this.authService.logout(currentToken!);
    }, 1500);
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe?.();
    this.usersSocketManager.disconnect();
    this.toolsSocketManager.disconnect();
  }
}
