import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { StorageUseCase } from '../use-cases';
import { AuthState, AppState, NotificationsState } from '../../domain/interfaces/state.interface';
import { IUser } from '../../domain';

@Injectable({
  providedIn: 'root',
})
export class GlobalStateService {
  private storage = inject(StorageUseCase);
  private debugMode = false;

  // ==========================================
  // AUTH STATE SLICE
  // ==========================================

  private _currentUser = signal<IUser | null>(null);
  private _accessToken = signal<string | null>(null);
  private _isAuthenticated = signal<boolean>(false);
  private _requiresPasswordChange = signal<boolean>(false);
  private _allowChangePassword = signal<boolean>(false);
  private _authLoading = signal<boolean>(false);
  private _authError = signal<string | null>(null);

  // Readonly auth signals
  readonly currentUser = this._currentUser.asReadonly();
  readonly accessToken = this._accessToken.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly requiresPasswordChange = this._requiresPasswordChange.asReadonly();
  readonly allowChangePassword = this._allowChangePassword.asReadonly();
  readonly authLoading = this._authLoading.asReadonly();
  readonly authError = this._authError.asReadonly();

  // ==========================================
  // APP STATE SLICE
  // ==========================================

  private _theme = signal<'light' | 'dark'>('light');
  private _sidebarCollapsed = signal<boolean>(true);
  private _language = signal<string>('es');
  private _isLoadingPage = signal<boolean>(false);
  private _isRouting = signal<boolean>(false);

  // Readonly app signals
  readonly theme = this._theme.asReadonly();
  readonly sidebarCollapsed = this._sidebarCollapsed.asReadonly();
  readonly language = this._language.asReadonly();
  readonly isLoadingPage = this._isLoadingPage.asReadonly();
  readonly isRouting = this._isRouting.asReadonly();

  // ==========================================
  // NOTIFICATIONS STATE SLICE
  // ==========================================

  private _unreadCount = signal<number>(0);
  private _notifications = signal<any[]>([]);

  // Readonly notifications signals
  readonly unreadCount = this._unreadCount.asReadonly();
  readonly notifications = this._notifications.asReadonly();

  // ==========================================
  // COMPUTED SIGNALS
  // ==========================================

  readonly hasUnreadNotifications = computed(() => this._unreadCount() > 0);
  readonly userDisplayName = computed(() => {
    const user = this._currentUser();
    return user ? user.username || user.email : 'Guest';
  });
  readonly isDarkMode = computed(() => this._theme() === 'dark');

  constructor() {
    this.initializeState();
    this.setupPersistence();

    if (this.debugMode) {
      this.enableDebugMode();
    }
  }

  // ==========================================
  // INITIALIZATION
  // ==========================================

  private initializeState(): void {
    // Load user from storage
    const userStr = this.storage.getItem('user');
    const token = this.storage.getItem('accessToken');

    if (userStr && token) {
      try {
        const user = JSON.parse(userStr);
        this._currentUser.set(user);
        this._accessToken.set(token);
        this._isAuthenticated.set(true);
        this._requiresPasswordChange.set(user.requiresPasswordChange || false);
      } catch (error) {
        console.error('[GlobalState] Error parsing user from storage:', error);
        this.clearAuthState();
      }
    }

    // Load theme from storage
    const savedTheme = this.storage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      this._theme.set(savedTheme);
    }

