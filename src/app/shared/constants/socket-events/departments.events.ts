/**
 * Department Socket Events
 * Events emitted by the server for department-related operations
 */
export const DEPARTMENT_EVENTS = {
  CREATED: 'department:created',
  UPDATED: 'department:updated',
  DELETED: 'department:deleted',
} as const;

export type DepartmentEventKey = (typeof DEPARTMENT_EVENTS)[keyof typeof DEPARTMENT_EVENTS];
