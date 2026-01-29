import { Injectable } from '@angular/core';
import { GenericSocketManager } from '../../core/infrastructure/services/generic-socket-manager.service';
import { SocketEventMap } from '../../core/domain/interfaces/socket-event-types';
import { SHIFT_EVENTS } from '../constants/socket-events/shifts.events';

/**
 * Shift Socket Events Interface
 */
export interface ShiftSocketEvents extends SocketEventMap {
  [SHIFT_EVENTS.CREATED]: any;
  [SHIFT_EVENTS.UPDATED]: any;
  [SHIFT_EVENTS.DELETED]: string | { shiftId: string };
}

/**
 * Shifts Socket Manager
 */
@Injectable({ providedIn: 'root' })
export class ShiftsSocketManager extends GenericSocketManager<ShiftSocketEvents> {
  protected socketKey = 'User';
  protected roomName = 'shifts';

  onShiftCreated(callback: (data: any) => void): void {
    this.listenToEvent(SHIFT_EVENTS.CREATED, callback);
  }

  onShiftUpdated(callback: (data: any) => void): void {
    this.listenToEvent(SHIFT_EVENTS.UPDATED, callback);
  }

  onShiftDeleted(callback: (data: any) => void): void {
    this.listenToEvent(SHIFT_EVENTS.DELETED, callback);
  }
}
