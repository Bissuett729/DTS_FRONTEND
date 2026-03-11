import { Injectable, signal } from '@angular/core';
import { Shift } from '../shifts';

@Injectable({
  providedIn: 'root'
})
export class ShiftState {
  
  shifts = signal<Shift[]>([]);
  
  loadingShifts = signal<boolean>(false);
  loadingCreateShift = signal<boolean>(false);
  loadingUpdateShift = signal<boolean>(false);
  loadingDeleteShift = signal<boolean>(false);

}
