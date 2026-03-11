import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../../core/application/services/http';
import { environment } from '../../../../environments/environment';
import { finalize } from 'rxjs';
import { AlertService } from '../../../shared';
import { DowntimeState } from '../state/downtime-state';
import { IDepartment } from '../interfaces/department.interface';
import { ILine } from '../interfaces/line.interface';
import { IShift } from '../interfaces/shift.interface';

@Injectable({
  providedIn: 'root',
})
export class DowntimeRequestService {
  private readonly http = inject(HttpService);
  private readonly alert = inject(AlertService);
  private downtimeState = inject(DowntimeState);

  private readonly dtsURL = environment.dtsURL;
  private readonly userURL = environment.userURL;

  async getDepartments(loading = true) {
    if (loading) this.downtimeState.loadingDepartments.set(true);
    this.http
      .get<IDepartment[]>(`${this.dtsURL}/v1/department`)
      .pipe(
        finalize(() => {
          if (loading) this.downtimeState.loadingDepartments.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          this.downtimeState.departments.set(res);
        },
        error: () => this.alert.error('Error al obtener los departamentos'),
      });
  }

  async getLines(loading = true) {
    if (loading) this.downtimeState.loadingLines.set(true);
    this.http
      .get<ILine[]>(`${this.dtsURL}/v1/line`)
      .pipe(
        finalize(() => {
          if (loading) this.downtimeState.loadingLines.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          this.downtimeState.lines.set(res);
        },
        error: () => this.alert.error('Error al obtener las líneas'),
      });
  }

  async getShift(loading = true) {
    if (loading) {
      this.downtimeState.loadingShifts.set(true);
    }
    this.http
      .get<IShift[]>(`${this.userURL}/v1/shifts`)
      .pipe(
        finalize(() => {
          if (loading) {
            this.downtimeState.loadingShifts.set(false);
          }
        }),
      )
      .subscribe({
        next: (res) => {
          this.downtimeState.shifts.set(res);
        },
        error: () => {
          this.alert.error('Error al obtener los turnos');
        },
      });
  }

  createDowntime(
    payload: {
      startTime: Date;
      endTime: Date;
      week?: number;
      shift?: string;
      line?: string;
      stage?: string;
      supervisor?: string;
      registeredBy?: string;
      standardOutput?: number;
      currentOutput?: number;
      efficiency?: number;
      downTimeGenerated?: number;
      downTimeUnreported?: number;
      downTimeReported?: number;
      classification?: { downTimeGenerated: number; department: string; reason: string }[];
    },
    onSuccess?: () => void,
  ) {
    this.downtimeState.loadingCreateDowntime.set(true);
    this.http
      .post(`${this.dtsURL}/v1/down-time`, payload)
      .pipe(finalize(() => this.downtimeState.loadingCreateDowntime.set(false)))
      .subscribe({
        next: () => {
          this.alert.success('Downtime registrado exitosamente');
          onSuccess?.();
        },
        error: () => this.alert.error('Error al registrar el downtime'),
      });
  }

  getDowntimes(filters?: { page?: number; limit?: number; week?: number; shift?: string; line?: string; stage?: string }) {
    this.downtimeState.loadingDowntimes.set(true);
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null) params.append(k, String(v));
      });
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    this.http
      .get<any>(`${this.dtsURL}/v1/down-time${query}`)
      .pipe(finalize(() => this.downtimeState.loadingDowntimes.set(false)))
      .subscribe({
        next: (res: any) => {
          this.downtimeState.downtimes.set(Array.isArray(res) ? res : (res.data ?? res.items ?? []));
        },
        error: () => this.alert.error('Error al obtener los downtimes'),
      });
  }
}
