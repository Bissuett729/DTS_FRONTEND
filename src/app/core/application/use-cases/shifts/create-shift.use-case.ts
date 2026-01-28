import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ShiftsApiRepository } from '../../../infrastructure/repositories/shifts';
import { CreateShiftDto, IShift } from '../../../domain';

@Injectable({
  providedIn: 'root',
})
export class CreateShiftUseCase {
  constructor(private shiftsRepository: ShiftsApiRepository) {}

  execute(shift: CreateShiftDto): Observable<IShift> {
    return this.shiftsRepository.createShift(shift);
  }
}
