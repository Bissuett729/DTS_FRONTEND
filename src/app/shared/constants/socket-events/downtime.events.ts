/**
 * DownTime Socket Events
 * Events emitted by the DTS server for downtime-related operations
 */
export const DOWNTIME_EVENTS = {
  CREATED: 'downtime:created',
  UPDATED: 'downtime:updated',
  DELETED: 'downtime:deleted',
} as const;

export type DowntimeEventKey = (typeof DOWNTIME_EVENTS)[keyof typeof DOWNTIME_EVENTS];
