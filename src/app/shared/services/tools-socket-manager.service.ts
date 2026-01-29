import { Injectable } from '@angular/core';
import { GenericSocketManager } from '../../core/infrastructure/services/generic-socket-manager.service';
import { SocketEventMap } from '../../core/domain/interfaces/socket-event-types';
import { TOOL_EVENTS } from '../constants/socket-events/tools.events';

/**
 * Tool Socket Events Interface
 */
export interface ToolSocketEvents extends SocketEventMap {
  [TOOL_EVENTS.CREATED]: any;
  [TOOL_EVENTS.UPDATED]: any;
  [TOOL_EVENTS.DELETED]: string | { toolId: string };
  [TOOL_EVENTS.ASSIGNED]: any;
  [TOOL_EVENTS.UNASSIGNED]: any;
  [TOOL_EVENTS.REMOVED]: any;
}

/**
 * Tools Socket Manager
 *
 * Manages WebSocket connections and events for tool-related operations.
 */
@Injectable({ providedIn: 'root' })
export class ToolsSocketManager extends GenericSocketManager<ToolSocketEvents> {
  protected socketKey = 'User';
  protected roomName = 'tools';

  onToolCreated(callback: (data: any) => void): void {
    this.listenToEvent(TOOL_EVENTS.CREATED, callback);
  }

  onToolUpdated(callback: (data: any) => void): void {
    this.listenToEvent(TOOL_EVENTS.UPDATED, callback);
  }

  onToolDeleted(callback: (data: any) => void): void {
    this.listenToEvent(TOOL_EVENTS.DELETED, callback);
  }

  onToolAssigned(callback: (data: any) => void): void {
    this.listenToEvent(TOOL_EVENTS.ASSIGNED, callback);
  }

  onToolUnassigned(callback: (data: any) => void): void {
    this.listenToEvent(TOOL_EVENTS.UNASSIGNED, callback);
  }

  onToolRemoved(callback: (data: any) => void): void {
    this.listenToEvent(TOOL_EVENTS.REMOVED, callback);
  }
}
