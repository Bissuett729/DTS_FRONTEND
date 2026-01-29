/**
 * Base interface for socket event maps
 * Each feature should define its own event map extending this interface
 */
export interface SocketEventMap {
  [eventName: string]: any;
}

/**
 * Generic CRUD events interface
 * Provides standard create, update, delete event types
 */
export interface CRUDEvents<T> extends SocketEventMap {
  created: T;
  updated: T | Partial<T>;
  deleted: string | { id: string; _id?: string };
}

/**
 * Extended CRUD events with status changes
 */
export interface CRUDEventsWithStatus<T> extends CRUDEvents<T> {
  'status-changed': { id: string; active: boolean } | { userId: string; active: boolean };
}

/**
 * Socket event callback type
 */
export type SocketEventCallback<T> = (data: T) => void;

/**
 * Socket event configuration
 */
export interface SocketEventConfig<TEventMap extends SocketEventMap> {
  [K: string]: keyof TEventMap;
}
