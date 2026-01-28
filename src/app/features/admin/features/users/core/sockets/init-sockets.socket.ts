import { inject, Injectable } from '@angular/core';
import { devLog, UserSocketsManagerService } from '../../../../../../shared';
import { UsersStateService } from '../../shared/services/users.state.service';

@Injectable({ providedIn: 'root' })
export class InitUserSockets {

    private readonly usersStateService = inject(UsersStateService);
    private readonly userSocketsManagerService = inject(UserSocketsManagerService);

    InitSockets() {
        devLog('🎧 Setting up users socket listeners...');
        this.userSocketsManagerService.onUserCreated((user) => {
            devLog('🆕 User created via socket:', user);
            this.usersStateService.addUser(user.data);
        });

        this.userSocketsManagerService.onUserUpdated((updatedUser) => {
            devLog('✏️ User updated via socket:', updatedUser.data);
            this.usersStateService.updateUser(updatedUser.data);
        });

        this.userSocketsManagerService.onUserDeleted((userId) => {
            devLog('🗑️ User deleted via socket:', userId);
            this.usersStateService.removeUser(userId);
        });

        this.userSocketsManagerService.onUserStatusChanged(({ data: { userId, active } }) => {
            devLog('🔄 User status changed via socket:', userId, active);
            this.usersStateService.toggleUserStatus(userId, active);
        });
    }

}
