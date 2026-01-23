import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/application/services/auth.service';
import { StorageRepository } from '../../../core/domain';
import { LoaderPage } from "../../components/loader-page/loader-page";
import { SupportSidebar } from '../../components/support-sidebar/support-sidebar';
import { Header } from "../header/header";
import { Sidebar } from "../sidebar/sidebar";

@Component({
  selector: 'foxcode-layout-template',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LoaderPage, SupportSidebar, Header, Sidebar],
  templateUrl: './layout-template.html'
})
export class LayoutTemplate implements OnInit {
  private authService = inject(AuthService);
  private storageRepository = inject(StorageRepository);
  
  sidebarCollapsed = signal(false);
  isLoadingPage = signal(true);
  loaderMessage = signal('Loading...');
  supportSidebarOpen = signal(false);
  isDarkMode = signal(false);
  user = this.authService.user;

  ngOnInit(): void {
    // Load theme from localStorage
    const savedTheme = this.storageRepository.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode.set(true);
      document.documentElement.classList.add('dark');
    }

    setTimeout(() => {
      this.isLoadingPage.set(false);
    }, 800);
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
}
