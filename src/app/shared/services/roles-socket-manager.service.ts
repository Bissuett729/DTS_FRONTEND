import { Injectable } from '@angular/core';
import { GenericSocketManager } from '../../core/infrastructure/services/generic-socket-manager.service';
import { SocketEventMap } from '../../core/domain/interfaces/socket-event-types';
import { ROLE_EVENTS } from '../constants/socket-events/roles.events';

/**
 * Role Socket Events Interface
 */
export interface RoleSocketEvents extends SocketEventMap {
  [ROLE_EVENTS.CREATED]: any;
  [ROLE_EVENTS.UPDATED]: any;
  [ROLE_EVENTS.DELETED]: string | { roleId: string };
  [ROLE_EVENTS.ASSIGNED]: any;
}

/**
 * Roles Socket Manager
 */
@Injectable({ providedIn: 'root' })
export class RolesSocketManager extends GenericSocketManager<RoleSocketEvents> {
  protected socketKey = 'User';
  protected roomName = 'roles';

  onRoleCreated(callback: (data: any) => void): void {
    this.listenToEvent(ROLE_EVENTS.CREATED, callback);
  }

  onRoleUpdated(callback: (data: any) => void): void {
    this.listenToEvent(ROLE_EVENTS.UPDATED, callback);
  }

  onRoleDeleted(callback: (data: any) => void): void {
    this.listenToEvent(ROLE_EVENTS.DELETED, callback);
  }

  onRoleAssigned(callback: (data: any) => void): void {
    this.listenToEvent(ROLE_EVENTS.ASSIGNED, callback);
  }
}
