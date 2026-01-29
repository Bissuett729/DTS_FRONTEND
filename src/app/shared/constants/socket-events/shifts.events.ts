/**
 * Shift Socket Events
 * Events emitted by the server for shift-related operations
 */
export const SHIFT_EVENTS = {
  CREATED: 'shift:created',
  UPDATED: 'shift:updated',
  DELETED: 'shift:deleted',
} as const;

export type ShiftEventKey = (typeof SHIFT_EVENTS)[keyof typeof SHIFT_EVENTS];
