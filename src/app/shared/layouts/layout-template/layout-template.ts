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
import { LinesSocketManager } from '../../services/lines-socket-manager.service';
import { DowntimeSocketManager } from '../../services/downtime-socket-manager.service';

@Component({
  selector: 'foxcode-layout-template',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LoaderPage, SupportSidebar, Header, Sidebar],
  templateUrl: './layout-template.html',
})
export class LayoutTemplate implements OnInit, OnDestroy {
  private usersSocketManager = inject(UsersSocketManager);
  private toolsSocketManager = inject(ToolsSocketManager);
  private linesSocketManager = inject(LinesSocketManager);
  private downtimeSocketManager = inject(DowntimeSocketManager);
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
  loaderMessage = signal('Bienvenido a DT Systems...');
  supportSidebarOpen = signal(false);
  businessUnit = signal(environment.BUSINESS_UNIT);
  showUATBanner = signal(environment.mode === 'UAT');
  private routerSub?: any;
  private routingTimeout?: any;

  ngOnInit(): void {
    this.usersSocketManager.connect();
    this.toolsSocketManager.connect();
    this.linesSocketManager.connect();
    this.downtimeSocketManager.connect();
    this.initSidebarSockets.InitSockets();

    // Ensure routing state is clean on init
    this.globalState.setRouting(false);

    setTimeout(() => {
      this.globalState.setLoadingPage(false);
    }, 2000);
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
    this.loaderMessage.set('Adios, nos vemos pronto');
    this.globalState.setLoadingPage(true);

    setTimeout(() => {
      const currentToken = this.globalState.accessToken();
      this.authService.logout(currentToken!);
    }, 1500);
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe?.();
    if (this.routingTimeout) {
      clearTimeout(this.routingTimeout);
    }
    this.usersSocketManager.disconnect();
    this.toolsSocketManager.disconnect();
    this.linesSocketManager.disconnect();
    this.downtimeSocketManager.disconnect();
  }
}
