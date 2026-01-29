import { inject, Injectable, signal } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SocketService } from './socket.service';
import { StorageUseCase } from '../../application';
import { SocketEventMap, SocketEventCallback } from '../../domain/interfaces/socket-event-types';
import { devLog } from '../../../shared/helpers';

@Injectable()
export abstract class GenericSocketManager<TEvents extends SocketEventMap> {
  protected readonly socketService = inject(SocketService);
  protected readonly storageRepository = inject(StorageUseCase);

  /**
   * Subject for managing subscriptions lifecycle
   */
  protected destroy$ = new Subject<void>();

  /**
   * Socket configuration key (must match SOCKETS_CONFIG)
   * @example 'User', 'Notification', 'Chat'
   */
  protected abstract socketKey: string;

  /**
   * Room name to join after connection
   * @example 'users', 'departments', 'tools'
   */
  protected abstract roomName: string;

  /**
   * Signal indicating socket connection status
   */
  socketConnected = signal<boolean>(false);

  /**
   * Connect to the socket server
   * Automatically retrieves the access token and joins the specified room
   */
  connect(): void {
    const token = this.storageRepository.getItem('accessToken');
    if (!token) {
      devLog(`[${this.roomName}] No access token found. Socket will not connect.`);
      return;
    }

    this.socketService.connect(this.socketKey, token);

    // Listen to connection status
    this.socketService
      .isConnected(this.socketKey)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (connected) => {
          this.socketConnected.set(connected);
          devLog(`🔌 [${this.roomName}] Socket ${connected ? 'connected' : 'disconnected'}`);

          // Join room when connected
          if (connected) {
            this.socketService.joinRoom(this.socketKey, this.roomName);
            devLog(`📥 [${this.roomName}] Joined room for real-time updates`);
          }
        },
        error: (err) => devLog(`[${this.roomName}] Socket connection error:`, err),
      });
  }

  /**
   * Disconnect from the socket server
   * Completes all subscriptions and cleans up resources
   */
  disconnect(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.socketService.disconnect(this.socketKey);
    this.socketConnected.set(false);
    devLog(`🔌 [${this.roomName}] Socket disconnected`);
  }

  /**
   * Emit an event to the server
   * @param event - Event name
   * @param data - Event data
   */
  emit<K extends keyof TEvents>(event: K, data?: TEvents[K]): void {
    this.socketService.emit(this.socketKey, event as string, data);
  }

  /**
   * Listen to a socket event (returns Observable)
   * @param event - Event name to listen to
   * @returns Observable that emits when the event is received
   */
  on<K extends keyof TEvents>(event: K): Observable<TEvents[K]> {
    return this.socketService.on<TEvents[K]>(this.socketKey, event as string);
  }

  /**
   * Listen to a socket event with automatic subscription management
   * @param event - Event name to listen to
   * @param callback - Callback function to execute when event is received
   */
  protected listenToEvent<K extends keyof TEvents>(
    event: K,
    callback: SocketEventCallback<TEvents[K]>,
  ): void {
    this.on<K>(event).pipe(takeUntil(this.destroy$)).subscribe(callback);
  }

  /**
   * Join a specific room
   * @param room - Room name to join
   */
  joinRoom(room: string): void {
    this.socketService.joinRoom(this.socketKey, room);
  }

  /**
   * Leave a specific room
   * @param room - Room name to leave
   */
  leaveRoom(room: string): void {
    this.socketService.leaveRoom(this.socketKey, room);
  }

  /**
   * Emit event and wait for acknowledgement
   * @param event - Event name
   * @param data - Event data
   * @returns Promise with server response
   */
  emitWithAck<K extends keyof TEvents>(event: K, data?: TEvents[K]): Promise<any> {
    return this.socketService.emitWithAck(this.socketKey, event as string, data);
  }
}
