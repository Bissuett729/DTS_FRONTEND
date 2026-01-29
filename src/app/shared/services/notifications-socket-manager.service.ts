import { Injectable } from '@angular/core';
import { GenericSocketManager } from '../../core/infrastructure/services/generic-socket-manager.service';
import { SocketEventMap } from '../../core/domain/interfaces/socket-event-types';
import { NOTIFICATION_EVENTS } from '../constants/socket-events/notifications.events';

/**
 * Notification Socket Events Interface
 */
export interface NotificationSocketEvents extends SocketEventMap {
  [NOTIFICATION_EVENTS.CREATED]: any;
  [NOTIFICATION_EVENTS.UPDATED]: any;
  [NOTIFICATION_EVENTS.DELETED]: string | { notificationId: string };
}

/**
 * Notifications Socket Manager
 */
@Injectable({ providedIn: 'root' })
export class NotificationsSocketManager extends GenericSocketManager<NotificationSocketEvents> {
  protected socketKey = 'User';
  protected roomName = 'notifications';

  onNotificationCreated(callback: (data: any) => void): void {
    this.listenToEvent(NOTIFICATION_EVENTS.CREATED, callback);
  }

  onNotificationUpdated(callback: (data: any) => void): void {
    this.listenToEvent(NOTIFICATION_EVENTS.UPDATED, callback);
  }

  onNotificationDeleted(callback: (data: any) => void): void {
    this.listenToEvent(NOTIFICATION_EVENTS.DELETED, callback);
  }
}