    // Load language from storage
    const savedLanguage = this.storage.getItem('language');
    if (savedLanguage) {
      this._language.set(savedLanguage);
    }
  }

  private setupPersistence(): void {
    // Auto-persist user to localStorage
    effect(() => {
      const user = this._currentUser();
      if (user) {
        this.storage.setItem('user', JSON.stringify(user));
      } else {
        this.storage.removeItem('user');
      }
    });

    // Auto-persist token to localStorage
    effect(() => {
      const token = this._accessToken();
      if (token) {
        this.storage.setItem('accessToken', token);
      } else {
        this.storage.removeItem('accessToken');
      }
    });

    // Auto-persist theme to localStorage
    effect(() => {
      const theme = this._theme();
      this.storage.setItem('theme', theme);
    });

    // Auto-persist language to localStorage
    effect(() => {
      const language = this._language();
      this.storage.setItem('language', language);
    });
  }

  // ==========================================
  // AUTH STATE METHODS
  // ==========================================

  setUser(user: IUser | null): void {
    this._currentUser.set(user);
    this._isAuthenticated.set(user !== null);

    if (user) {
      this._requiresPasswordChange.set(user.requiresPasswordChange || false);
    }

    this.log('User updated:', user);
  }

  setAccessToken(token: string | null): void {
    this._accessToken.set(token);
    this.log('Access token updated');
  }

  setAuthenticated(value: boolean): void {
    this._isAuthenticated.set(value);
    this.log('Authentication status:', value);
  }

  setRequiresPasswordChange(value: boolean): void {
    this._requiresPasswordChange.set(value);

    // Update user object if exists
    const user = this._currentUser();
    if (user) {
      this._currentUser.set({
        ...user,
        requiresPasswordChange: value,
      });
    }

    this.log('Requires password change:', value);
  }

  setAllowChangePassword(value: boolean): void {
    this._allowChangePassword.set(value);
    this.log('Allow change password:', value);
  }

  setAuthLoading(value: boolean): void {
    this._authLoading.set(value);
  }

  setAuthError(error: string | null): void {
    this._authError.set(error);
    if (error) {
      this.log('Auth error:', error);
    }
  }

  clearAuthError(): void {
    this._authError.set(null);
  }

  clearAuthState(): void {
    this._currentUser.set(null);
    this._accessToken.set(null);
    this._isAuthenticated.set(false);
    this._requiresPasswordChange.set(false);
    this._allowChangePassword.set(false);
    this._authLoading.set(false);
    this._authError.set(null);

    this.storage.removeItem('user');
    this.storage.removeItem('accessToken');

    this.log('Auth state cleared');
  }

  updateUserField<K extends keyof IUser>(field: K, value: IUser[K]): void {
    const user = this._currentUser();
    if (user) {
      this._currentUser.set({
        ...user,
        [field]: value,
      });
      this.log(`User field '${String(field)}' updated:`, value);
    }
  }

  // ==========================================
  // APP STATE METHODS
  // ==========================================

  setTheme(theme: 'light' | 'dark'): void {
    this._theme.set(theme);

    // Update DOM
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    this.log('Theme updated:', theme);
  }

  toggleTheme(): void {
    const newTheme = this._theme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setSidebarCollapsed(collapsed: boolean): void {
    this._sidebarCollapsed.set(collapsed);
    this.log('Sidebar collapsed:', collapsed);
  }

  toggleSidebar(): void {
    this._sidebarCollapsed.update((value) => !value);
  }

  setLanguage(language: string): void {
    this._language.set(language);
    this.log('Language updated:', language);
  }

  setLoadingPage(loading: boolean): void {
    this._isLoadingPage.set(loading);
  }

  setRouting(routing: boolean): void {
    this._isRouting.set(routing);
  }

  // ==========================================
  // NOTIFICATIONS STATE METHODS
  // ==========================================

  setUnreadCount(count: number): void {
    this._unreadCount.set(count);
    this.log('Unread notifications count:', count);
  }

  incrementUnreadCount(): void {
    this._unreadCount.update((count) => count + 1);
  }

  decrementUnreadCount(): void {
    this._unreadCount.update((count) => Math.max(0, count - 1));
  }

  setNotifications(notifications: any[]): void {
    this._notifications.set(notifications);
    this.log('Notifications updated:', notifications.length);
  }

  addNotification(notification: any): void {
    this._notifications.update((notifications) => [...notifications, notification]);
    this.incrementUnreadCount();
  }

  removeNotification(notificationId: string): void {
    this._notifications.update((notifications) =>
      notifications.filter((n) => n.id !== notificationId),
    );
  }

  clearNotifications(): void {
    this._notifications.set([]);
    this._unreadCount.set(0);
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  /**
   * Get a snapshot of the entire state
   */
  getStateSnapshot(): {
    auth: Partial<AuthState>;
    app: Partial<AppState>;
    notifications: Partial<NotificationsState>;
  } {
    return {
      auth: {
        currentUser: this._currentUser(),
        isAuthenticated: this._isAuthenticated(),
        requiresPasswordChange: this._requiresPasswordChange(),
        isLoading: this._authLoading(),
        error: this._authError(),
      },
      app: {
        theme: this._theme(),
        sidebarCollapsed: this._sidebarCollapsed(),
        language: this._language(),
        isLoadingPage: this._isLoadingPage(),
        isRouting: this._isRouting(),
      },
      notifications: {
        unreadCount: this._unreadCount(),
        notifications: this._notifications(),
      },
    };
  }

  /**
   * Reset entire application state
   */
  resetState(): void {
    this.clearAuthState();
    this._theme.set('light');
    this._sidebarCollapsed.set(true);
    this._language.set('es');
    this._isLoadingPage.set(false);
    this._isRouting.set(false);
    this.clearNotifications();

    this.log('State reset to defaults');
  }

  /**
   * Enable debug mode to log all state changes
   */
  enableDebugMode(): void {
    this.debugMode = true;
    console.log('[GlobalState] Debug mode enabled');

    // Log all state changes
    effect(() => {
      console.log('[GlobalState] State snapshot:', this.getStateSnapshot());
    });
  }

  /**
   * Disable debug mode
   */
  disableDebugMode(): void {
    this.debugMode = false;
    console.log('[GlobalState] Debug mode disabled');
  }

  private log(message: string, ...args: any[]): void {
    if (this.debugMode) {
      console.log(`[GlobalState] ${message}`, ...args);
    }
  }
}
