import { Injectable } from '@angular/core';
import { SUPPORT_REPORT_SOCKET_EVENTS } from './sockets.events';
import { GenericSocketManager } from '../../../../../../core/infrastructure/services';
import { SocketEventMap } from '../../../../../../core/domain';

export interface SupportReportSocketEvents extends SocketEventMap {
  [SUPPORT_REPORT_SOCKET_EVENTS.listeners.NEW_BUG_EVENT]: string;
  [SUPPORT_REPORT_SOCKET_EVENTS.listeners.UPDATED_BUG_EVENT]: string;
  [SUPPORT_REPORT_SOCKET_EVENTS.listeners.CLOSED_BUG_EVENT]: string;
  [SUPPORT_REPORT_SOCKET_EVENTS.listeners.COMMENT_ADDED_BUG_EVENT]: string;
  [SUPPORT_REPORT_SOCKET_EVENTS.listeners.DELETED_BUG_EVENT]: string;
  [SUPPORT_REPORT_SOCKET_EVENTS.listeners.HISTORY_ADDED_BUG_EVENT]: string;
  [SUPPORT_REPORT_SOCKET_EVENTS.listeners.STATUS_CHANGED_BUG_EVENT]: string;
  [SUPPORT_REPORT_SOCKET_EVENTS.listeners.IMAGE_ADDED_BUG_EVENT]: string;
}

@Injectable({ providedIn: 'root' })
export class SupportReportSocketManager extends GenericSocketManager<SupportReportSocketEvents> {
  protected socketKey = 'SupportReport';
  protected roomName = 'SupportReportRoom';


  onNewSupportReport(callback: (data: any) => void): void {
    this.listenToEvent(SUPPORT_REPORT_SOCKET_EVENTS.listeners.NEW_BUG_EVENT, callback);
  }
  onUpdatedSupportReport(callback: (data: any) => void): void {
    this.listenToEvent(SUPPORT_REPORT_SOCKET_EVENTS.listeners.UPDATED_BUG_EVENT, callback);
  }
  onClosedSupportReport(callback: (data: any) => void): void {
    this.listenToEvent(SUPPORT_REPORT_SOCKET_EVENTS.listeners.CLOSED_BUG_EVENT, callback);
  }
  onCommentAddedSupportReport(callback: (data: any) => void): void {
    this.listenToEvent(SUPPORT_REPORT_SOCKET_EVENTS.listeners.COMMENT_ADDED_BUG_EVENT, callback);
  }
  onDeletedSupportReport(callback: (data: any) => void): void {
    this.listenToEvent(SUPPORT_REPORT_SOCKET_EVENTS.listeners.DELETED_BUG_EVENT, callback);
  }
  onHistoryAddedSupportReport(callback: (data: any) => void): void {
    this.listenToEvent(SUPPORT_REPORT_SOCKET_EVENTS.listeners.HISTORY_ADDED_BUG_EVENT, callback);
  }
  onStatusChangedSupportReport(callback: (data: any) => void): void {
    this.listenToEvent(SUPPORT_REPORT_SOCKET_EVENTS.listeners.STATUS_CHANGED_BUG_EVENT, callback);
  }
  onAddedImageToSupportReport(callback: (data: any) => void): void {
    this.listenToEvent(SUPPORT_REPORT_SOCKET_EVENTS.listeners.IMAGE_ADDED_BUG_EVENT, callback);
  }
}