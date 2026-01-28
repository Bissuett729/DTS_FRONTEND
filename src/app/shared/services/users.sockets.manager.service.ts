import { inject, Injectable, signal } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { StorageUseCase } from '../../core/application';
import { SocketService } from '../../core/infrastructure/services';
import { devLog } from '../helpers';
import { USER_SOCKET_EVENTS } from '../constants';

@Injectable({ providedIn: 'root' })
export class UserSocketsManagerService {
    private readonly socketService = inject(SocketService);
    private readonly storageRepository = inject(StorageUseCase);

    destroy$ = new Subject<void>();

    private readonly socketKey = 'User';

    socketConnected = signal<boolean>(false);

    /**
     * Conecta el socket y escucha el estado de conexión
     * @param destroy$ Subject para desuscripción automática
     */
    connect(): void {
        const token = this.storageRepository.getItem('accessToken');
        if (!token) {
            devLog('No access token found. Socket will not connect.');
            return;
        }

        this.socketService.connect(this.socketKey, token);

        // Escuchar estado de conexión
        this.socketService.isConnected(this.socketKey)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: connected => {
                    this.socketConnected.set(connected);
                    devLog(`🔌 Socket ${connected ? 'connected' : 'disconnected'}`);
                    // Cuando se conecta, unirse al room de usuarios
                    if (connected) {
                        this.socketService.joinRoom(this.socketKey, 'users');
                        devLog('📥 Joined users room for real-time updates');
                    }
                },
                error: err => devLog('Socket connection error:', err)
            });
    }

    /**
     * Desconecta el socket del admin
     */
    disconnect(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.socketService.disconnect(this.socketKey);
        this.socketConnected.set(false);
    }

    /**
     * Emite un evento por socket
     */
    emit(event: string, data?: any): void {
        this.socketService.emit(this.socketKey, event, data);
    }

    /**
     * Escucha un evento de socket
     */
    on<T = any>(event: string): Observable<T> {
        return this.socketService.on<T>(this.socketKey, event);
    }

    // Events
    private listenToSocket<T>(event: string, callBack: (resp: T) => void) {
        this.on<T>(event)
            .pipe(takeUntil(this.destroy$))
            .subscribe(callBack);
    }

    // USER EVENTS
    onUserCreated(callBack: (resp: any) => void) {
        this.listenToSocket(USER_SOCKET_EVENTS.listeners.USER.CREATED, callBack);
    }

    onUserUpdated(callBack: (resp: any) => void) {
        this.listenToSocket(USER_SOCKET_EVENTS.listeners.USER.UPDATED, callBack);
    }

    onUserDeleted(callBack: (resp: any) => void) {
        this.listenToSocket(USER_SOCKET_EVENTS.listeners.USER.DELETED, callBack);
    }

    onUserStatusChanged(callBack: (resp: any) => void) {
        this.listenToSocket(USER_SOCKET_EVENTS.listeners.USER.STATUS_CHANGED, callBack);
    }

    // TOOL EVENTS
    onToolCreated(callBack: (resp: any) => void) {
        this.listenToSocket(USER_SOCKET_EVENTS.listeners.TOOL.CREATED, callBack);
    }

    onToolUpdated(callBack: (resp: any) => void) {
        this.listenToSocket(USER_SOCKET_EVENTS.listeners.TOOL.UPDATED, callBack);
    }

    onToolDeleted(callBack: (resp: any) => void) {
        this.listenToSocket(USER_SOCKET_EVENTS.listeners.TOOL.DELETED, callBack);
    }

    onToolAssigned(callBack: (resp: any) => void) {
        this.listenToSocket(USER_SOCKET_EVENTS.listeners.TOOL.ASSIGNED, callBack);
    }

    onToolUnassigned(callBack: (resp: any) => void) {
        this.listenToSocket(USER_SOCKET_EVENTS.listeners.TOOL.UNASSIGNED, callBack);
    } 

    // TOOL_TEMPLATE EVENTS
    onToolTemplateCreated(callBack: (resp: any) => void) {
        this.listenToSocket(USER_SOCKET_EVENTS.listeners.TOOL_TEMPLATE.CREATED, callBack);
    }

    onToolTemplateUpdated(callBack: (resp: any) => void) {
        this.listenToSocket(USER_SOCKET_EVENTS.listeners.TOOL_TEMPLATE.UPDATED, callBack);
    }

    onToolTemplateDeleted(callBack: (resp: any) => void) {
        this.listenToSocket(USER_SOCKET_EVENTS.listeners.TOOL_TEMPLATE.DELETED, callBack);
    }

    // ROLE EVENTS
    onRoleCreated(callBack: (resp: any) => void) {
        this.listenToSocket(USER_SOCKET_EVENTS.listeners.ROLE.CREATED, callBack);
    }

    onRoleUpdated(callBack: (resp: any) => void) {
        this.listenToSocket(USER_SOCKET_EVENTS.listeners.ROLE.UPDATED, callBack);
    }

    onRoleDeleted(callBack: (resp: any) => void) {
        this.listenToSocket(USER_SOCKET_EVENTS.listeners.ROLE.DELETED, callBack);
    }

    // DEPARTMENT EVENTS
    onDepartmentCreated(callBack: (resp: any) => void) {
        this.listenToSocket(USER_SOCKET_EVENTS.listeners.DEPARTMENT.CREATED, callBack);
    }

    onDepartmentUpdated(callBack: (resp: any) => void) {
        this.listenToSocket(USER_SOCKET_EVENTS.listeners.DEPARTMENT.UPDATED, callBack);
    }

    onDepartmentDeleted(callBack: (resp: any) => void) {
        this.listenToSocket(USER_SOCKET_EVENTS.listeners.DEPARTMENT.DELETED, callBack);
    }

    // BUSINESS_UNIT EVENTS
    onBusinessUnitCreated(callBack: (resp: any) => void) {
        this.listenToSocket(USER_SOCKET_EVENTS.listeners.BUSINESS_UNIT.CREATED, callBack);
    }

    onBusinessUnitUpdated(callBack: (resp: any) => void) {
        this.listenToSocket(USER_SOCKET_EVENTS.listeners.BUSINESS_UNIT.UPDATED, callBack);
    }

    onBusinessUnitDeleted(callBack: (resp: any) => void) {
        this.listenToSocket(USER_SOCKET_EVENTS.listeners.BUSINESS_UNIT.DELETED, callBack);
    }

    // SHIFT EVENTS
    onShiftCreated(callBack: (resp: any) => void) {
        this.listenToSocket(USER_SOCKET_EVENTS.listeners.SHIFT.CREATED, callBack);
    }

    onShiftUpdated(callBack: (resp: any) => void) {
        this.listenToSocket(USER_SOCKET_EVENTS.listeners.SHIFT.UPDATED, callBack);
    }

    onShiftDeleted(callBack: (resp: any) => void) {
        this.listenToSocket(USER_SOCKET_EVENTS.listeners.SHIFT.DELETED, callBack);
    }

    // NOTIFICATION EVENTS
    onNotificationCreated(callBack: (resp: any) => void) {
        this.listenToSocket(USER_SOCKET_EVENTS.listeners.NOTIFICATION.CREATED, callBack);
    }

    onNotificationUpdated(callBack: (resp: any) => void) {
        this.listenToSocket(USER_SOCKET_EVENTS.listeners.NOTIFICATION.UPDATED, callBack);
    }

    onNotificationDeleted(callBack: (resp: any) => void) {
        this.listenToSocket(USER_SOCKET_EVENTS.listeners.NOTIFICATION.DELETED, callBack);
    }
}
