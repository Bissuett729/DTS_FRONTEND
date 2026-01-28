import { Observable } from 'rxjs';
import { IShift } from '../../interfaces';

/**
 * Contrato del repositorio de turnos
 * Define las operaciones que cualquier implementación debe cumplir
 */
export abstract class ShiftsRepository {

  /**
   * Obtener todos los turnos disponibles
   */
  abstract getShifts(): Observable<IShift[]>;

  abstract createShift(shift: import('../../dtos').CreateShiftDto): Observable<IShift>;

  abstract updateShift(shiftId: string, shift: import('../../dtos').UpdateShiftDto): Observable<IShift>;

  abstract deleteShift(shiftId: string): Observable<IShift>;
}
