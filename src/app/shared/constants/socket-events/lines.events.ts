/**
 * Line Socket Events
 * Events emitted by the DTS server for line-related operations
 */
export const LINE_EVENTS = {
  CREATED: 'line:created',
  UPDATED: 'line:updated',
  DELETED: 'line:deleted',
} as const;

export type LineEventKey = (typeof LINE_EVENTS)[keyof typeof LINE_EVENTS];
