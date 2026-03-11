import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../../core/application/services/http';
import { environment } from '../../../../environments/environment';
import { finalize } from 'rxjs';
import { AlertService } from '../../../shared';
import { ShiftState } from '../state/shift-state';
import { ApiShift, mapApiShiftsToShifts } from './shift.mapper';

@Injectable({
  providedIn: 'root',
})
export class ShiftRequestService {
  private readonly http = inject(HttpService);
  private readonly alert = inject(AlertService);
  private shiftState = inject(ShiftState);

  private readonly userURL = environment.userURL;

  getShift(loading = true) {
    if (loading) {
      this.shiftState.loadingShifts.set(true);
    }
    this.http
      .get(`${this.userURL}/v1/shifts`)
      .pipe(
        finalize(() => {
          if (loading) {
            this.shiftState.loadingShifts.set(false);
          }
        }),
      )
      .subscribe({
        next: (res: any) => {
          const mapped = mapApiShiftsToShifts(res as ApiShift[]);
          // console.log('mapped:', mapped);
          this.shiftState.shifts.set(mapped);
        },
        error: (err) => {
          this.alert.error('Error al obtener los turnos');
        },
      });
  }

  createShift(payload: {
    shift: string;
    description: string;
    startTime: Date | null;
    endTime: Date | null;
  }) {
    this.shiftState.loadingCreateShift.set(true);
    this.http
      .post(`${this.userURL}/v1/shifts`, payload)
      .pipe(finalize(() => this.shiftState.loadingCreateShift.set(false)))
      .subscribe({
        next: (res: any) => {
          this.alert.success('Turno creado exitosamente');
          this.getShift(false);
        },
        error: (err) => {
          this.alert.error('Error al crear el turno');
        },
      });
  }

  updateShift(id: string, payload: { shift?: string; description?: string; startTime?: Date | null; endTime?: Date | null }) {
    this.shiftState.loadingUpdateShift.set(true);
    this.http
      .put(`${this.userURL}/v1/shifts/${id}`, payload)
      .pipe(finalize(() => this.shiftState.loadingUpdateShift.set(false)))
      .subscribe({
        next: () => {
          this.alert.success('Turno actualizado exitosamente');
          this.getShift(false);
        },
        error: () => this.alert.error('Error al actualizar el turno'),
      });
  }

  deleteShift(id: string) {
    this.shiftState.loadingDeleteShift.set(true);
    this.http
      .delete(`${this.userURL}/v1/shifts/${id}`)
      .pipe(finalize(() => this.shiftState.loadingDeleteShift.set(false)))
      .subscribe({
        next: () => {
          this.alert.success('Turno eliminado exitosamente');
          this.getShift(false);
        },
        error: () => this.alert.error('Error al eliminar el turno'),
      });
  }
}
