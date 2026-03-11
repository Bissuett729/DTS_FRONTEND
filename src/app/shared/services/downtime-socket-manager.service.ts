import { Injectable } from '@angular/core';
import { GenericSocketManager } from '../../core/infrastructure/services/generic-socket-manager.service';
import { SocketEventMap } from '../../core/domain/interfaces/socket-event-types';
import { DOWNTIME_EVENTS } from '../constants/socket-events/downtime.events';

/**
 * DownTime Socket Events Interface
 */
export interface DowntimeSocketEvents extends SocketEventMap {
  [DOWNTIME_EVENTS.CREATED]: any;
  [DOWNTIME_EVENTS.UPDATED]: any;
  [DOWNTIME_EVENTS.DELETED]: string | { downTimeId: string };
}

/**
 * Downtime Socket Manager
 * Connects to the DTS backend socket and handles downtime real-time events.
 */
@Injectable({ providedIn: 'root' })
export class DowntimeSocketManager extends GenericSocketManager<DowntimeSocketEvents> {
  protected socketKey = 'Dts';
  protected roomName = 'downtimes';

  onDowntimeCreated(callback: (data: any) => void): void {
    this.listenToEvent(DOWNTIME_EVENTS.CREATED, callback);
  }

  onDowntimeUpdated(callback: (data: any) => void): void {
    this.listenToEvent(DOWNTIME_EVENTS.UPDATED, callback);
  }

  onDowntimeDeleted(callback: (data: string | { downTimeId: string }) => void): void {
    this.listenToEvent(DOWNTIME_EVENTS.DELETED, callback);
  }
}
