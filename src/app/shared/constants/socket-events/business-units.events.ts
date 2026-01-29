/**
 * Business Unit Socket Events
 * Events emitted by the server for business unit operations
 */
export const BUSINESS_UNIT_EVENTS = {
  CREATED: 'business-unit:created',
  UPDATED: 'business-unit:updated',
  DELETED: 'business-unit:deleted',
} as const;

export type BusinessUnitEventKey = (typeof BUSINESS_UNIT_EVENTS)[keyof typeof BUSINESS_UNIT_EVENTS];
