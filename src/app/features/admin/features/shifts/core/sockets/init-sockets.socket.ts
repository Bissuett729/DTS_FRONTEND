import { inject, Injectable } from '@angular/core';
import { devLog } from '../../../../../../shared';
import { ShiftStateService } from '../../shared/services/shift.state.service';
import { IShift } from '../../../../../../core/domain';
import { ShiftsSocketManager } from '../../../../../../shared/services/shifts-socket-manager.service';

@Injectable({ providedIn: 'root' })
export class InitShiftsSockets {
  private readonly shiftsStateService = inject(ShiftStateService);
  private readonly shiftsSocketManager = inject(ShiftsSocketManager);

  extractPayload<T>(response: any): T {
    if (response?.data) {
      return response.data._doc ? response.data._doc : response.data;
    }
    return response?._doc ? response._doc : response;
  }

  InitSockets() {
    devLog('🎧 Setting up shifts socket listeners...');
    this.shiftsSocketManager.onShiftCreated((response) => {
      devLog('🆕 Shift created via socket:', response);
      const shift = this.extractPayload<IShift>(response);
      this.shiftsStateService.addShift(shift);
    });

    this.shiftsSocketManager.onShiftUpdated((response) => {
      devLog('✏️ Shift updated via socket:', response);
      const payload = this.extractPayload<Partial<IShift> & { shiftId?: string }>(response);
      if (payload?._id || payload?.shiftId) {
        this.shiftsStateService.updateShift(payload);
      } else if (payload?.shiftId) {
        this.shiftsStateService.updateShift({ _id: payload.shiftId, ...payload });
      }
    });

    this.shiftsSocketManager.onShiftDeleted((response) => {
      devLog('🗑️ Shift deleted via socket:', response);
      const payload = this.extractPayload<{ shiftId?: string; _id?: string }>(response);
      const shiftId = payload?.shiftId || payload?._id;
      if (shiftId) {
        this.shiftsStateService.removeShift(shiftId);
      }
    });
  }
}
