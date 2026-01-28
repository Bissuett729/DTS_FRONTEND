import { Injectable, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { IShift } from '../../../../../../core/domain';
import { GetShiftsUseCase } from '../../../../../../core/application/use-cases/shifts';

@Injectable({ providedIn: 'root' })
export class ShiftStateService {
  loading = signal<boolean>(false);
  shifts = signal<IShift[]>([]);

  constructor(private getShiftsUseCase: GetShiftsUseCase) { }

  loadShifts(destroy$: Subject<void>): void {
    if (this.loading()) return;
    this.loading.set(true);
    this.getShiftsUseCase.execute()
      .pipe(takeUntil(destroy$))
      .subscribe({
        next: (shifts) => {
          this.shifts.set(shifts);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading shifts:', error);
          this.loading.set(false);
        }
      });
  }

  addShift(shift: IShift): void {
    // Si existe, actualizar; si no, agregar al inicio
    this.shifts.update(shifts => {
      const index = shifts.findIndex(s => s._id === shift._id);
      if (index !== -1) {
        // Actualizar el existente
        return shifts.map(s =>
          s._id === shift._id ? { ...s, ...shift } : s
        );
      } else {
        // Agregar al inicio
        return [shift, ...shifts];
      }
    });
  }

  updateShift(updatedShift: any): void {
    this.shifts.update(shifts =>
      shifts.map(shift => {
        const shiftIdToMatch = updatedShift._id
        if (shift._id === shiftIdToMatch) {
          // Merge para preservar relaciones populadas que puedan venir del listado inicial
          return {
            ...shift,
            ...updatedShift,
            _id: shift._id, // Preservar el _id original
          };
        }
        return shift;
      })
    );
  }

  removeShift(shiftId: string): void {
    this.shifts.update(shifts => shifts.filter(shift => shift._id !== shiftId));
  }

  clear(): void {
    this.loading.set(false);
  }
}