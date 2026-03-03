import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';
import { SOCKETS_CONFIG } from '../config/sockets.config';

interface SocketConnection {
  socket: Socket;
  socketId: string | null;
  connected: BehaviorSubject<boolean>;
}

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private connections: Map<string, SocketConnection> = new Map();

  /**
   * Conectar a un socket específico usando la configuración
   * @param configKey - Clave del socket en SOCKETS_CONFIG (ej: 'User')
   * @param authToken - Token de autenticación opcional
   */
  connect(configKey: string, authToken?: string): void {
    const config = SOCKETS_CONFIG[configKey];

    if (!config) {
      console.error(`Socket configuration not found for key: ${configKey}`);
      return;
    }

    // Si ya existe la conexión, no crear una nueva
    if (this.connections.has(config.name)) {
      console.warn(`Socket ${config.name} already connected`);
      return;
    }

    // Configurar opciones del socket
    const socketOptions: any = {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    };

    // Agregar token si está disponible
    if (authToken) {
      socketOptions.auth = { token: authToken };
    }

    // Crear conexión
    const socket = io(config.url, socketOptions);
    const connectedSubject = new BehaviorSubject<boolean>(false);

    const connection: SocketConnection = {
      socket,
      socketId: null,
      connected: connectedSubject,
    };

    // Event listeners
    socket.on('connect', () => {
      connection.socketId = socket.id || null;
      connectedSubject.next(true);
      // console.log(`✅ Socket ${config.name} connected with ID: ${socket.id}`);
    });

    socket.on('disconnect', (reason: any) => {
      connection.socketId = null;
      connectedSubject.next(false);
      // console.log(`❌ Socket ${config.name} disconnected. Reason: ${reason}`);
    });

    socket.on('connect_error', (error: any) => {
      // console.error(`Socket ${config.name} connection error:`, error);
    });

    socket.on('error', (error: any) => {
      console.error(`Socket ${config.name} error:`, error);
    });

    // Listener genérico para debug - captura TODOS los eventos
    socket.onAny((eventName: string, ...args: any[]) => {
      // console.log(`🔔 Socket ${config.name} received event: ${eventName}`, args);
    });

    this.connections.set(config.name, connection);
  }

  /**
   * Desconectar un socket específico
   * @param configKey - Clave del socket en SOCKETS_CONFIG
   */
  disconnect(configKey: string): void {
    const config = SOCKETS_CONFIG[configKey];

    if (!config) {
      console.error(`Socket configuration not found for key: ${configKey}`);
      return;
    }

    const connection = this.connections.get(config.name);

    if (connection) {
      connection.socket.disconnect();
      connection.connected.complete();
      this.connections.delete(config.name);
      // console.log(`Socket ${config.name} disconnected and removed`);
    }
  }

  /**
   * Obtener el ID del socket conectado
   * @param configKey - Clave del socket en SOCKETS_CONFIG
   * @returns Socket ID o null si no está conectado
   */
  getSocketId(configKey: string): string | null {
    const config = SOCKETS_CONFIG[configKey];

    if (!config) {
      console.error(`Socket configuration not found for key: ${configKey}`);
      return null;
    }

    const connection = this.connections.get(config.name);
    return connection?.socketId || null;
  }

  /**
   * Verificar si un socket está conectado
   * @param configKey - Clave del socket en SOCKETS_CONFIG
   * @returns Observable del estado de conexión
   */
  isConnected(configKey: string): Observable<boolean> {
    const config = SOCKETS_CONFIG[configKey];

    if (!config) {
      console.error(`Socket configuration not found for key: ${configKey}`);
      return new BehaviorSubject<boolean>(false).asObservable();
    }

    const connection = this.connections.get(config.name);
    return (
      connection?.connected.asObservable() || new BehaviorSubject<boolean>(false).asObservable()
    );
  }

  /**
   * Emitir un evento al servidor
   * @param configKey - Clave del socket en SOCKETS_CONFIG
   * @param event - Nombre del evento
   * @param data - Datos a enviar
   */
  emit(configKey: string, event: string, data?: any): void {
    const config = SOCKETS_CONFIG[configKey];

    if (!config) {
      console.error(`Socket configuration not found for key: ${configKey}`);
      return;
    }

    const connection = this.connections.get(config.name);

    if (connection?.socket.connected) {
      connection.socket.emit(event, data);
    } else {
      console.warn(`Socket ${config.name} is not connected. Cannot emit event: ${event}`);
    }
  }

  /**
   * Escuchar eventos del servidor
   * @param configKey - Clave del socket en SOCKETS_CONFIG
   * @param event - Nombre del evento a escuchar
   * @returns Observable con los datos del evento
   */
  on<T = any>(configKey: string, event: string): Observable<T> {
    return new Observable((observer) => {
      const config = SOCKETS_CONFIG[configKey];

      if (!config) {
        console.error(`Socket configuration not found for key: ${configKey}`);
        observer.error(`Socket configuration not found for key: ${configKey}`);
        return;
      }

      const connection = this.connections.get(config.name);

      if (!connection) {
        console.error(`Socket ${config.name} is not connected`);
        observer.error(`Socket ${config.name} is not connected`);
        return;
      }

      const handler = (data: T) => {
        // console.log(`📨 Socket event received: ${event}`, data);
        observer.next(data);
      };

      connection.socket.on(event, handler);
      // console.log(`👂 Listening to socket event: ${event} on ${config.name}`);

      // Cleanup cuando se desuscribe
      return () => {
        connection.socket.off(event, handler);
        // console.log(`🔇 Stopped listening to: ${event}`);
      };
    });
  }

  /**
   * Unirse a un room específico
   * @param configKey - Clave del socket en SOCKETS_CONFIG
   * @param room - Nombre del room
   */
  joinRoom(configKey: string, room: string): void {
    const config = SOCKETS_CONFIG[configKey];

    if (!config) {
      console.error(`Socket configuration not found for key: ${configKey}`);
      return;
    }

    const connection = this.connections.get(config.name);

    if (connection?.socket.connected) {
      connection.socket.emit('join-room', room);
      // console.log(`📥 Joined room: ${room} on socket ${config.name}`);
    } else {
      console.warn(`Socket ${config.name} is not connected. Cannot join room: ${room}`);
    }
  }

  /**
   * Salir de un room específico
   * @param configKey - Clave del socket en SOCKETS_CONFIG
   * @param room - Nombre del room
   */
  leaveRoom(configKey: string, room: string): void {
    const config = SOCKETS_CONFIG[configKey];

    if (!config) {
      console.error(`Socket configuration not found for key: ${configKey}`);
      return;
    }

    const connection = this.connections.get(config.name);

    if (connection?.socket.connected) {
      connection.socket.emit('leave-room', room);
      // console.log(`📤 Left room: ${room} on socket ${config.name}`);
    } else {
      console.warn(`Socket ${config.name} is not connected. Cannot leave room: ${room}`);
    }
  }

  /**
   * Emitir evento y esperar respuesta (con acknowledgement)
   * @param configKey - Clave del socket en SOCKETS_CONFIG
   * @param event - Nombre del evento
   * @param data - Datos a enviar
   * @returns Promise con la respuesta
   */
  emitWithAck<T = any>(configKey: string, event: string, data?: any): Promise<T> {
    return new Promise((resolve, reject) => {
      const config = SOCKETS_CONFIG[configKey];

      if (!config) {
        reject(`Socket configuration not found for key: ${configKey}`);
        return;
      }

      const connection = this.connections.get(config.name);

      if (!connection?.socket.connected) {
        reject(`Socket ${config.name} is not connected`);
        return;
      }

      connection.socket.emit(event, data, (response: T) => {
        resolve(response);
      });
    });
  }

  /**
   * Desconectar todos los sockets
   */
  disconnectAll(): void {
    this.connections.forEach((connection, name) => {
      connection.socket.disconnect();
      connection.connected.complete();
      // console.log(`Socket ${name} disconnected`);
    });
    this.connections.clear();
  }

  /**
   * Obtener la instancia del socket para operaciones avanzadas
   * @param configKey - Clave del socket en SOCKETS_CONFIG
   * @returns Socket instance o undefined
   */
  getSocket(configKey: string): Socket | undefined {
    const config = SOCKETS_CONFIG[configKey];

    if (!config) {
      console.error(`Socket configuration not found for key: ${configKey}`);
      return undefined;
    }

    return this.connections.get(config.name)?.socket;
  }
}
