import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthApiRepository implements AuthRepository {
  private http = inject(HttpClient);
  private userURL = `${environment.userURL}/v1/auth`;

  login<T, R>(credentials: T): Observable<R> {
    return this.http.post<R>(`${this.userURL}/login`, credentials).pipe(
      catchError(this.handleError)
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.userURL}/logout`, {}).pipe(
      catchError(this.handleError)
    );
  }

  refreshToken(refreshToken: string): Observable<any> {
    return this.http.post<any>(`${this.userURL}/refresh-token`, { refreshToken }).pipe(
      catchError(this.handleError)
    );
  }

  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.userURL}/me`).pipe(
      catchError(this.handleError)
    );
  }

  validateToken(token: string): Observable<boolean> {
    return this.http.post<{ valid: boolean }>(`${this.userURL}/validate-token`, { token }).pipe(
      map(response => response.valid),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || `Error ${error.status}: ${error.statusText}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
