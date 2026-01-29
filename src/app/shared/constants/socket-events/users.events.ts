/**
 * User Socket Events
 * Events emitted by the server for user-related operations
 */
export const USER_EVENTS = {
  CREATED: 'user:created',
  UPDATED: 'user:updated',
  DELETED: 'user:deleted',
  PASSWORD_CHANGED: 'user:password-changed',
  PROFILE_IMAGE_UPDATED: 'user:profile-image-updated',
  STATUS_CHANGED: 'user:status-changed',
} as const;

export type UserEventKey = (typeof USER_EVENTS)[keyof typeof USER_EVENTS];
