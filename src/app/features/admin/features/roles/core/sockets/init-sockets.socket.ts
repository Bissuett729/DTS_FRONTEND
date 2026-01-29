import { inject, Injectable } from '@angular/core';
import { devLog } from '../../../../../../shared';
import { IRole } from '../../../../../../core/domain';
import { RolesStateService } from '../../shared/services/roles.state.service';
import { RolesSocketManager } from '../../../../../../shared/services/roles-socket-manager.service';

@Injectable({ providedIn: 'root' })
export class InitRolesSockets {
  private readonly rolesStateService = inject(RolesStateService);
  private readonly rolesSocketManager = inject(RolesSocketManager);

  extractPayload<T>(response: any): T {
    if (response?.data) {
      return response.data._doc ? response.data._doc : response.data;
    }
    return response?._doc ? response._doc : response;
  }

  InitSockets() {
    devLog('🎧 Setting up roles socket listeners...');
    this.rolesSocketManager.onRoleCreated((response) => {
      const role = this.extractPayload<IRole>(response);
      devLog('🆕 Role created via socket:', role);
      this.rolesStateService.addRole(role);
    });

    this.rolesSocketManager.onRoleUpdated((response) => {
      const payload = this.extractPayload<Partial<IRole> & { roleId?: string }>(response);
      devLog('✏️ Role updated via socket:', payload);
      if (payload?._id || payload?.roleId) {
        this.rolesStateService.updateRole(payload);
      } else if (payload?.roleId) {
        this.rolesStateService.updateRole({ _id: payload.roleId, ...payload });
      }
    });

    this.rolesSocketManager.onRoleDeleted((response) => {
      const payload = this.extractPayload<{ roleId?: string; _id?: string }>(response);
      const roleId = payload?.roleId || payload?._id;
      devLog('🗑️ Role deleted via socket:', roleId);
      if (roleId) {
        this.rolesStateService.removeRole(roleId);
      }
    });
  }
}
