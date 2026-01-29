import { inject, Injectable } from '@angular/core';
import { devLog } from '../../../../../../shared';
import { ToolsStateService } from '../../shared/services/tools.state.service';
import { ITool } from '../../../../../../core/domain';
import { ToolsSocketManager } from '../../../../../../shared/services/tools-socket-manager.service';

@Injectable({ providedIn: 'root' })
export class InitToolsSockets {
  private readonly toolsStateService = inject(ToolsStateService);
  private readonly toolsSocketManager = inject(ToolsSocketManager);

  extractPayload<T>(response: any): T {
    if (response?.data) {
      return response.data._doc ? response.data._doc : response.data;
    }
    return response?._doc ? response._doc : response;
  }

  InitSockets() {
    devLog('🎧 Setting up tools socket listeners...');
    this.toolsSocketManager.onToolCreated((response) => {
      const tool = this.extractPayload<ITool>(response);
      devLog('🆕 Tool created via socket:', tool);
      this.toolsStateService.addTool(tool);
    });

    this.toolsSocketManager.onToolUpdated((response) => {
      const payload = this.extractPayload<Partial<ITool> & { toolId?: string }>(response);
      devLog('✏️ Tool updated via socket:', payload);
      if (payload?._id || payload?.toolId) {
        this.toolsStateService.updateTool(payload);
      } else if (payload?.toolId) {
        this.toolsStateService.updateTool({ _id: payload.toolId, ...payload });
      }
    });

    this.toolsSocketManager.onToolDeleted((response) => {
      const payload = this.extractPayload<{ toolId?: string; _id?: string }>(response);
      const toolId = payload?.toolId || payload?._id;
      devLog('🗑️ Tool deleted via socket:', toolId);
      if (toolId) {
        this.toolsStateService.removeTool(toolId);
      }
    });
  }
}
