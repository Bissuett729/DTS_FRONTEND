import { Observable } from 'rxjs';
import { IBusinessUnit } from '../../interfaces';

/**
 * Contrato del repositorio de unidades de negocio
 * Define las operaciones que cualquier implementación debe cumplir
 */
export abstract class BusinessUnitRepository {

  /**
   * Obtener todas las unidades de negocio
   */
  abstract getBusinessUnits(): Observable<IBusinessUnit[]>;
}
