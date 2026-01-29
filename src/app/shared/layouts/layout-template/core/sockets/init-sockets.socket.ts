import { inject, Injectable } from '@angular/core';
import { devLog } from '../../../../helpers';
import { GlobalStateService, StorageUseCase } from '../../../../../core/application';
import { IUser, ITool } from '../../../../../core/domain';
import { UsersSocketManager } from '../../../../services/users-socket-manager.service';
import { ToolsSocketManager } from '../../../../services/tools-socket-manager.service';

@Injectable({ providedIn: 'root' })
export class InitSidebarSockets {
  private readonly usersSocketManager = inject(UsersSocketManager);
  private readonly toolsSocketManager = inject(ToolsSocketManager);
  private storageRepository = inject(StorageUseCase);
  private globalState = inject(GlobalStateService);

  InitSockets() {
    devLog('🎧 Setting up sidebar socket listeners...');

    // Listen for current user updates
    this.usersSocketManager.onUserUpdated((resp: { timestamp: Date; data: IUser }) => {
      // Compare with current user from global state
      if (resp?.data?._id === this.globalState.currentUser()?._id) {
        devLog('🔄 [InitSidebarSockets] [InitSockets] Current user updated via socket:', resp.data);
        this.globalState.setUser(resp.data);
      }
      devLog('🆕 [InitSidebarSockets] [InitSockets] User updated via socket:', resp.data);
    });

    // Listen for global tool updates to synchronize user's local tools
    this.toolsSocketManager.onToolUpdated((resp: { timestamp: Date; data: ITool }) => {
      const currentUser = this.globalState.currentUser();
      if (!currentUser || !currentUser.tools) return;

      const updatedTool = resp.data;
      if (!updatedTool || !updatedTool._id) {
        devLog('⚠️ [InitSidebarSockets] Received tool update with invalid data:', resp);
        return;
      }

      const toolIndex = currentUser.tools.findIndex((t) => t._id === updatedTool._id);

      if (toolIndex !== -1) {
        devLog(
          `🔧 [InitSidebarSockets] Tool found in user list: ${updatedTool.title} (ID: ${updatedTool._id})`,
        );

        let newTools = [...currentUser.tools];

        // Decidir si actualizar o quitar según estado activo y modo
        // Si la tool está inactiva, la quitamos directamente del array para forzar su remoción
        if (updatedTool.active === false) {
          devLog(
            '🚫 [InitSidebarSockets] Tool is now inactive, removing from user list:',
            updatedTool.title,
          );
          newTools = newTools.filter((t) => t._id !== updatedTool._id);
        } else {
          devLog(
            '📝 [InitSidebarSockets] Updating tool definition for current user:',
            updatedTool.title,
          );
          newTools[toolIndex] = updatedTool;
        }

        // Update user state
        this.globalState.updateUserField('tools', newTools);
      } else {
        devLog(`ℹ️ [InitSidebarSockets] Updated tool not in user list: ${updatedTool.title}`);
      }
    });

    // Handle tool deletion
    this.toolsSocketManager.onToolDeleted(
      (resp: { timestamp: Date; data: string | { toolId: string } | any }) => {
        const currentUser = this.globalState.currentUser();
        if (!currentUser || !currentUser.tools) return;

        // Extraer ID de forma robusta
        const deletedToolId =
          typeof resp.data === 'string'
            ? resp.data
            : resp.data?.toolId || resp.data?._id || resp.data?.id;

        if (!deletedToolId) {
          devLog('⚠️ [InitSidebarSockets] Could not extract deleted tool ID:', resp);
          return;
        }

        const toolExists = currentUser.tools.some((t) => t._id === deletedToolId);

        if (toolExists) {
          devLog('🗑️ [InitSidebarSockets] Removing deleted tool from user list:', deletedToolId);
          const newTools = currentUser.tools.filter((t) => t._id !== deletedToolId);
          this.globalState.updateUserField('tools', newTools);
        }
      },
    );
  }
}
