import { inject, Injectable } from '@angular/core';
import { devLog } from '../../../../../../shared';
import { UsersStateService } from '../../shared/services/users.state.service';
import { UsersSocketManager } from '../../../../../../shared/services/users-socket-manager.service';

@Injectable({ providedIn: 'root' })
export class InitUserSockets {
  private readonly usersStateService = inject(UsersStateService);
  private readonly usersSocketManager = inject(UsersSocketManager);

  InitSockets() {
    devLog('🎧 Setting up users socket listeners...');
    this.usersSocketManager.onUserCreated((user) => {
      devLog('🆕 User created via socket:', user);
      this.usersStateService.addUser(user.data);
    });

    this.usersSocketManager.onUserUpdated((updatedUser) => {
      devLog('✏️ User updated via socket:', updatedUser.data);
      this.usersStateService.updateUser(updatedUser.data);
    });

    this.usersSocketManager.onUserDeleted((userId) => {
      devLog('🗑️ User deleted via socket:', userId);
      const id = typeof userId === 'string' ? userId : userId.userId;
      this.usersStateService.removeUser(id);
    });

    this.usersSocketManager.onUserStatusChanged(({ data: { userId, active } }) => {
      devLog('🔄 User status changed via socket:', userId, active);
      this.usersStateService.toggleUserStatus(userId, active);
    });
  }
}
