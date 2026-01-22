import { Observable } from 'rxjs';

export abstract class AuthRepository {
  abstract login<T, R>(credentials: T): Observable<R>;
  abstract logout(): Observable<void>;
  abstract refreshToken(refreshToken: string): Observable<any>;
  abstract getCurrentUser(): Observable<any>;
  abstract validateToken(token: string): Observable<boolean>;
}
