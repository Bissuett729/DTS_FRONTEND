import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IShift, UpdateShiftDto } from '../../../domain';
import { ShiftsApiRepository } from '../../../infrastructure/repositories/shifts';

@Injectable({
  providedIn: 'root',
})
export class UpdateShiftUseCase {
  constructor(private shiftsRepository: ShiftsApiRepository) { }

  execute(shiftId: string, shift: UpdateShiftDto): Observable<IShift> {
    return this.shiftsRepository.updateShift(shiftId, shift);
  }
}
