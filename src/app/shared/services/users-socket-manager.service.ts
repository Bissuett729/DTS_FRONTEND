import { Injectable } from '@angular/core';
import { GenericSocketManager } from '../../core/infrastructure/services/generic-socket-manager.service';
import { SocketEventMap } from '../../core/domain/interfaces/socket-event-types';
import { USER_EVENTS } from '../constants/socket-events/users.events';

/**
 * User Socket Events Interface
 * Defines the structure of all user-related socket events
 */
export interface UserSocketEvents extends SocketEventMap {
  [USER_EVENTS.CREATED]: any;
  [USER_EVENTS.UPDATED]: any;
  [USER_EVENTS.DELETED]: string | { userId: string };
  [USER_EVENTS.STATUS_CHANGED]: { data: { userId: string; active: boolean } };
  [USER_EVENTS.PASSWORD_CHANGED]: any;
  [USER_EVENTS.PROFILE_IMAGE_UPDATED]: any;
}

@Injectable({ providedIn: 'root' })
export class UsersSocketManager extends GenericSocketManager<UserSocketEvents> {
  protected socketKey = 'User';
  protected roomName = 'users';

  /**
   * Listen to user created events
   * @param callback - Function to execute when a user is created
   */
  onUserCreated(callback: (data: any) => void): void {
    this.listenToEvent(USER_EVENTS.CREATED, callback);
  }

  /**
   * Listen to user updated events
   * @param callback - Function to execute when a user is updated
   */
  onUserUpdated(callback: (data: any) => void): void {
    this.listenToEvent(USER_EVENTS.UPDATED, callback);
  }

  /**
   * Listen to user deleted events
   * @param callback - Function to execute when a user is deleted
   */
  onUserDeleted(callback: (data: string | { userId: string }) => void): void {
    this.listenToEvent(USER_EVENTS.DELETED, callback);
  }

  /**
   * Listen to user status changed events
   * @param callback - Function to execute when a user's status changes
   */
  onUserStatusChanged(
    callback: (data: { data: { userId: string; active: boolean } }) => void,
  ): void {
    this.listenToEvent(USER_EVENTS.STATUS_CHANGED, callback);
  }

  /**
   * Listen to user password changed events
   * @param callback - Function to execute when a user's password changes
   */
  onUserPasswordChanged(callback: (data: any) => void): void {
    this.listenToEvent(USER_EVENTS.PASSWORD_CHANGED, callback);
  }

  /**
   * Listen to user profile image updated events
   * @param callback - Function to execute when a user's profile image is updated
   */
  onUserProfileImageUpdated(callback: (data: any) => void): void {
    this.listenToEvent(USER_EVENTS.PROFILE_IMAGE_UPDATED, callback);
  }
}
