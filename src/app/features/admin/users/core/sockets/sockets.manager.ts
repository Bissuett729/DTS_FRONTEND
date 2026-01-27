import { Injectable, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserSocketService } from '../../../../../core/infrastructure/services/user-socket.service';
import { StorageRepository } from '../../../../../core/domain/repositories/storage.repository';
import { UsersStateService } from '../../shared/services/users.state.service';

@Injectable()
export class UsersSocketManagerService {
  socketConnected = signal<boolean>(false);

  constructor(
    private userSocketService: UserSocketService,
    private storageRepository: StorageRepository,
    private stateService: UsersStateService
  ) {}

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
        
        // Cuando se conecta, unirse al room de usuarios
        if (connected) {
          this.userSocketService.joinUsersRoom();
          console.log('📥 Joined users room for real-time updates');
        }
      });
  }

  setupListeners(destroy$: Subject<void>): void {
    console.log('🎧 Setting up socket listeners...');
    
    // Usuario creado
    this.userSocketService.onUserCreated()
      .pipe(takeUntil(destroy$))
      .subscribe(user => {
        console.log('🆕 User created via socket:', user);
        this.stateService.addUser(user);
      });

    // Usuario actualizado
    this.userSocketService.onUserUpdated()
      .pipe(takeUntil(destroy$))
      .subscribe(updatedUser => {
        console.log('✏️ User updated via socket:', updatedUser);
        this.stateService.updateUser(updatedUser);
      });

    // Usuario eliminado
    this.userSocketService.onUserDeleted()
      .pipe(takeUntil(destroy$))
      .subscribe(({ userId }) => {
        console.log('🗑️ User deleted via socket:', userId);
        this.stateService.removeUser(userId);
      });

    // Estado del usuario cambiado
    this.userSocketService.onUserStatusChanged()
      .pipe(takeUntil(destroy$))
      .subscribe(({ userId, active }) => {
        console.log('🔄 User status changed via socket:', userId, active);
        this.stateService.toggleUserStatus(userId, active);
      });
      
    console.log('✅ Socket listeners configured successfully');
  }

  disconnect(): void {
    this.userSocketService.disconnect();
    this.socketConnected.set(false);
  }
}
