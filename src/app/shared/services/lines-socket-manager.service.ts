import { Injectable } from '@angular/core';
import { GenericSocketManager } from '../../core/infrastructure/services/generic-socket-manager.service';
import { SocketEventMap } from '../../core/domain/interfaces/socket-event-types';
import { LINE_EVENTS } from '../constants/socket-events/lines.events';

/**
 * Line Socket Events Interface
 */
export interface LineSocketEvents extends SocketEventMap {
  [LINE_EVENTS.CREATED]: any;
  [LINE_EVENTS.UPDATED]: any;
  [LINE_EVENTS.DELETED]: string | { lineId: string };
}

/**
 * Lines Socket Manager
 * Connects to the DTS backend socket and handles line-related real-time events.
 */
@Injectable({ providedIn: 'root' })
export class LinesSocketManager extends GenericSocketManager<LineSocketEvents> {
  protected socketKey = 'Dts';
  protected roomName = 'lines';

  onLineCreated(callback: (data: any) => void): void {
    this.listenToEvent(LINE_EVENTS.CREATED, callback);
  }

  onLineUpdated(callback: (data: any) => void): void {
    this.listenToEvent(LINE_EVENTS.UPDATED, callback);
  }

  onLineDeleted(callback: (data: string | { lineId: string }) => void): void {
    this.listenToEvent(LINE_EVENTS.DELETED, callback);
  }
}
