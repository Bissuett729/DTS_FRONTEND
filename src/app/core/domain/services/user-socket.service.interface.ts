import { Observable } from 'rxjs';
import { IUser } from '../interfaces/user.interface';

/**
 * Interfaz para eventos de socket de usuarios
 */
export interface IUserSocketService {
  /**
   * Conectar al socket de usuarios
   */
  connect(token: string): void;

  /**
   * Desconectar del socket de usuarios
   */
  disconnect(): void;

  /**
   * Verificar si está conectado
   */
  isConnected(): Observable<boolean>;

  /**
   * Escuchar cuando un usuario se crea
   */
  onUserCreated(): Observable<IUser>;

  /**
   * Escuchar cuando un usuario se actualiza
   */
  onUserUpdated(): Observable<IUser>;

  /**
   * Escuchar cuando un usuario se elimina
   */
  onUserDeleted(): Observable<{ userId: string }>;

  /**
   * Escuchar cuando un usuario cambia de estado (activo/inactivo)
   */
  onUserStatusChanged(): Observable<{ userId: string; active: boolean }>;

  /**
   * Emitir evento personalizado
   */
  emit(event: string, data?: any): void;

  /**
   * Escuchar evento personalizado
   */
  on<T = any>(event: string): Observable<T>;
}
