/**
 * Global State Interfaces
 *
 * Defines the structure of the global application state.
 * Organized in slices for better maintainability.
 */

import { IUser } from './user.interface';

/**
 * Authentication State Slice
 * Contains all authentication-related state
 */
export interface AuthState {
  currentUser: IUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  requiresPasswordChange: boolean;
  allowChangePassword: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Application State Slice
 * Contains UI and app configuration state
 */
export interface AppState {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  language: string;
  isLoadingPage: boolean;
  isRouting: boolean;
}

/**
 * Notifications State Slice
 * Contains notification and alert state
 */
export interface NotificationsState {
  unreadCount: number;
  notifications: any[];
}

/**
 * Global Application State
 * Combines all state slices
 */
export interface GlobalState {
  auth: AuthState;
  app: AppState;
  notifications: NotificationsState;
}

/**
 * State Update Options
 * Configuration for state updates
 */
export interface StateUpdateOptions {
  persist?: boolean;
  silent?: boolean;
}
