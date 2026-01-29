/**
 * Role Socket Events
 * Events emitted by the server for role-related operations
 */
export const ROLE_EVENTS = {
  CREATED: 'role:created',
  UPDATED: 'role:updated',
  DELETED: 'role:deleted',
  ASSIGNED: 'role:assigned',
} as const;

export type RoleEventKey = (typeof ROLE_EVENTS)[keyof typeof ROLE_EVENTS];
