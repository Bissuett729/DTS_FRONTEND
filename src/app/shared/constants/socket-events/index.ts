/**
 * Socket Events - Barrel Export
 *
 * Exports all socket event constants in a modular way.
 * Maintains backward compatibility with the old USER_SOCKET_EVENTS constant.
 */

export * from './users.events';
export * from './tools.events';
export * from './tool-templates.events';
export * from './roles.events';
export * from './departments.events';
export * from './business-units.events';
export * from './shifts.events';
export * from './notifications.events';
export * from './lines.events';
export * from './downtime.events';

// Re-export for backward compatibility
import { USER_EVENTS } from './users.events';
import { TOOL_EVENTS } from './tools.events';
import { TOOL_TEMPLATE_EVENTS } from './tool-templates.events';
import { ROLE_EVENTS } from './roles.events';
import { DEPARTMENT_EVENTS } from './departments.events';
import { BUSINESS_UNIT_EVENTS } from './business-units.events';
import { SHIFT_EVENTS } from './shifts.events';
import { NOTIFICATION_EVENTS } from './notifications.events';

/**
 * @deprecated Use individual event constants instead (USER_EVENTS, TOOL_EVENTS, etc.)
 * This constant is maintained for backward compatibility only.
 */
export const USER_SOCKET_EVENTS = {
  listeners: {
    USER: USER_EVENTS,
    TOOL: TOOL_EVENTS,
    TOOL_TEMPLATE: TOOL_TEMPLATE_EVENTS,
    ROLE: ROLE_EVENTS,
    DEPARTMENT: DEPARTMENT_EVENTS,
    BUSINESS_UNIT: BUSINESS_UNIT_EVENTS,
    SHIFT: SHIFT_EVENTS,
    NOTIFICATION: NOTIFICATION_EVENTS,
  },
} as const;
