import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AuthRepository, ILogoutResponse } from '../../domain/repositories/auth.repository';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthApiRepository implements AuthRepository {
  private http = inject(HttpClient);
  private authURL = `${environment.userURL}/v1/auth`;
  private userURL = `${environment.userURL}/v1/users`;

  login<T, R>(credentials: T): Observable<R> {
    return this.http.post<R>(`${this.authURL}/login`, credentials).pipe(
      catchError(this.handleError)
    );
  }

  logout(token: string): Observable<ILogoutResponse> {
    return this.http.post<ILogoutResponse>(`${this.authURL}/logout`, {token}).pipe(
      catchError(this.handleError)
    );
  }

  refreshToken<T>(refreshToken: string): Observable<T> {
    return this.http.post<T>(`${this.authURL}/refresh`, { accessToken: refreshToken }).pipe(
      catchError(this.handleError)
    );
  }

  getCurrentUser<T>(): Observable<T> {
    return this.http.get<T>(`${this.authURL}/me`).pipe(
      catchError(this.handleError)
    );
  }

  validateToken(token: string): Observable<boolean> {
    return this.http.post<{ valid: boolean }>(`${this.authURL}/validate-token`, { token }).pipe(
      map(response => response.valid),
      catchError(this.handleError)
    );
  }

  changePassword(id:string, currentPassword: string, newPassword: string): Observable<any> {
    return this.http.patch(`${this.userURL}/${id}/change-password`, { currentPassword, newPassword }).pipe(
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
