import { isDevMode } from '@angular/core';

/**
 * Log condicional solo en modo desarrollo
 */
export function devLog(...args: any[]) {
  if (isDevMode()) {
    // eslint-disable-next-line no-console
    // console.log(...args);
  }
}
