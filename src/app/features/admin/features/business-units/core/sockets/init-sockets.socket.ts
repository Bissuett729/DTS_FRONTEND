import { inject, Injectable } from '@angular/core';
import { devLog, UserSocketsManagerService } from '../../../../../../shared';
import { IBusinessUnit } from '../../../../../../core/domain';
import { BusinessUnitStateService } from '../../shared/services/business-unit.state.service';

@Injectable({ providedIn: 'root' })
export class InitBusinessUnitsSockets {

    private readonly businessUnitsStateService = inject(BusinessUnitStateService);
    private readonly userSocketsManagerService = inject(UserSocketsManagerService);

    extractPayload<T>(response: any): T {
        if (response?.data) {
            return response.data._doc ? response.data._doc : response.data;
        }
        return response?._doc ? response._doc : response;
    }

    InitSockets() {
        devLog('🎧 Setting up business units socket listeners...');
        this.userSocketsManagerService.onBusinessUnitCreated((response) => {
            const businessUnit = this.extractPayload<IBusinessUnit>(response);
            devLog('🆕 Business Unit created via socket:', businessUnit);
            this.businessUnitsStateService.addBusinessUnit(businessUnit);
        });

        this.userSocketsManagerService.onBusinessUnitUpdated((response) => {
            const payload = this.extractPayload<Partial<IBusinessUnit> & { businessUnitId?: string }>(response);
            devLog('✏️ Business Unit updated via socket:', payload);
            if (payload?._id || payload?.businessUnitId) {
                this.businessUnitsStateService.updateBusinessUnit(payload);
            } else if (payload?.businessUnitId) {
                this.businessUnitsStateService.updateBusinessUnit({ _id: payload.businessUnitId, ...payload });
            }
        });

        this.userSocketsManagerService.onBusinessUnitDeleted((response) => {
            const payload = this.extractPayload<{ businessUnitId?: string; _id?: string }>(response);
            const businessUnitId = payload?.businessUnitId || payload?._id;
            devLog('🗑️ Business Unit deleted via socket:', businessUnitId);
            if (businessUnitId) {
                this.businessUnitsStateService.removeBusinessUnit(businessUnitId);
            }
        });
    }

}
