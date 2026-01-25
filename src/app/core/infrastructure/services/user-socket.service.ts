import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketService } from './socket.service';
import { IUserSocketService } from '../../domain/services/user-socket.service.interface';
import { IUser } from '../../domain/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserSocketService implements IUserSocketService {
  private readonly socketKey = 'User';

  constructor(private socketService: SocketService) {}

  connect(token: string): void {
    this.socketService.connect(this.socketKey, token);
  }

  disconnect(): void {
    this.socketService.disconnect(this.socketKey);
  }

  isConnected(): Observable<boolean> {
    return this.socketService.isConnected(this.socketKey);
  }

  onUserCreated(): Observable<IUser> {
    return this.socketService.on<IUser>(this.socketKey, 'user:created');
  }

  onUserUpdated(): Observable<IUser> {
    return this.socketService.on<IUser>(this.socketKey, 'user:updated');
  }

  onUserDeleted(): Observable<{ userId: string }> {
    return this.socketService.on<{ userId: string }>(this.socketKey, 'user:deleted');
  }

  onUserStatusChanged(): Observable<{ userId: string; active: boolean }> {
    return this.socketService.on<{ userId: string; active: boolean }>(
      this.socketKey,
      'user:status-changed'
    );
  }

  emit(event: string, data?: any): void {
    this.socketService.emit(this.socketKey, event, data);
  }

  on<T = any>(event: string): Observable<T> {
    return this.socketService.on<T>(this.socketKey, event);
  }
}
