/**
 * Tool Template Socket Events
 * Events emitted by the server for tool template operations
 */
export const TOOL_TEMPLATE_EVENTS = {
  CREATED: 'tool-template:created',
  UPDATED: 'tool-template:updated',
  DELETED: 'tool-template:deleted',
  APPLIED: 'tool-template:applied',
} as const;

export type ToolTemplateEventKey = (typeof TOOL_TEMPLATE_EVENTS)[keyof typeof TOOL_TEMPLATE_EVENTS];
