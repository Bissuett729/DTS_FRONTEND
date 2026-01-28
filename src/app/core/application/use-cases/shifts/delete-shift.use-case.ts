import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IShift } from '../../../domain';
import { ShiftsApiRepository } from '../../../infrastructure/repositories/shifts';

@Injectable({
  providedIn: 'root',
})
export class DeleteShiftUseCase {

  constructor(private shiftsRepository: ShiftsApiRepository) { }

  execute(shiftId: string): Observable<IShift> {
    return this.shiftsRepository.deleteShift(shiftId);
  }
}
