import { inject, Injectable } from '@angular/core';
import { UserSocketsManagerService } from '../../../../services';
import { devLog } from '../../../../helpers';
import { AuthService, StorageUseCase } from '../../../../../core/application';
import { IUser } from '../../../../../core/domain';

@Injectable({ providedIn: 'root' })
export class InitSidebarSockets {
    private readonly userSocketsManagerService = inject(UserSocketsManagerService);
    private storageRepository = inject(StorageUseCase);
    private authService = inject(AuthService);

    InitSockets() {
        devLog('🎧 Setting up sidebar socket listeners...');
        this.userSocketsManagerService.onUserUpdated((resp: { timestamp: Date, data: IUser }) => {
            if(resp?.data?._id === this.authService.user()?._id) {
                devLog('🔄 [InitSidebarSockets] [InitSockets] Current user updated via socket:', resp.data);
                this.authService.userSignal.set(resp.data);
                this.storageRepository.setItem('user', JSON.stringify(resp.data));
            }
            devLog('🆕 [InitSidebarSockets] [InitSockets] User updated via socket:', resp.data);
        });
    }

}
