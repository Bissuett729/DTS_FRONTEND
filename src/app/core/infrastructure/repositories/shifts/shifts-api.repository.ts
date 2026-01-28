import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { CreateShiftDto, IShift, ShiftsRepository, UpdateShiftDto } from '../../../domain';

@Injectable({
  providedIn: 'root'
})
export class ShiftsApiRepository extends ShiftsRepository {
  private http = inject(HttpClient);
  private shiftsURL = `${environment.userURL}/v1/shifts`;

  getShifts(): Observable<IShift[]> {
    return this.http.get<IShift[]>(this.shiftsURL);
  }

  createShift(shift: CreateShiftDto): Observable<IShift> {
    return this.http.post<IShift>(this.shiftsURL, shift);
  }

  updateShift(shiftId: string, shift: UpdateShiftDto): Observable<IShift> {
    return this.http.put<IShift>(`${this.shiftsURL}/${shiftId}`, shift);
  }

  deleteShift(shiftId: string): Observable<IShift> {
    return this.http.delete<IShift>(`${this.shiftsURL}/${shiftId}`);
  }
}

export const SHIFTS_REPOSITORY_PROVIDER = {
  provide: ShiftsRepository,
  useExisting: ShiftsApiRepository
};
