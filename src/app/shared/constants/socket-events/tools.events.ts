/**
 * Tool Socket Events
 * Events emitted by the server for tool-related operations
 */
export const TOOL_EVENTS = {
  CREATED: 'tool:created',
  UPDATED: 'tool:updated',
  DELETED: 'tool:deleted',
  ASSIGNED: 'tool:assigned',
  UNASSIGNED: 'tool:unassigned',
  REMOVED: 'tool:removed',
} as const;

export type ToolEventKey = (typeof TOOL_EVENTS)[keyof typeof TOOL_EVENTS];
