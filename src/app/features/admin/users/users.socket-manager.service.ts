import { Injectable, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserSocketService } from '../../../core/infrastructure/services/user-socket.service';
import { StorageRepository } from '../../../core/domain/repositories/storage.repository';
import { UsersStateService } from './users.state.service';

/**
 * Servicio para manejar conexión y eventos WebSocket de usuarios
 * Conecta los eventos del socket con las actualizaciones del estado
 */
@Injectable()
export class UsersSocketManagerService {
  socketConnected = signal<boolean>(false);

  constructor(
    private userSocketService: UserSocketService,
    private storageRepository: StorageRepository,
    private stateService: UsersStateService
  ) {}

  /**
   * Conectar al socket de usuarios
   */
  connect(destroy$: Subject<void>): void {
    const token = this.storageRepository.getItem('accessToken');
    if (!token) {
      console.warn('No access token found. Socket will not connect.');
      return;
    }

    this.userSocketService.connect(token);

    // Escuchar estado de conexión
    this.userSocketService.isConnected()
      .pipe(takeUntil(destroy$))
      .subscribe(connected => {
        this.socketConnected.set(connected);
        console.log(`🔌 Socket ${connected ? 'connected' : 'disconnected'}`);
      });
  }

  /**
   * Configurar listeners para todos los eventos de usuario
   */
  setupListeners(destroy$: Subject<void>): void {
    // Usuario creado
    this.userSocketService.onUserCreated()
      .pipe(takeUntil(destroy$))
      .subscribe(user => {
        console.log('🆕 User created:', user);
        this.stateService.addUser(user);
      });

    // Usuario actualizado
    this.userSocketService.onUserUpdated()
      .pipe(takeUntil(destroy$))
      .subscribe(updatedUser => {
        console.log('✏️ User updated:', updatedUser);
        this.stateService.updateUser(updatedUser);
      });

    // Usuario eliminado
    this.userSocketService.onUserDeleted()
      .pipe(takeUntil(destroy$))
      .subscribe(({ userId }) => {
        console.log('🗑️ User deleted:', userId);
        this.stateService.removeUser(userId);
      });

    // Estado del usuario cambiado
    this.userSocketService.onUserStatusChanged()
      .pipe(takeUntil(destroy$))
      .subscribe(({ userId, active }) => {
        console.log('🔄 User status changed:', userId, active);
        this.stateService.toggleUserStatus(userId, active);
      });
  }

  /**
   * Desconectar del socket
   */
  disconnect(): void {
    this.userSocketService.disconnect();
    this.socketConnected.set(false);
  }
}
