/*La función retryStrategy define una estrategia de reintento personalizada para flujos observables en RxJS. 
Permite reintentar una operación fallida un número determinado de veces, con un retraso incremental entre cada intento.
Este servicio aplica buenas prácticas como:

Control de reintentos: Evita reintentos infinitos que podrían saturar el sistema.
Retrasos progresivos: Mejora la estabilidad al espaciar los intentos.
Reutilizable y configurable: Puede aplicarse a cualquier flujo observable con errores transitorios (como peticiones HTTP).*/

import { timer, throwError } from 'rxjs';
import { retryWhen, mergeMap } from 'rxjs/operators';


import { OperatorFunction } from 'rxjs';

export function retryStrategy<T>(maxRetries = 3, delayMs = 1000): OperatorFunction<T, T> {
  return retryWhen(errors =>
    errors.pipe(
      mergeMap((error, i) => i < maxRetries ? timer(delayMs * (i + 1)) : throwError(() => error))
    )
  );
}
