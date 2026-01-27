import { Injectable, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserSocketService } from '../../../../../core/infrastructure/services/user-socket.service';
import { StorageRepository } from '../../../../../core/domain/repositories/storage.repository';
import { ToolsStateService } from '../../shared/services/tools.state.service';

@Injectable()
export class ToolsSocketManagerService {
  socketConnected = signal<boolean>(false);

  constructor(
    private userSocketService: UserSocketService,
    private storageRepository: StorageRepository,
    private stateService: ToolsStateService
  ) {}

  connect(destroy$: Subject<void>): void {
    const token = this.storageRepository.getItem('accessToken');
    if (!token) {
      console.warn('No access token found. Socket will not connect.');
      return;
    }

    this.userSocketService.connect(token);

    // Listen for connection status
    this.userSocketService.isConnected()
      .pipe(takeUntil(destroy$))
      .subscribe(connected => {
        this.socketConnected.set(connected);
        console.log(`🔌 Socket ${connected ? 'connected' : 'disconnected'}`);
      });
  }

  setupListeners(destroy$: Subject<void>): void {
    console.log('🎧 Setting up tools socket listeners...');
    
    // Tool created
    this.userSocketService.on('tool:created')
      .pipe(takeUntil(destroy$))
      .subscribe((response: any) => {
        // Extract data: { timestamp, data: {...} }
        const payload = response?.data || response;
        // If payload has _doc (Mongoose document), extract from there
        const tool = payload?._doc || payload;
        console.log('🆕 Tool created via socket:', tool);
        this.stateService.addTool(tool);
      });

    // Tool updated
    this.userSocketService.on('tool:updated')
      .pipe(takeUntil(destroy$))
      .subscribe((response: any) => {
        // Backend sends: { timestamp, data: { toolId, ...toolData } }
        const payload = response?.data || response;
        // If payload has _doc (Mongoose document), extract from there
        const toolData = payload?._doc || payload;
        
        console.log('✏️ Tool updated via socket:', toolData);
        
        // If toolData is the complete tool (has _id), update it directly
        if (toolData?._id || toolData?.id) {
          this.stateService.updateTool(toolData);
        } else if (payload?.toolId) {
          // If only toolId comes with partial data, update directly with partial data
          this.stateService.updateTool({ _id: payload.toolId, ...payload });
        }
      });

    // Tool deleted
    this.userSocketService.on('tool:deleted')
      .pipe(takeUntil(destroy$))
      .subscribe((response: any) => {
        const payload = response?.data || response;
        const toolId = payload?.toolId || payload?._id;
        console.log('🗑️ Tool deleted via socket:', toolId);
        if (toolId) {
          this.stateService.removeTool(toolId);
        }
      });

    console.log('✅ Tools socket listeners configured');
  }

  disconnect(): void {
    this.userSocketService.disconnect();
    this.socketConnected.set(false);
    console.log('🔌 Tools socket disconnected');
  }
}
