import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

// Importa el cliente HTTP de Angular
import { HttpClient } from '@angular/common/http';

// Importa decoradores y ciclo de vida de Angular
import { inject, Injectable, OnDestroy } from '@angular/core';

// Importa utilidades personalizadas para encabezados, reintentos y manejo de errores
import { ContentType } from './type';
import { buildHeaders } from './httpHeaders.util';
import { retryStrategy } from './httpRetry.strategy';
import { HttpErrorHandlerService } from './httpErrorHandler';

// Marca esta clase como inyectable y disponible en toda la aplicación
@Injectable({ providedIn: 'root' })
export class HttpService implements OnDestroy {

  // Subject que se usa para cancelar suscripciones activas cuando el servicio se destruye
  private destroy$ = new Subject<void>();

  // Inyección del cliente HTTP de Angular
  private readonly http = inject(HttpClient);
  private readonly httpErrorHandlerService = inject(HttpErrorHandlerService);

  /**
   * Método privado genérico para realizar peticiones HTTP.
   * @param method - Método HTTP (GET, POST, PUT, etc.)
   * @param url - URL del recurso
   * @param body - Cuerpo de la petición (opcional)
   * @returns Observable con la respuesta tipada
   * @contentType Headers personalizados ( opcional )
   */

  private request<T>(method: string, url: string, body?: unknown, contentType?: ContentType, maxRetries?: number, delayMs?: number): Observable<T> {

    const headers = buildHeaders(contentType ? contentType : {});

    return this.http.request<T>(method, url, { body, headers }).pipe(

      takeUntil(this.destroy$),
      retryStrategy(maxRetries, delayMs),
      this.httpErrorHandlerService.handleHttpError<T>()

    );

  };

  // Métodos públicos para cada tipo de petición HTTP
  public get<T>(url: string, contentType?: ContentType, maxRetries?: number, delayMs?: number): Observable<T> {
    return this.request<T>('GET', url, undefined, contentType, maxRetries, delayMs);
  };

  public post<T>(url: string, body: unknown, contentType?: ContentType, maxRetries?: number, delayMs?: number): Observable<T> {
    return this.request<T>('POST', url, body, contentType, maxRetries, delayMs);
  };

  public put<T>(url: string, body: unknown, contentType?: ContentType, maxRetries?: number, delayMs?: number): Observable<T> {
    return this.request<T>('PUT', url, body, contentType, maxRetries, delayMs);
  };

  public patch<T>(url: string, body: unknown, contentType?: ContentType, maxRetries?: number, delayMs?: number): Observable<T> {
    return this.request<T>('PATCH', url, body, contentType, maxRetries, delayMs);
  };

  public delete<T>(url: string, contentType?: ContentType, maxRetries?: number, delayMs?: number): Observable<T> {
    return this.request<T>('DELETE', url, undefined, contentType, maxRetries, delayMs);
  };

  public download<T>(url: string): Observable<Blob> {
    return this.request<Blob>('GET', url, {
      "responseType": 'blob' as 'json',
    });
  }

  public downloadWithPayload<T>(url: string, body: unknown, maxRetries?: number): Observable<Blob> {
    return this.request<Blob>('POST', url, body, {
      "responseType": 'blob' as 'json',
    },  maxRetries);
  }
  public downloadWithPayloadAsBlob<T>(url: string, body: unknown, maxRetries?: number): Observable<Blob> {
    return this.request<Blob>('POST', url, body, {
      "responseType": 'blob',
    },  maxRetries);
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el servicio se destruye.
   * Se utiliza para limpiar recursos y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();     // Emite un valor para cancelar las suscripciones
    this.destroy$.complete(); // Completa el Subject
  }

}