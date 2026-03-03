import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../../core/application/services/http';
import { environment } from '../../../../environments/environment';
import { finalize } from 'rxjs';
import { AlertService } from '../../../shared';
import { LinesState } from '../state/lines-state';

@Injectable({
  providedIn: 'root',
})
export class LinesRequestService {
  private readonly http = inject(HttpService);
  private readonly alert = inject(AlertService);
  private linesState = inject(LinesState);

  private readonly dtsURL = environment.dtsURL;

  async getLines(loading = true) {
    if (loading) this.linesState.loadingLines.set(true);
    this.http
      .get(`${this.dtsURL}/v1/line`)
      .pipe(
        finalize(() => {
          if (loading) this.linesState.loadingLines.set(false);
        }),
      )
      .subscribe({
        next: (res: any) => {
          console.log('res:', res);
          this.linesState.lines.set(res);
        },
        error: () => this.alert.error('Error al obtener las líneas'),
      });
  }

  async createLine(payload: any) {
    this.linesState.loadingCreateLine.set(true);
    // const sweetAlert = await this.alert.confirm(
    //   '¿Estás seguro de crear la línea?',
    //   'Esta acción no se puede revertir',
    //   'Si, crear',
    // );
    // if (sweetAlert?.isDenied || sweetAlert?.isDismissed) return;
    this.http
      .post(`${this.dtsURL}/v1/line`, payload)
      .pipe(finalize(() => this.linesState.loadingCreateLine.set(false)))
      .subscribe({
        next: () => {
          this.alert.success('Línea creada exitosamente');
          this.getLines(false);
        },
        error: () => this.alert.error('Error al crear la línea'),
      });
  }

  updateLine(id: string, payload: any) {
    this.linesState.loadingUpdateLine.set(true);
    this.http
      .patch(`${this.dtsURL}/v1/line/${id}`, payload)
      .pipe(finalize(() => this.linesState.loadingUpdateLine.set(false)))
      .subscribe({
        next: () => {
          this.alert.success('Línea actualizada exitosamente');
          this.getLines(false);
        },
        error: () => this.alert.error('Error al actualizar la línea'),
      });
  }

  deleteLine(id: string) {
    this.linesState.loadingDeleteLine.set(true);
    this.http
      .delete(`${this.dtsURL}/v1/line/${id}`)
      .pipe(finalize(() => this.linesState.loadingDeleteLine.set(false)))
      .subscribe({
        next: () => {
          this.alert.success('Línea eliminada exitosamente');
          this.getLines(false);
        },
        error: () => this.alert.error('Error al eliminar la línea'),
      });
  }
}
