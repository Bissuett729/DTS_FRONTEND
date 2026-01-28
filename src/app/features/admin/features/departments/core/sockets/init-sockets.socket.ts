import { inject, Injectable } from '@angular/core';
import { devLog, UserSocketsManagerService } from '../../../../../../shared';
import { IDepartment } from '../../../../../../core/domain';
import { DepartmentsStateService } from '../../shared/services/departments.state.service';

@Injectable({ providedIn: 'root' })
export class InitDepartmentsSockets {

    private readonly departmentsStateService = inject(DepartmentsStateService);
    private readonly userSocketsManagerService = inject(UserSocketsManagerService);

    extractPayload<T>(response: any): T {
        if (response?.data) {
            return response.data._doc ? response.data._doc : response.data;
        }
        return response?._doc ? response._doc : response;
    }

    InitSockets() {
        devLog('🎧 Setting up departments socket listeners...');
        this.userSocketsManagerService.onDepartmentCreated((response) => {
            const department = this.extractPayload<IDepartment>(response);
            devLog('🆕 Department created via socket:', department);
            this.departmentsStateService.addDepartment(department);
        });

        this.userSocketsManagerService.onDepartmentUpdated((response) => {
            const payload = this.extractPayload<Partial<IDepartment> & { departmentId?: string }>(response);
            devLog('✏️ Department updated via socket:', payload);
            if (payload?._id || payload?.departmentId) {
                this.departmentsStateService.updateDepartment(payload);
            } else if (payload?.departmentId) {
                this.departmentsStateService.updateDepartment({ _id: payload.departmentId, ...payload });
            }
        });

        this.userSocketsManagerService.onDepartmentDeleted((response) => {
            const payload = this.extractPayload<{ departmentId?: string; _id?: string }>(response);
            const departmentId = payload?.departmentId || payload?._id;
            devLog('🗑️ Department deleted via socket:', departmentId);
            if (departmentId) {
                this.departmentsStateService.removeDepartment(departmentId);
            }
        });
    }

}
