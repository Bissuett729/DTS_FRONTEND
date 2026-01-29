import { Injectable } from '@angular/core';
import { GenericSocketManager } from '../../core/infrastructure/services/generic-socket-manager.service';
import { SocketEventMap } from '../../core/domain/interfaces/socket-event-types';
import { BUSINESS_UNIT_EVENTS } from '../constants/socket-events/business-units.events';

/**
 * Business Unit Socket Events Interface
 */
export interface BusinessUnitSocketEvents extends SocketEventMap {
  [BUSINESS_UNIT_EVENTS.CREATED]: any;
  [BUSINESS_UNIT_EVENTS.UPDATED]: any;
  [BUSINESS_UNIT_EVENTS.DELETED]: string | { businessUnitId: string };
}

/**
 * Business Units Socket Manager
 */
@Injectable({ providedIn: 'root' })
export class BusinessUnitsSocketManager extends GenericSocketManager<BusinessUnitSocketEvents> {
  protected socketKey = 'User';
  protected roomName = 'business-units';

  onBusinessUnitCreated(callback: (data: any) => void): void {
    this.listenToEvent(BUSINESS_UNIT_EVENTS.CREATED, callback);
  }

  onBusinessUnitUpdated(callback: (data: any) => void): void {
    this.listenToEvent(BUSINESS_UNIT_EVENTS.UPDATED, callback);
  }

  onBusinessUnitDeleted(callback: (data: any) => void): void {
    this.listenToEvent(BUSINESS_UNIT_EVENTS.DELETED, callback);
  }
}
