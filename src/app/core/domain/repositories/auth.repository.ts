import { Observable } from 'rxjs';

export interface ILogoutResponse {
  message: string;
  success: boolean;
}

export abstract class AuthRepository {
  abstract login<T, R>(credentials: T): Observable<R>;
  abstract logout(): Observable<ILogoutResponse>;
  abstract refreshToken<T>(refreshToken: string): Observable<T>;
  abstract getCurrentUser<T>(): Observable<T>;
  abstract validateToken(token: string): Observable<boolean>;
}
