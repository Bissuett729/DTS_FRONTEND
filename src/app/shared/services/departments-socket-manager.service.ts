import { Injectable } from '@angular/core';
import { GenericSocketManager } from '../../core/infrastructure/services/generic-socket-manager.service';
import { SocketEventMap } from '../../core/domain/interfaces/socket-event-types';
import { DEPARTMENT_EVENTS } from '../constants/socket-events/departments.events';

/**
 * Department Socket Events Interface
 */
export interface DepartmentSocketEvents extends SocketEventMap {
  [DEPARTMENT_EVENTS.CREATED]: any;
  [DEPARTMENT_EVENTS.UPDATED]: any;
  [DEPARTMENT_EVENTS.DELETED]: string | { departmentId: string; _id?: string };
}

/**
 * Departments Socket Manager
 *
 * Manages WebSocket connections and events for department-related operations.
 *
 * @example
 * ```typescript
 * private departmentsSocketManager = inject(DepartmentsSocketManager);
 *
 * ngOnInit() {
 *   this.departmentsSocketManager.connect();
 *   this.departmentsSocketManager.onDepartmentCreated((dept) => {
 *     console.log('New department:', dept);
 *   });
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class DepartmentsSocketManager extends GenericSocketManager<DepartmentSocketEvents> {
  protected socketKey = 'User';
  protected roomName = 'departments';

  /**
   * Listen to department created events
   */
  onDepartmentCreated(callback: (data: any) => void): void {
    this.listenToEvent(DEPARTMENT_EVENTS.CREATED, callback);
  }

  /**
   * Listen to department updated events
   */
  onDepartmentUpdated(callback: (data: any) => void): void {
    this.listenToEvent(DEPARTMENT_EVENTS.UPDATED, callback);
  }

  /**
   * Listen to department deleted events
   */
  onDepartmentDeleted(
    callback: (data: string | { departmentId: string; _id?: string }) => void,
  ): void {
    this.listenToEvent(DEPARTMENT_EVENTS.DELETED, callback);
  }
}
