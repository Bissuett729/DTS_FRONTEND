import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IShift } from '../../../domain';
import { ShiftsApiRepository } from '../../../infrastructure/repositories/shifts';

@Injectable({
  providedIn: 'root',
})
export class GetShiftsUseCase {
  constructor(private shiftsRepository: ShiftsApiRepository) {}

  execute(): Observable<IShift[]> {
    return this.shiftsRepository.getShifts();
  }
}
