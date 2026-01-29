/**
 * Notification Socket Events
 * Events emitted by the server for notification operations
 */
export const NOTIFICATION_EVENTS = {
  CREATED: 'notification:created',
  UPDATED: 'notification:updated',
  DELETED: 'notification:deleted',
} as const;

export type NotificationEventKey = (typeof NOTIFICATION_EVENTS)[keyof typeof NOTIFICATION_EVENTS];
